import { Clock3, Phone, MapPin, ShoppingBasket } from "lucide-react";

function StoreInfo() {
  return (
    <section className="bg-green-50 py-20">
      <div className="max-w-7xl mx-auto px-6">
        {/* Heading */}
        <div className="text-center">
          <h2 className="text-4xl font-bold text-gray-800">Visit Our Store</h2>

          <p className="text-gray-500 mt-4 text-lg">
            Order online and collect groceries at your selected pickup time.
          </p>
        </div>

        {/* Cards */}
        <div className="grid lg:grid-cols-4 gap-8 mt-16">
          <div className="bg-white rounded-3xl p-8 shadow-sm text-center">
            <div className="w-16 h-16 mx-auto rounded-full bg-green-100 flex items-center justify-center">
              <Clock3 className="text-green-700" size={30} />
            </div>

            <h3 className="font-bold text-xl mt-6">Store Timing</h3>

            <p className="text-gray-500 mt-3">8:00 AM - 9:00 PM</p>
          </div>

          <div className="bg-white rounded-3xl p-8 shadow-sm text-center">
            <div className="w-16 h-16 mx-auto rounded-full bg-green-100 flex items-center justify-center">
              <ShoppingBasket className="text-green-700" size={30} />
            </div>

            <h3 className="font-bold text-xl mt-6">Pickup Timing</h3>

            <p className="text-gray-500 mt-3">9:00 AM - 8:00 PM</p>
          </div>

          <div className="bg-white rounded-3xl p-8 shadow-sm text-center">
            <div className="w-16 h-16 mx-auto rounded-full bg-green-100 flex items-center justify-center">
              <Phone className="text-green-700" size={30} />
            </div>

            <h3 className="font-bold text-xl mt-6">Contact</h3>

            <p className="text-gray-500 mt-3">+91 98765 43210</p>
          </div>

          <div className="bg-white rounded-3xl p-8 shadow-sm text-center">
            <div className="w-16 h-16 mx-auto rounded-full bg-green-100 flex items-center justify-center">
              <MapPin className="text-green-700" size={30} />
            </div>

            <h3 className="font-bold text-xl mt-6">Location</h3>

            <p className="text-gray-500 mt-3">Kolhapur, Maharashtra</p>
          </div>
        </div>

        {/* CTA Banner */}
        <div
          className="
          mt-20
          rounded-3xl
          bg-gradient-to-r
          from-green-600
          to-green-700
          p-12
          text-center
          text-white
          "
        >
          <h2 className="text-4xl font-bold">Ready to Skip the Queue?</h2>

          <p className="mt-5 text-green-100 text-lg">
            Shop groceries online, book your pickup slot, and collect your order
            without waiting.
          </p>

          <button
            className="
            mt-8
            bg-white
            text-green-700
            px-8
            py-4
            rounded-2xl
            font-semibold
            hover:scale-105
            transition
            "
          >
            Start Shopping
          </button>
        </div>
      </div>
    </section>
  );
}

export default StoreInfo;
