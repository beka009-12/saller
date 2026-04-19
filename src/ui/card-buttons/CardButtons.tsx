"use client";
import { FC } from "react";
import scss from "./CardButtons.module.scss";

interface CardButtonsProps {
  productId: number;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

const CardButtons: FC<CardButtonsProps> = ({ productId, onEdit, onDelete }) => {
  return (
    <div className={scss.actions}>
      <button className={scss.editBtn} onClick={() => onEdit(productId)}>
        🖊 Изменить
      </button>
      <button className={scss.deleteBtn} onClick={() => onDelete(productId)}>
        🗑 Удалить
      </button>
    </div>
  );
};

export default CardButtons;
