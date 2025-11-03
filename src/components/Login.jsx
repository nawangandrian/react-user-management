import React, { useState } from "react";
import axios from "axios";

function Login({ onLogin }) {
  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL;

  async function handleLogin(e) {
    e.preventDefault();

    if (!nama || !email) {
      alert("Nama dan Email wajib diisi!");
      return;
    }

    setLoading(true);

    try {
      // Ambil semua data user
      const response = await axios.get(`${API_URL}/person`);
      const users = response.data;

      // Cek apakah ada user yang cocok
      const matchedUser = users.find(
        (user) =>
          user.nama.toLowerCase() === nama.toLowerCase() &&
          user.email.toLowerCase() === email.toLowerCase()
      );
      const matchedNama = users.find(user => user.nama.toLowerCase() === nama.toLowerCase());
      const matchedEmail = users.find(user => user.email.toLowerCase() === email.toLowerCase());

      if (matchedUser) {
        // Login berhasil
        localStorage.setItem("loggedIn", "true");
        onLogin();
      } else if (!matchedNama) {
        alert("Nama tidak ditemukan!");
      } else if (!matchedEmail) {
        alert("Email tidak ditemukan!");
      } else {
        alert("Nama dan Email tidak cocok!");
      }
    } catch (error) {
      console.error("Error saat login:", error);
      alert("Terjadi kesalahan saat login. Coba lagi nanti.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-jumbotron">
          <h1>Selamat Datang!</h1>
          <p>Masuk untuk mengelola data pengguna</p>
        </div>

        <form className="login-form" onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Nama"
            value={nama}
            onChange={(e) => setNama(e.target.value)}
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button type="submit" disabled={loading}>
            {loading ? "Memeriksa..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
