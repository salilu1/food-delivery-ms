// FoodsPage.tsx
import { useEffect, useState } from "react";
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

  const { token } = useAuth();
 
  const addToCart = useCartStore((state) => state.addToCart);

  useEffect(() => {
    async function loadFoods() {
      try {
        const data = await fetchFoods();
        setFoods(data);
      } finally {
        setLoading(false);
      }
    }
    loadFoods();
  }, []);

 const handleAddToCart = async (food: Food) => {
  if (!token) {
    alert("You must be logged in to add items to cart");
    return;
  }

  try {
    await addToCart(food.id, token); // ✅ FIXED
    setAddedFoodId(food.id);
    setTimeout(() => setAddedFoodId(null), 2000);
  } catch (err) {
    console.error(err);
    alert("Failed to add item to cart");
  }
};

  const filteredFoods = foods
    .filter((f) => f.name.toLowerCase().includes(search.toLowerCase()))
    .filter((f) => (minPrice !== "" ? f.price >= Number(minPrice) : true))
    .filter((f) => (maxPrice !== "" ? f.price <= Number(maxPrice) : true));

  const totalPages = Math.ceil(filteredFoods.length / itemsPerPage);
  const displayedFoods = filteredFoods.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (loading)
    return (
      <div className="p-4 text-center text-gray-500">Loading foods...</div>
    );

  return (
    <div className="max-w-7xl mx-auto p-4 flex flex-col lg:flex-row gap-18">
      {/* IMAGE MODAL */}
      {selectedFood && (
        <div
          className="fixed inset-0 bg-black/70 flex justify-center items-center z-50"
          onClick={() => setSelectedFood(null)}
        >
          <img
            src={selectedFood.imageUrl}
            alt={selectedFood.name}
            className="max-w-lg max-h-[80vh] rounded-xl shadow-lg"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      {/* Sidebar */}
      <aside className="w-full lg:w-64 flex-shrink-0">
        <div className="sticky top-4 p-6 bg-white border rounded-xl shadow space-y-4">
          <h2 className="font-bold text-xl mb-2">Filter & Search</h2>
          <input
            type="text"
            placeholder="Search foods..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full border rounded px-3 py-2"
          />
          <input
            type="number"
            placeholder="Min price"
            value={minPrice}
            onChange={(e) => {
              setMinPrice(e.target.value === "" ? "" : Number(e.target.value));
              setCurrentPage(1);
            }}
            className="w-full border rounded px-3 py-2"
          />
          <input
            type="number"
            placeholder="Max price"
            value={maxPrice}
            onChange={(e) => {
              setMaxPrice(e.target.value === "" ? "" : Number(e.target.value));
              setCurrentPage(1);
            }}
            className="w-full border rounded px-3 py-2"
          />
          <button
            onClick={() => {
              setSearch("");
              setMinPrice("");
              setMaxPrice("");
            }}
            className="w-full bg-gray-200 py-2 rounded hover:bg-gray-300 transition"
          >
            Reset Filters
          </button>
        </div>
      </aside>

      {/* Food Grid */}
      <main className="flex-1 grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
        {displayedFoods.map((food) => (
          <div
            key={food.id}
            className="bg-white border rounded-xl shadow hover:shadow-lg transition-shadow flex flex-col"
          >
            <div className="w-full h-64 overflow-hidden rounded-t-xl">
              <img
                src={food.imageUrl}
                alt={food.name}
                className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform duration-300"
                onClick={() => setSelectedFood(food)}
              />
            </div>

            <div className="p-4 flex flex-col flex-1">
              <h2 className="text-xl font-semibold">{food.name}</h2>
              <p className="text-gray-500 text-sm flex-1 mt-2">
                {food.description}
              </p>
              <p className="font-bold mt-3 text-black text-lg">
                ${food.price.toFixed(2)}
              </p>
              <button
                onClick={() => handleAddToCart(food)}
                className={`mt-4 w-full py-3 rounded-lg transition ${
                  addedFoodId === food.id
                    ? "bg-green-600 text-white"
                    : "bg-black text-white hover:bg-gray-800"
                }`}
              >
                {addedFoodId === food.id ? "Added ✓" : "Add to Cart"}
              </button>
            </div>
          </div>
        ))}
      </main>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="w-full flex justify-center mt-6 space-x-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 border rounded disabled:opacity-50"
          >
            Previous
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-4 py-2 border rounded ${
                currentPage === i + 1 ? "bg-black text-white" : ""
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}