"use client";
import { FC, useState } from "react";
import scss from "./MyProducts.module.scss";
import UpdateModal from "@/src/ui/card-buttons/updateModal/UpdateModal";
import Card from "@/src/ui/card/Card";
import { useGetCommodityMyProducts } from "@/src/api/generated/endpoints/product/product";

const MyProducts: FC = () => {
  const { data } = useGetCommodityMyProducts();
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
