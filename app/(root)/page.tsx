import ProductCarousel from "@/components/shared/product/product-carousel";
import ProductList from "@/components/shared/product/product-list";
import { getFeaturedProducts, getLatestProducts } from "@/lib/actions/product.actions";

async function HomePage() {
  const latestProducts = await getLatestProducts();
  const featuredProfucts = await getFeaturedProducts();

  return (
    <>
      {featuredProfucts.length > 0 && (
        <ProductCarousel data={featuredProfucts} />
      )}
      <ProductList data={latestProducts} title="Newest arrivals" limit={4} />
    </>
  );
}
export default HomePage;
