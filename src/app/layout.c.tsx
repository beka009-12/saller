"use client";
import { Provider } from "@/provider/Provider";
import { ReactNode, FC, Suspense } from "react";
import { Toaster } from "react-hot-toast";

interface ILay {
  children: ReactNode;
}

const LayoutClient: FC<ILay> = ({ children }) => {
  return (
    <Provider>
      <Suspense>{children}</Suspense>
      <Toaster position="top-center" reverseOrder={true} />
    </Provider>
  );
};

export default LayoutClient;
