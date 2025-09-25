"use client";
import { useState, type FC } from "react";
import scss from "./Header.module.scss";
import { useGetMe } from "@/api/user";

const Header: FC = () => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const { data: seller } = useGetMe();
  console.log(seller);

  return (
    <header className={scss.header}>
      {/* Logo or Brand */}
      <div className={scss.logo}>Панель управления</div>

      {/* Profile Section */}
      <div className={scss.profileContainer}>
        <button
          onClick={() => setShowProfileMenu(!showProfileMenu)}
          className={scss.profileButton}
        >
          <img
            src={
              seller?.user.avatar
                ? seller.user.avatar
                : "https://miro.medium.com/v2/resize:fit:720/1*W35QUSvGpcLuxPo3SRTH4w.png"
            }
            alt="Seller Avatar"
            className={scss.avatar}
          />

          <span className={scss.sellerName}>{seller?.user.name}</span>
          <svg
            className={scss.dropdownIcon}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>

        {/* Profile Dropdown */}
        {showProfileMenu && (
          <div className={scss.dropdownMenu}>
            <div className={scss.dropdownInfo}>
              <p className={scss.sellerName}>{seller?.user.name}</p>
              <p className={scss.sellerEmail}>{seller?.user.email}</p>
            </div>
            <a href="/profile" className={scss.dropdownItem}>
              Посмотреть профиль
            </a>
            <a href="/setting" className={scss.dropdownItem}>
              Настройки
            </a>
            <a href="/logout" className={scss.dropdownItemLogout}>
              Выйти
            </a>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
