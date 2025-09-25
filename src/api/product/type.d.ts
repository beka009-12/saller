namespace PRODUCT {
  type CreateProductRes = {
    data: {
      id: number;
      shopId: number;
      category: string;
      brand: string;
      title: string;
      description: string;
      images: string[];
      sizes: string[];
      colors: string[];
      price: number;
      newPrice?: number;
      stockCount: number;
      inStock: boolean;
      tags: string[];
      createdAt: string;
    };
  };

  type CreateProductReq = {
    category: string;
    brand: string;
    title: string;
    description: string;
    sizes?: string[];
    colors?: string[];
    price: number;
    newPrice?: number;
    stockCount?: number;
    inStock?: boolean;
    tags?: string[];
    images?: File[];
  };
}
