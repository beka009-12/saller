'use client'
import { useParams } from 'next/navigation';
import ProductDetail from '@/src/ui/product-detail/ProductDetail';

const ProductPage = () => {
  const params = useParams();
  const id = params?.id;

  if (!id) return null;

  return <ProductDetail id={Number(id)} />;
};

export default ProductPage;