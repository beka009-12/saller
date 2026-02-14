"use client";
import { Provider } from "@/src/provider/Provider";
import { ReactNode, FC, Suspense } from "react";
import { Toaster } from "react-hot-toast";

interface ILay {
  children: ReactNode;
}

const LayoutClient: FC<ILay> = ({ children }) => {
  return (
    <Provider>
      <Suspense>{children}</Suspense>
      <Toaster position="bottom-right" reverseOrder={false} />
    </Provider>
  );
};

export default LayoutClient;
