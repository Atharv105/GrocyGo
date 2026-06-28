function CategoryCard({ category }) {
  return (
    <div
      className="
      bg-white
      rounded-3xl
      p-6
      shadow-sm
      hover:shadow-lg
      hover:-translate-y-2
      transition-all
      duration-300
      cursor-pointer
      flex
      flex-col
      items-center
      "
    >
      <div
        className="
        w-24
        h-24
        rounded-full
        bg-green-50
        flex
        items-center
        justify-center
        text-5xl
        "
      >
        {category.image}
      </div>

      <h3
        className="
        mt-5
        text-lg
        font-semibold
        text-gray-700
        "
      >
        {category.name}
      </h3>
    </div>
  );
}

export default CategoryCard;
