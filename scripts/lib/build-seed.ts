import { lodgings, discounts, users, demoPassword, reviewTemplates } from "./seed-data";

const q = (v: unknown): string =>
  v === null || v === undefined ? "null"
  : typeof v === "number" || typeof v === "boolean" ? String(v)
  : Array.isArray(v) ? `ARRAY[${v.map(q).join(",")}]::text[]`
  : `'${String(v).replace(/'/g, "''")}'`;

const day = (offset: number) => {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() + offset);
  return d.toISOString().slice(0, 10);
};

/** Returns SQL statements that reset demo content and insert the seed. */
export async function buildSeedStatements(precomputedHash?: string): Promise<string[]> {
  const s: string[] = [];
  s.push(`TRUNCATE payment, booking, review, favorite, room, room_type, lodging_image, lodging, discount RESTART IDENTITY CASCADE`);
  s.push(`DELETE FROM "user" WHERE email LIKE '%@justinns.test' OR email LIKE '%@example.test'`);

  const hash = precomputedHash ?? (await (await import("better-auth/crypto")).hashPassword(demoPassword));
  for (const u of users) {
    s.push(`INSERT INTO "user" (id, name, email, email_verified, role, phone) VALUES (${q(u.id)}, ${q(u.name)}, ${q(u.email)}, true, ${q(u.role)}, ${q(u.phone)})`);
    s.push(`INSERT INTO account (id, account_id, provider_id, user_id, password) VALUES (${q("acc_" + u.id)}, ${q(u.id)}, 'credential', ${q(u.id)}, ${q(hash)})`);
  }

  for (const d of discounts) {
    s.push(`INSERT INTO discount (code, percent_off, description) VALUES (${q(d.code)}, ${d.percentOff}, ${q(d.description)})`);
  }

  let roomTypeId = 0, roomId = 0, bookingId = 0;
  const reviewers = users.filter((u) => u.id.startsWith("u_r"));
  lodgings.forEach((l, li) => {
    const lid = li + 1;
    s.push(`INSERT INTO lodging (id, slug, name, type, city, address, tagline, description, amenities, check_in_time, check_out_time) VALUES (${lid}, ${q(l.slug)}, ${q(l.name)}, ${q(l.type)}, ${q(l.city)}, ${q(l.address)}, ${q(l.tagline)}, ${q(l.description)}, ${q(l.amenities)}, ${q(l.checkIn)}, ${q(l.checkOut)})`);
    ["exterior", "courtyard", "lobby"].forEach((name, i) =>
      s.push(`INSERT INTO lodging_image (lodging_id, storage_key, alt, is_cover, sort_order) VALUES (${lid}, ${q(`seed/${l.slug}/${name}.svg`)}, ${q(`${l.name} — ${name}`)}, ${i === 0}, ${i})`));

    const firstRoomOfLodging: number[] = [];
    l.roomTypes.forEach((rt, ri) => {
      roomTypeId++;
      s.push(`INSERT INTO room_type (id, lodging_id, name, description, bed, size_sqm, max_persons, price_per_night, image_key) VALUES (${roomTypeId}, ${lid}, ${q(rt.name)}, ${q(rt.description)}, ${q(rt.bed)}, ${rt.sizeSqm}, ${rt.maxPersons}, ${rt.price.toFixed(2)}, ${q(`seed/${l.slug}/room-${ri + 1}.svg`)})`);
      for (let n = 0; n < rt.rooms; n++) {
        roomId++;
        const floor = ri + 1;
        if (n === 0) firstRoomOfLodging.push(roomId);
        s.push(`INSERT INTO room (id, lodging_id, room_type_id, number, floor) VALUES (${roomId}, ${lid}, ${roomTypeId}, ${q(`${floor}${String(n + 1).padStart(2, "0")}`)}, ${floor})`);
      }
    });

    // 2–4 past stays with reviews per lodging
    const count = 2 + (li % 3);
    for (let k = 0; k < count; k++) {
      const u = reviewers[(li + k) % reviewers.length];
      const t = reviewTemplates[(li * 2 + k) % reviewTemplates.length];
      const price = l.roomTypes[k % l.roomTypes.length].price;
      const start = -60 - li * 3 - k * 9;
      bookingId++;
      const total = (price * 2).toFixed(2);
      s.push(`INSERT INTO booking (id, reference, user_id, room_id, check_in, check_out, adults, children, guest_name, contact_number, subtotal, total, status, created_at) VALUES (${bookingId}, ${q(`JI-SEED${String(bookingId).padStart(4, "0")}`)}, ${q(u.id)}, ${firstRoomOfLodging[k % firstRoomOfLodging.length]}, ${q(day(start))}, ${q(day(start + 2))}, 2, 0, ${q(u.name)}, '0900 000 0000', ${total}, ${total}, 'completed', ${q(day(start - 10))})`);
      s.push(`INSERT INTO payment (booking_id, amount, method, mock_reference) VALUES (${bookingId}, ${total}, 'card', ${q(`DEMO-SEED${bookingId}`)})`);
      s.push(`INSERT INTO review (user_id, lodging_id, title, rating, comment, created_at) VALUES (${q(u.id)}, ${lid}, ${q(t.title)}, ${t.rating}, ${q(t.comment)}, ${q(day(start + 3))})`);
    }
  });

  // Demo guest: one upcoming trip and one past stay they can still review.
  bookingId++;
  s.push(`INSERT INTO booking (id, reference, user_id, room_id, check_in, check_out, adults, children, guest_name, contact_number, discount_code, subtotal, discount_amount, total, status) SELECT ${bookingId}, 'JI-DEMO0001', 'u_guest', r.id, ${q(day(14))}, ${q(day(17))}, 2, 0, 'Gabi Guest', '0900 000 0002', 'WELCOME10', rt.price_per_night * 3, rt.price_per_night * 3 * 0.10, rt.price_per_night * 3 * 0.90, 'active' FROM room r JOIN room_type rt ON rt.id = r.room_type_id WHERE r.id = 1`);
  s.push(`INSERT INTO payment (booking_id, amount, method, mock_reference) SELECT id, total, 'e-wallet', 'DEMO-GUEST01' FROM booking WHERE id = ${bookingId}`);
  bookingId++;
  s.push(`INSERT INTO booking (id, reference, user_id, room_id, check_in, check_out, adults, children, guest_name, contact_number, subtotal, total, status) SELECT ${bookingId}, 'JI-DEMO0002', 'u_guest', r.id, ${q(day(-20))}, ${q(day(-18))}, 1, 0, 'Gabi Guest', '0900 000 0002', rt.price_per_night * 2, rt.price_per_night * 2, 'completed' FROM room r JOIN room_type rt ON rt.id = r.room_type_id JOIN lodging l ON l.id = r.lodging_id WHERE l.slug = 'mangrove-lane-inn' ORDER BY r.id LIMIT 1`);
  s.push(`INSERT INTO payment (booking_id, amount, method, mock_reference) SELECT id, total, 'card', 'DEMO-GUEST02' FROM booking WHERE id = ${bookingId}`);
  s.push(`INSERT INTO favorite (user_id, lodging_id) VALUES ('u_guest', 1), ('u_guest', 7)`);

  for (const t of ["lodging", "room_type", "room", "booking"]) {
    s.push(`SELECT setval(pg_get_serial_sequence('${t}', 'id'), (SELECT max(id) FROM ${t}))`);
  }
  return s;
}
