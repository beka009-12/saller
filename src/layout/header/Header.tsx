"use client";
import { type FC } from "react";
import scss from "./Header.module.scss";
import { useGetCurrentUser } from "@/src/api/auth";

const Header: FC = () => {
  const { data: saller } = useGetCurrentUser();
  console.log(saller);

  return (
    <header className={scss.Header}>
      <div className="container">
        <div className={scss.content}>Header</div>
      </div>
    </header>
  );
};

export default Header;
