import { ProductDetailPage } from "../../pages/ProductDetailPage";

export default async function ProductDetail({ params }: { params: Promise<{ id: string }> | { id: string } }) {
  const realParams = await params;
  return <ProductDetailPage id={realParams.id} />;
}