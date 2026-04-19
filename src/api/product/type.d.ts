interface Category {
  id: number;
  name: string;
}

interface Store {
  id: number;
  name: string;
  logo: string | null;
  isVerified: boolean;
  rating: number;
}

interface Product {
  id: number;
  storeId: number;
  categoryId: number;

  title: string;
  description: string;
  images: string[];

  brandName?: string;

  // одежда
  sku?: string;
  sizes?: string[];
  colors?: string[];
  material?: string;
  gender?: Gender;
  season?: Season;

  price: number;
  newPrice?: number;

  stockCount: number;
  soldCount: number;
  views: number;

  isActive: boolean;
  archivedAt?: string | null;

  createdAt: string;
  updatedAt: string;
}

interface GetProductsResponse {
  products: Product[];
}

interface GetProductByIdResponse {
  product: Product;
}

interface UpdateProductPayload {
  id: number;
  title?: string;
  description?: string;
  price?: string;
  newPrice?: string | null;
  stockCount?: number;
  tags?: string[];
  categoryId?: number;
  brandName?: string | null;
}

interface CreateProductReq {
  categoryId: number;
  brandName?: string;
  title: string;
  description: string;
  price: number;
  newPrice?: number;
  stockCount?: number;
  images: File[];
}

interface CreateProductRes {
  message: string;
  product: Product;
}

interface DeleteProductResponse {
  message: string;
}

interface UpdateProductResponse {
  message: string;
  product: Product;
}

interface CreateProductResponse {
  message: string;
  product: Product;
}
