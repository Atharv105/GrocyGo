import { useEffect, useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { useTranslation } from "react-i18next";
import Hero from "../components/Hero";
import Categories from "../components/Categories";
import TrendingProducts from "../components/TrendingProducts";
import HowItWorks from "../components/HowItWorks";
import WhyChooseUs from "../components/WhyChooseUs";
import Testimonials from "../components/Testimonials";
import StoreInfo from "../components/StoreInfo";
import OfferCarousel from "../components/OfferCarousel";
import ProductCard from "../components/ProductCard";
import * as offerService from "../services/offerService";
import { FaBolt, FaAward, FaGift } from "react-icons/fa";

function Home() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const [offersData, setOffersData] = useState({
    heroBanners: [],
    todayOffers: [],
    festivalOffers: [],
    flashSales: [],
  });
  const [loadingOffers, setLoadingOffers] = useState(true);

  useEffect(() => {
    if (user?.role === "ADMIN") {
      navigate("/admin");
    }
  }, [user, navigate]);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        setLoadingOffers(true);
        const res = await offerService.getHomepageOffers();
        if (res.success) {
          setOffersData({
            heroBanners: res.data.heroBanners || [],
            todayOffers: res.data.todayOffers || [],
            festivalOffers: res.data.festivalOffers || [],
            flashSales: res.data.flashSales || [],
          });
        }
      } catch (err) {
        console.error("Failed to load homepage banners:", err);
      } finally {
        setLoadingOffers(false);
      }
    };
    fetchBanners();
  }, [i18n.language]);

  const hasBanners = offersData.heroBanners.length > 0;

  return (
    <>
      {/* Dynamic Banner Carousel (falls back to static Hero if none configured) */}
      {hasBanners ? (
        <div className="bg-gradient-to-b from-green-50/50 to-white">
          <OfferCarousel banners={offersData.heroBanners} />
        </div>
      ) : (
        <Hero />
      )}

      {/* Categories block */}
      <Categories />

      {/* ⚡ Flash Sale Section */}
      {offersData.flashSales.length > 0 && (
        <section className="bg-red-50/40 py-16 border-y border-red-100">
          <div className="max-w-7xl mx-auto px-6">
            {offersData.flashSales.map((sale) => {
              const saleProducts = sale.Products || [];
              if (saleProducts.length === 0) return null;
              return (
                <div key={sale.id} className="space-y-8">
                  <div className="flex justify-between items-end">
                    <div>
                      <span className="bg-red-500 text-white text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-sm self-start tracking-wider w-max mb-3">
                        <FaBolt className="animate-bounce" /> {t("flashSale")}
                      </span>
                      <h2 className="text-3xl font-extrabold text-gray-800 leading-tight">
                        {sale.title}
                      </h2>
                      <p className="text-gray-500 mt-2 text-sm">{sale.description || t("flashSaleDefaultDesc")}</p>
                    </div>
                    <Link to="/products" className="text-red-600 hover:text-red-700 font-bold text-sm shrink-0">
                      {t("viewAllDeals")} &rarr;
                    </Link>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {saleProducts.slice(0, 4).map((product) => {
                      // Apply parent flash sale badges/savings for listing
                      const discountValue = parseFloat(sale.discountValue || 0);
                      const originalPrice = parseFloat(product.price);
                      let finalPrice = originalPrice;
                      let discount = 0;
                      let badge = "";

                      if (sale.discountType === "PERCENTAGE") {
                        discount = originalPrice * (discountValue / 100);
                        finalPrice = originalPrice - discount;
                        badge = t("percentageOff", { value: Math.round(discountValue) });
                      } else if (sale.discountType === "FIXED") {
                        discount = discountValue;
                        finalPrice = originalPrice - discount;
                        badge = t("fixedOff", { value: Math.round(discountValue) });
                      } else if (sale.discountType === "FREE_QTY") {
                        badge = t("buyXGetYFree", { buy: sale.buyQuantity, get: sale.freeQuantity });
                      }

                      const productWithPromo = {
                        ...product,
                        originalPrice,
                        finalPrice,
                        discount,
                        offerBadge: badge,
                      };

                      return <ProductCard key={product.id} product={productWithPromo} />;
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Today's Offers / Hot Discounts Row */}
      {offersData.todayOffers.length > 0 && (
        <section className="bg-gradient-to-br from-orange-50/20 via-white to-green-50/20 py-16">
          <div className="max-w-7xl mx-auto px-6 space-y-8">
            <div className="flex justify-between items-end">
              <div>
                <span className="bg-orange-500 text-white text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-sm self-start tracking-wider w-max mb-3">
                  <FaAward /> {t("hotDeals")}
                </span>
                <h2 className="text-3xl font-extrabold text-gray-800 leading-tight">
                  {t("superSavingsToday")}
                </h2>
                <p className="text-gray-500 mt-2 text-sm">{t("superSavingsTodayDesc")}</p>
              </div>
              <Link to="/products" className="text-green-700 hover:text-green-800 font-bold text-sm shrink-0">
                {t("shopOffers")} &rarr;
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {offersData.todayOffers
                .flatMap((offer) =>
                  (offer.Products || []).map((product) => {
                    const discountValue = parseFloat(offer.discountValue || 0);
                    const originalPrice = parseFloat(product.price);
                    let finalPrice = originalPrice;
                    let discount = 0;
                    let badge = "";

                    if (offer.discountType === "PERCENTAGE" || offer.offerType === "PERCENTAGE_DISCOUNT") {
                      discount = originalPrice * (discountValue / 100);
                      finalPrice = originalPrice - discount;
                      badge = t("percentageOff", { value: Math.round(discountValue) });
                    } else if (offer.discountType === "FIXED" || offer.offerType === "FIXED_DISCOUNT") {
                      discount = discountValue;
                      finalPrice = originalPrice - discount;
                      badge = t("fixedOff", { value: Math.round(discountValue) });
                    }

                    return {
                      ...product,
                      originalPrice,
                      finalPrice,
                      discount,
                      offerBadge: badge,
                    };
                  })
                )
                .slice(0, 4)
                .map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
            </div>
          </div>
        </section>
      )}

      {/* 🎉 Festival Specials */}
      {offersData.festivalOffers.length > 0 && (
        <section className="bg-green-50/30 py-16 border-y border-green-100">
          <div className="max-w-7xl mx-auto px-6">
            {offersData.festivalOffers.map((fest) => {
              const festProducts = fest.Products || [];
              if (festProducts.length === 0) return null;
              return (
                <div key={fest.id} className="space-y-8">
                  <div className="flex justify-between items-end">
                    <div>
                      <span className="bg-green-600 text-white text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-sm self-start tracking-wider w-max mb-3">
                        <FaGift /> {t("celebrationOffer")}
                      </span>
                      <h2 className="text-3xl font-extrabold text-gray-800 leading-tight">
                        {fest.title}
                      </h2>
                      <p className="text-gray-500 mt-2 text-sm">{fest.description || t("celebrationOfferDefaultDesc")}</p>
                    </div>
                    <Link to="/products" className="text-green-700 hover:text-green-800 font-bold text-sm shrink-0">
                      {t("exploreFestivalCatalog")} &rarr;
                    </Link>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {festProducts.slice(0, 4).map((product) => {
                      const discountValue = parseFloat(fest.discountValue || 0);
                      const originalPrice = parseFloat(product.price);
                      let finalPrice = originalPrice;
                      let discount = 0;
                      let badge = "";

                      if (fest.discountType === "PERCENTAGE") {
                        discount = originalPrice * (discountValue / 100);
                        finalPrice = originalPrice - discount;
                        badge = t("percentageOff", { value: Math.round(discountValue) });
                      } else if (fest.discountType === "FIXED") {
                        discount = discountValue;
                        finalPrice = originalPrice - discount;
                        badge = t("fixedOff", { value: Math.round(discountValue) });
                      } else if (fest.discountType === "FREE_QTY") {
                        badge = t("buyXGetYFree", { buy: fest.buyQuantity, get: fest.freeQuantity });
                      }

                      const productWithFest = {
                        ...product,
                        originalPrice,
                        finalPrice,
                        discount,
                        offerBadge: badge,
                      };

                      return <ProductCard key={product.id} product={productWithFest} />;
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Trending / General row */}
      <TrendingProducts />

      <HowItWorks />
      <WhyChooseUs />
      <Testimonials />
      <StoreInfo />
    </>
  );
}

export default Home;
