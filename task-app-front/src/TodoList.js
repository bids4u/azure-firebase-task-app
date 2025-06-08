import React, { useEffect, useState, useCallback } from "react";

const VALID_STATUSES = ["pending", "in-progress", "completed"];

function formatDate(isoString) {
  const date = new Date(isoString);
  return date.toLocaleString();
}

function TodoList({ idToken }) {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editTodoId, setEditTodoId] = useState(null);
  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    status: "pending",
  });

const fetchTodos = useCallback(async () => {
  if (!idToken) return;

  setLoading(true);
  setError(null);

  try {
    const res = await fetch(
      "http://localhost:7071/api/getTask",
      {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      }
    );

    if (!res.ok) throw new Error(`Failed to fetch todos (${res.status})`);
    const data = await res.json();
    setTodos(data);
  } catch (err) {
    setError(err.message || "Unknown error");
    setTodos([]);
  } finally {
    setLoading(false);
  }
}, [idToken]);


  useEffect(() => {
    fetchTodos();
  }, [idToken, fetchTodos]);

  const handleEdit = (todo) => {
    setEditTodoId(todo._id);
    setEditForm({
      title: todo.title,
      description: todo.description,
      status: todo.status,
    });
  };

  const handleUpdate = async () => {
    if (!idToken || !editTodoId) return;

    try {
      const res = await fetch(
        `http://localhost:7071/api/updateTask/${editTodoId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${idToken}`,
          },
          body: JSON.stringify(editForm),
        }
      );

      if (!res.ok) throw new Error("Failed to update todo");

      setEditTodoId(null);
      await fetchTodos();
    } catch (err) {
      console.error(err);
      alert("Error updating todo");
    }
  };

  if (!idToken) return <div>Please sign in to see your todos.</div>;
  if (loading) return <div>Loading todos...</div>;

  if (error) {
    return (
      <div>
        <p style={{ color: "red" }}>Error: {error}</p>
        <button onClick={fetchTodos}>Try Again</button>
      </div>
    );
  }

  const getTodosByStatus = (status) =>
    todos.filter((todo) => todo.status === status);

  return (
    <div>
      <h2>Your Todo List</h2>
      <button onClick={fetchTodos} style={{ marginBottom: 10 }}>
        Refresh Todos
      </button>

      <div style={styles.gridContainer}>
        {VALID_STATUSES.map((status) => (
          <div key={status} style={styles.column}>
            <h3 style={{ textTransform: "capitalize" }}>{status}</h3>
            {getTodosByStatus(status).map(
              ({ _id, title, description, createdAt }) => (
                <div key={_id} style={styles.card(status)}>
                  {editTodoId === _id ? (
                    <>
                      <input
                        value={editForm.title}
                        onChange={(e) =>
                          setEditForm({ ...editForm, title: e.target.value })
                        }
                        placeholder="Title"
                      />
                      <textarea
                        value={editForm.description}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            description: e.target.value,
                          })
                        }
                        placeholder="Description"
                        rows={2}
                      />
                      <select
                        value={editForm.status}
                        onChange={(e) =>
                          setEditForm({ ...editForm, status: e.target.value })
                        }
                      >
                        {VALID_STATUSES.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                      <br />
                      <button onClick={handleUpdate}>Save</button>
                      <button onClick={() => setEditTodoId(null)}>
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <h4>{title}</h4>
                      <p>{description}</p>
                      <small>Created at: {formatDate(createdAt)}</small>
                      <br />
                      <button
                        onClick={() =>
                          handleEdit({ _id, title, description, status })
                        }
                      >
                        Edit
                      </button>
                    </>
                  )}
                </div>
              )
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  gridContainer: {
    display: "flex",
    flexWrap: "wrap",
    gap: "1rem",
    marginTop: "1rem",
  },
  column: {
    flex: "1 1 100%", // full width mobile
    maxWidth: "100%",
  },
  card: (status) => ({
    border: "1px solid #ccc",
    borderRadius: 6,
    padding: "1rem",
    marginBottom: "1rem",
    backgroundColor:
      status === "pending"
        ? "#fff3cd"
        : status === "in-progress"
        ? "#cce5ff"
        : "#d4edda",
  }),
};

// Responsive media query
const mediaQuery = window.matchMedia("(min-width: 768px)");
if (mediaQuery.matches) {
  styles.column.flex = "1 1 30%";
  styles.column.maxWidth = "30%";
}

export default TodoList;
