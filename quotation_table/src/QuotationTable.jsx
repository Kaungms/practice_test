import { useState } from "react";

export default function QuotationTable() {
  const [quotes, setQuotes] = useState([
    {
      id: 1,
      author: "Albert Einstein",
      text: "Imagination is more important than knowledge.",
    },
    {
      id: 2,
      author: "Oscar Wilde",
      text: "Be yourself; everyone else is already taken.",
    },
  ]);
  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState("");
  const [editAuthor, setEditAuthor] = useState("");

  // Add these states for the add form
  const [newAuthor, setNewAuthor] = useState("");
  const [newText, setNewText] = useState("");

  const handleEdit = (quote) => {
    setEditId(quote.id);
    setEditText(quote.text);
    setEditAuthor(quote.author);
  };

  const handleSave = (id) => {
    setQuotes(
      quotes.map((q) =>
        q.id === id ? { ...q, text: editText, author: editAuthor } : q
      )
    );
    setEditId(null);
  };

  const handleDelete = (id) => {
    setQuotes(quotes.filter((q) => q.id !== id));
  };

  // Add this function to handle adding a new quote
  const handleAdd = () => {
    if (newAuthor.trim() && newText.trim()) {
      setQuotes([
        ...quotes,
        {
          id: quotes.length ? Math.max(...quotes.map((q) => q.id)) + 1 : 1,
          author: newAuthor,
          text: newText,
        },
      ]);
      setNewAuthor("");
      setNewText("");
    }
  };

  return (
    <div className="quotation-table">
      <h1>Quotation Table</h1>
      {/* Add Quote Form */}
      <div style={{ marginBottom: "1em" }}>
        <input
          placeholder="Author"
          value={newAuthor}
          onChange={(e) => setNewAuthor(e.target.value)}
        />
        <input
          placeholder="Quote"
          value={newText}
          onChange={(e) => setNewText(e.target.value)}
        />
        <button onClick={handleAdd}>Add Quote</button>
      </div>
      <table>
        <thead>
          <tr>
            <th>Author</th>
            <th>Quote</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {quotes.map((quote) => (
            <tr key={quote.id}>
              <td>
                {editId === quote.id ? (
                  <input
                    value={editAuthor}
                    onChange={(e) => setEditAuthor(e.target.value)}
                  />
                ) : (
                  quote.author
                )}
              </td>
              <td>
                {editId === quote.id ? (
                  <input
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                  />
                ) : (
                  quote.text
                )}
              </td>
              <td>
                {editId === quote.id ? (
                  <>
                    <button onClick={() => handleSave(quote.id)}>Save</button>
                    <button onClick={() => setEditId(null)}>Cancel</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => handleEdit(quote)}>Edit</button>
                    <button onClick={() => handleDelete(quote.id)}>
                      Delete
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
