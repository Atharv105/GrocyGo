import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useTranslation } from "react-i18next";

function OfferCarousel({ banners = [] }) {
  const { t } = useTranslation();
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (banners.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 3000); // 3 seconds auto-scroll
    return () => clearInterval(interval);
  }, [banners]);

  if (!banners || banners.length === 0) {
    return null;
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? banners.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % banners.length);
  };

  return (
    <div className="relative w-full max-w-7xl mx-auto px-4 md:px-6 py-6 overflow-hidden select-none group">
      {/* Slider container */}
      <div className="relative h-56 sm:h-80 md:h-96 lg:h-[480px] w-full rounded-3xl overflow-hidden shadow-md bg-gradient-to-r from-green-50 to-orange-50">
        {banners.map((slide, idx) => {
          const isActive = idx === currentIndex;
          return (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out flex items-center justify-between ${
                isActive ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
              }`}
            >
              {/* Background image / overlay */}
              {slide.bannerImage ? (
                <img
                  src={slide.bannerImage}
                  className="absolute inset-0 w-full h-full object-cover"
                  alt={slide.title}
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-green-600 to-green-800" />
              )}

              {/* Glassmorphic content box */}
              <div className="absolute left-6 sm:left-14 md:left-20 bottom-6 sm:bottom-12 max-w-sm sm:max-w-md bg-white/90 backdrop-blur-md p-4 sm:p-6 rounded-2xl border border-white/40 shadow-xl flex flex-col z-20">
                <span className="bg-orange-500 text-white text-[10px] sm:text-xs font-extrabold uppercase px-2.5 py-1 rounded-full self-start shadow-sm tracking-wider">
                  {t(slide.offerType, { defaultValue: slide.offerType.replace("_", " ") })}
                </span>
                <h2 className="text-lg sm:text-2xl lg:text-3xl font-black text-gray-900 mt-2 leading-tight">
                  {slide.title}
                </h2>
                <p className="text-gray-600 text-xs sm:text-sm mt-1 sm:mt-2 line-clamp-2">
                  {slide.description || t("carouselDefaultDesc", { defaultValue: "Grab exclusive discounts on your grocery cart items today!" })}
                </p>
                <Link
                  to="/products"
                  className="bg-green-600 hover:bg-green-700 text-white text-xs sm:text-sm font-bold px-4 py-2 sm:py-2.5 rounded-xl mt-4 self-start shadow-sm transition text-center"
                >
                  {t("shopOfferNow", { defaultValue: "Shop Offer Now" })}
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {/* Nav Arrows */}
      {banners.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-6 md:left-10 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white text-gray-800 w-9 h-9 sm:w-12 sm:h-12 rounded-full shadow-lg flex items-center justify-center border transition z-20 opacity-0 group-hover:opacity-100"
          >
            <FaChevronLeft className="text-sm sm:text-base" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-6 md:right-10 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white text-gray-800 w-9 h-9 sm:w-12 sm:h-12 rounded-full shadow-lg flex items-center justify-center border transition z-20 opacity-0 group-hover:opacity-100"
          >
            <FaChevronRight className="text-sm sm:text-base" />
          </button>

          {/* Indicators Dots */}
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-2 z-20">
            {banners.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  idx === currentIndex ? "bg-green-600 w-6" : "bg-gray-300"
                }`}
                title={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default OfferCarousel;
