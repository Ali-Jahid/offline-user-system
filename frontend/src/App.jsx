
import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [users, setUsers] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [age, setAge] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");

  const API_URL = "http://localhost:5000/users";

  // دریافت کاربران
  const fetchUsers = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      setUsers(data);
    } catch (error) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // پاک کردن فرم
  const resetForm = () => {
    setName("");
    setEmail("");
    setAge("");
    setEditingId(null);
  };

  // ثبت یا ویرایش کاربر
  const handleSubmit = async (e) => {
    e.preventDefault();

    const userData = {
      name,
      email,
      age: age ? Number(age) : undefined
    };

    try {
      const response = await fetch(
        editingId ? `${API_URL}/${editingId}` : API_URL,
        {
          method: editingId ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(userData)
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      alert(
        editingId
          ? "User updated successfully!"
          : "User created successfully!"
      );

      resetForm();
      fetchUsers();

    } catch (error) {
      alert(error.message);
    }
  };

  // آماده‌کردن اطلاعات برای ویرایش
  const handleEdit = (user) => {
    setEditingId(user._id);
    setName(user.name);
    setEmail(user.email);
    setAge(user.age ?? "");
  };

  // حذف کاربر
  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this user?"
    );

    if (!confirmed) return;

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE"
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      alert("User deleted successfully!");
      fetchUsers();

      if (editingId === id) {
        resetForm();
      }

    } catch (error) {
      alert(error.message);
    }
  };

  // user filter
  const filteredUsers = users.filter((user) => {
  return (
    user.name.toLowerCase().includes(search.toLowerCase()) ||
    user.email.toLowerCase().includes(search.toLowerCase())
  );
});

  return (
    <div className="container">
      <header>
        <h1>User Management System</h1>
        <p>Offline User Management Dashboard</p>
      </header>

      <section className="form-section">
        <h2>
          {editingId ? "Edit User" : "Add New User"}
        </h2>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="number"
            placeholder="Age"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            min="1"
          />

          <button type="submit">
            {editingId ? "Update User" : "Add User"}
          </button>

          {editingId && (
            <button
              type="button"
              className="cancel-btn"
              onClick={resetForm}
            >
              Cancel
            </button>
          )}
        </form>
      </section>

      <section className="users-section">
        <h2>Registered Users ({filteredUsers.length})</h2>
        <input
          type="text"
          placeholder="Search users by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Age</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user._id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.age ?? "-"}</td>

                <td>
                  <button
                    className="edit-btn"
                    onClick={() => handleEdit(user)}
                  >
                    Edit
                  </button>

                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(user._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {users.length === 0 && (
          <p className="empty">No users found.</p>
        )}
      </section>
    </div>
  );
}

export default App;
