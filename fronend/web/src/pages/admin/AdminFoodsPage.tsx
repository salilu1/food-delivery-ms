import { useEffect, useState } from "react";
import { deleteFood, fetchFoods, type Food } from "../../services/catalogService";
import AddFoodModal from "../../components/admin/AddFoodModal";

export default function AdminFoodsPage() {
  const [foods, setFoods] = useState<Food[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showModal, setShowModal] = useState(false);

  async function loadFoods() {
    try {
      setError("");
      setLoading(true);
      const data = await fetchFoods();
      setFoods(data);
    } catch (err: any) {
      setError(err?.response?.data?.error || "Failed to load foods");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    const ok = confirm("Delete this food?");
    if (!ok) return;

    try {
      await deleteFood(id);
      await loadFoods();
    } catch (err: any) {
      alert(err?.response?.data?.error || "Delete failed");
    }
  }

  useEffect(() => {
    loadFoods();
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Admin Foods</h1>

        <button
          onClick={() => setShowModal(true)}
          className="bg-black text-white px-4 py-2 rounded-lg"
        >
          + Add Food
        </button>
      </div>

      {loading && <p className="mt-4 text-sm text-gray-500">Loading...</p>}

      {error && (
        <p className="mt-4 text-sm text-red-600 bg-red-50 p-2 rounded">
          {error}
        </p>
      )}

      {!loading && foods.length === 0 && (
        <p className="mt-4 text-sm text-gray-500">No foods yet.</p>
      )}

      {!loading && foods.length > 0 && (
        <div className="mt-6 overflow-x-auto bg-white border rounded-xl">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left">
              <tr>
                <th className="p-3">Image</th>
                <th className="p-3">Name</th>
                <th className="p-3">Price</th>
                <th className="p-3">Created</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>

            <tbody>
              {foods.map((food) => (
                <tr key={food.id} className="border-t">
                  <td className="p-3">
                    <img
                      src={food.imageUrl}
                      alt={food.name}
                      className="w-14 h-14 rounded-lg object-cover border"
                    />
                  </td>
                  <td className="p-3 font-medium">{food.name}</td>
                  <td className="p-3">${food.price.toFixed(2)}</td>
                  <td className="p-3">
                    {new Date(food.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-3">
                    <button
                      onClick={() => handleDelete(food.id)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <AddFoodModal
          onClose={() => setShowModal(false)}
          onCreated={loadFoods}
        />
      )}
    </div>
  );
}
