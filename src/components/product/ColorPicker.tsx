"use client";
import { FC, useState } from "react";
import { X } from "lucide-react";
import { COLOR_PALETTE, hexByName } from "@/src/lib/colors";
import scss from "./ColorPicker.module.scss";

interface ColorPickerProps {
  value: string[];
  onChange: (colors: string[]) => void;
}

const ColorPicker: FC<ColorPickerProps> = ({ value, onChange }) => {
  const [customInput, setCustomInput] = useState("");

  const toggle = (name: string) => {
    onChange(
      value.includes(name)
        ? value.filter((c) => c !== name)
        : [...value, name]
    );
  };

  const addCustom = () => {
    const name = customInput.trim();
    if (!name || value.includes(name)) return;
    onChange([...value, name]);
    setCustomInput("");
  };

  return (
    <div className={scss.root}>
      {/* Palette swatches */}
      <div className={scss.palette}>
        {COLOR_PALETTE.map(({ name, hex }) => {
          const selected = value.includes(name);
          return (
            <button
              key={name}
              type="button"
              title={name}
              className={`${scss.swatch} ${selected ? scss.swatchSelected : ""}`}
              style={{ background: hex }}
              onClick={() => toggle(name)}
            >
              {selected && (
                <span
                  className={scss.checkmark}
                  style={{ color: isLight(hex) ? "#000" : "#fff" }}
                >
                  ✓
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Custom name input */}
      <div className={scss.customRow}>
        <input
          type="text"
          placeholder="Свой цвет: Изумрудный, Молочный…"
          value={customInput}
          onChange={(e) => setCustomInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addCustom())}
          className={scss.customInput}
        />
        <button type="button" className={scss.addBtn} onClick={addCustom}>
          +
        </button>
      </div>

      {/* Selected pills */}
      {value.length > 0 && (
        <div className={scss.pills}>
          {value.map((name) => (
            <span key={name} className={scss.pill}>
              <span
                className={scss.pillDot}
                style={{ background: hexByName(name) }}
              />
              {name}
              <button
                type="button"
                className={scss.pillRemove}
                onClick={() => toggle(name)}
              >
                <X size={10} />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

function isLight(hex: string): boolean {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 > 155;
}

export default ColorPicker;
