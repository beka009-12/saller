import { type FC } from "react";
import scss from "./Product.module.scss";

const Product: FC = () => {
  return (
    <section className={scss.Product}>
      <div className="container">
        <div className={scss.content}>Product</div>
      </div>
    </section>
  );
};

export default Product;
