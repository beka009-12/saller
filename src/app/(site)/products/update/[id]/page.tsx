'use client'
import UpdateModal from '@/src/ui/card-buttons/updateModal/UpdateModal';
import { useParams, useRouter } from 'next/navigation';

const EditProductPage = () => {
  const { id } = useParams();
  const router = useRouter();

  return <UpdateModal productId={Number(id)} onClose={() => router.back()} />;
};

export default EditProductPage;