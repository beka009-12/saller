"use client";
import { useRouter } from "next/navigation";
import { useGetProductById } from "@/src/api/product";
import scss from "./ProductDetail.module.scss";
import { useState } from "react";
import UpdateModal from "../card-buttons/updateModal/UpdateModal";

interface ProductDetailProps {
  id: number;
}

const ProductDetail = ({ id }: ProductDetailProps) => {
  const router = useRouter();
  const { data, isLoading } = useGetProductById(id);
  const [isOpen, setIsOpen] = useState(false);

  if (isLoading) return <p>Загрузка...</p>;
  if (!data) return <p>Товар не найден</p>;

  const product = data.product;

  const discount = product.oldPrice
    ? Math.round((1 - Number(product.price) / Number(product.oldPrice)) * 100)
    : null;

  return (
    <section className={scss.ProductDetail}>
      <div className="container">
           <div className={scss.header}>
          <div className={scss.headerActions}>
            <button className={scss.editBtn} onClick={() => setIsOpen(true)}>
              🖊 Изменить
            </button>
          </div>
          <button className={scss.closeBtn} onClick={() => router.back()}>
            ✕
          </button>
        </div>

        <div className={scss.content}>
          <div className={scss.gallery}>
            <img
              src={product.images[0]}
              alt={product.title}
              className={scss.mainImage}
            />
            {product.images.length > 1 && (
              <div className={scss.thumbs}>
                {product.images.map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    alt={`${i + 1}`}
                    className={scss.thumb}
                  />
                ))}
              </div>
            )}
          </div>

          <div className={scss.info}>
            <div className={scss.badges}>
              <span className={scss.categoryBadge}>
                {product.category.name}
              </span>
              <span className={product.isActive ? scss.active : scss.inactive}>
                {product.isActive ? "Активен" : "Неактивен"}
              </span>
            </div>

            <div className={scss.titleBlock}>
              {product.brandName && (
                <p className={scss.brand}>{product.brandName}</p>
              )}
              <h1 className={scss.title}>{product.title}</h1>
              <p className={scss.description}>{product.description}</p>
            </div>

            <div className={scss.priceBox}>
              <div className={scss.priceMain}>
                <span>Цена</span>
                <span className={scss.price}>
                  {product.price} <span>сом</span>
                </span>
                {product.oldPrice && (
                  <span className={scss.oldPrice}>{product.oldPrice} сом</span>
                )}
              </div>
              {discount && (
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

            {product.store && (
              <div className={scss.store}>
                {product.store.logo ? (
                  <img
                    src={product.store.logo}
                    alt={product.store.name}
                    className={scss.storeLogo}
                  />
                ) : (
                  <div className={scss.storeInitials}>
                    {product.store.name.slice(0, 2).toUpperCase()}
                  </div>
                )}
                <div>
                  <p className={scss.storeName}>{product.store.name}</p>
                  {product.store.isVerified && (
                    <p className={scss.verified}>✓ Проверен</p>
                  )}
                </div>
              </div>
            )}

            {product.archivedAt && (
              <span className={scss.archived}>
                Архивировано:{" "}
                {new Date(product.archivedAt).toLocaleDateString("ru-RU")}
              </span>
            )}
          </div>
        </div>
      </div>
       {isOpen && (
        <UpdateModal productId={id} onClose={() => setIsOpen(false)} />
      )}
    </section>
  );
};

export default ProductDetail;
