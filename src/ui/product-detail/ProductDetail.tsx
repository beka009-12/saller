/* eslint-disable @next/next/no-img-element */
"use client";

import { useRouter } from "next/navigation";
import { useGetProductById } from "@/src/api/product";
import scss from "./ProductDetail.module.scss";
import { useState, useEffect, useRef } from "react";
import UpdateModal from "../card-buttons/updateModal/UpdateModal";

interface ProductDetailProps {
  id: number;
}

const ProductDetail = ({ id }: ProductDetailProps) => {
  const router = useRouter();
  const { data, isLoading } = useGetProductById(id);

  // Достаем product из даты (зависит от того, как возвращает ваш хук)
  const product = data?.product;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (isLoading) return <div className={scss.loader}>Загрузка...</div>;
  if (!product) return <div className={scss.error}>Товар не найден</div>;

  // ЛОГИКА СКИДКИ:
  // price — это старая/базовая цена
  // newPrice — это текущая цена со скидкой
  const hasDiscount = !!product.newPrice;
  const actualPrice = hasDiscount
    ? Number(product.newPrice)
    : Number(product.price);
  const oldPriceValue = hasDiscount ? Number(product.price) : null;

  const discountPercent =
    hasDiscount && oldPriceValue
      ? Math.round(100 - (actualPrice / oldPriceValue) * 100)
      : null;

  return (
    <section className={scss.ProductDetail}>
      <div className="container">
        <div className={scss.content}>
          {/* Левая колонка: Галерея */}
          <div className={scss.gallery}>
            {product.images?.length > 1 && (
              <div className={scss.thumbs}>
                {product.images.map((img: string, i: number) => (
                  <img
                    key={i}
                    src={img}
                    alt={`Preview ${i}`}
                    className={`${scss.thumb} ${
                      selectedImageIndex === i ? scss.activeThumb : ""
                    }`}
                    onClick={() => setSelectedImageIndex(i)}
                  />
                ))}
              </div>
            )}
            <img
              src={product.images?.[selectedImageIndex] || "/placeholder.png"}
              alt={product.title}
              className={scss.mainImage}
            />
          </div>

          {/* Правая колонка: Инфо */}
          <div className={scss.info}>
            <div className={scss.badges}>
              <div className={scss.ded}>
                <span className={scss.categoryBadge}>
                  {product.categoryId
                    ? `Категория: ${product.categoryId}`
                    : "Без категории"}
                </span>
                <span
                  className={product.isActive ? scss.active : scss.inactive}
                >
                  {product.isActive ? "Активен" : "Неактивен"}
                </span>
              </div>

              <div className={scss.menuWrapper} ref={menuRef}>
                <button
                  className={scss.burgerBtn}
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                  ⋮
                </button>

                {isMenuOpen && (
                  <div className={scss.dropdownMenu}>
                    <button
                      className={scss.menuItem}
                      onClick={() => {
                        setIsModalOpen(true);
                        setIsMenuOpen(false);
                      }}
                    >
                      <span>🖊</span> Изменить
                    </button>
                    <button
                      className={scss.menuItem}
                      onClick={() => router.back()}
                    >
                      <span>✕</span> Назад
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className={scss.titleBlock}>
              <h1 className={scss.title}>{product.title}</h1>
              <p className={scss.description}>{product.description}</p>
            </div>

            <div className={scss.priceBox}>
              <div className={scss.priceMain}>
                <span className={scss.label}>Цена</span>
                <div className={scss.priceRow}>
                  {/* Основная актуальная цена */}
                  <span className={scss.price}>
                    {actualPrice.toLocaleString()} <span>сом</span>
                  </span>

                  {/* Старая зачеркнутая цена, если есть скидка */}
                  {hasDiscount && (
                    <span className={scss.oldPrice}>
                      {oldPriceValue?.toLocaleString()} сом
                    </span>
                  )}
                </div>
              </div>
              {/* Бейдж процента скидки */}
              {discountPercent && discountPercent > 0 && (
                <span className={scss.discount}>−{discountPercent}%</span>
              )}
            </div>

            <div className={scss.stats}>
              <div className={scss.statItem}>
                <span>В наличии</span>
                <span>{product.stockCount} шт</span>
              </div>
              {product.brandName && (
                <div className={scss.statItem}>
                  <span>Бренд</span>
                  <span>{product.brandName}</span>
                </div>
              )}

              <div className={scss.statItem}>
                <span>Размер</span>
                <span>{product.sizes?.join(", ") || "Не указан"}</span>
              </div>
              <div className={scss.statItem}>
                <span>Цвет</span>
                <span>{product.colors?.join(", ") || "Не указан"}</span>
              </div>

              {product.material && (
                <div className={scss.statItem}>
                  <span>Материал</span>
                  <span>{product.material}</span>
                </div>
              )}

              {product.gender && (
                <div className={scss.statItem}>
                  <span>Пол</span>
                  <span>{product.gender}</span>
                </div>
              )}

              {product.season && (
                <div className={scss.statItem}>
                  <span>Сезон</span>
                  <span>{product.season}</span>
                </div>
              )}

              {product.sku && (
                <div className={scss.statItem}>
                  <span>Коллекция</span>
                  <span>{product.sku}</span>
                </div>
              )}
            </div>

            {product.archivedAt && (
              <div className={scss.archived}>
                Архивировано:{" "}
                {new Date(product.archivedAt).toLocaleDateString("ru-RU")}
              </div>
            )}
          </div>
        </div>
      </div>

      {isModalOpen && (
        <UpdateModal productId={id} onClose={() => setIsModalOpen(false)} />
      )}
    </section>
  );
};

export default ProductDetail;
