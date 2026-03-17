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
  
  // Состояния
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Реф для отслеживания клика вне меню
  const menuRef = useRef<HTMLDivElement>(null);

  // Логика закрытия меню при клике "мимо"
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
  if (!data?.product) return <div className={scss.error}>Товар не найден</div>;

  const { product } = data;

  // Расчет скидки
  const discount = product.oldPrice
    ? Math.round((1 - Number(product.price) / Number(product.oldPrice)) * 100)
    : null;

  return (
    <section className={scss.ProductDetail}>
      <div className="container">
        <div className={scss.content}>
          
          {/* Левая колонка: Галерея */}
          <div className={scss.gallery}>
            {product.images.length > 1 && (
              <div className={scss.thumbs}>
                {product.images.map((img, i) => (
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
              src={product.images[selectedImageIndex] || "/placeholder.png"}
              alt={product.title}
              className={scss.mainImage}
            />
          </div>

          {/* Правая колонка: Инфо */}
          <div className={scss.info}>
            <div className={scss.badges}>
              <div className={scss.ded}>
                <span className={scss.categoryBadge}>
                  {product.category.name}
                </span>
                <span className={product.isActive ? scss.active : scss.inactive}>
                  {product.isActive ? "Активен" : "Неактивен"}
                </span>
              </div>

              {/* Бургер-меню (3 точки) */}
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
                  <span className={scss.price}>
                    {Number(product.price).toLocaleString()} <span>сом</span>
                  </span>
                  {product.oldPrice && (
                    <span className={scss.oldPrice}>
                      {Number(product.oldPrice).toLocaleString()} сом
                    </span>
                  )}
                </div>
              </div>
              {discount && discount > 0 && (
                <span className={scss.discount}>−{Math.abs(discount)}%</span>
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
            </div>

            {product.tags.length > 0 && (
              <div className={scss.tags}>
                {product.tags.map((tag, i) => (
                  <span key={i} className={scss.tag}>
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {product.archivedAt && (
              <div className={scss.archived}>
                Архивировано: {new Date(product.archivedAt).toLocaleDateString("ru-RU")}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Модальное окно */}
      {isModalOpen && (
        <UpdateModal productId={id} onClose={() => setIsModalOpen(false)} />
      )}
    </section>
  );
};

export default ProductDetail;