"use client";
import { FC } from "react";
import { useGetProducts } from "@/src/api/product";
import Card from "@/src/ui/card/Card";
import scss from "./MyProducts.module.scss";

const MyProducts: FC = () => {
  const { data, isLoading, isError } = useGetProducts();

  if (isLoading) return <p>Загрузка...</p>;
  if (isError) return <p>Ошибка загрузки</p>;

  return (
    <section className={scss.MyProducts}>
      <div className="container">
        <div className={scss.header}>
          <h1 className={scss.title}>Мои товары</h1>
          <span className={scss.count}>{data?.products.length ?? 0} товаров</span>
        </div>
        <div className={scss.content}>
          {data?.products.map((product) => (
            <Card key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default MyProducts;