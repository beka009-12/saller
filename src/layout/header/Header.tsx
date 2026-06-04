"use client";
import { useState, useEffect, type FC } from "react";
import { useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import scss from "./Header.module.scss";
import { useCurrentSeller } from "../../hooks/use-current-seller";
import {
  LayoutDashboard, Package, ShoppingBag, Megaphone,
  Settings, LogOut, Menu, X, Zap, BarChart2, Sun, Moon,
} from "lucide-react";
import { useTheme } from "@/src/hooks/use-theme";
import { motionTokens, springs } from "@/src/lib/motion-tokens";

const NAV = [
  { label: "Дашборд",   path: "/",          icon: LayoutDashboard },
  { label: "Товары",    path: "/products",   icon: Package },
  { label: "Заказы",    path: "/orders",     icon: ShoppingBag },
  { label: "Аналитика", path: "/analytics",  icon: BarChart2 },
  { label: "Баннеры",   path: "/banners",    icon: Megaphone },
  { label: "Настройки", path: "/settings",   icon: Settings },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.055, delayChildren: 0.1 } },
};

const itemVariants = {
  hidden:  { opacity: 0, x: -motionTokens.distance.sm },
  visible: { opacity: 1, x: 0, transition: { ...springs.gentle } },
};

const Header: FC = () => {
  const router   = useRouter();
  const pathname = usePathname();
  const reduce   = useReducedMotion() ?? false;
  const { data: seller, isLoading, isError } = useCurrentSeller();
  const [mobile,   setMobile]   = useState(false);
  const [mounted,  setMounted]  = useState(false);
  const { isDark, toggle: toggleTheme } = useTheme();

  useEffect(() => { setMounted(true); }, []);

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

  const shop     = (seller?.user?.stores?.[0] as any);
  const name     = seller?.user?.name  || "Продавец";
  const email    = seller?.user?.email || "";
  const initials = name.slice(0, 2).toUpperCase();

  const isActive = (path: string) =>
    path === "/" ? pathname === "/" : (pathname ?? "").startsWith(path);

  const shouldAnimate = mounted && !reduce;

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

      {/* ─── Desktop sidebar ───────────────────────────────── */}
      <aside className={scss.sidebar}>
        <div className={scss.sideInner}>

          {/* Logo */}
          <motion.div
            className={scss.logo}
            onClick={() => go("/")}
            whileHover={shouldAnimate ? { scale: motionTokens.scale.pop } : undefined}
            whileTap={shouldAnimate  ? { scale: motionTokens.scale.press } : undefined}
            transition={springs.snappy}
          >
            <div className={scss.logoIcon}>
              <Zap size={17} />
            </div>
            <div className={scss.logoWords}>
              <span className={scss.logoText}>SALLIX</span>
              <span className={scss.logoBadge}>Seller</span>
            </div>
          </motion.div>

          {/* Store chip */}
          <div className={scss.storeChip}>
            <span className={`${scss.storeDot} ${shop ? "" : scss.dotOff}`} />
            <span className={scss.storeName}>{shop?.name ?? "Нет магазина"}</span>
          </div>

          {/* Navigation */}
          <nav className={scss.nav}>
            <motion.ul
              className={scss.navList}
              variants={shouldAnimate ? containerVariants : undefined}
              initial={shouldAnimate ? "hidden" : false}
              animate="visible"
            >
              {NAV.map(({ label, path, icon: Icon }) => {
                const active = isActive(path);
                return (
                  <motion.li
                    key={path}
                    variants={shouldAnimate ? itemVariants : undefined}
                    className={scss.navLi}
                  >
                    <motion.button
                      className={`${scss.navItem} ${active ? scss.active : ""}`}
                      onClick={() => go(path)}
                      whileHover={shouldAnimate && !active
                        ? { x: motionTokens.distance.xs, transition: springs.snappy }
                        : undefined
                      }
                      whileTap={shouldAnimate
                        ? { scale: motionTokens.scale.subtle, transition: springs.instant }
                        : undefined
                      }
                    >
                      {/* Sliding background pill */}
                      {active && (
                        <motion.span
                          className={scss.activePill}
                          layoutId="activeNavPill"
                          transition={springs.snappy}
                        />
                      )}
                      <Icon size={16} className={scss.navIcon} />
                      <span className={scss.navLabel}>{label}</span>
                    </motion.button>
                  </motion.li>
                );
              })}
            </motion.ul>
          </nav>

          {/* Bottom */}
          <div className={scss.bottomBlock}>
            <motion.button
              className={scss.profileBtn}
              onClick={() => go("/profile")}
              whileHover={shouldAnimate ? { backgroundColor: "var(--bg-3)" } : undefined}
              transition={{ duration: motionTokens.duration.fast }}
            >
              <div className={scss.avatar}>{initials}</div>
              <div className={scss.userInfo}>
                <span className={scss.userName}>{name}</span>
                <span className={scss.userEmail}>{email}</span>
              </div>
            </motion.button>

            <div className={scss.bottomActions}>
              <motion.button
                className={scss.iconBtn}
                onClick={toggleTheme}
                aria-label="Сменить тему"
                whileHover={shouldAnimate ? { scale: motionTokens.scale.pop } : undefined}
                whileTap={shouldAnimate   ? { scale: motionTokens.scale.press } : undefined}
                transition={springs.snappy}
              >
                <AnimatePresence mode="wait">
                  <motion.span
                    key={isDark ? "sun" : "moon"}
                    initial={shouldAnimate ? { opacity: 0, rotate: -45 } : false}
                    animate={{ opacity: 1, rotate: 0 }}
                    exit={shouldAnimate    ? { opacity: 0, rotate: 45 }  : undefined}
                    transition={{ duration: motionTokens.duration.fast }}
                  >
                    {isDark ? <Sun size={15} /> : <Moon size={15} />}
                  </motion.span>
                </AnimatePresence>
              </motion.button>

              <motion.button
                className={`${scss.iconBtn} ${scss.iconBtnDanger}`}
                onClick={handleLogout}
                aria-label="Выйти"
                whileHover={shouldAnimate ? { scale: motionTokens.scale.pop } : undefined}
                whileTap={shouldAnimate   ? { scale: motionTokens.scale.press } : undefined}
                transition={springs.snappy}
              >
                <LogOut size={15} />
              </motion.button>
            </div>
          </div>

        </div>
      </aside>

      {/* ─── Mobile drawer ──────────────────────────────────── */}
      <AnimatePresence>
        {mobile && (
          <motion.div
            className={scss.backdrop}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: motionTokens.duration.fast }}
            onClick={() => setMobile(false)}
          />
        )}
      </AnimatePresence>

      <motion.div
        className={scss.drawer}
        initial={false}
        animate={{ x: mobile ? 0 : "-100%" }}
        transition={springs.gentle}
      >
        <div className={scss.drawerHead}>
          <div className={scss.logo} onClick={() => go("/")}>
            <div className={scss.logoIcon}><Zap size={14} /></div>
            <span className={scss.logoText}>SALLIX</span>
          </div>
          <button className={scss.closeBtn} onClick={() => setMobile(false)}>
            <X size={16} />
          </button>
        </div>

        {shop && (
          <div className={scss.drawerStore}>
            <span className={scss.storeDot} />
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
      </motion.div>
    </>
  );
};

export default Header;
