import { type FC } from "react";
import Home from "./home/Home";
import CreateCategoryForm from "./category/Category";

const HomePage: FC = () => {
  return (
    <>
      <Home />
      <CreateCategoryForm />
    </>
  );
};

export default HomePage;
