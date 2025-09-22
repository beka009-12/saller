import { type FC, ReactNode } from "react";
import Layout from "@/components/layout/Layout";

interface ILay {
  children: ReactNode;
}

const layout: FC<ILay> = ({ children }) => {
  return <Layout>{children}</Layout>;
};

export default layout;
