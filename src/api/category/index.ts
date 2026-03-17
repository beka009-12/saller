import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "..";

const useGetCategories = () => {
  return useQuery<CategoryApi[]>({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await api.get("/category/categories-tree");
      return response.data.categories;
    },
  });
};

const useCreateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation<CATEGORY.CreateRes, Error, CATEGORY.CreateReq>({
    mutationFn: async (createReq) => {
      const response = await api.post("/category/create-category", createReq);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
};

export { useGetCategories, useCreateCategory };
