"use client";
import { useMemo, useState } from "react";
import { ArrowDown, ArrowUp, ArrowUpDown, Search } from "lucide-react";
import clsx from "clsx";
import type { Room, RoomType } from "@/lib/types";
import { peso } from "@/lib/format";
import { Input, Select } from "../ui";

type SortKey = "number" | "floor" | "type" | "price" | "guests";
type Row = { id: number; number: string; floor: number; type: string; typeId: number; price: number; guests: number };

const columns: { key: SortKey; label: string; align?: "right" }[] = [
  { key: "number", label: "Room" },
  { key: "floor", label: "Floor" },
  { key: "type", label: "Room type" },
  { key: "price", label: "Price / night", align: "right" },
  { key: "guests", label: "Max guests", align: "right" },
];

/** Sortable, filterable list of a lodging's rooms for the admin page. */
export function RoomsTable({ rooms, roomTypes, onDelete }: { rooms: Room[]; roomTypes: RoomType[]; onDelete: (room: Room) => void }) {
  const [sort, setSort] = useState<{ key: SortKey; dir: 1 | -1 }>({ key: "number", dir: 1 });
  const [typeFilter, setTypeFilter] = useState("all");
  const [floorFilter, setFloorFilter] = useState("all");
  const [query, setQuery] = useState("");

  const rows = useMemo<Row[]>(() => {
    const byId = new Map(roomTypes.map((t) => [t.id, t]));
    return rooms.map((r) => {
      const t = r.roomTypeId ? byId.get(r.roomTypeId) : undefined;
      return { id: r.id, number: r.number, floor: r.floor, type: r.roomTypeName ?? t?.name ?? "", typeId: r.roomTypeId ?? 0, price: t?.pricePerNight ?? 0, guests: t?.maxPersons ?? 0 };
    });
  }, [rooms, roomTypes]);

  const floors = useMemo(() => [...new Set(rows.map((r) => r.floor))].sort((a, b) => a - b), [rows]);

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows
      .filter((r) => typeFilter === "all" || String(r.typeId) === typeFilter)
      .filter((r) => floorFilter === "all" || String(r.floor) === floorFilter)
      .filter((r) => !q || r.number.toLowerCase().includes(q) || r.type.toLowerCase().includes(q))
      .sort((a, b) => {
        const x = a[sort.key], y = b[sort.key];
        const c = typeof x === "number" && typeof y === "number" ? x - y : String(x).localeCompare(String(y), undefined, { numeric: true });
        return c * sort.dir;
      });
  }, [rows, typeFilter, floorFilter, query, sort]);

  const toggle = (key: SortKey) => setSort((s) => (s.key === key ? { key, dir: s.dir === 1 ? -1 : 1 } : { key, dir: 1 }));
  const filtered = typeFilter !== "all" || floorFilter !== "all" || query.trim() !== "";

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative min-w-48 flex-1">
          <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search room number or type" aria-label="Search rooms" className="pl-9" />
        </div>
        <Select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} aria-label="Filter by room type" className="w-auto!">
          <option value="all">All room types</option>
          {roomTypes.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
        </Select>
        <Select value={floorFilter} onChange={(e) => setFloorFilter(e.target.value)} aria-label="Filter by floor" className="w-auto!">
          <option value="all">All floors</option>
          {floors.map((f) => <option key={f} value={f}>Floor {f}</option>)}
        </Select>
        <span className="text-sm text-muted">{shown.length} of {rows.length} rooms</span>
      </div>

      <div className="overflow-x-auto rounded-xl border border-sand-200">
        <table className="w-full text-left text-sm">
          <thead className="bg-sand-100 text-xs text-muted">
            <tr>
              {columns.map((c) => {
                const active = sort.key === c.key;
                const Icon = active ? (sort.dir === 1 ? ArrowUp : ArrowDown) : ArrowUpDown;
                return (
                  <th key={c.key} className={clsx("px-4 py-3 font-medium", c.align === "right" && "text-right")}
                    aria-sort={active ? (sort.dir === 1 ? "ascending" : "descending") : "none"}>
                    <button type="button" onClick={() => toggle(c.key)}
                      className={clsx("inline-flex items-center gap-1 hover:text-ink", active && "text-ink", c.align === "right" && "flex-row-reverse")}>
                      {c.label}<Icon size={13} className={active ? "" : "opacity-40"} />
                    </button>
                  </th>
                );
              })}
              <th className="px-4 py-3"><span className="sr-only">Actions</span></th>
            </tr>
          </thead>
          <tbody>
            {shown.map((r) => (
              <tr key={r.id} className="border-t border-sand-200 hover:bg-sand-100/60">
                <td className="px-4 py-3 font-medium">{r.number}</td>
                <td className="px-4 py-3">{r.floor}</td>
                <td className="px-4 py-3">{r.type}</td>
                <td className="px-4 py-3 text-right">{peso(r.price)}</td>
                <td className="px-4 py-3 text-right">{r.guests}</td>
                <td className="px-4 py-3 text-right">
                  <button type="button" onClick={() => onDelete({ id: r.id, number: r.number, floor: r.floor })}
                    className="text-sm font-medium text-muted hover:text-clay-500">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!shown.length && (
          <p className="p-6 text-center text-sm text-muted">
            {filtered ? "No rooms match these filters." : "No rooms yet. Add the first one above."}
          </p>
        )}
      </div>
    </div>
  );
}
