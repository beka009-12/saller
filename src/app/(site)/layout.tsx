import Layout from "@/src/layout/Layout";
import { type FC, ReactNode } from "react";
interface ILay {
  children: ReactNode;
}
const layout: FC<ILay> = ({ children }) => {
  return <Layout>{children}</Layout>;
};

export default layout;
