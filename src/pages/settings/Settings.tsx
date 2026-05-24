"use client";
import { type FC, useState, useRef, useEffect } from "react";
import scss from "./Settings.module.scss";
import { useCurrentSeller } from "@/src/hooks/use-current-seller";
import { usePatchShopsUpdate, usePatchShopsDeactivate, usePatchShopsReactivate } from "@/src/api/generated/endpoints/shops/shops";
import { usePutUserProfile } from "@/src/api/generated/endpoints/user/user";
import { useQueryClient } from "@tanstack/react-query";
import {
  Store,
  User,
  MapPin,
  Globe,
  FileText,
  Camera,
  CheckCircle,
  BadgeCheck,
  Clock,
  Save,
  Shield,
} from "lucide-react";
import toast from "react-hot-toast";

const Settings: FC = () => {
  const { data: seller, isLoading } = useCurrentSeller();
  const { mutate: updateStore, isPending: storePending } = usePatchShopsUpdate();
  const { mutate: updateProfile, isPending: profilePending } = usePutUserProfile();
  const { mutate: deactivateShop, isPending: deactivating } = usePatchShopsDeactivate();
  const { mutate: reactivateShop, isPending: reactivating } = usePatchShopsReactivate();
  const queryClient = useQueryClient();

  const shop = seller?.user?.stores?.[0] as any;
  const user = seller?.user;

  const [storeForm, setStoreForm] = useState({
    name: "",
    description: "",
    address: "",
    region: "",
  });

  const [profileForm, setProfileForm] = useState({
    name: "",
    phone: "",
  });

  const [storeSaved, setStoreSaved] = useState(false);
  const [profileSaved, setProfileSaved] = useState(false);
  const logoRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (shop) {
      setStoreForm({
        name: shop.name ?? "",
        description: shop.description ?? "",
        address: shop.address ?? "",
        region: shop.region ?? "",
      });
    }
  }, [shop]);

  useEffect(() => {
    if (user) {
      setProfileForm({
        name: user.name ?? "",
        phone: user.phone ?? "",
      });
    }
  }, [user]);

  const handleStoreSave = () => {
    updateStore(
      {
        data: {
          name: storeForm.name || undefined,
          description: storeForm.description || null,
          address: storeForm.address || null,
          region: storeForm.region || null,
        },
      },
      {
        onSuccess: () => {
          toast.success("Магазин обновлён");
          queryClient.invalidateQueries({ queryKey: ["/user/profile"] });
          queryClient.invalidateQueries({ queryKey: ["/shops/my"] });
          setStoreSaved(true);
          setTimeout(() => setStoreSaved(false), 2500);
        },
        onError: () => toast.error("Ошибка при сохранении"),
      },
    );
  };

  const handleProfileSave = () => {
    updateProfile(
      {
        data: {
          name: profileForm.name || undefined,
          phone: profileForm.phone || undefined,
        },
      },
      {
        onSuccess: () => {
          toast.success("Профиль обновлён");
          queryClient.invalidateQueries({ queryKey: ["/user/profile"] });
          queryClient.invalidateQueries({ queryKey: ["/shops/my"] });
          setProfileSaved(true);
          setTimeout(() => setProfileSaved(false), 2500);
        },
        onError: () => toast.error("Ошибка при сохранении"),
      },
    );
  };

  if (isLoading) {
    return (
      <div className={scss.Settings}>
        <div className="container">
          <div style={{ padding: "40px 0", color: "#888", fontSize: 14 }}>
            Загрузка...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={scss.Settings}>
      <div className="container">
        <div className={scss.pageHeader}>
          <h1>Настройки</h1>
          <p>Управляйте информацией о магазине и вашем аккаунте</p>
        </div>

        <div className={scss.grid}>
          {/* ── Store settings ─────────────────────────── */}
          <div className={scss.section}>
            <div className={scss.sectionHead}>
              <div className={scss.sectionIcon}>
                <Store size={16} />
              </div>
              <div>
                <h2>Магазин</h2>
                <p>Публичная информация о вашем магазине</p>
              </div>
            </div>

            <div className={scss.sectionBody}>
              {/* Logo */}
              <div className={scss.logoUpload}>
                <div className={scss.logoPreview}>
                  {shop?.logo ? (
                    <img src={shop.logo} alt="logo" />
                  ) : (
                    <Store size={22} />
                  )}
                </div>
                <button
                  className={scss.logoBtn}
                  onClick={() => logoRef.current?.click()}
                  type="button"
                >
                  <Camera size={13} />
                  Загрузить логотип
                </button>
                <input ref={logoRef} type="file" accept="image/*" hidden />
              </div>

              {/* Verification badge */}
              {shop?.isVerified ? (
                <span className={scss.verifiedBadge}>
                  <BadgeCheck size={13} />
                  Верифицирован
                </span>
              ) : (
                <span className={scss.unverifiedBadge}>
                  <Clock size={12} />
                  На верификации
                </span>
              )}

              <div className={scss.field}>
                <label>Название магазина</label>
                <input
                  type="text"
                  placeholder="Ваш магазин"
                  value={storeForm.name}
                  onChange={(e) =>
                    setStoreForm((s) => ({ ...s, name: e.target.value }))
                  }
                />
              </div>

              <div className={scss.field}>
                <label>Описание</label>
                <textarea
                  placeholder="Расскажите о вашем магазине..."
                  value={storeForm.description}
                  onChange={(e) =>
                    setStoreForm((s) => ({ ...s, description: e.target.value }))
                  }
                />
              </div>

              <div className={scss.fieldRow}>
                <div className={scss.field}>
                  <label>
                    <MapPin
                      size={10}
                      style={{ marginRight: 4, verticalAlign: "middle" }}
                    />
                    Адрес
                  </label>
                  <input
                    type="text"
                    placeholder="ул. Манаса 45"
                    value={storeForm.address}
                    onChange={(e) =>
                      setStoreForm((s) => ({ ...s, address: e.target.value }))
                    }
                  />
                </div>
                <div className={scss.field}>
                  <label>
                    <Globe
                      size={10}
                      style={{ marginRight: 4, verticalAlign: "middle" }}
                    />
                    Регион
                  </label>
                  <input
                    type="text"
                    placeholder="Бишкек"
                    value={storeForm.region}
                    onChange={(e) =>
                      setStoreForm((s) => ({ ...s, region: e.target.value }))
                    }
                  />
                </div>
              </div>
            </div>

            <div className={scss.sectionFoot}>
              {storeSaved && (
                <span className={scss.savedMsg}>
                  <CheckCircle size={13} /> Сохранено
                </span>
              )}
              <button
                className={scss.saveBtn}
                onClick={handleStoreSave}
                disabled={storePending || !storeForm.name}
              >
                <Save size={13} />
                {storePending ? "Сохранение..." : "Сохранить"}
              </button>
            </div>
          </div>

          {/* ── Account settings ────────────────────────── */}
          <div className={scss.section}>
            <div className={scss.sectionHead}>
              <div className={scss.sectionIcon}>
                <User size={16} />
              </div>
              <div>
                <h2>Аккаунт</h2>
                <p>Личные данные продавца</p>
              </div>
            </div>

            <div className={scss.sectionBody}>
              <div className={scss.field}>
                <label>Имя</label>
                <input
                  type="text"
                  placeholder="Ваше имя"
                  value={profileForm.name}
                  onChange={(e) =>
                    setProfileForm((s) => ({ ...s, name: e.target.value }))
                  }
                />
              </div>

              <div className={scss.field}>
                <label>Email</label>
                <input
                  type="email"
                  value={user?.email ?? ""}
                  readOnly
                  style={{ opacity: 0.55, cursor: "not-allowed" }}
                />
              </div>

              <div className={scss.field}>
                <label>Телефон</label>
                <input
                  type="tel"
                  placeholder="+996 700 000 000"
                  value={profileForm.phone}
                  onChange={(e) =>
                    setProfileForm((s) => ({ ...s, phone: e.target.value }))
                  }
                />
              </div>

              <div className={scss.field}>
                <label>
                  <FileText
                    size={10}
                    style={{ marginRight: 4, verticalAlign: "middle" }}
                  />
                  Роль
                </label>
                <input
                  type="text"
                  value={user?.role === "OWNER" ? "Продавец" : user?.role ?? ""}
                  readOnly
                  style={{ opacity: 0.55, cursor: "not-allowed" }}
                />
              </div>
            </div>

            <div className={scss.sectionFoot}>
              {profileSaved && (
                <span className={scss.savedMsg}>
                  <CheckCircle size={13} /> Сохранено
                </span>
              )}
              <button
                className={scss.saveBtn}
                onClick={handleProfileSave}
                disabled={profilePending}
              >
                <Save size={13} />
                {profilePending ? "Сохранение..." : "Сохранить"}
              </button>
            </div>
          </div>

          {/* ── Security ────────────────────────────────── */}
          <div className={scss.section} style={{ gridColumn: "1 / -1" }}>
            <div className={scss.sectionHead}>
              <div className={scss.sectionIcon}>
                <Shield size={16} />
              </div>
              <div>
                <h2>Безопасность</h2>
                <p>Управление магазином и опасные действия</p>
              </div>
            </div>
            <div className={scss.sectionBody}>
              <p style={{ fontSize: 13, color: "#888" }}>
                Деактивация магазина скрывает все товары и отменяет активные
                заказы.
              </p>
              <div style={{ display: "flex", gap: 12 }}>
                {shop?.isActive !== false ? (
                  <button
                    className={scss.dangerBtn}
                    type="button"
                    disabled={deactivating}
                    onClick={() => {
                      if (!confirm("Деактивировать магазин? Все активные заказы будут отменены.")) return;
                      deactivateShop(undefined, {
                        onSuccess: () => {
                          toast.success("Магазин деактивирован");
                          queryClient.invalidateQueries({ queryKey: ["/user/profile"] });
          queryClient.invalidateQueries({ queryKey: ["/shops/my"] });
                        },
                        onError: () => toast.error("Ошибка при деактивации"),
                      });
                    }}
                  >
                    {deactivating ? "Деактивация..." : "Деактивировать магазин"}
                  </button>
                ) : (
                  <button
                    className={scss.saveBtn}
                    type="button"
                    disabled={reactivating}
                    onClick={() => {
                      reactivateShop(undefined, {
                        onSuccess: () => {
                          toast.success("Магазин реактивирован");
                          queryClient.invalidateQueries({ queryKey: ["/user/profile"] });
          queryClient.invalidateQueries({ queryKey: ["/shops/my"] });
                        },
                        onError: () => toast.error("Ошибка при реактивации"),
                      });
                    }}
                  >
                    {reactivating ? "Реактивация..." : "Реактивировать магазин"}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
