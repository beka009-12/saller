"use client";
import { FC, useState, useEffect } from "react";
import { X, Upload } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import {
  useGetCommodityProductOwnerId,
  usePatchCommodityProductUpdateId,
} from "@/src/api/generated/endpoints/product/product";
import ColorPicker from "@/src/components/product/ColorPicker";
import SizePicker from "@/src/components/product/SizePicker";
import toast from "react-hot-toast";
import scss from "./UpdateModal.module.scss";

type Gender = "MALE" | "FEMALE" | "UNISEX" | "";
type Season = "SPRING_SUMMER" | "AUTUMN_WINTER" | "ALL_SEASON" | "";

const GENDER_OPTIONS = [
  { value: "MALE",   label: "Мужской" },
  { value: "FEMALE", label: "Женский" },
  { value: "UNISEX", label: "Унисекс" },
];

const SEASON_OPTIONS = [
  { value: "SPRING_SUMMER", label: "Весна / Лето" },
  { value: "AUTUMN_WINTER", label: "Осень / Зима" },
  { value: "ALL_SEASON",    label: "Всесезонный" },
];

interface Props {
  productId: number;
  onClose: () => void;
}

const smooth: [number,number,number,number] = [0.22, 1, 0.36, 1];

const UpdateModal: FC<Props> = ({ productId, onClose }) => {
  const { data, isLoading } = useGetCommodityProductOwnerId(productId);
  const { mutate: updateProduct, isPending } = usePatchCommodityProductUpdateId();

  const [title,       setTitle]       = useState("");
  const [description, setDescription] = useState("");
  const [price,       setPrice]       = useState("");
  const [newPrice,    setNewPrice]    = useState("");
  const [stockCount,  setStockCount]  = useState("");
  const [brandName,   setBrandName]   = useState("");
  const [material,    setMaterial]    = useState("");
  const [gender,      setGender]      = useState<Gender>("");
  const [season,      setSeason]      = useState<Season>("");
  const [sizes,       setSizes]       = useState<string[]>([]);
  const [colors,      setColors]      = useState<string[]>([]);
  const [previews,    setPreviews]    = useState<string[]>([]);
  const [newImages,   setNewImages]   = useState<File[]>([]);

  // Populate form when product loads
  useEffect(() => {
    if (!data?.product) return;
    const p = data.product as any;
    setTitle(p.title ?? "");
    setDescription(p.description ?? "");
    setPrice(String(p.price ?? ""));
    setNewPrice(p.newPrice ? String(p.newPrice) : "");
    setStockCount(String(p.stockCount ?? ""));
    setBrandName(p.brandName ?? "");
    setMaterial(p.material ?? "");
    setGender((p.gender ?? "") as Gender);
    setSeason((p.season ?? "") as Season);
    setSizes(p.sizes ?? []);
    setColors(p.colors ?? []);
  }, [data]);

  const priceError =
    newPrice && price && Number(newPrice) >= Number(price)
      ? "Цена со скидкой должна быть меньше основной"
      : null;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    setNewImages(files);
    setPreviews(files.map((f) => URL.createObjectURL(f)));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) { toast.error("Введите название"); return; }
    if (!price)        { toast.error("Введите цену");     return; }
    if (priceError)    { toast.error(priceError);         return; }
    if (sizes.length === 0)  { toast.error("Добавьте хотя бы один размер"); return; }
    if (colors.length === 0) { toast.error("Добавьте хотя бы один цвет");   return; }

    updateProduct(
      {
        id: productId,
        data: {
          categoryId: data?.product?.categoryId ?? 0,
          title:       title.trim(),
          description: description.trim(),
          price:       Number(price),
          newPrice:    newPrice ? Number(newPrice) : undefined,
          stockCount:  stockCount ? Number(stockCount) : undefined,
          brandName:   brandName.trim() || undefined,
          material:    material.trim()  || undefined,
          gender:      (gender  || "UNISEX")     as any,
          season:      (season  || "ALL_SEASON") as any,
          sizes,
          colors,
        },
      },
      {
        onSuccess: () => { toast.success("Товар обновлён"); onClose(); },
        onError:   () => toast.error("Ошибка при обновлении"),
      }
    );
  };

  const existingImages: string[] = (data?.product as any)?.images ?? [];
  const displayImages = previews.length > 0 ? previews : existingImages;

  return (
    <AnimatePresence>
      <motion.div
        className={scss.overlay}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={onClose}
      >
        <motion.div
          className={scss.modal}
          initial={{ opacity: 0, scale: 0.96, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 12 }}
          transition={{ duration: 0.25, ease: smooth }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className={scss.header}>
            <div>
              <h3>Редактировать товар</h3>
              <p>#{productId}</p>
            </div>
            <button className={scss.closeBtn} onClick={onClose} aria-label="Закрыть">
              <X size={16} />
            </button>
          </div>

          {isLoading ? (
            <div className={scss.loading}>Загрузка…</div>
          ) : (
            <form onSubmit={handleSubmit} className={scss.form}>

              {/* ── Images ── */}
              <div className={scss.section}>
                <div className={scss.sectionLabel}>Фотографии</div>
                {displayImages.length > 0 && (
                  <div className={scss.images}>
                    {displayImages.map((src, i) => (
                      <img key={i} src={src} alt="" className={scss.image} />
                    ))}
                  </div>
                )}
                <label className={scss.uploadBtn}>
                  <Upload size={13} />
                  {newImages.length > 0 ? `${newImages.length} фото выбрано` : "Загрузить новые фото"}
                  <input type="file" accept="image/*" multiple hidden onChange={handleImageChange} />
                </label>
              </div>

              {/* ── Basic info ── */}
              <div className={scss.section}>
                <div className={scss.sectionLabel}>Основная информация</div>

                <div className={scss.field}>
                  <label>Название *</label>
                  <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Название товара"
                    required
                  />
                </div>

                <div className={scss.field}>
                  <label>Описание</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Описание товара"
                    rows={3}
                  />
                </div>

                <div className={scss.row}>
                  <div className={scss.field}>
                    <label>Цена (сом) *</label>
                    <input
                      type="number"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="0"
                      required
                    />
                  </div>
                  <div className={scss.field}>
                    <label>Цена со скидкой</label>
                    <input
                      type="number"
                      value={newPrice}
                      onChange={(e) => setNewPrice(e.target.value)}
                      placeholder="0"
                      className={priceError ? scss.inputError : ""}
                    />
                    {priceError && <span className={scss.errorMsg}>{priceError}</span>}
                  </div>
                  <div className={scss.field}>
                    <label>Остаток</label>
                    <input
                      type="number"
                      value={stockCount}
                      onChange={(e) => setStockCount(e.target.value)}
                      placeholder="0"
                    />
                  </div>
                </div>

                <div className={scss.row}>
                  <div className={scss.field}>
                    <label>Бренд</label>
                    <input
                      value={brandName}
                      onChange={(e) => setBrandName(e.target.value)}
                      placeholder="Nike, Adidas…"
                    />
                  </div>
                  <div className={scss.field}>
                    <label>Материал</label>
                    <input
                      value={material}
                      onChange={(e) => setMaterial(e.target.value)}
                      placeholder="Кожа, хлопок…"
                    />
                  </div>
                </div>

                <div className={scss.row}>
                  <div className={scss.field}>
                    <label>Пол</label>
                    <select value={gender} onChange={(e) => setGender(e.target.value as Gender)}>
                      <option value="">— Не указан —</option>
                      {GENDER_OPTIONS.map((o) => (
                        <option key={o.value} value={o.value}>{o.label}</option>
                      ))}
                    </select>
                  </div>
                  <div className={scss.field}>
                    <label>Сезон</label>
                    <select value={season} onChange={(e) => setSeason(e.target.value as Season)}>
                      <option value="">— Не указан —</option>
                      {SEASON_OPTIONS.map((o) => (
                        <option key={o.value} value={o.value}>{o.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* ── Sizes ── */}
              <div className={scss.section}>
                <div className={scss.sectionLabel}>Размеры *</div>
                <SizePicker value={sizes} onChange={setSizes} />
              </div>

              {/* ── Colors ── */}
              <div className={scss.section}>
                <div className={scss.sectionLabel}>
                  Цвета * <span className={scss.hint}>(выберите из палитры или введите название)</span>
                </div>
                <ColorPicker value={colors} onChange={setColors} />
              </div>

              {/* ── Actions ── */}
              <div className={scss.buttons}>
                <button type="button" className={scss.cancelBtn} onClick={onClose}>
                  Отмена
                </button>
                <button type="submit" className={scss.saveBtn} disabled={isPending}>
                  {isPending ? "Сохранение…" : "Сохранить"}
                </button>
              </div>
            </form>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default UpdateModal;
