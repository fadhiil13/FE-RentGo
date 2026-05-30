"use client";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { MapPin, Search, Check, ChevronDown } from "lucide-react";

const CITIES = [
  "Jakarta", "Surabaya", "Malang", "Semarang", "Jogja",
  "Bandung", "Bali", "Medan", "Makassar", "Palembang",
];

interface CitySelectorProps {
  value?: string;
  onChange?: (city: string) => void;
  dark?: boolean;
}

export default function CitySelector({ value, onChange, dark = false }: CitySelectorProps) {
  const [open, setOpen]       = useState(false);
  const [search, setSearch]   = useState("");
  const [selected, setSelected] = useState(value ?? "");
  const [dropPos, setDropPos] = useState({ top: 0, left: 0, width: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);
  const inputRef   = useRef<HTMLInputElement>(null);

  const filtered = CITIES.filter((c) =>
    c.toLowerCase().includes(search.toLowerCase())
  );

  // sync controlled value
  useEffect(() => {
    if (value !== undefined) setSelected(value);
  }, [value]);

  // focus search input when open
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 50);
    else setSearch("");
  }, [open]);

  // close on outside click
  useEffect(() => {
    function onDown(e: MouseEvent) {
      if (triggerRef.current && !triggerRef.current.contains(e.target as Node)) {
        // also check portal dropdown
        const portal = document.getElementById("city-selector-portal");
        if (portal && portal.contains(e.target as Node)) return;
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  function handleToggle() {
    if (!open && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setDropPos({
        top: rect.bottom + window.scrollY + 6,
        left: rect.left + window.scrollX,
        width: rect.width,
      });
    }
    setOpen((v) => !v);
  }

  function handleSelect(city: string) {
    setSelected(city);
    onChange?.(city);
    setOpen(false);
  }

  const dropdown = open ? createPortal(
    <div
      id="city-selector-portal"
      style={{
        position: "absolute",
        top: dropPos.top,
        left: dropPos.left,
        width: dropPos.width,
        zIndex: 9999,
      }}
      className={dark
        ? "bg-[#0f1f2e] border border-[#4ade80]/30 rounded-xl overflow-hidden shadow-2xl"
        : "bg-white border border-emerald-500 rounded-xl overflow-hidden shadow-xl ring-2 ring-emerald-500/10"
      }
    >
      {/* Search */}
      <div className={`px-3 pt-2.5 pb-2 border-b ${dark ? "border-white/[0.06]" : "border-gray-100"}`}>
        <div className="relative">
          <Search size={13} className={`absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none ${dark ? "text-white/30" : "text-gray-400"}`} />
          <input
            ref={inputRef}
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari kota..."
            className={`w-full pl-8 pr-3 py-1.5 text-sm rounded-lg outline-none transition-colors ${
              dark
                ? "bg-white/5 border border-white/10 focus:border-[#4ade80] text-white placeholder:text-white/30"
                : "bg-gray-50 border border-gray-200 focus:border-emerald-500 text-gray-800 placeholder:text-gray-400"
            }`}
          />
        </div>
      </div>

      {/* List */}
      <ul className="max-h-52 overflow-y-auto [&::-webkit-scrollbar]:w-[3px] [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-[#4ade80]/30 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-[#4ade80]/60">
        {filtered.length === 0 ? (
          <li className={`px-4 py-4 text-sm text-center ${dark ? "text-white/30" : "text-gray-400"}`}>
            Kota tidak ditemukan
          </li>
        ) : (
          filtered.map((city) => (
            <li
              key={city}
              onMouseDown={() => handleSelect(city)}
              className={`flex items-center gap-2.5 px-4 py-2.5 text-sm cursor-pointer border-b last:border-0 transition-colors ${
                dark
                  ? `border-white/[0.06] ${selected === city ? "bg-[#4ade80]/10 text-[#4ade80] font-medium" : "text-white/70 hover:bg-[#4ade80]/10 hover:text-[#4ade80]"}`
                  : `border-gray-50 ${selected === city ? "bg-emerald-50 text-emerald-700 font-medium" : "text-gray-700 hover:bg-emerald-50 hover:text-emerald-700"}`
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full shrink-0 transition-colors ${
                selected === city
                  ? (dark ? "bg-[#4ade80]" : "bg-emerald-500")
                  : (dark ? "bg-white/20" : "bg-gray-300")
              }`} />
              {city}
              {selected === city && (
                <Check size={14} className={`ml-auto ${dark ? "text-[#4ade80]" : "text-emerald-500"}`} />
              )}
            </li>
          ))
        )}
      </ul>
    </div>,
    document.body
  ) : null;

  // ── Dark mode (inline trigger) ─────────────────────────────────────────────
  if (dark) {
    return (
      <div className="relative w-full" ref={triggerRef}>
        <button
          type="button"
          className="w-full flex items-center gap-2 cursor-pointer bg-transparent focus:outline-none"
          onClick={handleToggle}
        >
          <span className={`flex-1 text-sm text-left ${selected ? "text-white font-medium" : "text-white/25"}`}>
            {selected || "Pilih kota..."}
          </span>
          <ChevronDown
            size={15}
            className={`flex-shrink-0 transition-transform duration-200 ${open ? "rotate-180 text-[#4ade80]" : "text-white/30"}`}
          />
        </button>
        {dropdown}
      </div>
    );
  }

  // ── Light mode (standalone card) ──────────────────────────────────────────
  return (
    <div className="flex flex-col gap-2 w-full max-w-[280px]">
      <span className="flex items-center gap-1.5 text-[11px] font-semibold tracking-widest uppercase text-gray-400">
        <MapPin size={13} /> Lokasi
      </span>
      <div className="relative w-full" ref={triggerRef}>
        <button
          type="button"
          onClick={handleToggle}
          className={`w-full flex items-center gap-2.5 px-4 py-3 bg-white border rounded-xl text-left transition-all duration-200
            ${open
              ? "border-emerald-500 ring-2 ring-emerald-500/10"
              : "border-gray-200 hover:border-emerald-500 hover:ring-2 hover:ring-emerald-500/10"
            }`}
        >
          <MapPin size={18} className="text-emerald-500 shrink-0" />
          <span className={`flex-1 text-sm font-medium ${selected ? "text-gray-800" : "text-gray-400 font-normal"}`}>
            {selected || "Pilih kota..."}
          </span>
          <ChevronDown
            size={16}
            className={`text-gray-400 transition-transform duration-200 ${open ? "rotate-180 text-emerald-500" : ""}`}
          />
        </button>
        {dropdown}
      </div>
    </div>
  );
}