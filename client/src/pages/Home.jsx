import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Categories from "../components/Categories";
import TrendingProducts from "../components/TrendingProducts";
import HowItWorks from "../components/HowItWorks";
import Testimonials from "../components/Testimonials";
import StoreInfo from "../components/StoreInfo";
import WhyChooseUs from "../components/WhyChooseUs";
import Footer from "../components/Footer";
function Home() {
  return (
    <>
      <Hero />
      <Categories />
      <TrendingProducts />
      <HowItWorks />
      <WhyChooseUs />
      <Testimonials />
      <StoreInfo />
    </>
  );
}

export default Home;
