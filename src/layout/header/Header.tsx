/* eslint-disable @next/next/no-img-element */
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
} from "lucide-react";

const Header: FC = () => {
  const router = useRouter();
  const { data: seller, isLoading, isError } = useGetCurrentUser();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

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

  // Блокируем скролл когда мобильное меню открыто
  useEffect(() => {
    if (showMobileMenu) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
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
      text: "Товар 'iPhone 14' - осталось 2 шт",
      time: "1 час назад",
      unread: true,
    },
  ];

  const unreadCount = notifications.filter((n) => n.unread).length;
  const isAuthorized = !isLoading && !!seller && !isError;

  return (
    <>
      <header className={scss.Header}>
        <div className="container">
          <div className={scss.content}>
            <div className={scss.leftSection}>
              <button
                className={scss.burgerButton}
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                aria-label="Открыть меню"
              >
                <Menu size={20} />
              </button>

              {/* Логотип */}
              <div onClick={() => router.push("/")} className={scss.logo}>
                <div className={scss.logoIcon}>
                  <Store size={24} />
                </div>
                <div className={scss.logoText}>
                  Sell<span>ix</span>
                </div>
              </div>

              {/* Навигация — только десктоп */}
              <nav className={scss.nav}>
                <p onClick={() => router.push("/")} className={scss.navLink}>
                  <LayoutDashboard size={18} />
                  <span>Главная</span>
                </p>
                <p
                  onClick={() => router.push("/products")}
                  className={scss.navLink}
                >
                  <Package size={18} />
                  <span>Товары</span>
                </p>
                <p
                  onClick={() => router.push("/orders")}
                  className={scss.navLink}
                >
                  <ShoppingBag size={18} />
                  <span>Заказы</span>
                </p>
              </nav>
            </div>

            {/* Правая часть */}
            <div className={scss.rightSection}>
              {/* Загрузка */}
              {isLoading && <div className={scss.skeletonUser} />}

              {/* Не авторизован */}
              {!isLoading && !isAuthorized && (
                <button
                  className={scss.loginButton}
                  onClick={() => router.push("/register")}
                >
                  <LogIn size={18} />
                  <span>Войти</span>
                </button>
              )}

              {/* Авторизован */}
              {isAuthorized && seller && (
                <>
                  {seller.user.name && (
                    <div className={scss.storeBadge}>
                      <span className={scss.storeLabel}>Магазин:</span>
                      <span className={scss.storeName}>
                        {seller.user.stores[0]?.name || "Название магазина"}
                      </span>
                    </div>
                  )}

                  {/* Уведомления */}
                  <div className={scss.notificationWrapper}>
                    <button
                      className={scss.iconButton}
                      onClick={() => {
                        setShowNotifications(!showNotifications);
                        setShowUserMenu(false);
                      }}
                      aria-label="Уведомления"
                    >
                      <Bell size={20} />
                      {unreadCount > 0 && (
                        <span className={scss.badge}>{unreadCount}</span>
                      )}
                    </button>

                    {showNotifications && (
                      <>
                        <div
                          className={scss.backdrop}
                          onClick={() => setShowNotifications(false)}
                        />
                        <div className={scss.notificationDropdown}>
                          <div className={scss.dropdownHeader}>
                            <h3>Уведомления</h3>
                            <button
                              className={scss.closeBtn}
                              onClick={() => setShowNotifications(false)}
                            >
                              ×
                            </button>
                          </div>
                          <div className={scss.notificationList}>
                            {notifications.map((n) => (
                              <div
                                key={n.id}
                                className={`${scss.notificationItem} ${n.unread ? scss.unread : ""}`}
                              >
                                <div className={scss.notifContent}>
                                  <p>{n.text}</p>
                                  <span className={scss.time}>{n.time}</span>
                                </div>
                                {n.unread && <div className={scss.unreadDot} />}
                              </div>
                            ))}
                          </div>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Профиль */}
                  <div className={scss.userWrapper}>
                    <button
                      className={scss.userButton}
                      onClick={() => {
                        setShowUserMenu(!showUserMenu);
                        setShowNotifications(false);
                      }}
                      aria-label="Меню пользователя"
                    >
                      <div className={scss.avatar}>
                        {seller.user.avatar ? (
                          <img
                            src={seller.user.avatar}
                            alt={seller.user.name}
                          />
                        ) : (
                          <User size={18} />
                        )}
                      </div>
                      <div className={scss.userInfo}>
                        <span className={scss.userName}>
                          {seller.user.name || "Продавец"}
                        </span>
                      </div>
                      <ChevronDown size={16} className={scss.chevron} />
                    </button>

                    {showUserMenu && (
                      <>
                        <div
                          className={scss.backdrop}
                          onClick={() => setShowUserMenu(false)}
                        />
                        <div className={scss.userDropdown}>
                          <div className={scss.userDropdownHeader}>
                            <div className={scss.avatarLarge}>
                              {seller.user.avatar ? (
                                <img
                                  src={seller.user.avatar}
                                  alt={seller.user.name}
                                />
                              ) : (
                                <User size={24} />
                              )}
                            </div>
                            <div className={scss.userDetails}>
                              <div className={scss.userNameLarge}>
                                {seller.user.name || "Продавец"}
                              </div>
                              <div className={scss.userEmail}>
                                {seller.user.email}
                              </div>
                            </div>
                          </div>
                          <div className={scss.menuItems}>
                            <a
                              href="/seller/store-settings"
                              className={scss.menuItem}
                            >
                              <Settings size={18} />
                              <span>Настройки магазина</span>
                            </a>
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

      {/* ===== МОБИЛЬНОЕ МЕНЮ ===== */}
      {showMobileMenu && (
        <>
          <div
            className={scss.mobileMenuBackdrop}
            onClick={() => setShowMobileMenu(false)}
          />
          <div className={scss.mobileMenu}>
            {/* Шапка мобильного меню */}
            <div className={scss.mobileMenuHeader}>
              <div className={scss.logo}>
                <div className={scss.logoIcon}>
                  <Store size={20} />
                </div>
                <div className={scss.logoText}>
                  Sell<span>ix</span>
                </div>
              </div>
              <button
                className={scss.mobileMenuClose}
                onClick={() => setShowMobileMenu(false)}
                aria-label="Закрыть меню"
              >
                <X size={20} />
              </button>
            </div>

            {/* Навигация */}
            <nav className={scss.mobileNav}>
              <p
                onClick={() => handleNavigate("/")}
                className={scss.mobileNavLink}
              >
                <LayoutDashboard size={20} />
                <span>Главная</span>
              </p>
              <p
                onClick={() => handleNavigate("/products")}
                className={scss.mobileNavLink}
              >
                <Package size={20} />
                <span>Товары</span>
              </p>
              <p
                onClick={() => handleNavigate("/orders")}
                className={scss.mobileNavLink}
              >
                <ShoppingBag size={20} />
                <span>Заказы</span>
              </p>
            </nav>

            {isAuthorized && seller && (
              <div className={scss.mobileMenuFooter}>
                {seller.user.stores[0]?.name && (
                  <div className={scss.mobileStoreBadge}>
                    <Store size={16} />
                    <span className={scss.storeLabel}>Магазин:</span>
                    <span className={scss.storeName}>
                      {seller.user.stores[0].name}
                    </span>
                  </div>
                )}
                <button
                  className={scss.menuItem}
                  onClick={() => {
                    handleLogout();
                    setShowMobileMenu(false);
                  }}
                >
                  <LogOut size={18} />
                  <span>Выйти</span>
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
};

export default Header;
