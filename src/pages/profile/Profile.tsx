"use client";
import { type FC, useState, useEffect } from "react";
import scss from "./Profile.module.scss";
import { useCurrentSeller } from "@/src/hooks/use-current-seller";
import { usePutUserProfile } from "@/src/api/generated/endpoints/user/user";
import { useRouter } from "next/navigation";
import {
  User,
  Mail,
  Phone,
  Store,
  Star,
  Package,
  Settings,
  Camera,
  Edit3,
  MapPin,
} from "lucide-react";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";

const Profile: FC = () => {
  const { data: seller, isLoading } = useCurrentSeller();
  const { mutate: updateProfile, isPending } = usePutUserProfile();
  const queryClient = useQueryClient();
  const router = useRouter();

  const user = seller?.user;
  const shop = (seller?.user?.stores?.[0] as any) ?? null;

  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "" });

  useEffect(() => {
    if (user) {
      setForm({ name: user.name ?? "", phone: user.phone ?? "" });
    }
  }, [user]);

  const handleSave = () => {
    updateProfile(
      { data: { name: form.name || undefined, phone: form.phone || undefined } },
      {
        onSuccess: () => {
          toast.success("Профиль обновлён");
          queryClient.invalidateQueries({ queryKey: ["/user/profile"] });
          queryClient.invalidateQueries({ queryKey: ["/shops/my"] });
          setEditing(false);
        },
        onError: () => toast.error("Ошибка при сохранении"),
      },
    );
  };

  if (isLoading) {
    return (
      <div className={scss.Profile}>
        <div className="container">
          <div style={{ padding: "40px 0", color: "#888", fontSize: 14 }}>
            Загрузка...
          </div>
        </div>
      </div>
    );
  }

  const initials = user?.name
    ? user.name.slice(0, 1).toUpperCase()
    : (user?.email ?? "?").slice(0, 1).toUpperCase();

  return (
    <div className={scss.Profile}>
      <div className="container">
        {/* Hero */}
        <div className={scss.hero}>
          <div className={scss.avatarWrap}>
            <div className={scss.avatar}>
              {user?.avatar ? (
                <img src={user.avatar} alt={user.name ?? "avatar"} />
              ) : (
                initials
              )}
            </div>
            <div className={scss.avatarOverlay}>
              <Camera size={18} />
            </div>
          </div>

          <div className={scss.heroInfo}>
            <p className={scss.heroName}>{user?.name ?? "Продавец"}</p>
            <p className={scss.heroEmail}>{user?.email}</p>
            <div className={scss.heroBadges}>
              <span className={scss.badge}>
                <Store size={11} />
                {user?.role === "OWNER" ? "Продавец" : user?.role}
              </span>
              {shop?.isVerified && (
                <span className={scss.verifiedBadge}>✓ Верифицирован</span>
              )}
            </div>
          </div>

          <button
            className={scss.editHeroBtn}
            onClick={() => setEditing((v) => !v)}
          >
            <Edit3 size={13} />
            {editing ? "Отмена" : "Редактировать"}
          </button>
        </div>

        <div className={scss.grid}>
          {/* Left column */}
          <div>
            {/* Personal info / edit */}
            <div className={scss.section}>
              <div className={scss.sectionHead}>
                <div className={scss.sectionIcon}>
                  <User size={15} />
                </div>
                <h2>Личные данные</h2>
              </div>

              {editing ? (
                <>
                  <div className={scss.editForm}>
                    <div className={scss.field}>
                      <label>Имя</label>
                      <input
                        type="text"
                        placeholder="Ваше имя"
                        value={form.name}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, name: e.target.value }))
                        }
                      />
                    </div>
                    <div className={scss.field}>
                      <label>Email (нельзя изменить)</label>
                      <input
                        type="email"
                        value={user?.email ?? ""}
                        readOnly
                      />
                    </div>
                    <div className={scss.field}>
                      <label>Телефон</label>
                      <input
                        type="tel"
                        placeholder="+996 700 000 000"
                        value={form.phone}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, phone: e.target.value }))
                        }
                      />
                    </div>
                  </div>
                  <div className={scss.formActions}>
                    <button
                      className={scss.cancelBtn}
                      onClick={() => setEditing(false)}
                    >
                      Отмена
                    </button>
                    <button
                      className={scss.saveBtn}
                      onClick={handleSave}
                      disabled={isPending}
                    >
                      {isPending ? "Сохранение..." : "Сохранить"}
                    </button>
                  </div>
                </>
              ) : (
                <div className={scss.sectionBody}>
                  <div className={scss.infoRow}>
                    <div className={scss.infoIcon}>
                      <User size={14} />
                    </div>
                    <div className={scss.infoText}>
                      <div className={scss.infoLabel}>Имя</div>
                      {user?.name ? (
                        <div className={scss.infoVal}>{user.name}</div>
                      ) : (
                        <div className={scss.infoEmpty}>Не указано</div>
                      )}
                    </div>
                  </div>

                  <div className={scss.infoRow}>
                    <div className={scss.infoIcon}>
                      <Mail size={14} />
                    </div>
                    <div className={scss.infoText}>
                      <div className={scss.infoLabel}>Email</div>
                      <div className={scss.infoVal}>{user?.email}</div>
                    </div>
                  </div>

                  <div className={scss.infoRow}>
                    <div className={scss.infoIcon}>
                      <Phone size={14} />
                    </div>
                    <div className={scss.infoText}>
                      <div className={scss.infoLabel}>Телефон</div>
                      {user?.phone ? (
                        <div className={scss.infoVal}>{user.phone}</div>
                      ) : (
                        <div className={scss.infoEmpty}>Не указан</div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right column — store card */}
          <div>
            <div className={scss.section}>
              <div className={scss.sectionHead}>
                <div className={scss.sectionIcon}>
                  <Store size={15} />
                </div>
                <h2>Мой магазин</h2>
              </div>

              <div className={scss.sectionBody}>
                {shop ? (
                  <div className={scss.storePanel}>
                    <div className={scss.storeLogoRow}>
                      <div className={scss.storeLogo}>
                        {shop.logo ? (
                          <img src={shop.logo} alt={shop.name} />
                        ) : (
                          <Store size={20} />
                        )}
                      </div>
                      <div>
                        <div className={scss.storeName}>{shop.name}</div>
                        {shop.region && (
                          <div className={scss.storeRegion}>
                            <MapPin
                              size={10}
                              style={{ verticalAlign: "middle", marginRight: 3 }}
                            />
                            {shop.region}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className={scss.storeStat}>
                      <span className={scss.storeStatLabel}>
                        <Star size={13} />
                        Рейтинг
                      </span>
                      <span className={scss.storeStatVal}>
                        {shop.rating != null
                          ? Number(shop.rating).toFixed(1)
                          : "—"}
                      </span>
                    </div>

                    <div className={scss.storeStat}>
                      <span className={scss.storeStatLabel}>
                        <Package size={13} />
                        Товаров
                      </span>
                      <span className={scss.storeStatVal}>
                        {shop._count?.products ?? "—"}
                      </span>
                    </div>

                    <a
                      href="/settings"
                      className={scss.settingsLink}
                    >
                      <Settings size={13} />
                      Настройки магазина
                    </a>
                  </div>
                ) : (
                  <div style={{ padding: "8px 0", fontSize: 13, color: "#888" }}>
                    Магазин не создан.{" "}
                    <a
                      href="/store"
                      style={{ color: "#5533eb", fontWeight: 500 }}
                    >
                      Создать
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
