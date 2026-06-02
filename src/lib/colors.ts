export interface ColorOption {
  name: string;
  hex:  string;
}

export const COLOR_PALETTE: ColorOption[] = [
  { name: "Чёрный",      hex: "#000000" },
  { name: "Белый",       hex: "#FFFFFF" },
  { name: "Серый",       hex: "#9CA3AF" },
  { name: "Тёмно-серый", hex: "#374151" },
  { name: "Бежевый",     hex: "#D4B896" },
  { name: "Кремовый",    hex: "#FFF8E7" },
  { name: "Коричневый",  hex: "#92400E" },
  { name: "Красный",     hex: "#DC2626" },
  { name: "Розовый",     hex: "#F472B6" },
  { name: "Оранжевый",   hex: "#F97316" },
  { name: "Жёлтый",      hex: "#FBBF24" },
  { name: "Хаки",        hex: "#6B7C45" },
  { name: "Зелёный",     hex: "#16A34A" },
  { name: "Мятный",      hex: "#34D399" },
  { name: "Голубой",     hex: "#38BDF8" },
  { name: "Синий",       hex: "#2563EB" },
  { name: "Navy",        hex: "#1E3A5F" },
  { name: "Фиолетовый",  hex: "#7C3AED" },
  { name: "Сиреневый",   hex: "#C084FC" },
  { name: "Бордовый",    hex: "#9F1239" },
];

export function hexByName(name: string): string {
  return COLOR_PALETTE.find((c) => c.name === name)?.hex ?? "#CCCCCC";
}
