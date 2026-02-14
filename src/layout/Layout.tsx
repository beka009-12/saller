import { type FC, ReactNode } from "react";
import scss from "./Layout.module.scss";
import Header from "./header/Header";

interface ILay {
  children: ReactNode;
}

const Layout: FC<ILay> = ({ children }) => {
  return (
    <div className={scss.Layout}>
      <Header />
      <main>{children}</main>
    </div>
  );
};

export default Layout;
