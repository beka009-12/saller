"use client";
import { FC, useState } from "react";
import scss from "./MyProducts.module.scss";
import UpdateModal from "@/src/ui/card-buttons/updateModal/UpdateModal";
import { useGetNestShopCommodityProducts } from "@/src/api/generated/endpoints/product/product";
import Card from "@/src/ui/card/Card";

const MyProducts: FC = () => {
  const { data } = useGetNestShopCommodityProducts();
  const [editingProductId, setEditingProductId] = useState<number | null>(null);

  return (
    <div className={scss.wrapper}>
      <div className={scss.grid}>
        {data?.products?.map((product) => (
          <Card
            key={product.id}
            product={product}
            onEdit={(id) => setEditingProductId(id)}
          />
        ))}
      </div>

      {editingProductId && (
        <UpdateModal
          productId={editingProductId}
          onClose={() => setEditingProductId(null)}
        />
      )}
    </div>
  );
};

export default MyProducts;
