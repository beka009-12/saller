"use client";
import { FC, useRef, useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { Edit2, Trash2, ImageOff, Tag } from "lucide-react";
import { useDeleteCommodityProductDeleteId } from "@/src/api/generated/endpoints/product/product";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import ConfirmModal from "@/src/components/ui/ConfirmModal";
import scss from "@/src/components/product/ProductCard.module.scss";

interface ProductCardProps {
  product: any;
  onEdit: (id: number) => void;
  reduce: boolean;
}

const smooth: [number,number,number,number] = [0.22, 1, 0.36, 1];

const cardVariants = {
  hidden:  { opacity: 0, y: 20, scale: 0.97 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.35, ease: smooth } },
  exit:    { opacity: 0, scale: 0.94, transition: { duration: 0.2 } },
};

const GENDER_LABEL: Record<string, string> = {
  MALE: "М", FEMALE: "Ж", UNISEX: "Унисекс",
};

const SEASON_LABEL: Record<string, string> = {
  SPRING_SUMMER: "Весна/Лето",
  AUTUMN_WINTER: "Осень/Зима",
  ALL_SEASON: "Всесезон",
};

const ProductCard: FC<ProductCardProps> = ({ product, onEdit, reduce }) => {
  const { mutate: deleteProduct } = useDeleteCommodityProductDeleteId();
  const queryClient = useQueryClient();
  const scrollRef   = useRef<HTMLDivElement>(null);
  const [activeImg,    setActiveImg]    = useState(0);
  const [confirmOpen,  setConfirmOpen]  = useState(false);

  const images     = product.images ?? [];
  const price      = Number(product.price ?? 0);
  const newPrice   = product.newPrice ? Number(product.newPrice) : null;
  const stock      = product.stockCount ?? 0;
  const sold       = product.soldCount  ?? 0;
  const hasDiscount = newPrice !== null && newPrice < price;

  useEffect(() => {
    const el = scrollRef.current;
    if (!el || images.length <= 1) return;
    const onScroll = () => setActiveImg(Math.round(el.scrollLeft / el.offsetWidth));
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [images.length]);

  const handleDelete = () => setConfirmOpen(true);

  const doDelete = () => {
    setConfirmOpen(false);
    deleteProduct(
      { id: product.id },
      {
        onSuccess: () => {
          toast.success("Товар удалён");
          queryClient.invalidateQueries({ queryKey: ["/commodity/my-products"] });
        },
        onError: () => toast.error("Ошибка при удалении"),
      }
    );
  };

  const stockStatus =
    stock === 0 ? "out" : stock <= 5 ? "low" : "ok";

  return (
    <>
    <motion.article
      className={scss.card}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      layout={!reduce}
      whileHover={reduce ? undefined : { y: -3, transition: { duration: 0.2, ease: smooth } }}
    >
      {/* ── Image ──────────────────────────────────────── */}
      <div className={scss.imageWrap}>
        <div className={scss.imageScroll} ref={scrollRef}>
          {images.length > 0 ? (
            images.map((src: string, i: number) => (
              <motion.img
                key={i}
                src={src}
                alt=""
                className={scss.img}
                whileHover={reduce ? undefined : { scale: 1.05 }}
                transition={{ duration: 0.5, ease: smooth }}
              />
            ))
          ) : (
            <div className={scss.noImage}>
              <ImageOff size={24} />
            </div>
          )}
        </div>

        {/* dots */}
        {images.length > 1 && (
          <div className={scss.dots}>
            {images.map((_: any, i: number) => (
              <span key={i} className={`${scss.dot} ${i === activeImg ? scss.dotActive : ""}`} />
            ))}
          </div>
        )}

        {/* stock badge */}
        <div className={`${scss.stockBadge} ${scss[`stock_${stockStatus}`]}`}>
          {stockStatus === "out"  && "Нет в наличии"}
          {stockStatus === "low"  && `Осталось ${stock} шт`}
          {stockStatus === "ok"   && `${stock} шт`}
        </div>

        {/* discount badge */}
        {hasDiscount && (
          <div className={scss.discountBadge}>
            <Tag size={10} />
            -{Math.round((1 - newPrice! / price) * 100)}%
          </div>
        )}
      </div>

      {/* ── Body ───────────────────────────────────────── */}
      <div className={scss.body}>

        {/* meta row */}
        <div className={scss.metaRow}>
          <span className={scss.idTag}>#{product.id}</span>
          {product.brandName && (
            <span className={scss.brandTag}>{product.brandName}</span>
          )}
          {product.gender && (
            <span className={scss.genderTag}>{GENDER_LABEL[product.gender] ?? product.gender}</span>
          )}
          {product.season && (
            <span className={scss.seasonTag}>{SEASON_LABEL[product.season] ?? product.season}</span>
          )}
        </div>

        {/* title */}
        <Link href={`/products/${product.id}`} className={scss.titleLink}>
          <h3 className={scss.title}>{product.title}</h3>
        </Link>

        {/* category */}
        {product.category?.name && (
          <span className={scss.category}>{product.category.name}</span>
        )}

        {/* price row */}
        <div className={scss.priceRow}>
          <div className={scss.prices}>
            {hasDiscount ? (
              <>
                <span className={scss.newPrice}>
                  {newPrice!.toLocaleString("ru-KG")} с.
                </span>
                <span className={scss.oldPrice}>
                  {price.toLocaleString("ru-KG")} с.
                </span>
              </>
            ) : (
              <span className={scss.price}>
                {price.toLocaleString("ru-KG")} с.
              </span>
            )}
          </div>
          {sold > 0 && (
            <span className={scss.soldCount}>{sold} продано</span>
          )}
        </div>

        {/* actions */}
        <div className={scss.actions}>
          <motion.button
            className={scss.editBtn}
            onClick={() => onEdit(product.id)}
            whileHover={reduce ? undefined : { scale: 1.04 }}
            whileTap={reduce   ? undefined : { scale: 0.95 }}
          >
            <Edit2 size={13} />
            Изменить
          </motion.button>
          <motion.button
            className={scss.deleteBtn}
            onClick={handleDelete}
            whileHover={reduce ? undefined : { scale: 1.04 }}
            whileTap={reduce   ? undefined : { scale: 0.95 }}
          >
            <Trash2 size={13} />
          </motion.button>
        </div>
      </div>
    </motion.article>

    <ConfirmModal
      open={confirmOpen}
      title={`Удалить «${product.title}»?`}
      message="Это действие нельзя отменить. Товар будет удалён из каталога."
      confirmLabel="Удалить"
      variant="danger"
      onConfirm={doDelete}
      onCancel={() => setConfirmOpen(false)}
    />
    </>
  );
};

export default ProductCard;
