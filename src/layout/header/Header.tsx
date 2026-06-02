"use client";
import { useState, useEffect, type FC } from "react";
import { useRouter, usePathname } from "next/navigation";
import scss from "./Header.module.scss";
import { useCurrentSeller } from "../../hooks/use-current-seller";
import {
  LayoutDashboard, Package, ShoppingBag, Megaphone,
  Settings, LogOut, User, Store, Menu, X,
  ChevronRight, Zap, BarChart2,
} from "lucide-react";

const NAV = [
  { label: "Дашборд",   path: "/",          icon: LayoutDashboard },
  { label: "Товары",    path: "/products",   icon: Package },
  { label: "Заказы",    path: "/orders",     icon: ShoppingBag },
  { label: "Аналитика", path: "/analytics",  icon: BarChart2 },
  { label: "Баннеры",   path: "/banners",    icon: Megaphone },
  { label: "Настройки", path: "/settings",   icon: Settings },
];

const Header: FC = () => {
  const router   = useRouter();
  const pathname = usePathname();
  const { data: seller, isLoading, isError } = useCurrentSeller();
  const [mobile, setMobile] = useState(false);

  useEffect(() => {
    if (!isLoading && (!seller || isError)) router.replace("/register");
  }, [isLoading, seller, isError, router]);

  useEffect(() => {
    document.body.style.overflow = mobile ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobile]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.replace("/register");
  };

  const go = (path: string) => {
    router.push(path);
    setMobile(false);
  };

  const shop  = (seller?.user?.stores?.[0] as any);
  const name  = seller?.user?.name || "Продавец";
  const email = seller?.user?.email || "";
  const initials = name.slice(0, 2).toUpperCase();

  const isActive = (path: string) =>
    path === "/" ? pathname === "/" : (pathname ?? "").startsWith(path);

  return (
    <>
      {/* ─── Mobile topbar ─────────────────────────────────── */}
      <div className={scss.topbar}>
        <button className={scss.burger} onClick={() => setMobile(true)} aria-label="Меню">
          <Menu size={18} />
        </button>
        <div className={scss.topLogo} onClick={() => go("/")}>
          <Zap size={14} className={scss.logoZap} />
          <span>SALLIX</span>
        </div>
        <div className={scss.topAvatar}>{initials}</div>
      </div>

      {/* ─── Desktop sidebar ────────────────────────────────── */}
      <aside className={scss.sidebar}>
        <div className={scss.sideInner}>
          {/* Logo */}
          <div className={scss.logo} onClick={() => go("/")}>
            <div className={scss.logoIcon}>
              <Zap size={16} />
            </div>
            <span className={scss.logoText}>SALLIX</span>
          </div>

          {/* Store pill */}
          {shop ? (
            <div className={scss.storePill}>
              <div className={scss.storeDot} />
              <span>{shop.name}</span>
            </div>
          ) : (
            <div className={scss.storePill}>
              <div className={`${scss.storeDot} ${scss.dotOff}`} />
              <span>Нет магазина</span>
            </div>
          )}

          {/* Navigation */}
          <nav className={scss.nav}>
            <div className={scss.navLabel}>Навигация</div>
            {NAV.map(({ label, path, icon: Icon }) => (
              <button
                key={path}
                className={`${scss.navItem} ${isActive(path) ? scss.active : ""}`}
                onClick={() => go(path)}
              >
                <Icon size={15} className={scss.navIcon} />
                <span>{label}</span>
                {isActive(path) && <ChevronRight size={12} className={scss.chevron} />}
              </button>
            ))}
          </nav>

          {/* Bottom user block */}
          <div className={scss.bottomBlock}>
            <button className={scss.profileBtn} onClick={() => go("/profile")}>
              <div className={scss.avatar}>{initials}</div>
              <div className={scss.userInfo}>
                <span className={scss.userName}>{name}</span>
                <span className={scss.userEmail}>{email}</span>
              </div>
            </button>
            <button className={scss.logoutBtn} onClick={handleLogout} aria-label="Выйти">
              <LogOut size={14} />
            </button>
          </div>
        </div>
      </aside>

      {/* ─── Mobile drawer ──────────────────────────────────── */}
      {mobile && (
        <div className={scss.backdrop} onClick={() => setMobile(false)} />
      )}
      <div className={`${scss.drawer} ${mobile ? scss.drawerOpen : ""}`}>
        <div className={scss.drawerHead}>
          <div className={scss.logo}>
            <div className={scss.logoIcon}><Zap size={14} /></div>
            <span className={scss.logoText}>SALLIX</span>
          </div>
          <button className={scss.closeBtn} onClick={() => setMobile(false)}>
            <X size={16} />
          </button>
        </div>

        {shop && (
          <div className={scss.drawerStore}>
            <div className={scss.storeDot} />
            <span>{shop.name}</span>
          </div>
        )}

        <nav className={scss.drawerNav}>
          {NAV.map(({ label, path, icon: Icon }) => (
            <button
              key={path}
              className={`${scss.drawerNavItem} ${isActive(path) ? scss.active : ""}`}
              onClick={() => go(path)}
            >
              <Icon size={15} />
              <span>{label}</span>
            </button>
          ))}
        </nav>

        <div className={scss.drawerFooter}>
          <div className={scss.drawerUser}>
            <div className={scss.avatar}>{initials}</div>
            <div className={scss.userInfo}>
              <span className={scss.userName}>{name}</span>
              <span className={scss.userEmail}>{email}</span>
            </div>
          </div>
          <button className={scss.drawerLogout} onClick={handleLogout}>
            <LogOut size={14} />
            Выйти
          </button>
        </div>
      </div>
    </>
  );
};

export default Header;
