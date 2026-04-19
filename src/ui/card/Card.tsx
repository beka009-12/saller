"use client";
import { FC, useRef, useState, useEffect } from "react";
import Link from "next/link";
import scss from "./Card.module.scss";
import CardButtons from "@/src/ui/card-buttons/CardButtons";
import { useDeleteProduct } from "@/src/api/product";

interface CardProps {
  product: Product;
  onEdit: (id: number) => void;
}

const Card: FC<CardProps> = ({ product, onEdit }) => {
  const { mutate: deleteProduct } = useDeleteProduct();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const handleDelete = (id: number) => {
    if (confirm("Удалить товар?")) {
      deleteProduct(id);
    }
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el || product.images.length <= 1) return;

    const handleScroll = () => {
      const index = Math.round(el.scrollLeft / el.offsetWidth);
      setActiveIndex(index);
    };
    el.addEventListener("scroll", handleScroll, { passive: true });
    return () => el.removeEventListener("scroll", handleScroll);
  }, [product.images.length]);

  const discountPercent =
    product.newPrice && product.price
      ? Math.round(((product.price - product.newPrice) / product.price) * 100)
      : null;

  const stockLabel =
    product.stockCount === 0
      ? "Нет в наличии"
      : product.stockCount <= 3
        ? `Осталось: ${product.stockCount}`
        : `В наличии: ${product.stockCount}`;

  const stockClass =
    product.stockCount === 0
      ? scss.out
      : product.stockCount <= 3
        ? scss.low
        : "";

  return (
    <div className={scss.card}>
      <Link href={`/products/${product.id}`} className={scss.link}>
        <div className={scss.imageWrapper}>
          <div className={scss.images} ref={scrollRef}>
            {product.images.map((img, i) => (
              <img
                key={i}
                src={img}
                alt={`${product.title} ${i + 1}`}
                className={scss.image}
                loading={i === 0 ? "eager" : "lazy"}
              />
            ))}
          </div>

          {discountPercent && (
            <span className={scss.discountBadge}>−{discountPercent}%</span>
          )}

          {product.images.length > 1 && (
            <div className={scss.dots}>
              {product.images.slice(0, 5).map((_, i) => (
                <span
                  key={i}
                  className={`${scss.dot} ${i === activeIndex ? scss.active : ""}`}
                />
              ))}
            </div>
          )}

          {product.images.length > 1 && (
            <span className={scss.imageBadge}>
              {activeIndex + 1} / {product.images.length}
            </span>
          )}
        </div>

        <div className={scss.info}>
          <h3 className={scss.title}>{product.title}</h3>
          <p className={scss.description}>{product.description}</p>

          <div className={scss.footer}>
            <div className={scss.prices}>
              {product.newPrice ? (
                <>
                  <span className={scss.price}>{product.newPrice} сом</span>
                  <span className={scss.oldPrice}>{product.price} сом</span>
                </>
              ) : (
                <span className={scss.price}>{product.price} сом</span>
              )}
            </div>
            <span className={`${scss.stock} ${stockClass}`}>{stockLabel}</span>
          </div>
        </div>
      </Link>

      <CardButtons
        productId={product.id}
        onEdit={onEdit} // ← передаём
        onDelete={handleDelete}
      />
    </div>
  );
};

export default Card;
