import { useState, useEffect } from "react";

const INITIAL_PRODUCTS = [
  { name: "Apple", price: 1.5 },
  { name: "Banana", price: 1.0 },
  { name: "Orange", price: 2.0 },
  { name: "Milk", price: 2.5 },
  { name: "Bread", price: 2.2 },
];

const TAX_RATE = 0.07; // 7% tax

export default function ShoppingTable() {
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [items, setItems] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(products[0].name);
  const [selectedPrice, setSelectedPrice] = useState(products[0].price);
  const [editId, setEditId] = useState(null);
  const [editProduct, setEditProduct] = useState(products[0].name);
  const [editPrice, setEditPrice] = useState(products[0].price);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // For adding new product
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newProductName, setNewProductName] = useState("");
  const [newProductPrice, setNewProductPrice] = useState("");

  // Filter items based on search term
  const filteredItems = items.filter(
    (item) =>
      item.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.price.toString().includes(searchTerm)
  );

  // When product changes, update price accordingly
  useEffect(() => {
    if (!isAddingNew) {
      const product = products.find((p) => p.name === selectedProduct);
      if (product) setSelectedPrice(product.price);
    }
  }, [selectedProduct, products, isAddingNew]);

  useEffect(() => {
    const product = products.find((p) => p.name === editProduct);
    if (product) setEditPrice(product.price);
  }, [editProduct, editId, products]);

  const handleEdit = (item) => {
    setEditId(item.id);
    setEditProduct(item.product);
    setEditPrice(item.price);
  };

  const handleSave = (id) => {
    setItems(
      items.map((item) =>
        item.id === id
          ? { ...item, product: editProduct, price: editPrice }
          : item
      )
    );
    setEditId(null);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      setIsLoading(true);
      setTimeout(() => {
        setItems(items.filter((item) => item.id !== id));
        setIsLoading(false);
      }, 300);
    }
  };

  const handleAdd = () => {
    if (isAddingNew) {
      if (!newProductName.trim() || !newProductPrice) return;
      // Add new product to products list
      setProducts([
        ...products,
        { name: newProductName.trim(), price: Number(newProductPrice) },
      ]);
      // Add to items
      setItems([
        ...items,
        {
          id: Date.now(),
          product: newProductName.trim(),
          price: Number(newProductPrice),
        },
      ]);
      // Reset new product fields
      setNewProductName("");
      setNewProductPrice("");
      setIsAddingNew(false);
      setSelectedProduct(newProductName.trim());
      setSelectedPrice(Number(newProductPrice));
    } else {
      setItems([
        ...items,
        {
          id: Date.now(),
          product: selectedProduct,
          price: selectedPrice,
        },
      ]);
    }
  };

  // Calculate total and tax
  const total = filteredItems.reduce(
    (sum, item) => sum + Number(item.price),
    0
  );
  const tax = total * TAX_RATE;
  const grandTotal = total + tax;

  return (
    <div className="quotation-table">
      <h1>🛒 Shopping List</h1>
      <div className="add-quote-form" style={{ marginBottom: "1.5em" }}>
        <input
          placeholder="🔍 Search items..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ flex: 2, maxWidth: "none" }}
        />
      </div>

      {/* Add Item Form */}
      <div className="add-quote-form">
        {!isAddingNew ? (
          <>
            <select
              value={selectedProduct}
              onChange={(e) => setSelectedProduct(e.target.value)}
              style={{ minWidth: 120, padding: "0.8em", borderRadius: 8 }}
            >
              {products.map((product) => (
                <option key={product.name} value={product.name}>
                  {product.name}
                </option>
              ))}
            </select>
            <input
              type="number"
              min="0"
              step="0.01"
              value={selectedPrice}
              readOnly
              style={{
                minWidth: 80,
                padding: "0.8em",
                borderRadius: 8,
                background: "#f3f3f3",
                color: "#888",
                cursor: "not-allowed",
              }}
              placeholder="Price"
            />
            <button className="add-btn" onClick={handleAdd}>
              Add Item
            </button>
            <button
              type="button"
              className="add-btn"
              style={{ background: "#22c55e" }}
              onClick={() => setIsAddingNew(true)}
            >
              + New Product
            </button>
          </>
        ) : (
          <>
            <input
              type="text"
              placeholder="Product Name"
              value={newProductName}
              onChange={(e) => setNewProductName(e.target.value)}
              style={{ minWidth: 120, padding: "0.8em", borderRadius: 8 }}
            />
            <input
              type="number"
              min="0"
              step="0.01"
              placeholder="Price"
              value={newProductPrice}
              onChange={(e) => setNewProductPrice(e.target.value)}
              style={{ minWidth: 80, padding: "0.8em", borderRadius: 8 }}
            />
            <button className="add-btn" onClick={handleAdd}>
              Add Product
            </button>
            <button
              type="button"
              className="cancel-btn"
              onClick={() => {
                setIsAddingNew(false);
                setNewProductName("");
                setNewProductPrice("");
              }}
            >
              Cancel
            </button>
          </>
        )}
      </div>

      {/* Results counter */}
      {searchTerm && (
        <div
          style={{
            marginBottom: "1em",
            color: "#667eea",
            fontWeight: "500",
            fontSize: "0.9em",
          }}
        >
          {filteredItems.length} item{filteredItems.length !== 1 ? "s" : ""}{" "}
          found
        </div>
      )}

      {/* Table */}
      {filteredItems.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Product</th>
              <th>Price ($)</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.map((item) => (
              <tr key={item.id}>
                <td>
                  {editId === item.id ? (
                    <select
                      value={editProduct}
                      onChange={(e) => setEditProduct(e.target.value)}
                      style={{
                        minWidth: 100,
                        padding: "0.4em",
                        borderRadius: 6,
                      }}
                    >
                      {products.map((product) => (
                        <option key={product.name} value={product.name}>
                          {product.name}
                        </option>
                      ))}
                    </select>
                  ) : (
                    item.product
                  )}
                </td>
                <td>
                  {editId === item.id ? (
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={editPrice}
                      onChange={(e) => setEditPrice(Number(e.target.value))}
                      style={{
                        minWidth: 80,
                        padding: "0.4em",
                        borderRadius: 6,
                      }}
                    />
                  ) : (
                    Number(item.price).toFixed(2)
                  )}
                </td>
                <td>
                  <div className="action-buttons">
                    {editId === item.id ? (
                      <>
                        <button
                          className="save-btn"
                          onClick={() => handleSave(item.id)}
                        >
                          Save
                        </button>
                        <button
                          className="cancel-btn"
                          onClick={() => setEditId(null)}
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          className="edit-btn"
                          onClick={() => handleEdit(item)}
                          disabled={isLoading}
                        >
                          Edit
                        </button>
                        <button
                          className="delete-btn"
                          onClick={() => handleDelete(item.id)}
                          disabled={isLoading}
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="empty-state">
          {searchTerm ? (
            <>
              <h3>🔍 No items found</h3>
              <p>Try searching with different keywords or add a new item!</p>
            </>
          ) : (
            <>
              <h3>🛒 Your shopping list is empty</h3>
              <p>
                Start building your shopping list by adding your first product!
              </p>
            </>
          )}
        </div>
      )}

      {/* Item count and totals */}
      <div className="totals-box">
        <div
          style={{
            color: "#718096",
            fontSize: "0.98em",
            marginBottom: "0.5em",
          }}
        >
          {items.length} item{items.length !== 1 ? "s" : ""} in your shopping
          list
        </div>
        <div style={{ color: "#232323", fontWeight: 600 }}>
          Total: ${total.toFixed(2)} <br />
          Tax (7%): ${tax.toFixed(2)} <br />
          Grand Total: ${grandTotal.toFixed(2)}
        </div>
      </div>
    </div>
  );
}
