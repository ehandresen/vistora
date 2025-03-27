import ProductList from "@/components/shared/product/product-list";
import sampleData from "@/db/sample-data";

function HomePage() {
  return (
    <>
      <ProductList
        data={sampleData.products}
        title="Newest arrivals"
        limit={4}
      />
    </>
  );
}
export default HomePage;
