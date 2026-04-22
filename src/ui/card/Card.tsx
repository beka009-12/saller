"use client";
import { FC, useRef, useState, useEffect } from "react";
import Link from "next/link";
import scss from "./Card.module.scss";
import CardButtons from "@/src/ui/card-buttons/CardButtons";
import { Product } from "@/src/api/generated/models/product";

interface CardProps {
  product: Product;
  onEdit: (id: number) => void;
  onDelete?: (id: number) => void; // Можно передать сверху для гибкости
}

const Card: FC<CardProps> = ({ product, onEdit }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el || (product.images ?? []).length <= 1) return;
    const handleScroll = () => {
      const index = Math.round(el.scrollLeft / el.offsetWidth);
      setActiveIndex(index);
    };
    el.addEventListener("scroll", handleScroll, { passive: true });
    return () => el.removeEventListener("scroll", handleScroll);
  }, [product.images]);

  const price = Number(product.price ?? 0);
  const stockCount = product.stockCount ?? 0;
  const images = product.images ?? [];

  return (
    <div className={scss.adminCard}>
      <div className={scss.preview}>
        <div className={scss.imageContainer} ref={scrollRef}>
          {images.length > 0 ? (
            images.map((img, i) => (
              <img key={i} src={img} alt="" className={scss.img} />
            ))
          ) : (
            <div className={scss.noImage}>No image</div>
          )}
        </div>

        {images.length > 1 && (
          <div className={scss.imageCounter}>
            {activeIndex + 1} / {images.length}
          </div>
        )}

        <div className={scss.statusDot}>
          <span className={stockCount > 0 ? scss.active : scss.inactive} />
        </div>
      </div>

      <div className={scss.content}>
        <div className={scss.header}>
          <div className={scss.meta}>
            <span className={scss.id}>#{product.id}</span>
            {product.brandName && (
              <span className={scss.brand}>{product.brandName}</span>
            )}
          </div>
          <Link href={`/products/${product.id}`} className={scss.titleLink}>
            <h3 className={scss.title}>{product.title}</h3>
          </Link>
        </div>

        <div className={scss.stats}>
          <div className={scss.statGroup}>
            <span className={scss.label}>Цена</span>
            <span className={scss.value}>{price.toLocaleString()} c.</span>
          </div>
          <div className={scss.statGroup}>
            <span className={scss.label}>Склад</span>
            <span
              className={`${scss.value} ${stockCount <= 3 ? scss.warning : ""}`}
            >
              {stockCount} шт.
            </span>
          </div>
        </div>

        <div className={scss.actions}>
          <CardButtons
            productId={product.id!}
            onEdit={onEdit}
            onDelete={() => {}} // Логика удаления
          />
        </div>
      </div>
    </div>
  );
};

export default Card;
