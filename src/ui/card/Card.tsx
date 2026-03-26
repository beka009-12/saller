"use client";
import { FC } from "react";
import Link from "next/link";
import scss from "./Card.module.scss";
import CardButtons from "@/src/ui/card-buttons/CardButtons";
import { useDeleteProduct } from "@/src/api/product";

interface CardProps {
  product: Product;
}

const Card: FC<CardProps> = ({ product }) => {
  const { mutate: deleteProduct } = useDeleteProduct();

  const handleDelete = (id: number) => {
    if (confirm("Удалить товар")) {
      deleteProduct(id);
    }
  };

  return (
    <div className={scss.card}>
      <Link href={`/products/${product.id}`} className={scss.link}>
        <div className={scss.images}>
          {product.images.map((img, i) => (
            <img
              key={i}
              src={img}
              alt={`${product.title} ${i + 1}`}
              className={scss.image}
            />
          ))}
        </div>

        <div className={scss.info}>
          <h3>{product.title}</h3>
          <p>{product.description}</p>

          <div className={scss.prices}>
            <span className={scss.price}>{product.price} сом</span>
            {product.newPrice && (
              <span className={scss.newPrice}>{product.newPrice} сом</span>
            )}
          </div>

          <span className={scss.stock}>В наличии: {product.stockCount}</span>

          {product.tags.length > 0 && (
            <div className={scss.tags}>
              {product.tags.map((tag, i) => (
                <span key={i} className={scss.tag}>
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </Link>

      <CardButtons productId={product.id} onDelete={handleDelete} />
    </div>
  );
};

export default Card;
