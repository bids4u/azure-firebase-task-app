import React, { useState } from "react";

function AddTodo({ idToken, onTodoAdded }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("Title is required");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("https://azure-firebase-task-app.azurewebsites.net/api/createTask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({ title, description }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to add todo");
      }

      setTitle("");
      setDescription("");
      if (onTodoAdded) onTodoAdded();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        maxWidth: 500,
        padding: "1rem",
        border: "1px solid #ddd",
        borderRadius: 8,
        backgroundColor: "#f9f9f9",
        boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
      }}
    >
      <h3 style={{ marginBottom: 12 }}>Add New Todo</h3>

      <div style={{ marginBottom: 10 }}>
        <label style={{ display: "block", marginBottom: 4 }}>
          Title <span style={{ color: "red" }}>*</span>
        </label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter task title"
          required
          style={{
            width: "100%",
            padding: 8,
            borderRadius: 4,
            border: "1px solid #ccc",
          }}
        />
      </div>

      <div style={{ marginBottom: 10 }}>
        <label style={{ display: "block", marginBottom: 4 }}>
          Description
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Optional details about the task"
          rows={3}
          style={{
            width: "100%",
            padding: 8,
            borderRadius: 4,
            border: "1px solid #ccc",
            resize: "vertical",
          }}
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        style={{
          backgroundColor: loading ? "#ccc" : "#007bff",
          color: "#fff",
          padding: "8px 16px",
          border: "none",
          borderRadius: 4,
          cursor: loading ? "not-allowed" : "pointer",
        }}
      >
        {loading ? "Adding..." : "Add Todo"}
      </button>

      {error && (
        <p style={{ color: "red", marginTop: 10, fontSize: "0.9rem" }}>
          {error}
        </p>
      )}
    </form>
  );
}

export default AddTodo;
