"use client";
import { FC } from "react";
import scss from "./Profile.module.scss";
import { useGetCurrentUser } from "@/src/api/auth";

const Profile: FC = () => {
  const { data: currentUser } = useGetCurrentUser();

  return (
    <div className={scss.Profile}>
      <div className="container">
        <div className={scss.Profile_content}>
          <h1 className={scss.Profile_title}>Профиль</h1>
          <div className={scss.Profile_info}>
            <p>
              <span>Имя:</span> {currentUser?.user.name}
            </p>
            <p>
              <span>Email:</span> {currentUser?.user.email}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
