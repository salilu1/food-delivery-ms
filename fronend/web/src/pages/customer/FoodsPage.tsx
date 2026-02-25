import { useEffect, useState, useMemo } from "react";
import { fetchFoods } from "../../services/catalogService";
import { useCartStore } from "../../store/cartStore";
import { useAuth } from "../../store/authStore";
import type { Food } from "../../types/food";

export default function FoodsPage() {
  const [foods, setFoods] = useState<Food[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [minPrice, setMinPrice] = useState<number | "">("");
  const [maxPrice, setMaxPrice] = useState<number | "">("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedFood, setSelectedFood] = useState<Food | null>(null);
  const [addedFoodId, setAddedFoodId] = useState<string | null>(null);

  const itemsPerPage = 6;
  const { token, user } = useAuth();
  const addToCart = useCartStore((state) => state.addToCart);

  useEffect(() => {
    async function loadFoods() {
      try {
        setLoading(true);
        const data = await fetchFoods();
        setFoods(data);
      } catch (err) {
        console.error("Failed to load foods", err);
      } finally {
        setLoading(false);
      }
    }
    loadFoods();
  }, []);

  // Memoize filtered foods for performance
  const filteredFoods = useMemo(() => {
    return foods.filter((f) => {
      const matchesSearch = f.name.toLowerCase().includes(search.toLowerCase());
      const matchesMin = minPrice === "" || f.price >= Number(minPrice);
      const matchesMax = maxPrice === "" || f.price <= Number(maxPrice);
      return matchesSearch && matchesMin && matchesMax;
    });
  }, [foods, search, minPrice, maxPrice]);

  const totalPages = Math.ceil(filteredFoods.length / itemsPerPage);
  const displayedFoods = filteredFoods.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleAddToCart = async (food: Food) => {
    if (!token || !user) {
      alert("Please log in as a customer to order.");
      return;
    }
    try {
      await addToCart(food.id, token);
      setAddedFoodId(food.id);
      setTimeout(() => setAddedFoodId(null), 2000);
    } catch (err) {
      alert("Could not add to cart. Try again.");
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-8 text-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-48 bg-gray-200 rounded-full mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-80 bg-gray-100 rounded-2xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900">Explore Menu</h1>
          <p className="text-gray-500">Delicious meals delivered to your doorstep.</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filter */}
          <aside className="w-full lg:w-72 flex-shrink-0">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-24">
              <h2 className="font-bold text-lg mb-4 text-gray-800">Refine Search</h2>
              
              <div className="space-y-5">
                <div>
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Keywords</label>
                  <input
                    type="text"
                    placeholder="Pizza, Burger..."
                    value={search}
                    onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
                    className="w-full mt-1 border-gray-200 focus:ring-orange-500 focus:border-orange-500 rounded-xl px-4 py-2 border outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Price Range</label>
                  <div className="flex gap-2 mt-1">
                    <input
                      type="number"
                      placeholder="Min"
                      value={minPrice}
                      onChange={(e) => { setMinPrice(e.target.value === "" ? "" : Number(e.target.value)); setCurrentPage(1); }}
                      className="w-1/2 border-gray-200 focus:ring-orange-500 rounded-xl px-3 py-2 border outline-none"
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      value={maxPrice}
                      onChange={(e) => { setMaxPrice(e.target.value === "" ? "" : Number(e.target.value)); setCurrentPage(1); }}
                      className="w-1/2 border-gray-200 focus:ring-orange-500 rounded-xl px-3 py-2 border outline-none"
                    />
                  </div>
                </div>

                <button
                  onClick={() => { setSearch(""); setMinPrice(""); setMaxPrice(""); }}
                  className="w-full text-sm font-medium text-gray-500 hover:text-orange-600 transition-colors py-2"
                >
                  Clear all filters
                </button>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            {displayedFoods.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
                {displayedFoods.map((food) => (
                  <div key={food.id} className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col">
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={food.imageUrl}
                        alt={food.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 cursor-zoom-in"
                        onClick={() => setSelectedFood(food)}
                      />
                      <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-3 py-1 rounded-full shadow-sm">
                        <span className="font-bold text-orange-600">${food.price.toFixed(2)}</span>
                      </div>
                    </div>

                    <div className="p-5 flex flex-col flex-1">
                      <h3 className="text-lg font-bold text-gray-800 line-clamp-1">{food.name}</h3>
                      <p className="text-gray-500 text-sm mt-2 line-clamp-2 flex-1">
                        {food.description}
                      </p>
                      
                      <button
                        onClick={() => handleAddToCart(food)}
                        disabled={user?.role && user.role !== "CUSTOMER"}
                        className={`mt-5 w-full py-3 rounded-xl font-bold transition-all transform active:scale-95
                          ${addedFoodId === food.id 
                            ? "bg-green-500 text-white" 
                            : "bg-orange-600 text-white hover:bg-orange-700 shadow-lg shadow-orange-200"}
                          ${(user?.role && user.role !== "CUSTOMER") ? "bg-gray-100 text-gray-400 shadow-none cursor-not-allowed" : ""}
                        `}
                      >
                        {addedFoodId === food.id ? "Added to Cart ✓" : (user?.role && user.role !== "CUSTOMER") ? "Customer only" : "Add to Cart"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-300">
                <p className="text-gray-400 text-lg">No meals match your current filters.</p>
                <button onClick={() => {setSearch(""); setMinPrice(""); setMaxPrice("");}} className="mt-4 text-orange-600 font-bold underline">Show all foods</button>
              </div>
            )}

            {/* Pagination - Moved outside of the flex-row for proper alignment */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center mt-12 gap-2">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(p => p - 1)}
                  className="p-2 rounded-lg border hover:bg-gray-100 disabled:opacity-30 transition-all"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`w-10 h-10 rounded-lg font-medium transition-all ${currentPage === i + 1 ? "bg-orange-600 text-white shadow-md shadow-orange-200" : "hover:bg-gray-100 text-gray-600"}`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(p => p + 1)}
                  className="p-2 rounded-lg border hover:bg-gray-100 disabled:opacity-30 transition-all"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Image Modal */}
      {selectedFood && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm transition-opacity" onClick={() => setSelectedFood(null)}>
          <div className="relative max-w-4xl w-full animate-in zoom-in-95 duration-200">
            <button className="absolute -top-12 right-0 text-white text-3xl font-light hover:text-orange-400 transition-colors" onClick={() => setSelectedFood(null)}>&times; Close</button>
            <img src={selectedFood.imageUrl} alt={selectedFood.name} className="w-full h-auto max-h-[85vh] object-contain rounded-2xl shadow-2xl" />
            <div className="absolute bottom-4 left-4 right-4 bg-white/10 backdrop-blur-md p-4 rounded-xl text-white border border-white/20">
              <h2 className="text-xl font-bold">{selectedFood.name}</h2>
              <p className="text-sm opacity-80">{selectedFood.description}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}