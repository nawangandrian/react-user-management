import React, { useState } from "react";

function Login({ onLogin }) {
  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");

  function handleLogin(e) {
    e.preventDefault();
    if (nama && email) {
      localStorage.setItem('loggedIn', 'true'); 
      onLogin();
    } else {
      alert("Nama dan Email wajib diisi!");
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
          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
}

export default Login;
