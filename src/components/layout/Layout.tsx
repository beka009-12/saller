"use client";
import { type FC, ReactNode, useEffect, useState } from "react";
import scss from "./Layout.module.scss";
import { useRouter } from "next/navigation";
import SideBar from "../pages/sideBar/SideBar";

interface ILay {
  children: ReactNode;
}

const Layout: FC<ILay> = ({ children }) => {
  const router = useRouter();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/register");
    }
  }, [router]);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleSidebarToggle = (collapsed: boolean) => {
    setIsSidebarCollapsed(collapsed);
  };

  return (
    <div className={scss.Layout}>
      <div
        className={`${scss.sideBar} ${
          isMobile && !isSidebarCollapsed ? scss.open : ""
        }`}
      >
        <SideBar onToggle={handleSidebarToggle} />
      </div>
      <div
        className={`${scss.LayoutContent} ${
          isSidebarCollapsed ? scss.collapsed : ""
        }`}
      >
        <main>{children}</main>
      </div>
    </div>
  );
};

export default Layout;
