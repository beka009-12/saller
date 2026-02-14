import { type FC } from "react";
import scss from "./CreateProduct.module.scss";

const CreateProduct: FC = () => {
  return (
    <section className={scss.CreateProduct}>
      <div className="container">
        <div className={scss.content}>CreateProduct</div>
      </div>
    </section>
  );
};

export default CreateProduct;
