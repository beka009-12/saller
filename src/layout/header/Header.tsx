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
} from "lucide-react";

const Header: FC = () => {
  const router = useRouter();
  const { data: seller, isLoading, isError } = useGetCurrentUser();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  // Проверка авторизации: если запрос завершён и пользователь не найден — редирект на логин
  useEffect(() => {
    if (!isLoading && (!seller || isError)) {
      router.replace("/register");
    }
  }, [isLoading, seller, isError, router]);

  if (isLoading) return null;

  if (!seller) return null;

  const handleLogout = () => {
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    localStorage.removeItem("token");
    router.replace("/register");
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

  return (
    <header className={scss.Header}>
      <div className="container">
        <div className={scss.content}>
          {/* LEFT: Logo + Nav */}
          <div className={scss.leftSection}>
            <a href="/seller/dashboard" className={scss.logo}>
              <div className={scss.logoIcon}>
                <Store size={24} />
              </div>
              <div className={scss.logoText}>
                Sell<span>ix</span>
              </div>
            </a>

            <nav className={scss.nav}>
              <a href="/" className={scss.navLink}>
                <LayoutDashboard size={18} />
                <span>Главная</span>
              </a>
              <a href="/products" className={scss.navLink}>
                <Package size={18} />
                <span>Товары</span>
              </a>
              <a href="/orders" className={scss.navLink}>
                <ShoppingBag size={18} />
                <span>Заказы</span>
              </a>
            </nav>
          </div>

          <div className={scss.rightSection}>
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
                onClick={() => setShowNotifications(!showNotifications)}
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
                      {notifications.length > 0 ? (
                        notifications.map((notification) => (
                          <div
                            key={notification.id}
                            className={`${scss.notificationItem} ${
                              notification.unread ? scss.unread : ""
                            }`}
                          >
                            <div className={scss.notifContent}>
                              <p>{notification.text}</p>
                              <span className={scss.time}>
                                {notification.time}
                              </span>
                            </div>
                            {notification.unread && (
                              <div className={scss.unreadDot} />
                            )}
                          </div>
                        ))
                      ) : (
                        <div className={scss.emptyState}>
                          <Bell size={32} />
                          <p>Нет новых уведомлений</p>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Профиль */}
            <div className={scss.userWrapper}>
              <button
                className={scss.userButton}
                onClick={() => setShowUserMenu(!showUserMenu)}
                aria-label="Меню пользователя"
              >
                <div className={scss.avatar}>
                  {seller.user.avatar ? (
                    <img src={seller.user.avatar} alt={seller.user.name} />
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
                      <hr className={scss.divider} />
                      {/* Кнопка выхода теперь с реальной логикой */}
                      <button className={scss.menuItem} onClick={handleLogout}>
                        <LogOut size={18} />
                        <span>Выйти</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
