"use client";

import { useState, type FC } from "react";
import scss from "./AuthStote.module.scss";
import { useAuthStore } from "@/src/api/auth";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const AuthStore: FC = () => {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<AUTH.CreateStoreReq>();

  const { mutateAsync: createStore, isPending } = useAuthStore();
  const router = useRouter();

  const [address, setAddress] = useState("");
  const [coords, setCoords] = useState<{ lat: number; lon: number } | null>(
    null,
  );
  const [loadingAddress, setLoadingAddress] = useState(false);

  const onCreateStore = async (data: AUTH.CreateStoreReq) => {
    try {
      await createStore({
        ...data,
        address,
      });

      reset();
      setAddress("");
      setCoords(null);

      toast.success("Магазин успешно создан 🚀");
      router.push("/");
    } catch (error) {
      console.error(error);
      toast.error("Ошибка при создании магазина");
    }
  };

  const city = address.split(" ").slice(0, 3).join(" ");

  const detectAddress = () => {
    setLoadingAddress(true);

    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        const lat = coords.latitude;
        const lon = coords.longitude;

        setCoords({ lat, lon });

        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`,
          );
          const data = await res.json();

          const fullAddress = data.display_name || "";
          const region =
            data.address?.state ||
            data.address?.region ||
            data.address?.county ||
            "";

          setAddress(fullAddress);

          // 🔥 автоматически вставляем регион в форму
          if (region) {
            setValue("region", region);
          }
        } catch {
          toast.error("Не удалось определить адрес");
        } finally {
          setLoadingAddress(false);
        }
      },
      () => {
        setLoadingAddress(false);
        toast.error("Доступ к геолокации запрещён 🙏");
      },
    );
  };

  const openMap = () => {
    if (!coords) return;
    window.open(
      `https://www.google.com/maps?q=${coords.lat},${coords.lon}`,
      "_blank",
    );
  };

  return (
    <section className={scss.AuthStote}>
      <div className="container">
        <div className={scss.card}>
          <h2 className={scss.title}>Создать магазин</h2>

          <form onSubmit={handleSubmit(onCreateStore)} className={scss.form}>
            <div className={scss.field}>
              <input
                className={scss.input}
                type="text"
                placeholder="Название магазина"
                {...register("name", { required: "Введите название" })}
              />
              {errors.name && (
                <span className={scss.error}>{errors.name.message}</span>
              )}
            </div>

            <div className={scss.field}>
              <textarea
                className={scss.textarea}
                placeholder="Описание магазина"
                {...register("description")}
              />
            </div>

            <div className={scss.field}>
              <label>Адрес</label>

              <textarea
                className={scss.textarea}
                value={city}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Улица, дом..."
                rows={3}
              />

              <div className={scss.actions}>
                <button
                  type="button"
                  onClick={detectAddress}
                  disabled={loadingAddress}
                  className={scss.secondaryBtn}
                >
                  {loadingAddress
                    ? "Определяем..."
                    : "📍 Определить автоматически"}
                </button>

                {coords && (
                  <button
                    type="button"
                    onClick={openMap}
                    className={scss.secondaryBtn}
                  >
                    🗺 На карте
                  </button>
                )}
              </div>
            </div>

            <div className={scss.field}>
              <input
                className={scss.input}
                type="text"
                placeholder="Регион"
                {...register("region")}
              />
            </div>

            <button
              type="submit"
              disabled={isPending}
              className={scss.primaryBtn}
            >
              {isPending ? "Создание..." : "Созить магазин"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default AuthStore;
