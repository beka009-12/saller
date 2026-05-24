"use client";
import { FC, useState } from "react";
import { useGetCommodityProductOwnerId, usePatchCommodityProductUpdateId } from "@/src/api/generated/endpoints/product/product";
import scss from "./UpdateModal.module.scss";

interface EditModalProps {
  productId: number;
  onClose: () => void;
}

const UpdateModal: FC<EditModalProps> = ({ productId, onClose }) => {
  const { data, isLoading } = useGetCommodityProductOwnerId(productId);
  const { mutate: updateProduct, isPending } = usePatchCommodityProductUpdateId();
  const [previews, setPreviews] = useState<string[]>([]);

  if (isLoading) return null;
  if (!data) return null;

  const product = data.product!;

  const handleImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const urls = files.map((file) => URL.createObjectURL(file));
    setPreviews(urls);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const tagsValue = formData.get("tags") as string;

    updateProduct(
      {
        id: productId,
        data: {
          categoryId: product?.categoryId ?? 0,
          title: formData.get("title") as string,
          description: formData.get("description") as string,
          price: Number(formData.get("price")),
          newPrice: Number(formData.get("newPrice")),
          stockCount: Number(formData.get("stockCount")),
          brandName: (formData.get("brandName") as string) || undefined,
          season: ((formData.get("season") as string) || "ALL_SEASON") as any,
          sizes:
            ((formData.get("size") as string)
              ?.split(",")
              .map((s) => s.trim())
              .filter(Boolean)) || [],
          colors:
            ((formData.get("color") as string)
              ?.split(",")
              .map((s) => s.trim())
              .filter(Boolean)) || [],
          material: (formData.get("material") as string) || undefined,
          gender: ((formData.get("gender") as string) || "UNISEX") as any,
        },
      },
      { onSuccess: onClose },
    );
  };

  return (
    <div className={scss.overlay} onClick={onClose}>
      <div className={scss.modal} onClick={(e) => e.stopPropagation()}>
        <div className={scss.header}>
          <h3>Редактировать товар</h3>
          <button className={scss.closeBtn} onClick={onClose}>
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className={scss.form}>
          <div className={scss.field}>
            <label>Фото</label>
            <div className={scss.images}>
              {(previews.length > 0 ? previews : ((product as any)?.images ?? [])).map(
                (img: string, i: number) => (
                  <img
                    key={i}
                    src={img}
                    alt={`фото ${i + 1}`}
                    className={scss.image}
                  />
                ),
              )}
            </div>
            <label className={scss.uploadBtn}>
              📎 Загрузить новые фото
              <input
                type="file"
                name="images"
                accept="image/*"
                multiple
                hidden
                onChange={handleImages}
              />
            </label>
          </div>

          <div className={scss.field}>
            <label>Название</label>
            <input
              name="title"
              defaultValue={product.title}
              placeholder="Название"
              required
            />
          </div>

          <div className={scss.field}>
            <label>Описание</label>
            <textarea
              name="description"
              defaultValue={product.description}
              placeholder="Описание"
              rows={3}
            />
          </div>

          <div className={scss.row}>
            <div className={scss.field}>
              <label>Цена (сом)</label>
              <input
                name="price"
                type="number"
                defaultValue={product.price}
                placeholder="Цена"
                required
              />
            </div>
            <div className={scss.field}>
              <label>Старая цена (сом)</label>
              <input
                name="newPrice"
                type="number"
                defaultValue={product.newPrice ?? ""}
                placeholder="Старая цена"
              />
            </div>
          </div>

          <div className={scss.row}>
            <div className={scss.field}>
              <label>В наличии</label>
              <input
                name="stockCount"
                type="number"
                defaultValue={product.stockCount}
                placeholder="Кол-во"
              />
            </div>
            <div className={scss.field}>
              <label>Бренд</label>
              <input
                name="brandName"
                defaultValue={product.brandName ?? ""}
                placeholder="Бренд"
              />
            </div>
          </div>

          <div className={scss.field}>
            <label>Размер</label>
            <input
              name="size"
              defaultValue={product.sizes?.join(", ") || ""}
              placeholder="Размер"
            />
          </div>

          <div className={scss.field}>
            <label>Цвет</label>
            <input
              name="color"
              defaultValue={product.colors?.join(", ") || ""}
              placeholder="Цвет"
            />
          </div>

          <div className={scss.field}>
            <label>Материал</label>
            <input
              name="material"
              defaultValue={product.material ?? ""}
              placeholder="Материал"
            />
          </div>

          <div className={scss.field}>
            <label>Сезон</label>
            <input
              name="season"
              defaultValue={product.season ?? ""}
              placeholder="Сезон"
            />
          </div>

          <div className={scss.field}>
            <label>Пол</label>
            <input
              name="gender"
              defaultValue={product.gender ?? ""}
              placeholder="Пол"
            />
          </div>

          <div className={scss.buttons}>
            <button type="button" onClick={onClose}>
              Отмена
            </button>
            <button type="submit" disabled={isPending}>
              {isPending ? "Сохранение..." : "Сохранить"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateModal;
