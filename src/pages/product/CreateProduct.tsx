"use client";
import { type FC, useState, useRef, useEffect, useMemo } from "react";
import scss from "./CreateProduct.module.scss";
import { useGetCategoryCategoriesTree } from "@/src/api/generated/endpoints/category/category";
import { usePostCommodityCreateProduct } from "@/src/api/generated/endpoints/product/product";
import toast from "react-hot-toast";

type Gender = "MALE" | "FEMALE" | "UNISEX";
type Season = "SPRING_SUMMER" | "AUTUMN_WINTER" | "ALL_SEASON";

interface CategoryWithChildren {
  id: number;
  name: string;
  children?: CategoryWithChildren[];
}

interface FormState {
  images: File[];
  title: string;
  description: string;
  price: string;
  newPrice: string;
  stockCount: string;
  categoryId: number | null;
  brandName: string;
  sizes: string[];
  colors: string[];
  material?: string;
  gender: Gender | "";
  season: Season | "";
  isActive: boolean;
}

const TOTAL_STEPS = 5;

// ─── Step 1: Photos ───────────────────────────────────────────────────────────
const Step1Photos: FC<{ images: File[]; onChange: (imgs: File[]) => void }> = ({
  images,
  onChange,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const previews = useMemo(
    () => images.map((file) => URL.createObjectURL(file)),
    [images],
  );

  useEffect(() => {
    return () => previews.forEach((url) => URL.revokeObjectURL(url));
  }, [previews]);

  const addFiles = (files: FileList | null) => {
    if (!files) return;
    const validFiles = Array.from(files).filter((f) =>
      f.type.startsWith("image/"),
    );
    onChange([...images, ...validFiles].slice(0, 10));
  };

  return (
    <div className={scss.step}>
      <h2 className={scss.stepTitle}>Фотографии товара</h2>
      <p className={scss.stepDesc}>
        Добавьте до 10 фото. Первое фото — главное.
      </p>

      <div
        className={`${scss.dropzone} ${dragging ? scss.dragging : ""}`}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          addFiles(e.dataTransfer.files);
        }}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          hidden
          onChange={(e) => addFiles(e.target.files)}
        />
        <div className={scss.dropzoneInner}>
          <svg
            width="40"
            height="40"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
          <span>Перетащите фото или нажмите для выбора</span>
        </div>
      </div>

      {previews.length > 0 && (
        <div className={scss.imageGrid}>
          {previews.map((url, i) => (
            <div
              key={url}
              className={`${scss.imageCard} ${i === 0 ? scss.mainImage : ""}`}
            >
              <img src={url} alt="" />
              {i === 0 && <span className={scss.mainBadge}>Главное</span>}
              <button
                className={scss.removeBtn}
                type="button"
                onClick={() => onChange(images.filter((_, j) => j !== i))}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ─── Step 2: Info ─────────────────────────────────────────────────────────────
const Step2Info: FC<{
  data: FormState;
  onChange: (key: keyof FormState, value: unknown) => void;
}> = ({ data, onChange }) => {
  const priceError =
    data.newPrice && data.price && Number(data.newPrice) >= Number(data.price)
      ? "Цена со скидкой должна быть меньше основной"
      : null;

  return (
    <div className={scss.step}>
      <h2 className={scss.stepTitle}>Информация о товаре</h2>

      <div className={scss.field}>
        <label>Название товара *</label>
        <input
          type="text"
          placeholder="Например: Мужские кроссовки Nike Air Max Plus"
          value={data.title}
          onChange={(e) => onChange("title", e.target.value)}
        />
      </div>

      <div className={scss.field}>
        <label>Описание товара *</label>
        <textarea
          placeholder="Подробное описание..."
          value={data.description}
          rows={5}
          onChange={(e) => onChange("description", e.target.value)}
        />
      </div>

      <div className={scss.fieldRow}>
        <div className={scss.field}>
          <label>Цена (сом) *</label>
          <input
            type="number"
            placeholder="19650"
            value={data.price}
            onChange={(e) => onChange("price", e.target.value)}
          />
        </div>
        <div className={scss.field}>
          <label>Цена со скидкой</label>
          <input
            type="number"
            placeholder="15699"
            value={data.newPrice}
            className={priceError ? scss.inputError : ""}
            onChange={(e) => onChange("newPrice", e.target.value)}
          />
          {priceError && <span className={scss.errorMsg}>{priceError}</span>}
        </div>
        <div className={scss.field}>
          <label>Остаток на складе</label>
          <input
            type="number"
            placeholder="20"
            value={data.stockCount}
            onChange={(e) => onChange("stockCount", e.target.value)}
          />
        </div>
      </div>

      <div className={scss.field}>
        <label className={scss.checkboxLabel}>
          <input
            type="checkbox"
            checked={data.isActive}
            onChange={(e) => onChange("isActive", e.target.checked)}
          />
          Опубликовать товар сразу (активен)
        </label>
      </div>
    </div>
  );
};

// ─── Step 3: Attributes ───────────────────────────────────────────────────────
const SIZE_HINTS = ["S", "M", "L", "XL", "XXL", "36", "38", "40", "42", "44"];

const Step3Attributes: FC<{
  data: FormState;
  onChange: (key: keyof FormState, value: unknown) => void;
}> = ({ data, onChange }) => {
  const [sizeInput, setSizeInput] = useState("");
  const [colorPicker, setColorPicker] = useState("#000000");
  const [colorHex, setColorHex] = useState("#000000");
  const [hexError, setHexError] = useState<string | null>(null);

  const GENDER_OPTIONS: { value: Gender; label: string }[] = [
    { value: "MALE", label: "Мужской" },
    { value: "FEMALE", label: "Женский" },
    { value: "UNISEX", label: "Унисекс" },
  ];

  const SEASON_OPTIONS: { value: Season; label: string }[] = [
    { value: "SPRING_SUMMER", label: "Весна / Лето" },
    { value: "AUTUMN_WINTER", label: "Осень / Зима" },
    { value: "ALL_SEASON", label: "Всесезонный" },
  ];

  const addSize = (value: string) => {
    const trimmed = value.trim();
    if (trimmed && !data.sizes.includes(trimmed)) {
      onChange("sizes", [...data.sizes, trimmed]);
    }
  };

  const handleSizeKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addSize(sizeInput);
      setSizeInput("");
    }
  };

  const COLOR_PRESETS = [
    { hex: "#000000", label: "Чёрный" },
    { hex: "#ffffff", label: "Белый" },
    { hex: "#f5f0e8", label: "Бежевый" },
    { hex: "#808080", label: "Серый" },
    { hex: "#c41e3a", label: "Красный" },
    { hex: "#001f5b", label: "Navy" },
    { hex: "#3b82f6", label: "Синий" },
    { hex: "#22c55e", label: "Зелёный" },
    { hex: "#f97316", label: "Оранжевый" },
    { hex: "#a855f7", label: "Фиолетовый" },
  ];

  const normalizeHex = (input: string): string | null => {
    const trimmed = input.trim();
    const rgbMatch = trimmed.match(
      /^rgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/i
    );
    if (rgbMatch) {
      const clamp = (n: number) => Math.max(0, Math.min(255, n));
      const r = clamp(parseInt(rgbMatch[1])).toString(16).padStart(2, "0");
      const g = clamp(parseInt(rgbMatch[2])).toString(16).padStart(2, "0");
      const b = clamp(parseInt(rgbMatch[3])).toString(16).padStart(2, "0");
      return `#${r}${g}${b}`;
    }
    const withHash = trimmed.startsWith("#") ? trimmed : `#${trimmed}`;
    if (/^#[0-9a-fA-F]{3}$/.test(withHash)) {
      const [, r, g, b] = withHash.split("");
      return `#${r}${r}${g}${g}${b}${b}`.toLowerCase();
    }
    if (/^#[0-9a-fA-F]{6}$/.test(withHash)) {
      return withHash.toLowerCase();
    }
    return null;
  };

  const addColor = () => {
    const hex = normalizeHex(colorHex);
    if (!hex) {
      setHexError("Неверный формат. Пример: #3B82F6 или rgb(59,130,246)");
      return;
    }
    if (data.colors.includes(hex)) {
      setHexError("Этот цвет уже добавлен");
      return;
    }
    setHexError(null);
    onChange("colors", [...data.colors, hex]);
    setColorPicker("#000000");
    setColorHex("#000000");
  };

  return (
    <div className={scss.step}>
      <h2 className={scss.stepTitle}>Характеристики</h2>

      {/* ── Sizes ── */}
      <div className={scss.field}>
        <label>Размеры *</label>
        <div className={scss.tagInput}>
          <input
            type="text"
            placeholder="Например: 38, M, XL..."
            value={sizeInput}
            onChange={(e) => setSizeInput(e.target.value)}
            onKeyDown={handleSizeKeyDown}
          />
          <button
            type="button"
            onClick={() => {
              addSize(sizeInput);
              setSizeInput("");
            }}
          >
            +
          </button>
        </div>
        {data.sizes.length > 0 && (
          <div className={scss.tags}>
            {data.sizes.map((s) => (
              <span key={s} className={scss.tag}>
                {s}
                <button
                  type="button"
                  onClick={() =>
                    onChange(
                      "sizes",
                      data.sizes.filter((x) => x !== s)
                    )
                  }
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
        <div className={scss.sizeHints}>
          {SIZE_HINTS.filter((h) => !data.sizes.includes(h)).map((hint) => (
            <button
              key={hint}
              type="button"
              className={scss.sizeHint}
              onClick={() => onChange("sizes", [...data.sizes, hint])}
            >
              {hint}
            </button>
          ))}
        </div>
      </div>

      {/* ── Colors ── */}
      <div className={scss.field}>
        <label>Цвета *</label>

        {/* Preset swatches — only show unselected ones */}
        <div className={scss.colorPresets}>
          {COLOR_PRESETS.filter(({ hex }) => !data.colors.includes(hex)).map(
            ({ hex, label }) => (
              <button
                key={hex}
                type="button"
                title={label}
                className={scss.colorPreset}
                style={{ background: hex }}
                onClick={() => onChange("colors", [...data.colors, hex])}
              />
            )
          )}
        </div>

        {/* Picker row */}
        <div className={scss.colorPickerRow}>
          <input
            type="color"
            value={colorPicker}
            className={scss.colorSwatch}
            onChange={(e) => {
              setColorPicker(e.target.value);
              setColorHex(e.target.value);
            }}
          />
          <input
            type="text"
            placeholder="#000000 или rgb(0,0,0)"
            value={colorHex}
            className={hexError ? scss.inputError : ""}
            onChange={(e) => {
              setColorHex(e.target.value);
              const hex = normalizeHex(e.target.value);
              if (hex) {
                setColorPicker(hex);
                setHexError(null);
              }
            }}
            onKeyDown={(e) => e.key === "Enter" && addColor()}
          />
          <button type="button" className={scss.btnAddColor} onClick={addColor}>
            Добавить
          </button>
        </div>
        {hexError && <span className={scss.errorMsg}>{hexError}</span>}

        {/* Tags */}
        {data.colors.length > 0 && (
          <div className={scss.tags}>
            {data.colors.map((c) => (
              <span key={c} className={scss.tag}>
                <span className={scss.colorDot} style={{ background: c }} />
                {c}
                <button
                  type="button"
                  onClick={() =>
                    onChange(
                      "colors",
                      data.colors.filter((x) => x !== c)
                    )
                  }
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      <div className={scss.fieldRow}>
        <div className={scss.field}>
          <label>Материал</label>
          <input
            type="text"
            placeholder="Кожа, Текстиль, Хлопок..."
            value={data.material || ""}
            onChange={(e) => onChange("material", e.target.value)}
          />
        </div>
      </div>

      <div className={scss.fieldRow}>
        <div className={scss.field}>
          <label>Пол</label>
          <select
            value={data.gender}
            onChange={(e) => onChange("gender", e.target.value)}
          >
            <option value="">— Не указан —</option>
            {GENDER_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div className={scss.field}>
          <label>Сезон</label>
          <select
            value={data.season}
            onChange={(e) => onChange("season", e.target.value)}
          >
            <option value="">— Не указан —</option>
            {SEASON_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};
// ─── Step 4: Category ─────────────────────────────────────────────────────────
const Step4Category: FC<{
  categoryId: number | null;
  onChange: (id: number) => void;
  categories: CategoryWithChildren[];
  isLoading: boolean;
}> = ({ categoryId, onChange, categories, isLoading }) => {
  const [path, setPath] = useState<number[]>([]);

  const getLevelItems = (level: number) => {
    if (level === 0) return categories;
    let list = categories;
    for (let i = 0; i < level; i++) {
      const found = list.find((c) => c.id === path[i]);
      if (!found || !found.children) return [];
      list = found.children;
    }
    return list;
  };

  if (isLoading)
    return <div className={scss.loading}>Загрузка категорий...</div>;

  const labels = ["Раздел", "Категория", "Подкатегория", "Тип"];

  return (
    <div className={scss.step}>
      <h2 className={scss.stepTitle}>Категория товара</h2>
      <p className={scss.stepDesc}>
        Выбирайте последовательно: раздел → категория.
      </p>

      <div className={scss.categoryLevels}>
        {Array.from({ length: path.length + 1 }).map((_, level) => {
          const items = getLevelItems(level);
          if (items.length === 0) return null;
          return (
            <div key={level} className={scss.categoryLevel}>
              <span className={scss.levelLabel}>
                {labels[level] || `Уровень ${level + 1}`}
              </span>
              <div className={scss.categoryList}>
                {items.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    className={`${scss.categoryBtn} ${path[level] === cat.id ? scss.active : ""}`}
                    onClick={() => {
                      setPath([...path.slice(0, level), cat.id]);
                      onChange(cat.id);
                    }}
                  >
                    <span>{cat.name}</span>
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
      {categoryId && (
        <div className={scss.selectedCategory}>✓ Категория выбрана</div>
      )}
    </div>
  );
};

// ─── Step 5: Brand ────────────────────────────────────────────────────────────
const Step5Brand: FC<{ brandName: string; onChange: (v: string) => void }> = ({
  brandName,
  onChange,
}) => (
  <div className={scss.step}>
    <h2 className={scss.stepTitle}>Бренд</h2>
    <p className={scss.stepDesc}>Укажите название бренда, если есть.</p>
    <div className={scss.field}>
      <label>Название бренда</label>
      <input
        type="text"
        placeholder="Например: Nike, Adidas..."
        value={brandName}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
    <div className={scss.brandPreview}>
      {brandName ? (
        <div className={scss.brandBadge}>{brandName}</div>
      ) : (
        <span className={scss.noBrand}>Без бренда</span>
      )}
    </div>
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────
const CreateProduct: FC = () => {
  const [step, setStep] = useState(1);

  const [form, setForm] = useState<FormState>({
    images: [],
    title: "",
    description: "",
    price: "",
    newPrice: "",
    stockCount: "",
    categoryId: null,
    brandName: "",
    sizes: [],
    colors: [],
    material: "",
    gender: "",
    season: "",
    isActive: true,
  });

  const { data: categoriesData, isLoading: isLoadingCats } = useGetCategoryCategoriesTree();
  const categories = categoriesData?.categories ?? [];
  const { mutate: createProduct, isPending } = usePostCommodityCreateProduct();

  const update = (key: keyof FormState, value: unknown) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const canNext = () => {
    if (step === 1) return form.images.length > 0;
    if (step === 2) return !!form.title && !!form.description && !!form.price;
    if (step === 4) return !!form.categoryId;
    return true;
  };

  const handleSubmit = () => {
    if (!form.categoryId) {
      toast.error("Выберите категорию товара");
      return;
    }

    if (form.sizes.length === 0) {
      toast.error("Добавьте хотя бы один размер");
      return;
    }

    if (form.colors.length === 0) {
      toast.error("Добавьте хотя бы один цвет");
      return;
    }

    createProduct({ data: {
      categoryId: form.categoryId!,
      title: form.title.trim(),
      description: form.description.trim(),
      price: Number(form.price),
      brandName: form.brandName?.trim() || undefined,
      newPrice: form.newPrice ? Number(form.newPrice) : undefined,
      stockCount: form.stockCount ? Number(form.stockCount) : undefined,
      sizes: form.sizes,
      colors: form.colors,
      material: form.material?.trim() || undefined,
      gender: (form.gender || "UNISEX") as any,
      season: (form.season || "ALL_SEASON") as any,
      images: form.images as any,
    }}, {
      onSuccess: () => {
        toast.success("Товар успешно создан!");
        // Сброс формы
        setForm({
          images: [],
          title: "",
          description: "",
          price: "",
          newPrice: "",
          stockCount: "",
          categoryId: null,
          brandName: "",
          sizes: [],
          colors: [],
          material: "",
          gender: "",
          season: "",
          isActive: true,
        });
        setStep(1);
      },
      onError: (error: any) => {
        toast.error(
          error?.response?.data?.message || "Ошибка при создании товара",
        );
      },
    });
  };

  const stepLabels = ["Фото", "Инфо", "Характеристики", "Категория", "Бренд"];
  return (
    <section className={scss.CreateProduct}>
      <div className="container">
        <div className={scss.content}>
          {/* Progress Bar */}
          <div className={scss.progress}>
            {stepLabels.map((label, i) => (
              <div
                key={i}
                className={`${scss.progressItem} ${step > i + 1 ? scss.done : ""} ${step === i + 1 ? scss.active : ""}`}
              >
                <div className={scss.progressCircle}>
                  {step > i + 1 ? "✓" : i + 1}
                </div>
                <span>{label}</span>
                {i < TOTAL_STEPS - 1 && <div className={scss.progressLine} />}
              </div>
            ))}
          </div>

          <div className={scss.stepWrapper}>
            {step === 1 && (
              <Step1Photos
                images={form.images}
                onChange={(v) => update("images", v)}
              />
            )}
            {step === 2 && <Step2Info data={form} onChange={update} />}
            {step === 3 && <Step3Attributes data={form} onChange={update} />}
            {step === 4 && (
              <Step4Category
                categoryId={form.categoryId}
                onChange={(id) => update("categoryId", id)}
                categories={categories as CategoryWithChildren[]}
                isLoading={isLoadingCats}
              />
            )}
            {step === 5 && (
              <Step5Brand
                brandName={form.brandName}
                onChange={(v) => update("brandName", v)}
              />
            )}
          </div>

          <div className={scss.nav}>
            {step > 1 && (
              <button
                className={scss.btnBack}
                onClick={() => setStep((s) => s - 1)}
              >
                Назад
              </button>
            )}

            {step < TOTAL_STEPS ? (
              <button
                className={scss.btnNext}
                disabled={!canNext()}
                onClick={() => setStep((s) => s + 1)}
              >
                Далее
              </button>
            ) : (
              <button
                className={scss.btnSubmit}
                disabled={isPending || !form.categoryId}
                onClick={handleSubmit}
              >
                {isPending ? "Создаём товар..." : "Создать товар"}
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CreateProduct;
