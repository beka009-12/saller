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
  brandName: string | null;
  price: string;
  oldPrice: string | null;
  stockCount: number;
  tags: string[];
  isActive: boolean;
  archivedAt: string | null;
  createdAt: string;
  updatedAt: string;
  category: Category;
  store?: Store;
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
  oldPrice?: string | null;
  stockCount?: number;
  tags?: string[];
  categoryId?: number;
  brandName?: string | null;
}

interface CreateProductPayload {
  categoryId: number;
  brandName?: string;
  title: string;
  description: string;
  price: number;
  oldPrice?: number;
  stockCount?: number;
  tags?: string[];
  images: File[];
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