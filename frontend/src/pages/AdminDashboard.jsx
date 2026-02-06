import { useEffect, useState } from "react";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    // Dummy data
    const dummyUsers = [
      { _id: "1", name: "Ashish", email: "ashish@example.com" },
      { _id: "2", name: "Riya", email: "riya@example.com" },
    ];

    const dummyBlogs = [
      { _id: "101", title: "React Basics" },
      { _id: "102", title: "Understanding useEffect" },
    ];

    setUsers(dummyUsers);
    setBlogs(dummyBlogs);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-10">
        Admin Dashboard
      </h1>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Users</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {users.map((u) => (
            <div
              key={u._id}
              className="bg-white p-4 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300"
            >
              <h3 className="text-lg font-bold text-gray-800">{u.name}</h3>
              <p className="text-gray-500">{u.email}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Blogs</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {blogs.map((b) => (
            <div
              key={b._id}
              className="bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-white p-4 rounded-xl shadow-lg hover:scale-105 transition-transform duration-300"
            >
              <h3 className="text-lg font-semibold">{b.title}</h3>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
