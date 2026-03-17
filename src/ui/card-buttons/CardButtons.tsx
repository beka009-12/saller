"use client";
import { FC, useState } from "react";
import scss from "./CardButtons.module.scss";
import UpdateModal from "./updateModal/UpdateModal";

interface CardButtonsProps {
  productId: number;
  onDelete: (id: number) => void;
}

const CardButtons: FC<CardButtonsProps> = ({ productId, onDelete }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className={scss.actions}>
        <button className={scss.editBtn} onClick={() => setIsOpen(true)}>
          🖊 Изменить
        </button>
        <button className={scss.deleteBtn} onClick={() => onDelete(productId)}>
          🗑 Удалить
        </button>
      </div>

      {isOpen && (
        <UpdateModal productId={productId} onClose={() => setIsOpen(false)} />
      )}
    </>
  );
};

export default CardButtons;