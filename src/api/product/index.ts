import { useMutation, useQuery } from "@tanstack/react-query";
import { api } from "..";

const useGetProducts = () => {
  return useQuery<GetProductsResponse>({
    queryKey: ["products"],
    queryFn: async () => {
      const response = await api.get<GetProductsResponse>("/commodity/products");
      return response.data;
    },
  });
};

const useGetProductById = (id: number) => {
  return useQuery<{ product: Product }>({
    queryKey: ["product", id],
    queryFn: async () => {
      const response = await api.get<{ product: Product }>(
        `/commodity/product-for-user/${id}`
      );
      return response.data;
    },
    enabled: !!id,
  });
};

const useUpdateProduct = () => {
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<Product> }) => {
      const response = await api.patch(`/commodity/product-update/${id}`, data);
      return response.data;
    },
  });
};

const useDeleteProduct = () => {
  return useMutation({
    mutationFn: async (id: number) => {
      const response = await api.delete(`/commodity/product-delete/${id}`);
      return response.data;
    },
  });
};

export {
  useCreateProduct,
  useGetProducts,
  useGetProductById,
  useUpdateProduct,
  useDeleteProduct,
};


