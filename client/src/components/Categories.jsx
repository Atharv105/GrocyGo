import CategoryCard from "./CategoryCard";
import categories from "../data/categories";

function Categories() {
  return (
    <section className="bg-white py-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center">
          <h2
            className="
            text-4xl
            font-bold
            text-gray-800
            "
          >
            Shop by Categories
          </h2>

          <p
            className="
            text-gray-500
            mt-4
            text-lg
            "
          >
            Find your daily essentials quickly.
          </p>
        </div>

        <div
          className="
          grid
          grid-cols-2
          md:grid-cols-4
          gap-8
          mt-14
          "
        >
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default Categories;
