import { useState } from "react";
import { updateFood, type Food } from "../../services/catalogService";

interface Props {
  food: Food;
  onClose: () => void;
  onUpdated: () => void;
}

export default function EditFoodModal({
  food,
  onClose,
  onUpdated,
}: Props) {
  const [name, setName] = useState(food.name);
  const [description, setDescription] = useState(food.description || "");
  const [price, setPrice] = useState(food.price);
  const [available, setAvailable] = useState(food.available);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", String(price));
      formData.append("available", String(available));

      if (imageFile) {
        formData.append("image", imageFile);
      }

      await updateFood(food.id, formData);

      onUpdated();
      onClose();
    } catch (err: any) {
      alert(err?.response?.data?.error || "Update failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <div className="bg-white w-full max-w-md p-6 rounded-xl shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Edit Food</h2>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            className="w-full border p-2 rounded"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Food name"
          />

          <textarea
            className="w-full border p-2 rounded"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
          />

          <input
            type="number"
            className="w-full border p-2 rounded"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
          />

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={available}
              onChange={(e) => setAvailable(e.target.checked)}
            />
            <label>Available</label>
          </div>

          <input
            type="file"
            onChange={(e) =>
              setImageFile(e.target.files ? e.target.files[0] : null)
            }
          />

          <div className="flex justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1 border rounded"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-4 py-1 bg-black text-white rounded"
            >
              {loading ? "Updating..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}