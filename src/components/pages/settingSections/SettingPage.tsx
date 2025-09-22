import { type FC } from "react";
import scss from "./SettingPage.module.scss";

const SettingPage: FC = () => {
  return (
    <section className={scss.SettingPage}>
      <div className="container">
        <div className={scss.content}>SettingPage</div>
      </div>
    </section>
  );
};

export default SettingPage;
