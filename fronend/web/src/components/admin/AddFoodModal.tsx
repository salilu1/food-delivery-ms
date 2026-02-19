import { useState } from "react";
import { createFood } from "../../services/catalogService";

type Props = {
  onClose: () => void;
  onCreated: () => void;
};

export default function AddFoodModal({ onClose, onCreated }: Props) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState<File | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name || !description || !price || !image) {
      setError("All fields are required (including image).");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("image", image);

      await createFood(formData);

      onCreated();
      onClose();
    } catch (err: any) {
      setError(err?.response?.data?.error || "Failed to create food");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">Add Food</h2>

          <button
            onClick={onClose}
            className="text-gray-500 hover:text-black"
          >
            ✕
          </button>
        </div>

        {error && (
          <p className="mt-3 text-sm text-red-600 bg-red-50 p-2 rounded">
            {error}
          </p>
        )}

        <form className="mt-4 space-y-3" onSubmit={handleSubmit}>
          <input
            className="w-full border rounded-lg px-3 py-2"
            placeholder="Food name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <textarea
            className="w-full border rounded-lg px-3 py-2"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <input
            className="w-full border rounded-lg px-3 py-2"
            placeholder="Price"
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />

          <input
            type="file"
            accept="image/*"
            className="w-full border rounded-lg px-3 py-2"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) setImage(file);
            }}
          />

          <button
            disabled={loading}
            className="w-full bg-black text-white rounded-lg py-2 disabled:opacity-60"
          >
            {loading ? "Creating..." : "Create Food"}
          </button>
        </form>
      </div>
    </div>
  );
}
