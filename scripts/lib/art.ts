// Procedural SVG illustrations for demo lodgings. No photos of real places are used.
const palettes = [
  ["#f6c89f", "#e9876b", "#2d5f73", "#f4eee4", "#1f5c55"], ["#cfe3f0", "#8fb8d8", "#24485e", "#efe7da", "#3a6b5c"],
  ["#ffd9b0", "#f08f6a", "#3b4a6b", "#eae2d6", "#2f5d50"], ["#bfe6ef", "#5fb3c7", "#1f5868", "#f7efe0", "#2c6b4f"],
  ["#d9ecd2", "#9cc59a", "#2f4f3a", "#efe8d8", "#40704a"], ["#ffe3a8", "#f2b05e", "#5b4636", "#f3ecdf", "#4e7b4a"],
  ["#f3d7c6", "#d38b6d", "#6b3f2e", "#efe3d1", "#7a5236"], ["#d6e2e9", "#9db4c0", "#2e3f4a", "#ece6dc", "#2e5a44"],
  ["#fde2c8", "#e7a27c", "#3e5c76", "#f4ede2", "#3f6e5e"], ["#f7d6d0", "#e48c7c", "#4b3b52", "#f1e9df", "#5a7d5a"],
  ["#e4f1d4", "#b5d48f", "#46603a", "#f2ecdd", "#557a3e"], ["#e8dcf0", "#b79ad0", "#3f3a5c", "#efe9e1", "#4a6a5a"],
];

function rng(seed: number) {
  let s = seed >>> 0 || 1;
  return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 2 ** 32);
}

const svg = (body: string) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">${body}</svg>`;

function sky(p: string[], id: string) {
  return `<defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${p[0]}"/><stop offset="1" stop-color="${p[3]}"/></linearGradient></defs><rect width="1200" height="800" fill="url(#${id})"/>`;
}

function palm(x: number, y: number, h: number, color: string) {
  const top = y - h;
  const leaves = [-70, -35, 0, 35, 70, 110, -110].map((a) => {
    const r = (a * Math.PI) / 180;
    const ex = x + Math.sin(r) * 95, ey = top + 30 - Math.cos(r) * 45;
    return `<path d="M${x} ${top} Q${(x + ex) / 2} ${ey - 40} ${ex} ${ey}" stroke="${color}" stroke-width="14" fill="none" stroke-linecap="round"/>`;
  }).join("");
  return `<path d="M${x} ${y} Q${x + 18} ${y - h / 2} ${x} ${top}" stroke="#6b4f3a" stroke-width="12" fill="none"/>${leaves}`;
}

function windows(x: number, y: number, cols: number, rows: number, w: number, h: number, gap: number, lit: string, dark: string, r: () => number) {
  let out = "";
  for (let i = 0; i < cols; i++) for (let j = 0; j < rows; j++) {
    out += `<rect x="${x + i * (w + gap)}" y="${y + j * (h + gap)}" width="${w}" height="${h}" rx="3" fill="${r() > 0.35 ? lit : dark}"/>`;
  }
  return out;
}

export function exterior(type: "hotel" | "inn" | "pension", paletteIdx: number, seed: number) {
  const p = palettes[paletteIdx % palettes.length];
  const r = rng(seed);
  let b = sky(p, `s${seed}`);
  b += `<circle cx="${850 + r() * 200}" cy="${150 + r() * 80}" r="70" fill="#fff6e0" opacity="0.85"/>`;
  b += `<path d="M0 560 Q300 ${480 + r() * 40} 600 540 T1200 520 V800 H0Z" fill="${p[1]}" opacity="0.45"/>`;
  if (type === "hotel") {
    b += `<rect x="380" y="150" width="440" height="470" rx="6" fill="${p[3]}"/><rect x="380" y="150" width="440" height="34" fill="${p[2]}"/>`;
    b += windows(410, 210, 7, 7, 40, 34, 18, "#fbe7b5", p[2], r);
    b += `<rect x="820" y="330" width="200" height="290" rx="6" fill="${p[3]}" opacity="0.92"/>` + windows(845, 360, 3, 4, 40, 34, 18, "#fbe7b5", p[2], r);
    b += `<rect x="540" y="560" width="120" height="60" fill="${p[2]}"/>`;
  } else if (type === "inn") {
    b += `<rect x="330" y="330" width="540" height="290" fill="${p[3]}"/><path d="M300 340 L600 190 L900 340Z" fill="${p[2]}"/>`;
    b += `<rect x="330" y="455" width="540" height="12" fill="${p[1]}"/>`;
    b += windows(370, 370, 5, 2, 70, 60, 34, "#fbe7b5", p[2], r);
    b += `<rect x="565" y="540" width="70" height="80" rx="35" fill="${p[2]}"/>`;
  } else {
    for (let i = 0; i < 3; i++) {
      const x = 250 + i * 240, h = 220 + Math.floor(r() * 80);
      b += `<rect x="${x}" y="${620 - h}" width="230" height="${h}" fill="${i % 2 ? p[3] : p[0]}" stroke="${p[2]}" stroke-width="3"/>`;
      b += `<rect x="${x - 8}" y="${606 - h}" width="246" height="18" fill="${p[2]}"/>`;
      b += windows(x + 25, 650 - h, 3, Math.max(2, Math.floor(h / 110)), 45, 45, 25, "#fbe7b5", p[2], r);
    }
  }
  b += `<rect x="0" y="615" width="1200" height="185" fill="${p[4]}"/><rect x="0" y="615" width="1200" height="10" fill="#000" opacity="0.08"/>`;
  b += palm(170, 640, 260 + r() * 60, p[4]) + palm(1040, 650, 230 + r() * 60, p[4]);
  return svg(b);
}

export function courtyard(paletteIdx: number, seed: number) {
  const p = palettes[paletteIdx % palettes.length];
  const r = rng(seed);
  let b = sky(p, `c${seed}`);
  b += `<rect x="0" y="380" width="1200" height="420" fill="${p[3]}"/>`;
  b += `<path d="M180 560 L1020 560 L1120 760 L80 760Z" fill="#7cc6d6"/><path d="M180 560 L1020 560 L1040 600 L160 600Z" fill="#fff" opacity="0.25"/>`;
  for (let i = 0; i < 4; i++) {
    const x = 170 + i * 240;
    b += `<rect x="${x}" y="470" width="150" height="28" rx="8" fill="#fff"/><rect x="${x + 110}" y="440" width="40" height="40" rx="8" fill="#fff"/>`;
    b += `<path d="M${x + 75} 470 V330" stroke="${p[2]}" stroke-width="6"/><path d="M${x - 15} 340 Q${x + 75} 270 ${x + 165} 340Z" fill="${r() > 0.5 ? p[1] : p[0]}"/>`;
  }
  b += palm(80, 560, 300, p[4]) + palm(1130, 560, 280, p[4]);
  return svg(b);
}

export function room(paletteIdx: number, seed: number, beds = 1) {
  const p = palettes[paletteIdx % palettes.length];
  const r = rng(seed);
  let b = `<rect width="1200" height="800" fill="${p[3]}"/><rect x="0" y="560" width="1200" height="240" fill="${p[1]}" opacity="0.55"/>`;
  b += `<rect x="760" y="120" width="300" height="280" rx="8" fill="${p[0]}" stroke="#fff" stroke-width="14"/><path d="M910 120 V400 M760 260 H1060" stroke="#fff" stroke-width="8"/>`;
  b += `<path d="M780 380 Q880 ${300 + r() * 40} 1040 380Z" fill="${p[4]}" opacity="0.6"/>`;
  const n = Math.min(beds, 2), w = n === 1 ? 520 : 330;
  for (let i = 0; i < n; i++) {
    const x = (n === 1 ? 140 : 70 + i * 370);
    b += `<rect x="${x}" y="300" width="${w}" height="180" rx="14" fill="${p[2]}"/>`;
    b += `<rect x="${x - 10}" y="450" width="${w + 20}" height="130" rx="18" fill="#fff"/><rect x="${x - 10}" y="520" width="${w + 20}" height="60" rx="10" fill="${p[1]}"/>`;
    b += `<rect x="${x + 30}" y="410" width="${w / 2 - 50}" height="60" rx="22" fill="${p[3]}"/><rect x="${x + w / 2 + 20}" y="410" width="${w / 2 - 50}" height="60" rx="22" fill="${p[3]}"/>`;
  }
  b += `<rect x="${n === 1 ? 700 : 20}" y="470" width="70" height="110" rx="6" fill="${p[2]}" opacity="0.85"/><path d="M${n === 1 ? 735 : 55} 470 V400" stroke="${p[2]}" stroke-width="5"/><path d="M${n === 1 ? 705 : 25} 400 L${n === 1 ? 765 : 85} 400 L${n === 1 ? 750 : 70} 350 L${n === 1 ? 720 : 40} 350Z" fill="#fbe7b5"/>`;
  b += `<rect x="1080" y="470" width="60" height="110" rx="30" fill="${p[4]}"/><circle cx="1110" cy="440" r="45" fill="${p[4]}" opacity="0.8"/>`;
  return svg(b);
}

/** Every image key the seed uses, mapped to its SVG markup. */
export function allSeedImages(lodgings: { slug: string; type: "hotel" | "inn" | "pension"; palette: number; roomTypes: { name: string; bed: string }[] }[]) {
  const out: Record<string, string> = {};
  lodgings.forEach((l, i) => {
    out[`seed/${l.slug}/exterior.svg`] = exterior(l.type, l.palette, i * 97 + 3);
    out[`seed/${l.slug}/courtyard.svg`] = courtyard(l.palette, i * 31 + 7);
    out[`seed/${l.slug}/lobby.svg`] = room(l.palette + 3, i * 13 + 11, 1);
    l.roomTypes.forEach((rt, j) => {
      const beds = /2 |bunk|\+/.test(rt.bed) ? 2 : 1;
      out[`seed/${l.slug}/room-${j + 1}.svg`] = room(l.palette, i * 101 + j * 7 + 1, beds);
    });
  });
  return out;
}
