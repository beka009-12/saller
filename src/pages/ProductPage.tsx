import { type FC } from "react";
import MyProducts from "./product/MyProducts";
import CreateProduct from "./product/CreateProduct";

const ProductPage: FC = () => {
  return (
    <>
      <MyProducts />
      <CreateProduct />
    </>
  );
};

export default ProductPage;
