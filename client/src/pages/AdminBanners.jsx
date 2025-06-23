import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export default function AdminBanners() {
  const [banners, setBanners] = useState([]);
  const [form, setForm] = useState({ imageUrl: "", caption: "", link: "" });

  const fetchBanners = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/banners`
      );
      setBanners(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("❌ Failed to fetch banners:", err);
      toast.error("Could not load banners");
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/banners`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setForm((prev) => ({ ...prev, imageUrl: res.data.imageUrl }));
      toast.success("✅ Image uploaded");
    } catch (err) {
      console.error("❌ Upload error:", err);
      toast.error("Failed to upload image");
    }
  };

  const handleAdd = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/banners`, form, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      toast.success("✅ Banner added");
      setForm({ imageUrl: "", caption: "", link: "" });
      fetchBanners();
    } catch (err) {
      toast.error("❌ Failed to add");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/banners/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      toast.success("🗑 Deleted");
      fetchBanners();
    } catch (err) {
      toast.error("❌ Failed to delete");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">🖼 Manage Banners</h2>

      <div className="mb-6 space-y-2">
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="w-full border p-2 rounded"
        />
        {form.imageUrl && (
          <img
            src={form.imageUrl}
            alt="Preview"
            className="h-24 w-full object-cover rounded"
          />
        )}

        <input
          type="text"
          placeholder="Caption"
          className="w-full border p-2 rounded"
          value={form.caption}
          onChange={(e) => setForm({ ...form, caption: e.target.value })}
        />
        <input
          type="text"
          placeholder="Link (optional)"
          className="w-full border p-2 rounded"
          value={form.link}
          onChange={(e) => setForm({ ...form, link: e.target.value })}
        />
        <button
          onClick={handleAdd}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          ➕ Add Banner
        </button>
      </div>

      <div className="grid gap-4">
        {banners.map((b) => (
          <div key={b._id} className="border rounded flex items-center p-3">
            <img
              src={b.imageUrl}
              alt=""
              className="h-20 w-32 object-cover mr-4"
            />
            <div className="flex-1">
              <div className="font-semibold">{b.caption}</div>
              <div className="text-sm text-gray-500">{b.link}</div>
            </div>
            <button
              onClick={() => handleDelete(b._id)}
              className="text-red-600 ml-4"
            >
              ❌ Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
