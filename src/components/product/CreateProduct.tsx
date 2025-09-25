"use client";
import { type FC, useState } from "react";
import scss from "./CreateProduct.module.scss";
import { useForm } from "react-hook-form";
import { useCreateProduct } from "@/api/product";

interface FormData {
  category: string;
  brand: string;
  title: string;
  description: string;
  sizes: string;
  colors: string;
  price: number;
  newPrice?: number;
  stockCount: number;
  inStock: boolean;
  tags: string;
  images: FileList;
}

const CreateProduct: FC = () => {
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<FormData>();
  const { mutate: createProduct, isPending, error } = useCreateProduct();
  const [previewImages, setPreviewImages] = useState<string[]>([]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const previews = Array.from(files).map((file) =>
        URL.createObjectURL(file)
      );
      setPreviewImages(previews);
    }
  };

  const onSubmit = (data: FormData) => {
    const formData = {
      category: data.category,
      brand: data.brand,
      title: data.title,
      description: data.description,
      sizes: data.sizes
        ? data.sizes
            .split(",")
            .map((s) => s.trim())
            .filter((s) => s)
        : [],
      colors: data.colors
        ? data.colors
            .split(",")
            .map((c) => c.trim())
            .filter((c) => c)
        : [],
      price: Number(data.price),
      newPrice: data.newPrice ? Number(data.newPrice) : undefined,
      stockCount: Number(data.stockCount),
      inStock: data.inStock,
      tags: data.tags
        ? data.tags
            .split(",")
            .map((t) => t.trim())
            .filter((t) => t)
        : [],
      images: data.images ? Array.from(data.images) : [],
    };

    createProduct(formData, {
      onSuccess: () => {
        alert("Товар успешно создан!");
        reset();
        setPreviewImages([]);
      },
      onError: (error) => {
        alert(`Ошибка: ${error.message}`);
      },
    });
  };

  return (
    <section className={scss.CreateProduct}>
      <div className="container">
        <div className={scss.content}>
          <h1>Создание товара</h1>

          <form onSubmit={handleSubmit(onSubmit)} className={scss.form}>
            <div className={scss.formGroup}>
              <label htmlFor="category">Категория *</label>
              <input
                id="category"
                type="text"
                {...register("category", { required: "Категория обязательна" })}
                className={errors.category ? scss.error : ""}
              />
              {errors.category && (
                <span className={scss.errorText}>
                  {errors.category.message}
                </span>
              )}
            </div>

            <div className={scss.formGroup}>
              <label htmlFor="brand">Бренд *</label>
              <input
                id="brand"
                type="text"
                {...register("brand", { required: "Бренд обязателен" })}
                className={errors.brand ? scss.error : ""}
              />
              {errors.brand && (
                <span className={scss.errorText}>{errors.brand.message}</span>
              )}
            </div>

            <div className={scss.formGroup}>
              <label htmlFor="title">Название товара *</label>
              <input
                id="title"
                type="text"
                {...register("title", { required: "Название обязательно" })}
                className={errors.title ? scss.error : ""}
              />
              {errors.title && (
                <span className={scss.errorText}>{errors.title.message}</span>
              )}
            </div>

            <div className={scss.formGroup}>
              <label htmlFor="description">Описание *</label>
              <textarea
                id="description"
                rows={4}
                {...register("description", {
                  required: "Описание обязательно",
                })}
                className={errors.description ? scss.error : ""}
              />
              {errors.description && (
                <span className={scss.errorText}>
                  {errors.description.message}
                </span>
              )}
            </div>

            <div className={scss.formRow}>
              <div className={scss.formGroup}>
                <label htmlFor="sizes">Размеры (через запятую)</label>
                <input
                  id="sizes"
                  type="text"
                  placeholder="S, M, L, XL"
                  {...register("sizes")}
                />
              </div>

              <div className={scss.formGroup}>
                <label htmlFor="colors">Цвета (через запятую)</label>
                <input
                  id="colors"
                  type="text"
                  placeholder="Красный, Синий, Зеленый"
                  {...register("colors")}
                />
              </div>
            </div>

            <div className={scss.formRow}>
              <div className={scss.formGroup}>
                <label htmlFor="price">Цена *</label>
                <input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0"
                  {...register("price", {
                    required: "Цена обязательна",
                    min: {
                      value: 0,
                      message: "Цена не может быть отрицательной",
                    },
                  })}
                  className={errors.price ? scss.error : ""}
                />
                {errors.price && (
                  <span className={scss.errorText}>{errors.price.message}</span>
                )}
              </div>

              <div className={scss.formGroup}>
                <label htmlFor="newPrice">Новая цена (скидка)</label>
                <input
                  id="newPrice"
                  type="number"
                  step="0.01"
                  min="0"
                  {...register("newPrice", {
                    min: {
                      value: 0,
                      message: "Цена не может быть отрицательной",
                    },
                  })}
                  className={errors.newPrice ? scss.error : ""}
                />
                {errors.newPrice && (
                  <span className={scss.errorText}>
                    {errors.newPrice.message}
                  </span>
                )}
              </div>
            </div>

            <div className={scss.formRow}>
              <div className={scss.formGroup}>
                <label htmlFor="stockCount">Количество на складе</label>
                <input
                  id="stockCount"
                  type="number"
                  min="0"
                  defaultValue={0}
                  {...register("stockCount", {
                    min: {
                      value: 0,
                      message: "Количество не может быть отрицательным",
                    },
                  })}
                  className={errors.stockCount ? scss.error : ""}
                />
                {errors.stockCount && (
                  <span className={scss.errorText}>
                    {errors.stockCount.message}
                  </span>
                )}
              </div>

              <div className={scss.formGroup}>
                <label className={scss.checkboxLabel}>В наличии</label>
              </div>
            </div>

            <div className={scss.formGroup}>
              <label htmlFor="tags">Теги (через запятую)</label>
              <input
                id="tags"
                type="text"
                placeholder="новинка, популярное, акция"
                {...register("tags")}
              />
            </div>

            <div className={scss.formGroup}>
              <label htmlFor="images">Изображения товара</label>
              <input
                id="images"
                type="file"
                multiple
                accept="image/*"
                {...register("images")}
                onChange={handleImageChange}
              />

              {previewImages.length > 0 && (
                <div className={scss.imagePreview}>
                  {previewImages.map((src, index) => (
                    <img key={index} src={src} alt={`Превью ${index + 1}`} />
                  ))}
                </div>
              )}
            </div>

            {error && (
              <div className={scss.errorMessage}>Ошибка: {error.message}</div>
            )}

            <div className={scss.formActions}>
              <button
                type="button"
                onClick={() => {
                  reset();
                  setPreviewImages([]);
                }}
                className={scss.resetButton}
                disabled={isPending}
              >
                Очистить
              </button>

              <button
                type="submit"
                className={scss.submitButton}
                disabled={isPending}
              >
                {isPending ? "Создание..." : "Создать товар"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default CreateProduct;
