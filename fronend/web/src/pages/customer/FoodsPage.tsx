import { useEffect, useState } from "react";
import { fetchFoods } from "../../services/catalogService";
import { useCartStore } from "../../store/cartStore";
import type { Food } from "../../types/food";

export default function FoodsPage() {
  const [foods, setFoods] = useState<Food[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [minPrice, setMinPrice] = useState<number | "">("");
  const [maxPrice, setMaxPrice] = useState<number | "">("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedFood, setSelectedFood] = useState<Food | null>(null);
  const itemsPerPage = 6;

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

  // Filter and search foods
  const filteredFoods = foods
    .filter((f) =>
      f.name.toLowerCase().includes(search.toLowerCase())
    )
    .filter((f) =>
      minPrice !== "" ? f.price >= Number(minPrice) : true
    )
    .filter((f) =>
      maxPrice !== "" ? f.price <= Number(maxPrice) : true
    );

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
      {/* Sidebar */}
      <aside className="w-full lg:w-64 flex-shrink-0">
        <div className="sticky top-4 p-6 bg-white border rounded-xl shadow space-y-4">
          <h2 className="font-bold text-xl mb-2">Filter & Search</h2>

          <div>
            <label className="block text-sm font-medium mb-1">Search</label>
            <input
              type="text"
              placeholder="Search foods..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-gray-300"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Min Price</label>
            <input
              type="number"
              placeholder="0"
              value={minPrice}
              onChange={(e) => {
                setMinPrice(e.target.value === "" ? "" : Number(e.target.value));
                setCurrentPage(1);
              }}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-gray-300"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Max Price</label>
            <input
              type="number"
              placeholder="100"
              value={maxPrice}
              onChange={(e) => {
                setMaxPrice(e.target.value === "" ? "" : Number(e.target.value));
                setCurrentPage(1);
              }}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-gray-300"
            />
          </div>

          <button
            onClick={() => {
              setSearch("");
              setMinPrice("");
              setMaxPrice("");
            }}
            className="mt-2 w-full bg-gray-200 text-gray-700 py-2 rounded hover:bg-gray-300 transition-colors"
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
            <div className="w-full h-64 mb-4 overflow-hidden rounded-t-xl">
                {selectedFood && (
  <div
    className="fixed inset-0 bg-black/70 flex justify-center items-center z-50"
    onClick={() => setSelectedFood(null)}
  >
    <img
      src={selectedFood.imageUrl}
      alt={selectedFood.name}
      className="max-w-lg max-h-[80vh] rounded-xl shadow-lg"
      onClick={(e) => e.stopPropagation()} // prevent closing when clicking image
    />
  </div>
)}

{/* <img
  src={food.imageUrl}
  alt={food.name}
  className="cursor-pointer rounded-xl object-cover"
  onClick={() => setSelectedFood(food)}
/> */}
              <img
                src={food.imageUrl}
                alt={food.name}
                className="w-full h-full object-cover cursor-pointer rounded-xl object-cover"
                 onClick={() => setSelectedFood(food)}
              />
            </div>
            <div className="p-4 flex flex-col flex-1">
              <h2 className="text-xl font-semibold">{food.name}</h2>
              <p className="text-gray-500 text-sm flex-1 mt-2">{food.description}</p>
              <p className="font-bold mt-3 text-black text-lg">${food.price.toFixed(2)}</p>
              <button
                onClick={() => addToCart(food)}
                className="mt-4 w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition-colors"
              >
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </main>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="w-full flex justify-center mt-6 space-x-2 col-span-full">
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