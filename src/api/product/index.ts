import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "..";

const useCreateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation<CreateProductRes, unknown, FormData>({
    mutationFn: async (formData: FormData) => {
      const response = await api.post("/commodity/create-product", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
};

const useGetProducts = () => {
  return useQuery<GetProductsResponse>({
    queryKey: ["products"],
    queryFn: async () => {
      const response = await api.get<GetProductsResponse>(
        "/commodity/products",
      );
      return response.data;
    },
  });
};

const useGetProductById = (id: number) => {
  return useQuery<GetProductByIdResponse>({
    queryKey: ["products", id],
    queryFn: async () => {
      const response = await api.get<GetProductByIdResponse>(
        `/commodity/product-for-user/${id}`,
      );
      return response.data;
    },
    enabled: !!id,
  });
};

const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: number;
      data: Partial<Product>;
    }) => {
      const response = await api.patch(`/commodity/product-update/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
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
  useGetProducts,
  useGetProductById,
  useUpdateProduct,
  useDeleteProduct,
  useCreateProduct,
};
