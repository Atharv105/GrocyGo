import { Clock3, ShieldCheck, Leaf, TimerOff } from "lucide-react";

function WhyChooseUs() {
  const features = [
    {
      icon: <TimerOff size={35} />,
      title: "No Waiting Queue",
      description: "Skip long billing lines and collect groceries instantly.",
    },
    {
      icon: <Clock3 size={35} />,
      title: "Flexible Pickup Slots",
      description: "Choose a convenient time and pick up your order easily.",
    },
    {
      icon: <Leaf size={35} />,
      title: "Fresh Daily Groceries",
      description:
        "Get fresh fruits, vegetables, dairy and essentials every day.",
    },
    {
      icon: <ShieldCheck size={35} />,
      title: "Secure Ordering",
      description:
        "Your orders and account information remain safe and protected.",
    },
  ];

  return (
    <section className="bg-green-50 py-20">
      <div className="max-w-7xl mx-auto px-6">
        {/* Heading */}
        <div className="text-center">
          <h2 className="text-4xl font-bold text-gray-800">
            Why Choose GrocyGo?
          </h2>

          <p className="text-gray-500 mt-4 text-lg">
            Grocery shopping made smarter, faster and hassle-free.
          </p>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mt-16">
          {features.map((feature, index) => (
            <div
              key={index}
              className="
              bg-white
              rounded-3xl
              p-8
              shadow-sm
              hover:shadow-xl
              hover:-translate-y-2
              transition-all
              duration-300
              text-center
              "
            >
              <div
                className="
                w-20
                h-20
                rounded-full
                bg-green-100
                flex
                items-center
                justify-center
                mx-auto
                text-green-700
                "
              >
                {feature.icon}
              </div>

              <h3 className="text-xl font-bold text-gray-800 mt-6">
                {feature.title}
              </h3>

              <p className="text-gray-500 mt-4 leading-7">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default WhyChooseUs;
