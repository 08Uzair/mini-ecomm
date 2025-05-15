"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Trash2 } from "lucide-react"; // Correct import

const TabEnum = {
  SUBMIT: "Product Submission",
  VIEW: "My Products",
};

function App() {
  const [tab, setTab] = useState(TabEnum.SUBMIT);
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    name: "",
    price: "",
    description: "",
    image: "",
  });
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get("https://mini-ecomm-server.onrender.com/api/products");
      setProducts(res.data);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("https://mini-ecomm-server.onrender.com/api/products", form);
      setProducts([res.data, ...products]);
      setForm({ name: "", price: "", description: "", image: "" });
      setTab(TabEnum.VIEW);
    } catch (err) {
      console.error("Submit error:", err);
      alert("Failed to submit product. Please check fields and try again.");
    }
  };

  const handleSearch = async () => {
    try {
      if (!search.trim()) {
        fetchProducts();
        return;
      }
      const res = await axios.get(
        `https://mini-ecomm-server.onrender.com/api/search?query=${search}`
      );
      setProducts(res.data);
    } catch (err) {
      console.error("Search error:", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;

    try {
      await axios.delete(`https://mini-ecomm-server.onrender.com/api/products/${id}`);
      setProducts(products.filter((product) => product.id !== id));
    } catch (err) {
      console.error("Delete error:", err);
      alert("Failed to delete product. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="flex justify-center gap-4 mb-6">
        {Object.values(TabEnum).map((label) => (
          <button
            key={label}
            onClick={() => setTab(label)}
            className={`px-4 py-2 rounded ${
              tab === label ? "bg-blue-500 text-white" : "bg-white border"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === TabEnum.SUBMIT && (
        <form
          onSubmit={handleSubmit}
          className="max-w-md mx-auto bg-white p-6 rounded shadow"
        >
          <input
            className="w-full mb-2 p-2 border"
            placeholder="Product Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
          <input
            className="w-full mb-2 p-2 border"
            placeholder="Price"
            type="number"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            required
          />
          <textarea
            className="w-full mb-2 p-2 border"
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            required
          />
          <input
            className="w-full mb-4 p-2 border"
            placeholder="Image URL (optional)"
            value={form.image}
            onChange={(e) => setForm({ ...form, image: e.target.value })}
          />
          <button className="w-full bg-blue-500 text-white py-2 rounded">
            Submit Product
          </button>
        </form>
      )}

      {tab === TabEnum.VIEW && (
        <div>
          <div className="max-w-md mx-auto mb-4">
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full p-2 border mb-2"
            />
            <button
              className="w-full bg-gray-800 text-white py-2 rounded"
              onClick={handleSearch}
            >
              Search
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-white p-4 rounded shadow relative flex flex-col items-center"
              >
                {product.image && (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-60 w-60  rounded mb-2"
                  />
                )}
                <div>
                  <h2 className="text-xl font-bold">{product.name}</h2>
                  <p className="text-gray-600">${product.price}</p>
                  <p>{product.description}</p>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="absolute top-0 right-1 text-gray-200 hover:text-white p-2 bg-gray-400 rounded-full cursor-pointer m-1"
                    title="Delete Product"
                    aria-label={`Delete ${product.name}`}
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
