import ProductCard from "./ProductCard";
import products from "../data/products";

function TrendingProducts() {
  return (
    <section className="bg-green-50 py-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center">
          <div>
            <h2
              className="
              text-4xl
              font-bold
              text-gray-800
              "
            >
              🔥 Trending Products
            </h2>

            <p
              className="
              text-gray-500
              mt-3
              "
            >
              Most loved groceries by our customers.
            </p>
          </div>

          <button
            className="
            hidden
            md:block
            border
            border-green-600
            text-green-700
            px-6
            py-3
            rounded-xl
            font-medium
            hover:bg-green-100
            "
          >
            View All
          </button>
        </div>

        <div
          className="
          grid
          grid-cols-1
          sm:grid-cols-2
          lg:grid-cols-4
          gap-8
          mt-14
          "
        >
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default TrendingProducts;
