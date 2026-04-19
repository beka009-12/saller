"use client";
import { FC, useState } from "react";
import { useGetProducts } from "@/src/api/product";
import { useRouter } from "next/navigation";
import scss from "./MyProducts.module.scss";
import UpdateModal from "@/src/ui/card-buttons/updateModal/UpdateModal";

const MyProducts: FC = () => {
  const { data, isLoading, isError } = useGetProducts();
  const [editingProductId, setEditingProductId] = useState<number | null>(null);
  const router = useRouter();

  const handleAddProduct = () => {
    router.push("/products/new");
  };

  return (
    <>
      {editingProductId && (
        <UpdateModal
          productId={editingProductId}
          onClose={() => setEditingProductId(null)}
        />
      )}
    </>
  );
};

export default MyProducts;
