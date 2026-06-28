import { Link } from "react-router-dom";
import { ShoppingBasket, Clock3, Truck } from "lucide-react";

function Hero() {
  return (
    <section className="bg-gradient-to-br from-green-50 via-white to-orange-50">
      <div className="max-w-7xl mx-auto px-6 py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-14 items-center">
          {/* Left */}
          <div>
            <span
              className="
              inline-flex
              items-center
              gap-2
              bg-green-100
              text-green-700
              px-4
              py-2
              rounded-full
              text-sm
              font-medium
              "
            >
              🌿 Fresh & Queue-Free Grocery Shopping
            </span>

            <h1
              className="
              text-5xl
              lg:text-6xl
              font-bold
              text-gray-800
              mt-6
              leading-tight
              "
            >
              Fresh Groceries,
              <span className="text-green-600"> Zero Waiting</span>
            </h1>

            <p
              className="
              text-gray-600
              text-lg
              mt-6
              leading-8
              max-w-xl
              "
            >
              Shop groceries online, choose your pickup slot, and collect your
              order without standing in long queues.
            </p>

            {/* Buttons */}
            <div className="flex flex-wrap gap-4 mt-8">
              <Link
                to="/products"
                className="
                bg-green-600
                text-white
                px-8
                py-4
                rounded-2xl
                font-semibold
                hover:bg-green-700
                transition
                "
              >
                Shop Now
              </Link>

              <Link
                to="/categories"
                className="
                border
                border-green-600
                text-green-700
                px-8
                py-4
                rounded-2xl
                font-semibold
                hover:bg-green-50
                transition
                "
              >
                Explore Categories
              </Link>
            </div>

            {/* Features */}
            <div className="grid sm:grid-cols-3 gap-4 mt-12">
              <div className="bg-white rounded-2xl p-5 shadow-sm">
                <ShoppingBasket className="text-green-600" size={30} />

                <h3 className="font-semibold mt-3">Fresh Products</h3>

                <p className="text-sm text-gray-500 mt-2">
                  Daily fresh groceries and essentials.
                </p>
              </div>

              <div className="bg-white rounded-2xl p-5 shadow-sm">
                <Clock3 className="text-orange-500" size={30} />

                <h3 className="font-semibold mt-3">Book Slot</h3>

                <p className="text-sm text-gray-500 mt-2">
                  Choose your convenient pickup time.
                </p>
              </div>

              <div className="bg-white rounded-2xl p-5 shadow-sm">
                <Truck className="text-green-600" size={30} />

                <h3 className="font-semibold mt-3">No Waiting</h3>

                <p className="text-sm text-gray-500 mt-2">
                  Collect groceries without standing in queues.
                </p>
              </div>
            </div>
          </div>

          {/* Right */}
          <div className="flex justify-center">
            <div
              className="
              w-[400px]
              h-[400px]
              bg-gradient-to-br
              from-green-100
              to-orange-100
              rounded-full
              flex
              items-center
              justify-center
              shadow-xl
              "
            >
              <div className="text-center">
                <div className="text-8xl">🛒</div>

                <h2
                  className="
                  text-3xl
                  font-bold
                  text-green-700
                  mt-4
                  "
                >
                  GrocyGo
                </h2>

                <p className="text-gray-600 mt-2">Order • Book • Pickup</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
