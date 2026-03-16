"use client";
import { FC, useState } from "react";
import { useGetProductById, useUpdateProduct } from "@/src/api/product";
import scss from "./UpdateModal.module.scss";

interface EditModalProps {
  productId: number;
  onClose: () => void;
}

const UpdateModal: FC<EditModalProps> = ({ productId, onClose }) => {
  const { data, isLoading } = useGetProductById(productId);
  const { mutate: updateProduct, isPending } = useUpdateProduct();
  const [previews, setPreviews] = useState<string[]>([]);

  if (isLoading) return null;
  if (!data) return null;

  const product = data.product;

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
          title: formData.get("title") as string,
          description: formData.get("description") as string,
          price: formData.get("price") as string,
          oldPrice: (formData.get("oldPrice") as string) || null,
          stockCount: Number(formData.get("stockCount")),
          brandName: (formData.get("brandName") as string) || null,
          tags: tagsValue ? tagsValue.split(",").map((t) => t.trim()) : [],
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
              {(previews.length > 0 ? previews : product.images).map(
                (img, i) => (
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
                name="oldPrice"
                type="number"
                defaultValue={product.oldPrice ?? ""}
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
            <label>Теги (через запятую)</label>
            <input
              name="tags"
              defaultValue={product.tags.join(", ")}
              placeholder="nike, air, кроссовки"
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
