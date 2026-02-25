import { useEffect, useState, useCallback } from "react";
import {
  deleteFood,
  fetchFoods,
  type Food,
} from "../../services/catalogService";
import AddFoodModal from "../../components/admin/AddFoodModal";
import EditFoodModal from "../../components/admin/EditFoodModal";

export default function AdminFoodsPage() {
  const [foods, setFoods] = useState<Food[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingFood, setEditingFood] = useState<Food | null>(null);

  const loadFoods = useCallback(async () => {
    try {
      setError("");
      setLoading(true);
      const data = await fetchFoods();
      // Sort by newest added
      setFoods(data.sort((a: Food, b: Food) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ));
    } catch (err: any) {
      setError(err?.response?.data?.error || "Failed to load catalog data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadFoods();
  }, [loadFoods]);

  async function handleDelete(id: string) {
    if (!window.confirm("Permanent Action: Are you sure you want to delete this item?")) return;

    try {
      await deleteFood(id);
      loadFoods(); // Refresh list
    } catch (err: any) {
      alert(err?.response?.data?.error || "Delete failed");
    }
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">Inventory Management</h1>
            <p className="text-gray-500 mt-1">Manage your menu items, pricing, and availability.</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center justify-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-orange-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Add New Dish
          </button>
        </div>

        {/* Status Messages */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl flex items-center gap-2">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </div>
        )}

        {/* Data Table Container */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100">
                  <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Item</th>
                  <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Price</th>
                  <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Added On</th>
                  <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {loading ? (
                  [...Array(5)].map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td colSpan={5} className="p-4"><div className="h-12 bg-gray-50 rounded-lg"></div></td>
                    </tr>
                  ))
                ) : foods.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-12 text-center text-gray-400">
                      No dishes found in the catalog.
                    </td>
                  </tr>
                ) : (
                  foods.map((food) => (
                    <tr key={food.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-4">
                          <img
                            src={food.imageUrl}
                            alt={food.name}
                            className="w-12 h-12 rounded-xl object-cover border border-gray-100 shadow-sm"
                          />
                          <div>
                            <p className="font-bold text-gray-900">{food.name}</p>
                            <p className="text-xs text-gray-400 truncate max-w-[200px]">{food.description}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        {food.available ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-green-50 text-green-600 border border-green-100">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-600"></span>
                            In Stock
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-500 border border-gray-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
                            Hidden
                          </span>
                        )}
                      </td>
                      <td className="p-4 font-semibold text-gray-900">
                        ${food.price.toFixed(2)}
                      </td>
                      <td className="p-4 text-sm text-gray-500">
                        {new Date(food.createdAt).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => setEditingFood(food)}
                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                            title="Edit Item"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDelete(food.id)}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                            title="Delete Item"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showAddModal && (
        <AddFoodModal onClose={() => setShowAddModal(false)} onCreated={loadFoods} />
      )}
      {editingFood && (
        <EditFoodModal food={editingFood} onClose={() => setEditingFood(null)} onUpdated={loadFoods} />
      )}
    </div>
  );
}