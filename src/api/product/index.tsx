import { useMutation } from "@tanstack/react-query";
import { api } from "..";

const useCreateProduct = () => {
  return useMutation<PRODUCT.CreateProductRes, Error, PRODUCT.CreateProductReq>(
    {
      mutationFn: async (data: PRODUCT.CreateProductReq) => {
        // Если есть файлы изображений, используем FormData
        if (data.images && data.images.length > 0) {
          const formData = new FormData();

          // Добавляем текстовые поля
          formData.append("category", data.category);
          formData.append("brand", data.brand);
          formData.append("title", data.title);
          formData.append("description", data.description);
          formData.append("price", data.price.toString());

          // Опциональные поля
          if (data.newPrice)
            formData.append("newPrice", data.newPrice.toString());
          if (data.stockCount)
            formData.append("stockCount", data.stockCount.toString());
          if (data.inStock !== undefined)
            formData.append("inStock", data.inStock.toString());

          // Массивы
          if (data.sizes) {
            data.sizes.forEach((size) => formData.append("sizes[]", size));
          }
          if (data.colors) {
            data.colors.forEach((color) => formData.append("colors[]", color));
          }
          if (data.tags) {
            data.tags.forEach((tag) => formData.append("tags[]", tag));
          }

          // Файлы изображений
          data.images.forEach((image, index) => {
            formData.append(`images`, image);
          });

          const response = await api.post(
            "/commodity/create-product",
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );
          return response.data;
        } else {
          // Если нет файлов, отправляем как JSON
          const response = await api.post("/commodity/create-product", data);
          return response.data;
        }
      },
    }
  );
};

export { useCreateProduct };
