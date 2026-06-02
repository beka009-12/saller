"use client";
import { FC, useState } from "react";
import { X } from "lucide-react";
import scss from "./SizePicker.module.scss";

const SIZE_HINTS = ["XS", "S", "M", "L", "XL", "XXL", "36", "37", "38", "39", "40", "41", "42", "43", "44", "45"];

interface SizePickerProps {
  value: string[];
  onChange: (sizes: string[]) => void;
}

const SizePicker: FC<SizePickerProps> = ({ value, onChange }) => {
  const [input, setInput] = useState("");

  const add = (size: string) => {
    const s = size.trim().toUpperCase();
    if (s && !value.includes(s)) onChange([...value, s]);
  };

  const remove = (size: string) => onChange(value.filter((s) => s !== size));

  return (
    <div className={scss.root}>
      {/* Quick hints */}
      <div className={scss.hints}>
        {SIZE_HINTS.filter((h) => !value.includes(h)).map((h) => (
          <button key={h} type="button" className={scss.hint} onClick={() => add(h)}>
            {h}
          </button>
        ))}
      </div>

      {/* Manual input */}
      <div className={scss.inputRow}>
        <input
          type="text"
          placeholder="Свой размер…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === ",") {
              e.preventDefault();
              add(input);
              setInput("");
            }
          }}
          className={scss.input}
        />
        <button
          type="button"
          className={scss.addBtn}
          onClick={() => { add(input); setInput(""); }}
        >
          +
        </button>
      </div>

      {/* Selected tags */}
      {value.length > 0 && (
        <div className={scss.tags}>
          {value.map((s) => (
            <span key={s} className={scss.tag}>
              {s}
              <button type="button" className={scss.tagRemove} onClick={() => remove(s)}>
                <X size={10} />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default SizePicker;
