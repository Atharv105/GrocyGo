import { Star } from "lucide-react";

function Testimonials() {
  const reviews = [
    {
      name: "Shivanee Patil",
      city: "Kolhapur",
      review:
        "Booked my pickup slot and collected groceries in less than 5 minutes. Amazing experience!",
    },
    {
      name: "riya Sharma",
      city: "Pune",
      review:
        "No more waiting in billing queues. The slot booking feature is extremely useful.",
    },
    {
      name: "Amit Desai",
      city: "Sangli",
      review:
        "Fresh groceries, easy ordering process, and smooth pickup. Highly recommended.",
    },
  ];

  return (
    <section className="bg-white py-20">
      <div className="max-w-7xl mx-auto px-6">
        {/* Heading */}
        <div className="text-center">
          <h2 className="text-4xl font-bold text-gray-800">
            What Our Customers Say
          </h2>

          <p className="text-gray-500 mt-4 text-lg">
            Thousands of families trust GrocyGo for faster and smarter grocery
            shopping.
          </p>
        </div>

        {/* Reviews */}
        <div className="grid lg:grid-cols-3 gap-8 mt-16">
          {reviews.map((review, index) => (
            <div
              key={index}
              className="
              bg-green-50
              rounded-3xl
              p-8
              shadow-sm
              hover:shadow-lg
              transition-all
              duration-300
              "
            >
              {/* Stars */}
              <div className="flex gap-1 text-yellow-500">
                <Star fill="currentColor" size={20} />
                <Star fill="currentColor" size={20} />
                <Star fill="currentColor" size={20} />
                <Star fill="currentColor" size={20} />
                <Star fill="currentColor" size={20} />
              </div>

              {/* Review */}
              <p className="text-gray-600 leading-8 mt-6">"{review.review}"</p>

              {/* User */}
              <div className="mt-8 flex items-center gap-4">
                <div
                  className="
                  w-14
                  h-14
                  rounded-full
                  bg-green-600
                  text-white
                  flex
                  items-center
                  justify-center
                  font-bold
                  text-lg
                  "
                >
                  {review.name.charAt(0)}
                </div>

                <div>
                  <h3 className="font-semibold text-gray-800">{review.name}</h3>

                  <p className="text-sm text-gray-500">{review.city}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Testimonials;
