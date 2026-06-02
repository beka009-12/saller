/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import {
  ArrowLeft, Edit2, Package, Tag, Eye, TrendingUp,
  CheckCircle, XCircle, Archive,
} from "lucide-react";
import { useGetCommodityProductOwnerId } from "@/src/api/generated/endpoints/product/product";
import UpdateModal from "../card-buttons/updateModal/UpdateModal";
import { hexByName } from "@/src/lib/colors";
import scss from "./ProductDetail.module.scss";

interface ProductDetailProps { id: number }

const smooth: [number,number,number,number] = [0.22, 1, 0.36, 1];

const GENDER_LABEL: Record<string, string> = {
  MALE: "Мужской", FEMALE: "Женский", UNISEX: "Унисекс",
};
const SEASON_LABEL: Record<string, string> = {
  SPRING_SUMMER: "Весна / Лето",
  AUTUMN_WINTER: "Осень / Зима",
  ALL_SEASON: "Всесезонный",
};

// ── Skeleton ──────────────────────────────────────────────────────────────────
const Skeleton = () => (
  <div className={scss.skeleton}>
    <div className={scss.skelGallery} />
    <div className={scss.skelInfo}>
      {[100, 60, 80, 40, 90, 50].map((w, i) => (
        <div key={i} className={scss.skelLine} style={{ width: `${w}%` }} />
      ))}
    </div>
  </div>
);

// ── Main component ─────────────────────────────────────────────────────────────
const ProductDetail = ({ id }: ProductDetailProps) => {
  const router  = useRouter();
  const reduce  = useReducedMotion() ?? false;
  const { data, isLoading } = useGetCommodityProductOwnerId(id);

  const [activeImg,   setActiveImg]   = useState(0);
  const [modalOpen,   setModalOpen]   = useState(false);
  const [imgKey,      setImgKey]      = useState(0);

  if (isLoading) return <Skeleton />;

  const product = data?.product as any;
  if (!product) return (
    <div className={scss.notFound}>
      <Package size={40} />
      <p>Товар не найден</p>
      <button onClick={() => router.back()} className={scss.backBtn}>← Назад</button>
    </div>
  );

  const images: string[]       = product.images ?? [];
  const price                  = Number(product.price ?? 0);
  const newPrice               = product.newPrice ? Number(product.newPrice) : null;
  const hasDiscount            = newPrice !== null && newPrice < price;
  const actualPrice            = hasDiscount ? newPrice! : price;
  const discountPct            = hasDiscount ? Math.round((1 - newPrice! / price) * 100) : null;
  const colors: string[]       = product.colors ?? [];
  const sizes: string[]        = product.sizes ?? [];

  const selectImage = (i: number) => {
    setActiveImg(i);
    setImgKey((k) => k + 1);
  };

  const fmtPrice = (n: number) =>
    new Intl.NumberFormat("ru-KG", { style: "currency", currency: "KGS", maximumFractionDigits: 0 }).format(n);

  return (
    <div className={scss.page}>

      {/* ── Top bar ────────────────────────────────────── */}
      <motion.div
        className={scss.topBar}
        initial={reduce ? false : { opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: smooth }}
      >
        <motion.button
          className={scss.backBtn}
          onClick={() => router.back()}
          whileHover={{ x: -3, transition: { duration: 0.15 } }}
          whileTap={reduce ? undefined : { scale: 0.95 }}
        >
          <ArrowLeft size={15} />
          Назад
        </motion.button>

        <div className={scss.topActions}>
          <motion.button
            className={scss.editBtn}
            onClick={() => setModalOpen(true)}
            whileHover={{ scale: 1.03, transition: { duration: 0.15 } }}
            whileTap={reduce ? undefined : { scale: 0.96 }}
          >
            <Edit2 size={14} />
            Редактировать
          </motion.button>
        </div>
      </motion.div>

      {/* ── Layout ─────────────────────────────────────── */}
      <div className={scss.layout}>

        {/* ── Gallery ──────────────────────────────────── */}
        <motion.div
          className={scss.gallery}
          initial={reduce ? false : { opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.45, ease: smooth }}
        >
          {/* Main image */}
          <div className={scss.mainImgWrap}>
            <AnimatePresence mode="wait">
              {images.length > 0 ? (
                <motion.img
                  key={imgKey}
                  src={images[activeImg]}
                  alt={product.title}
                  className={scss.mainImg}
                  initial={reduce ? false : { opacity: 0, scale: 1.03 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3, ease: smooth }}
                />
              ) : (
                <div className={scss.noImg}>
                  <Package size={48} />
                </div>
              )}
            </AnimatePresence>

            {/* Status overlay */}
            <div className={`${scss.statusOverlay} ${product.isActive ? scss.statusActive : scss.statusInactive}`}>
              {product.isActive
                ? <><CheckCircle size={12} /> Активен</>
                : <><XCircle size={12} /> Неактивен</>
              }
            </div>

            {/* Discount badge */}
            {hasDiscount && discountPct && (
              <div className={scss.discountOverlay}>−{discountPct}%</div>
            )}

            {/* Image counter */}
            {images.length > 1 && (
              <div className={scss.imgCounter}>{activeImg + 1} / {images.length}</div>
            )}
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className={scss.thumbs}>
              {images.map((src, i) => (
                <motion.button
                  key={i}
                  className={`${scss.thumb} ${i === activeImg ? scss.thumbActive : ""}`}
                  onClick={() => selectImage(i)}
                  whileHover={reduce ? undefined : { scale: 1.06 }}
                  whileTap={reduce ? undefined : { scale: 0.94 }}
                >
                  <img src={src} alt="" />
                </motion.button>
              ))}
            </div>
          )}
        </motion.div>

        {/* ── Info panel ───────────────────────────────── */}
        <motion.div
          className={scss.info}
          initial={reduce ? false : { opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.45, delay: 0.08, ease: smooth }}
        >
          {/* Meta badges */}
          <div className={scss.metaBadges}>
            {product.category?.name && (
              <span className={scss.badge}>{product.category.name}</span>
            )}
            {product.brandName && (
              <span className={scss.badgeAccent}>{product.brandName}</span>
            )}
            {product.gender && (
              <span className={scss.badge}>{GENDER_LABEL[product.gender] ?? product.gender}</span>
            )}
            {product.season && (
              <span className={scss.badge}>{SEASON_LABEL[product.season] ?? product.season}</span>
            )}
          </div>

          {/* Title */}
          <div className={scss.titleBlock}>
            <h1>{product.title}</h1>
            {product.sku && (
              <span className={scss.sku}>SKU: {product.sku}</span>
            )}
          </div>

          {/* Price */}
          <div className={scss.priceBlock}>
            <div className={scss.priceMain}>
              <span className={scss.actualPrice}>{fmtPrice(actualPrice)}</span>
              {hasDiscount && (
                <span className={scss.oldPrice}>{fmtPrice(price)}</span>
              )}
            </div>
            {hasDiscount && discountPct && (
              <span className={scss.discountBadge}>
                <Tag size={11} />
                −{discountPct}%
              </span>
            )}
          </div>

          {/* Quick stats */}
          <motion.div
            className={scss.quickStats}
            initial="hidden"
            animate="visible"
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.06 } } }}
          >
            {[
              { label: "В наличии", value: `${product.stockCount ?? 0} шт`, icon: Package,    warn: (product.stockCount ?? 0) <= 5 },
              { label: "Продано",   value: `${product.soldCount  ?? 0} шт`, icon: TrendingUp, warn: false },
              { label: "Просмотры", value: String(product.views  ?? 0),     icon: Eye,         warn: false },
            ].map(({ label, value, icon: Icon, warn }) => (
              <motion.div
                key={label}
                className={`${scss.statCard} ${warn ? scss.statCardWarn : ""}`}
                variants={{
                  hidden:  { opacity: 0, y: 10 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: smooth } },
                }}
              >
                <Icon size={14} className={scss.statIcon} />
                <span className={scss.statValue}>{value}</span>
                <span className={scss.statLabel}>{label}</span>
              </motion.div>
            ))}
          </motion.div>

          {/* Colors */}
          {colors.length > 0 && (
            <div className={scss.section}>
              <div className={scss.sectionLabel}>Цвета</div>
              <div className={scss.colorRow}>
                {colors.map((name) => (
                  <div key={name} className={scss.colorChip}>
                    <span
                      className={scss.colorDot}
                      style={{ background: hexByName(name) }}
                    />
                    {name}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Sizes */}
          {sizes.length > 0 && (
            <div className={scss.section}>
              <div className={scss.sectionLabel}>Размеры</div>
              <div className={scss.sizeRow}>
                {sizes.map((s) => (
                  <span key={s} className={scss.sizeChip}>{s}</span>
                ))}
              </div>
            </div>
          )}

          {/* Attributes */}
          {(product.material || product.sku) && (
            <div className={scss.section}>
              <div className={scss.sectionLabel}>Характеристики</div>
              <div className={scss.attrList}>
                {product.material && (
                  <div className={scss.attrRow}>
                    <span>Материал</span>
                    <span>{product.material}</span>
                  </div>
                )}
                {product.sku && (
                  <div className={scss.attrRow}>
                    <span>SKU</span>
                    <span className={scss.mono}>{product.sku}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Description */}
          {product.description && (
            <div className={scss.section}>
              <div className={scss.sectionLabel}>Описание</div>
              <p className={scss.description}>{product.description}</p>
            </div>
          )}

          {/* Archived */}
          {product.archivedAt && (
            <div className={scss.archivedBanner}>
              <Archive size={14} />
              Архивировано {new Date(product.archivedAt).toLocaleDateString("ru-RU")}
            </div>
          )}
        </motion.div>
      </div>

      {/* ── Modal ──────────────────────────────────────── */}
      {modalOpen && (
        <UpdateModal productId={id} onClose={() => setModalOpen(false)} />
      )}
    </div>
  );
};

export default ProductDetail;
