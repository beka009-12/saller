"use client";
import { useState, type FC } from "react";
import scss from "./Header.module.scss";

const Header: FC = () => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  return (
    <div className={scss.header}>
      <div className={scss.welcomeInfo}>
        <h1 className={scss.title}>
          Добро пожаловать, <span>Партнёр!</span>
        </h1>
        <p className={scss.subtitle}>
          Здесь вы можете управлять товарами, следить за заказами и отзывами
          клиентов
        </p>
      </div>

      {/* Profile info */}
      <div className={scss.profileSection}>
        <div
          className={scss.profileCard}
          onClick={() => setShowProfileMenu(!showProfileMenu)}
        >
          <div className={scss.avatar}>
            <img
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
              alt="Profile avatar"
            />
            <div className={scss.statusIndicator}></div>
          </div>
          <div className={scss.profileInfo}>
            <h3>Shop Dream</h3>
            <p>ID: #SP2024</p>
          </div>
          <svg
            className={`${scss.chevron} ${showProfileMenu ? scss.rotated : ""}`}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </div>
        {showProfileMenu && (
          <div className={scss.profileMenu}>
            <div className={scss.menuItem}>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              Мой профиль
            </div>
            <div className={scss.menuItem}>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              Настройки
            </div>
            <div className={scss.menuItem}>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              Выйти
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
