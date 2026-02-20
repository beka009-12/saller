import { useMutation } from "@tanstack/react-query";
import { api } from "..";

const useCreateProduct = () => {
  return useMutation({
    mutationFn: async (data: FormData) => {
      const response = await api.post("/create-product", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    },
  });
};
