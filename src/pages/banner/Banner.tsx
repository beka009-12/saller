"use client";
import { type FC, useState } from "react";
import scss from "./Banner.module.scss";
import {
  useGetBannerActive,
  usePostBannerStoreId,
} from "@/src/api/generated/endpoints/banner/banner";
import { useGetCommodityMyProducts } from "@/src/api/generated/endpoints/product/product";
import { useCurrentSeller } from "@/src/hooks/use-current-seller";
import type { CreateBannerInput } from "@/src/api/generated/models";
import {
  Plus,
  Megaphone,
  Calendar,
  Package,
  CheckCircle,
  Clock,
  XCircle,
  Tag,
  Layers,
  X,
} from "lucide-react";
import toast from "react-hot-toast";

type PromoType = "PERCENT" | "FIXED_PRICE" | "BUY_ONE_GET" | "SEASONAL";

const PROMO_LABELS: Record<PromoType, string> = {
  PERCENT: "Скидка %",
  FIXED_PRICE: "Фикс. цена",
  BUY_ONE_GET: "1+1",
  SEASONAL: "Сезонная",
};

const COLORS = [
  "#5533eb", "#ef4444", "#f97316", "#22c55e",
  "#3b82f6", "#a855f7", "#ec4899", "#14b8a6",
  "#f59e0b", "#0ea5e9",
];

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString("ru-RU", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

type BannerStatus = "APPROVED" | "PENDING" | "REJECTED";

const statusMeta: Record<BannerStatus, { label: string; cls: string; icon: typeof CheckCircle }> = {
  APPROVED: { label: "Активен", cls: scss.approved, icon: CheckCircle },
  PENDING: { label: "На проверке", cls: scss.pending, icon: Clock },
  REJECTED: { label: "Отклонён", cls: scss.rejected, icon: XCircle },
};

interface FormState extends Omit<CreateBannerInput, "productIds"> {
  productIds: number[];
}

const defaultForm = (): FormState => ({
  title: "",
  accent: "",
  description: "",
  decoNum: "",
  promoTag: "",
  color: "#5533eb",
  promoType: "PERCENT" as PromoType,
  discount: undefined,
  fixedPrice: undefined,
  deadline: "",
  productIds: [],
  promoCode: "",
});

const BannerPage: FC = () => {
  const { data: seller } = useCurrentSeller();
  const storeId = (seller?.user?.stores?.[0] as any)?.id as number | undefined;

  const { data: activeBanners } = useGetBannerActive();
  const { data: productsData } = useGetCommodityMyProducts();
  const { mutate: createBanner, isPending } = usePostBannerStoreId();

  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<FormState>(defaultForm());

  const banners = (activeBanners as any)?.banners ?? [];
  const products = productsData?.products ?? [];

  const counts = {
    all: banners.length,
    active: banners.filter((b: any) => b.status === "APPROVED").length,
    pending: banners.filter((b: any) => b.status === "PENDING").length,
    rejected: banners.filter((b: any) => b.status === "REJECTED").length,
  };

  const update = <K extends keyof FormState>(key: K, val: FormState[K]) =>
    setForm((f) => ({ ...f, [key]: val }));

  const toggleProduct = (id: number) => {
    setForm((f) => ({
      ...f,
      productIds: f.productIds.includes(id)
        ? f.productIds.filter((x) => x !== id)
        : [...f.productIds, id],
    }));
  };

  const handleSubmit = () => {
    if (!storeId) {
      toast.error("Магазин не найден");
      return;
    }
    if (!form.title || !form.deadline || form.productIds.length === 0) {
      toast.error("Заполните обязательные поля");
      return;
    }

    const payload: CreateBannerInput = {
      title: form.title,
      accent: form.accent,
      description: form.description,
      decoNum: form.decoNum,
      promoTag: form.promoTag,
      color: form.color,
      promoType: form.promoType,
      deadline: form.deadline,
      productIds: form.productIds,
      ...(form.promoType === "PERCENT" && form.discount
        ? { discount: form.discount }
        : {}),
      ...(form.promoType === "FIXED_PRICE" && form.fixedPrice
        ? { fixedPrice: form.fixedPrice }
        : {}),
      ...(form.promoCode ? { promoCode: form.promoCode } : {}),
    };

    createBanner(
      { storeId, data: payload },
      {
        onSuccess: () => {
          toast.success("Баннер отправлен на проверку");
          setShowModal(false);
          setForm(defaultForm());
        },
        onError: (e: any) =>
          toast.error(e?.response?.data?.message ?? "Ошибка при создании"),
      },
    );
  };

  return (
    <div className={scss.Banners}>
      <div className="container">
        {/* Header */}
        <div className={scss.pageHeader}>
          <div className={scss.left}>
            <h1>Баннеры</h1>
            <p>Рекламные размещения вашего магазина</p>
          </div>
          <button className={scss.createBtn} onClick={() => setShowModal(true)}>
            <Plus size={14} />
            Создать баннер
          </button>
        </div>

        {/* Stats */}
        <div className={scss.statsStrip}>
          <div className={scss.statPill}>
            <Layers size={16} color="#888" />
            <div>
              <div className={scss.statCount}>{counts.all}</div>
              <div className={scss.statLabel}>Всего</div>
            </div>
          </div>
          <div className={`${scss.statPill} ${scss.active}`}>
            <CheckCircle size={16} color="#16a34a" />
            <div>
              <div className={scss.statCount}>{counts.active}</div>
              <div className={scss.statLabel}>Активных</div>
            </div>
          </div>
          <div className={`${scss.statPill} ${scss.pending}`}>
            <Clock size={16} color="#d97706" />
            <div>
              <div className={scss.statCount}>{counts.pending}</div>
              <div className={scss.statLabel}>На проверке</div>
            </div>
          </div>
          <div className={`${scss.statPill} ${scss.rejected}`}>
            <XCircle size={16} color="#dc2626" />
            <div>
              <div className={scss.statCount}>{counts.rejected}</div>
              <div className={scss.statLabel}>Отклонено</div>
            </div>
          </div>
        </div>

        {/* Banner grid */}
        <div className={scss.bannerGrid}>
          {banners.length === 0 ? (
            <div className={scss.empty}>
              <div className={scss.emptyIcon}>
                <Megaphone size={24} />
              </div>
              <h3>Нет баннеров</h3>
              <p>Создайте первый рекламный баннер, чтобы привлечь покупателей</p>
              <button
                className={scss.createBtn}
                onClick={() => setShowModal(true)}
              >
                <Plus size={14} />
                Создать баннер
              </button>
            </div>
          ) : (
            banners.map((banner: any) => {
              const s = statusMeta[banner.status as BannerStatus] ?? statusMeta.PENDING;
              const Icon = s.icon;
              return (
                <div key={banner.id} className={scss.bannerCard}>
                  <div className={scss.bannerTop}>
                    <div
                      className={scss.colorDot}
                      style={{ background: banner.color ?? "#5533eb" }}
                    />
                    <p className={scss.bannerTitle}>{banner.title}</p>
                    <p className={scss.bannerAccent}>{banner.accent}</p>
                    <span className={`${scss.statusBadge} ${s.cls}`}>
                      <Icon size={11} />
                      {s.label}
                    </span>
                  </div>

                  <div className={scss.bannerMeta}>
                    <span className={scss.metaChip}>
                      <Tag size={11} />
                      {PROMO_LABELS[banner.promoType as PromoType] ?? banner.promoType}
                    </span>
                    <span className={scss.metaChip}>
                      <Package size={11} />
                      {banner.products?.length ?? 0} товаров
                    </span>
                  </div>

                  <div className={scss.bannerFoot}>
                    <span>
                      <Calendar size={11} style={{ marginRight: 4, verticalAlign: "middle" }} />
                      до {fmtDate(banner.deadline)}
                    </span>
                    <span>{banner.promoTag}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Create modal */}
      {showModal && (
        <div className={scss.overlay} onClick={() => setShowModal(false)}>
          <div className={scss.modal} onClick={(e) => e.stopPropagation()}>
            <div className={scss.modalHead}>
              <h2>Новый баннер</h2>
              <button onClick={() => setShowModal(false)}>
                <X size={16} />
              </button>
            </div>

            <div className={scss.modalBody}>
              {/* Title + Accent */}
              <div className={scss.fieldRow}>
                <div className={scss.field}>
                  <label>Заголовок *</label>
                  <input
                    placeholder="Летняя распродажа"
                    value={form.title}
                    onChange={(e) => update("title", e.target.value)}
                  />
                </div>
                <div className={scss.field}>
                  <label>Акцент</label>
                  <input
                    placeholder="−30% на всё"
                    value={form.accent}
                    onChange={(e) => update("accent", e.target.value)}
                  />
                </div>
              </div>

              {/* Description */}
              <div className={scss.field}>
                <label>Описание</label>
                <textarea
                  placeholder="Подробнее об акции..."
                  value={form.description}
                  onChange={(e) => update("description", e.target.value)}
                />
              </div>

              {/* DecoNum + PromoTag */}
              <div className={scss.fieldRow}>
                <div className={scss.field}>
                  <label>Деко-число</label>
                  <input
                    placeholder="30"
                    value={form.decoNum}
                    onChange={(e) => update("decoNum", e.target.value)}
                  />
                </div>
                <div className={scss.field}>
                  <label>Промо-тег</label>
                  <input
                    placeholder="SALE"
                    value={form.promoTag}
                    onChange={(e) => update("promoTag", e.target.value)}
                  />
                </div>
              </div>

              {/* PromoType */}
              <div className={scss.field}>
                <label>Тип акции *</label>
                <div className={scss.promoTabs}>
                  {(["PERCENT", "FIXED_PRICE", "BUY_ONE_GET", "SEASONAL"] as PromoType[]).map(
                    (t) => (
                      <button
                        key={t}
                        type="button"
                        className={`${scss.promoTab} ${form.promoType === t ? scss.activeTab : ""}`}
                        onClick={() => update("promoType", t)}
                      >
                        {PROMO_LABELS[t]}
                      </button>
                    ),
                  )}
                </div>
              </div>

              {/* Conditional discount / fixedPrice */}
              {form.promoType === "PERCENT" && (
                <div className={scss.field}>
                  <label>Скидка % (1–99)</label>
                  <input
                    type="number"
                    min={1}
                    max={99}
                    placeholder="20"
                    value={form.discount ?? ""}
                    onChange={(e) => update("discount", Number(e.target.value))}
                  />
                </div>
              )}

              {form.promoType === "FIXED_PRICE" && (
                <div className={scss.field}>
                  <label>Фиксированная цена (сом)</label>
                  <input
                    type="number"
                    placeholder="9990"
                    value={form.fixedPrice ?? ""}
                    onChange={(e) => update("fixedPrice", Number(e.target.value))}
                  />
                </div>
              )}

              {/* Deadline */}
              <div className={scss.field}>
                <label>Дедлайн *</label>
                <input
                  type="datetime-local"
                  value={form.deadline}
                  onChange={(e) => update("deadline", e.target.value)}
                />
              </div>

              {/* Color */}
              <div className={scss.field}>
                <label>Цвет баннера</label>
                <div className={scss.colorRow}>
                  {COLORS.map((c) => (
                    <div
                      key={c}
                      className={`${scss.colorSwatch} ${form.color === c ? scss.selected : ""}`}
                      style={{ background: c }}
                      onClick={() => update("color", c)}
                    />
                  ))}
                </div>
              </div>

              {/* Products */}
              <div className={scss.field}>
                <label>Товары * ({form.productIds.length} выбрано)</label>
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 6,
                    maxHeight: 160,
                    overflowY: "auto",
                  }}
                >
                  {products.map((p: any) => {
                    const sel = form.productIds.includes(p.id);
                    return (
                      <button
                        key={p.id}
                        type="button"
                        className={`${scss.promoTab} ${sel ? scss.activeTab : ""}`}
                        onClick={() => toggleProduct(p.id)}
                      >
                        {p.title?.slice(0, 22)}
                        {p.title?.length > 22 ? "…" : ""}
                      </button>
                    );
                  })}
                  {products.length === 0 && (
                    <span style={{ fontSize: 12, color: "#888" }}>
                      Нет доступных товаров
                    </span>
                  )}
                </div>
              </div>

              {/* Promo code */}
              <div className={scss.field}>
                <label>Промокод (необязательно)</label>
                <input
                  placeholder="SUMMER10"
                  value={form.promoCode ?? ""}
                  onChange={(e) => update("promoCode", e.target.value)}
                />
              </div>
            </div>

            <div className={scss.modalFoot}>
              <button
                className={scss.cancelBtn}
                onClick={() => setShowModal(false)}
              >
                Отмена
              </button>
              <button
                className={scss.submitBtn}
                onClick={handleSubmit}
                disabled={isPending}
              >
                {isPending ? "Создание..." : "Создать баннер"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BannerPage;
