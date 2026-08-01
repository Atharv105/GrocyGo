import { useState, useEffect, useContext } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Search, ShoppingCart, Filter, ChevronLeft, ChevronRight } from "lucide-react";
import { getAllProducts } from "../services/productService";
import { getAllCategories } from "../services/categoryService";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import { useTranslation } from "react-i18next";

function ProductCard({ product, onAddToCart, adding }) {
  const { t } = useTranslation();
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-200 flex flex-col">
      <div className="h-44 bg-gradient-to-br from-green-50 to-orange-50 flex items-center justify-center text-6xl relative overflow-hidden">
        {product.image && product.image.startsWith("http") ? (
          <img src={product.image} className="w-full h-full object-cover" alt={product.name} />
        ) : (
          product.image || "🛍️"
        )}
        {product.stock <= 5 && product.stock > 0 && (
          <span className="absolute top-3 right-3 bg-orange-100 text-orange-700 text-xs font-bold px-2 py-1 rounded-full">
            {t("lowStock")}
          </span>
        )}
        {product.stock === 0 && (
          <span className="absolute top-3 right-3 bg-red-100 text-red-700 text-xs font-bold px-2 py-1 rounded-full">
            {t("outOfStock")}
          </span>
        )}
      </div>

      <div className="p-4 flex flex-col flex-1">
        <p className="text-xs text-green-600 font-semibold uppercase tracking-wide mb-1">
          {product.Category?.name || t("generalCategory", { defaultValue: "General" })}
        </p>
        <h3 className="font-bold text-gray-800 text-lg leading-snug">{product.name}</h3>
        {product.description && (
          <p className="text-gray-400 text-sm mt-1 line-clamp-2">{product.description}</p>
        )}

        <div className="mt-auto pt-4 flex items-center justify-between">
          <div>
            <p className="text-2xl font-bold text-green-700">₹{parseFloat(product.price).toFixed(2)}</p>
            <p className="text-xs text-gray-400">{product.unit}</p>
          </div>

          <button
            onClick={() => onAddToCart(product.id)}
            disabled={product.stock === 0 || adding === product.id}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-4 py-2.5 rounded-xl font-semibold text-sm transition"
          >
            {adding === product.id ? (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <ShoppingCart size={16} />
            )}
            {t("add")}
          </button>
        </div>
      </div>
    </div>
  );
}

function Products() {
  const { t, i18n } = useTranslation();
  const { isLoggedIn } = useContext(AuthContext);
  const { addToCart } = useContext(CartContext);
  const [searchParams] = useSearchParams();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("categoryId") || "");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [adding, setAdding] = useState(null);
  const [toast, setToast] = useState("");
  const [sortBy, setSortBy] = useState("createdAt-DESC");
  const [inStockOnly, setInStockOnly] = useState(false);

  // Suggestions State
  const [allProductsForSuggestions, setAllProductsForSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1);

  const fetchAllProductsForSuggestions = async () => {
    try {
      const res = await getAllProducts({ limit: 1000 });
      if (res.success) {
        setAllProductsForSuggestions(res.data.products || []);
      }
    } catch (err) {
      console.error("Failed to load products for suggestions:", err);
    }
  };

  const fetchProducts = async (params = {}) => {
    try {
      setLoading(true);
      const [sort, order] = sortBy.split("-");
      const res = await getAllProducts({
        page,
        limit: 12,
        search,
        categoryId: selectedCategory,
        sort,
        order,
        inStock: inStockOnly ? "true" : "false",
        ...params
      });
      if (res.success) {
        setProducts(res.data.products);
        setTotalPages(res.data.totalPages);
        setTotalProducts(res.data.totalProducts);
      }
    } catch (err) {
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await getAllCategories();
      if (res.success) {
        setCategories(res.data.filter(c => c.isActive));
      }
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchAllProductsForSuggestions();
  }, [i18n.language]);

  useEffect(() => {
    fetchProducts();
  }, [page, selectedCategory, search, sortBy, inStockOnly, i18n.language]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    setSearch(searchInput);
  };

  const handleCategoryChange = (catId) => {
    setSelectedCategory(catId);
    setPage(1);
  };

  const handleAddToCart = async (productId) => {
    if (!isLoggedIn) {
      setToast(t("loginToViewCart", { defaultValue: "Please login to add items to cart!" }));
      setTimeout(() => setToast(""), 3000);
      return;
    }
    try {
      setAdding(productId);
      await addToCart(productId, 1);
      setToast(t("addedToCartToast", { defaultValue: "Added to cart! 🛒" }));
      setTimeout(() => setToast(""), 2500);
    } catch (err) {
      setToast(err.response?.data?.message || t("failedAddToCart", { defaultValue: "Failed to add to cart" }));
      setTimeout(() => setToast(""), 3000);
    } finally {
      setAdding(null);
    }
  };

  const suggestions = searchInput
    ? allProductsForSuggestions
        .filter(p => p.name.toLowerCase().includes(searchInput.toLowerCase()))
        .slice(0, 5)
    : [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Toast */}
      {toast && (
        <div className="fixed top-24 right-6 z-50 bg-green-600 text-white px-6 py-3 rounded-2xl shadow-lg font-semibold animate-bounce">
          {toast}
        </div>
      )}

      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-green-600 to-green-800 py-14 px-6 text-white text-center">
        <h1 className="text-4xl md:text-5xl font-bold">{t("freshGroceries")}</h1>
        <p className="mt-3 text-green-100 max-w-xl mx-auto">
          {t("orderFreshSubtitle")}
        </p>

        {/* Search */}
        <form onSubmit={handleSearch} className="mt-8 flex max-w-xl mx-auto gap-3">
          <div className="flex-1 relative">
            <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => {
                setSearchInput(e.target.value);
                setShowSuggestions(true);
                setActiveSuggestionIndex(-1);
              }}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              onKeyDown={(e) => {
                if (e.key === "ArrowDown") {
                  e.preventDefault();
                  setActiveSuggestionIndex(prev => Math.min(prev + 1, suggestions.length - 1));
                } else if (e.key === "ArrowUp") {
                  e.preventDefault();
                  setActiveSuggestionIndex(prev => Math.max(prev - 1, -1));
                } else if (e.key === "Enter") {
                  if (activeSuggestionIndex >= 0 && suggestions[activeSuggestionIndex]) {
                    e.preventDefault();
                    const selected = suggestions[activeSuggestionIndex];
                    setSearchInput(selected.name);
                    setSearch(selected.name);
                    setPage(1);
                    setShowSuggestions(false);
                  }
                } else if (e.key === "Escape") {
                  setShowSuggestions(false);
                }
              }}
              placeholder={t("searchPlaceholderProducts")}
              className="w-full pl-12 pr-4 py-3.5 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-300"
            />
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute left-0 right-0 mt-1.5 bg-white border border-gray-100 rounded-xl shadow-xl z-20 overflow-hidden divide-y divide-gray-50 max-h-56">
                {suggestions.map((p, idx) => (
                  <button
                    key={p.id}
                    type="button"
                    onMouseDown={(e) => {
                      e.preventDefault(); // Prevents blur before click registers
                      setSearchInput(p.name);
                      setSearch(p.name);
                      setPage(1);
                      setShowSuggestions(false);
                    }}
                    className={`w-full text-left px-4 py-3 text-xs transition flex items-center justify-between text-gray-700 font-medium ${
                      idx === activeSuggestionIndex ? "bg-green-50" : "hover:bg-green-50/50"
                    }`}
                  >
                    <span>{p.name}</span>
                    <span className="text-green-700 font-bold">₹{parseFloat(p.price).toFixed(2)}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
          <button
            type="submit"
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3.5 rounded-xl font-semibold transition"
          >
            {t("search")}
          </button>
        </form>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar Filters */}
          <aside className="md:w-56 shrink-0">
            <div className="bg-white rounded-2xl shadow-sm p-5 sticky top-24">
              <h2 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Filter size={16} className="text-green-600" /> {t("categories")}
              </h2>
              <button
                onClick={() => handleCategoryChange("")}
                className={`w-full text-left px-3 py-2.5 rounded-xl mb-1 text-sm font-medium transition ${
                  selectedCategory === ""
                    ? "bg-green-600 text-white"
                    : "hover:bg-green-50 text-gray-700"
                }`}
              >
                {t("allProducts")}
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryChange(cat.id.toString())}
                  className={`w-full text-left px-3 py-2.5 rounded-xl mb-1 text-sm font-medium transition ${
                    selectedCategory === cat.id.toString()
                      ? "bg-green-600 text-white"
                      : "hover:bg-green-50 text-gray-700"
                  }`}
                >
                  {cat.image && (
                    <span className="mr-2 inline-block align-middle">
                      {cat.image.startsWith("http") ? (
                        <img src={cat.image} className="w-5 h-5 object-cover rounded-full inline" alt="" />
                      ) : (
                        cat.image
                      )}
                    </span>
                  )}
                  {cat.name}
                </button>
              ))}
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            {/* Results count & Sort/Stock filters */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div className="flex items-center gap-3">
                <p className="text-gray-500 text-sm font-semibold">
                  {loading ? t("loading") : `${totalProducts} ${t("productsFound")}`}
                </p>
                {search && (
                  <button
                    onClick={() => { setSearch(""); setSearchInput(""); setPage(1); }}
                    className="text-xs text-red-500 hover:underline font-bold"
                  >
                    {t("clearSearch")}
                  </button>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-4">
                {/* Stock filter */}
                <label className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-wider cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(e) => {
                      setInStockOnly(e.target.checked);
                      setPage(1);
                    }}
                    className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500 cursor-pointer"
                  />
                  {t("inStockOnly")}
                </label>

                {/* Sort selector */}
                <select
                  value={sortBy}
                  onChange={(e) => {
                    setSortBy(e.target.value);
                    setPage(1);
                  }}
                  className="bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-gray-700 focus:border-green-500 outline-none cursor-pointer shadow-sm"
                >
                  <option value="createdAt-DESC">{t("newest")}</option>
                  <option value="price-ASC">{t("priceLowHigh")}</option>
                  <option value="price-DESC">{t("priceHighLow")}</option>
                  <option value="name-ASC">{t("nameAsc")}</option>
                </select>
              </div>
            </div>

            {/* Products Grid */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white rounded-2xl h-72 animate-pulse" />
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="bg-white rounded-2xl p-16 text-center shadow-sm">
                <p className="text-5xl mb-4">🔍</p>
                <h3 className="text-xl font-bold text-gray-700">{t("noProductsFound")}</h3>
                <p className="text-gray-400 mt-2">{t("noProductsTryDifferent")}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={handleAddToCart}
                    adding={adding}
                  />
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-4 mt-10">
                <button
                  onClick={() => setPage((p) => Math.max(p - 1, 1))}
                  disabled={page === 1}
                  className="flex items-center gap-1 px-4 py-2.5 border rounded-xl hover:bg-gray-100 disabled:opacity-40 font-semibold text-gray-700"
                >
                  <ChevronLeft size={18} /> {t("prev")}
                </button>
                <span className="text-gray-600 font-medium">
                  {t("pageOf", { current: page, total: totalPages })}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                  disabled={page === totalPages}
                  className="flex items-center gap-1 px-4 py-2.5 border rounded-xl hover:bg-gray-100 disabled:opacity-40 font-semibold text-gray-700"
                >
                  {t("next")} <ChevronRight size={18} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Products;

