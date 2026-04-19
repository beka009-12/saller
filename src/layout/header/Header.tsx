"use client";
import { useState, useEffect, type FC } from "react";
import { useRouter } from "next/navigation";
import scss from "./Header.module.scss";
import { useGetCurrentUser } from "../../api/auth";
import {
  Bell,
  User,
  ChevronDown,
  LogOut,
  Settings,
  Package,
  ShoppingBag,
  LayoutDashboard,
  Store,
  LogIn,
  Menu,
  X,
  AlertCircle,
} from "lucide-react";

const Header: FC = () => {
  const router = useRouter();
  const { data: seller, isLoading, isError } = useGetCurrentUser();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (!isLoading && (!seller || isError)) {
      router.replace("/register");
    }
  }, [isLoading, seller, isError, router]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setShowNotifications(false);
        setShowUserMenu(false);
        setShowMobileMenu(false);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = showMobileMenu ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [showMobileMenu]);

  const handleLogout = () => {
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    localStorage.removeItem("token");
    router.replace("/register");
  };

  const handleNavigate = (path: string) => {
    router.push(path);
    setShowMobileMenu(false);
  };

  const notifications = [
    {
      id: 1,
      text: "Новый заказ #ORD-12345",
      time: "5 мин назад",
      unread: true,
    },
    {
      id: 2,
      text: "Товар 'iPhone 14' — осталось 2 шт",
      time: "1 час назад",
      unread: true,
    },
  ];

  const unreadCount = notifications.filter((n) => n.unread).length;
  const isAuthorized = !isLoading && !!seller && !isError;

  const navItems = [
    { label: "Главная", path: "/", icon: <LayoutDashboard size={15} /> },
    { label: "Товары", path: "/products", icon: <Package size={15} /> },
    { label: "Заказы", path: "/orders", icon: <ShoppingBag size={15} /> },
  ];

  return (
    <>
      <header className={`${scss.header} ${scrolled ? scss.scrolled : ""}`}>
        <div className="container">
          <div className={scss.inner}>
            {/* Left */}
            <div className={scss.left}>
              <button
                className={scss.burger}
                onClick={() => setShowMobileMenu(true)}
                aria-label="Открыть меню"
              >
                <Menu size={18} />
              </button>

              <div className={scss.logo} onClick={() => router.push("/")}>
                <div className={scss.logoMark}>
                  <Store size={16} strokeWidth={2.5} />
                </div>
                <span className={scss.logoText}>
                  Sell<em>ix</em>
                </span>
              </div>

              <nav className={scss.nav}>
                {navItems.map(({ label, path, icon }) => (
                  <button
                    key={path}
                    className={scss.navItem}
                    onClick={() => router.push(path)}
                  >
                    {icon}
                    {label}
                  </button>
                ))}
              </nav>
            </div>

            {/* Right */}
            <div className={scss.right}>
              {isLoading && <div className={scss.skeleton} />}

              {!isLoading && !isAuthorized && (
                <button
                  className={scss.loginBtn}
                  onClick={() => router.push("/register")}
                >
                  <LogIn size={15} />
                  Войти
                </button>
              )}

              {isAuthorized && seller && (
                <>
                  {seller.user.stores[0]?.name && (
                    <div className={scss.storePill}>
                      <Store size={12} className={scss.storeIcon} />
                      <span>{seller.user.stores[0].name}</span>
                    </div>
                  )}

                  {/* Bell */}
                  <div className={scss.popoverAnchor}>
                    <button
                      className={`${scss.iconBtn} ${showNotifications ? scss.active : ""}`}
                      onClick={() => {
                        setShowNotifications(!showNotifications);
                        setShowUserMenu(false);
                      }}
                      aria-label="Уведомления"
                    >
                      <Bell size={17} />
                      {unreadCount > 0 && (
                        <span className={scss.dot}>{unreadCount}</span>
                      )}
                    </button>

                    {showNotifications && (
                      <>
                        <div
                          className={scss.veil}
                          onClick={() => setShowNotifications(false)}
                        />
                        <div className={scss.popover}>
                          <div className={scss.popoverHead}>
                            <span>Уведомления</span>
                            {unreadCount > 0 && (
                              <span className={scss.unreadBadge}>
                                {unreadCount} новых
                              </span>
                            )}
                          </div>
                          <div className={scss.notifList}>
                            {notifications.map((n) => (
                              <div
                                key={n.id}
                                className={`${scss.notifRow} ${n.unread ? scss.unread : ""}`}
                              >
                                <div className={scss.notifIcon}>
                                  <AlertCircle size={14} />
                                </div>
                                <div className={scss.notifText}>
                                  <p>{n.text}</p>
                                  <time>{n.time}</time>
                                </div>
                                {n.unread && (
                                  <span className={scss.unreadDot} />
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      </>
                    )}
                  </div>

                  {/* User */}
                  <div className={scss.popoverAnchor}>
                    <button
                      className={`${scss.userBtn} ${showUserMenu ? scss.active : ""}`}
                      onClick={() => {
                        setShowUserMenu(!showUserMenu);
                        setShowNotifications(false);
                      }}
                      aria-label="Профиль"
                    >
                      <div className={scss.avatar}>
                        {seller.user.avatar ? (
                          <img
                            src={seller.user.avatar}
                            alt={seller.user.name}
                          />
                        ) : (
                          <User size={15} />
                        )}
                      </div>
                      <span className={scss.userName}>
                        {seller.user.name || "Продавец"}
                      </span>
                      <ChevronDown
                        size={13}
                        className={`${scss.chevron} ${showUserMenu ? scss.open : ""}`}
                      />
                    </button>

                    {showUserMenu && (
                      <>
                        <div
                          className={scss.veil}
                          onClick={() => setShowUserMenu(false)}
                        />
                        <div className={scss.popover}>
                          <div className={scss.userHead}>
                            <div className={scss.avatarLg}>
                              {seller.user.avatar ? (
                                <img
                                  src={seller.user.avatar}
                                  alt={seller.user.name}
                                />
                              ) : (
                                <User size={20} />
                              )}
                            </div>
                            <div>
                              <p className={scss.userNameLg}>
                                {seller.user.name || "Продавец"}
                              </p>
                              <p className={scss.userEmail}>
                                {seller.user.email}
                              </p>
                            </div>
                          </div>
                          <div className={scss.menuList}>
                            <a
                              href="/seller/store-settings"
                              className={scss.menuRow}
                            >
                              <Settings size={15} />
                              Настройки магазина
                            </a>
                            <button
                              className={`${scss.menuRow} ${scss.danger}`}
                              onClick={handleLogout}
                            >
                              <LogOut size={15} />
                              Выйти
                            </button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      <div
        className={`${scss.drawerBackdrop} ${showMobileMenu ? scss.drawerOpen : ""}`}
        onClick={() => setShowMobileMenu(false)}
      />

      <div
        className={`${scss.drawer} ${showMobileMenu ? scss.drawerOpen : ""}`}
      >
        <div className={scss.drawerHead}>
          <div className={scss.logo}>
            <div className={scss.logoMark}>
              <Store size={14} strokeWidth={2.5} />
            </div>
            <span className={scss.logoText}>
              Sell<em>ix</em>
            </span>
          </div>
          <button
            className={scss.drawerClose}
            onClick={() => setShowMobileMenu(false)}
          >
            <X size={18} />
          </button>
        </div>

        {isAuthorized && seller?.user.stores[0]?.name && (
          <div className={scss.drawerStore}>
            <Store size={13} />
            <span>{seller.user.stores[0].name}</span>
          </div>
        )}

        <nav className={scss.drawerNav}>
          {navItems.map(({ label, path, icon }) => (
            <button
              key={path}
              className={scss.drawerNavItem}
              onClick={() => handleNavigate(path)}
            >
              {icon}
              {label}
            </button>
          ))}
        </nav>

        {isAuthorized && (
          <div className={scss.drawerFooter}>
            <button
              className={scss.drawerLogout}
              onClick={() => {
                handleLogout();
                setShowMobileMenu(false);
              }}
            >
              <LogOut size={15} />
              Выйти из аккаунта
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default Header;
