import { Heart } from "lucide-react";

function ProductCard({ product }) {
  return (
    <div
      className="
      bg-white
      rounded-3xl
      p-5
      shadow-sm
      hover:shadow-xl
      transition-all
      duration-300
      hover:-translate-y-2
      "
    >
      {/* Top */}
      <div className="flex justify-between items-center">
        <button
          className="
          w-10
          h-10
          rounded-full
          bg-red-50
          flex
          items-center
          justify-center
          "
        >
          <Heart size={20} className="text-red-500" />
        </button>

        <span
          className="
          bg-orange-100
          text-orange-600
          text-xs
          px-3
          py-1
          rounded-full
          font-medium
          "
        >
          {product.discount}
        </span>
      </div>

      {/* Product */}
      <div className="text-center mt-6">
        <div className="text-7xl">{product.image}</div>

        <h3
          className="
          mt-5
          text-lg
          font-bold
          text-gray-800
          "
        >
          {product.name}
        </h3>

        <p className="text-gray-500 mt-2">{product.quantity}</p>

        <h4
          className="
          text-2xl
          font-bold
          text-green-700
          mt-3
          "
        >
          ₹{product.price}
        </h4>
      </div>

      {/* Button */}
      <button
        className="
        w-full
        mt-6
        py-3
        bg-green-600
        text-white
        rounded-2xl
        font-semibold
        hover:bg-green-700
        transition
        "
      >
        Add
      </button>
    </div>
  );
}

export default ProductCard;
