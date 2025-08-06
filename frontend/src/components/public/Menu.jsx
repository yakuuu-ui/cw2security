import { Grid, List, Music, Search, Star, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Footer from "../common/customer/Footer";
import ItemCard from "../common/customer/ItemCard";
import Layout from "../common/customer/Layout";

const Menu = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState("");
  const [sortOption, setSortOption] = useState("");
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("grid"); // grid or list
  const navigate = useNavigate();
  const { user } = useAuth();
  const customerId = user?.userId;

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/v1/category/getCategories");
        const data = await response.json();
        if (data.success) {
          setCategories(data.data);
        } else {
          setCategories([]);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
        setCategories([]);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        let url = "http://localhost:3000/api/v1/item/getItems";

        const response = await fetch(url);
        const data = await response.json();

        if (data.success) {
          let filteredProducts = data.data;

          // Client-side filtering by category
          if (category) {
            filteredProducts = filteredProducts.filter(product =>
              product.category && product.category._id === category
            );
          }

          // Client-side search
          if (searchTerm) {
            filteredProducts = filteredProducts.filter(product =>
              product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
              product.description.toLowerCase().includes(searchTerm.toLowerCase())
            );
          }

          // Client-side sorting
          if (sortOption) {
            switch (sortOption) {
              case "low-to-high":
                filteredProducts.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
                break;
              case "high-to-low":
                filteredProducts.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
                break;
              case "above-500":
                filteredProducts = filteredProducts.filter(item => parseFloat(item.price) > 500);
                break;
              case "below-500":
                filteredProducts = filteredProducts.filter(item => parseFloat(item.price) <= 500);
                break;
              case "between-1000-2000":
                filteredProducts = filteredProducts.filter(item =>
                  parseFloat(item.price) >= 1000 && parseFloat(item.price) <= 2000
                );
                break;
              default:
                break;
            }
          }

          setProducts(filteredProducts);
        } else {
          setProducts([]);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category, sortOption, searchTerm]);

  return (
    <>
      <Layout />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Header Section */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <Music className="text-blue-600" size={40} />
              <h1 className="text-4xl font-bold text-gray-900">
                All Instruments
              </h1>
              <Music className="text-blue-600" size={40} />
            </div>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Discover our complete collection of musical instruments. From guitars to pianos, find your perfect sound.
            </p>
          </div>

          {/* Filters and Search Section */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Search */}
              <div className="lg:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Search instruments..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Category Filter */}
              <div>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort Options */}
              <div>
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Sort by</option>
                  <option value="low-to-high">Price: Low to High</option>
                  <option value="high-to-low">Price: High to Low</option>
                  <option value="above-500">Price: Above 500</option>
                  <option value="below-500">Price: Below 500</option>
                  <option value="between-1000-2000">Price: 1000 - 2000</option>
                </select>
              </div>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200">
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium text-gray-700">View:</span>
                <div className="flex bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 rounded-md transition-colors ${viewMode === "grid"
                      ? "bg-white text-blue-600 shadow-sm"
                      : "text-gray-500 hover:text-gray-700"
                      }`}
                  >
                    <Grid size={18} />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 rounded-md transition-colors ${viewMode === "list"
                      ? "bg-white text-blue-600 shadow-sm"
                      : "text-gray-500 hover:text-gray-700"
                      }`}
                  >
                    <List size={18} />
                  </button>
                </div>
              </div>

              <div className="text-sm text-gray-500">
                {products.length} instrument{products.length !== 1 ? 's' : ''} found
              </div>
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading instruments...</p>
            </div>
          )}

          {/* Products Grid/List */}
          {!loading && (
            <>
              {products.length > 0 ? (
                <div className={viewMode === "grid"
                  ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
                  : "space-y-6"
                }>
                  {products.map((product) => (
                    <ItemCard
                      key={product._id}
                      item={product}
                      customerId={customerId}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="text-gray-400 mb-4">
                    <Music size={80} className="mx-auto" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">No instruments found</h3>
                  <p className="text-gray-500 mb-6">
                    Try adjusting your search criteria or browse all categories
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <button
                      onClick={() => {
                        setSearchTerm("");
                        setCategory("");
                        setSortOption("");
                      }}
                      className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Clear Filters
                    </button>
                    <button
                      onClick={() => navigate('/')}
                      className="border border-blue-600 text-blue-600 px-6 py-2 rounded-lg hover:bg-blue-50 transition-colors"
                    >
                      Back to Home
                    </button>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Quick Stats */}
          {products.length > 0 && (
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg p-6 shadow-md border border-gray-200">
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <Music className="text-blue-600" size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Total Instruments</p>
                    <p className="text-2xl font-bold text-gray-900">{products.length}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-md border border-gray-200">
                <div className="flex items-center space-x-3">
                  <div className="bg-green-100 p-3 rounded-lg">
                    <TrendingUp className="text-green-600" size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Categories</p>
                    <p className="text-2xl font-bold text-gray-900">{categories.length}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-md border border-gray-200">
                <div className="flex items-center space-x-3">
                  <div className="bg-yellow-100 p-3 rounded-lg">
                    <Star className="text-yellow-600" size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Featured Items</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {products.filter(p => p.featured).length}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Menu;
