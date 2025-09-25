"use client";
import { useState, useEffect, type FC } from "react";
import scss from "./SideBar.module.scss";
import { SideBarIcons } from "@/utils/sideBarIcons/Icons";
import { usePathname, useRouter } from "next/navigation";

interface SideBarProps {
  onToggle?: (collapsed: boolean) => void;
}

const SideBar: FC<SideBarProps> = ({ onToggle }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const [activePath, setActivePath] = useState<string | null>(null);

  const toggleSidebar = () => {
    const newCollapsed = !isCollapsed;
    setIsCollapsed(newCollapsed);

    if (onToggle) {
      onToggle(newCollapsed);
    }
  };

  useEffect(() => {
    setActivePath(pathname);
  }, [pathname]);

  useEffect(() => {
    if (onToggle) {
      onToggle(isCollapsed);
    }
  }, []);

  return (
    <aside className={`${scss.SideBar} ${isCollapsed ? scss.collapsed : ""}`}>
      <div className={scss.container}>
        <div className={scss.logo}>
          <h2 className={scss.title}>
            <span>S.N</span> Partners
          </h2>
          <button className={scss.toggleBtn} onClick={toggleSidebar}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              className={scss.toggleIcon}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
              />
            </svg>
          </button>
        </div>

        <div className={scss.path}>
          {!isCollapsed && <span className={scss.label}>Главное</span>}

          {/* Главное */}
          <div
            className={`${scss.rout} ${
              activePath === "/saller-page" ? scss.active : ""
            }`}
            onClick={() => router.push("/saller-page")}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className={scss.icon}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
              />
            </svg>

            <p className={scss.text}>Главное</p>
            {isCollapsed && <div className={scss.tooltip}>Главное</div>}
          </div>

          {!isCollapsed && (
            <span className={scss.label}>Работа с клиентами</span>
          )}

          {/* Отзывы */}
          <div
            className={`${scss.rout} ${
              activePath === "/reviews" ? scss.active : ""
            }`}
            onClick={() => router.push("/reviews")}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className={scss.icon}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"
              />
            </svg>

            <p className={scss.text}>Отзывы и жалобы</p>
            {isCollapsed && <div className={scss.tooltip}>Отзывы и жалобы</div>}
          </div>

          {!isCollapsed && <span className={scss.label}>Управление</span>}

          {/* Настройки */}
          <div
            className={`${scss.rout} ${
              activePath === "/setting" ? scss.active : ""
            }`}
            onClick={() => router.push("/setting")}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className={scss.icon}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
              />
            </svg>
            <p className={scss.text}>Настройки</p>
            {isCollapsed && <div className={scss.tooltip}>Настройки</div>}
          </div>

          {/* Товары */}
          {!isCollapsed && <span className={scss.label}>Мои товары</span>}
          {SideBarIcons.map((item, index) => (
            <div
              key={index}
              className={`${scss.rout} ${
                activePath === item.path ? scss.active : ""
              }`}
              onClick={() => router.push(item.path)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className={scss.icon}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d={item.icon}
                />
              </svg>
              <p className={scss.text}>{item.title}</p>
              {isCollapsed && <div className={scss.tooltip}>{item.title}</div>}
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default SideBar;
