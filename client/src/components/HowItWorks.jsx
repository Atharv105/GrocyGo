import { ShoppingBasket, ShoppingCart, Clock3, Smile } from "lucide-react";

function HowItWorks() {
  const steps = [
    {
      icon: <ShoppingBasket size={38} />,
      title: "Browse Products",
      description:
        "Explore fresh groceries category wise and discover daily essentials.",
    },
    {
      icon: <ShoppingCart size={38} />,
      title: "Add to Cart",
      description: "Select products and prepare your grocery list with ease.",
    },
    {
      icon: <Clock3 size={38} />,
      title: "Book Pickup Slot",
      description: "Choose a convenient time slot for grocery pickup.",
    },
    {
      icon: <Smile size={38} />,
      title: "Collect Without Waiting",
      description:
        "Visit the store during your slot and collect groceries instantly.",
    },
  ];

  return (
    <section className="bg-white py-20">
      <div className="max-w-7xl mx-auto px-6">
        {/* Heading */}
        <div className="text-center">
          <h2 className="text-4xl font-bold text-gray-800">
            How GrocyGo Works
          </h2>

          <p className="text-gray-500 mt-4 text-lg">
            Smart grocery shopping with queue-free pickup.
          </p>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mt-16">
          {steps.map((step, index) => (
            <div
              key={index}
              className="
              bg-green-50
              rounded-3xl
              p-8
              text-center
              shadow-sm
              hover:shadow-lg
              hover:-translate-y-2
              transition-all
              duration-300
              "
            >
              <div
                className="
                w-20
                h-20
                rounded-full
                bg-white
                flex
                items-center
                justify-center
                mx-auto
                text-green-700
                shadow-md
                "
              >
                {step.icon}
              </div>

              <h3 className="text-xl font-bold text-gray-800 mt-6">
                {step.title}
              </h3>

              <p className="text-gray-500 mt-4 leading-7">{step.description}</p>
            </div>
          ))}
        </div>

        {/* Bottom Banner */}
        <div
          className="
          mt-20
          bg-gradient-to-r
          from-green-600
          to-green-700
          rounded-3xl
          p-10
          text-center
          text-white
          "
        >
          <h3 className="text-3xl font-bold">
            Skip the Queue. Save Your Time.
          </h3>

          <p className="mt-4 text-green-100 text-lg">
            Order groceries online and collect them during your booked time
            slot.
          </p>
        </div>
      </div>
    </section>
  );
}

export default HowItWorks;
