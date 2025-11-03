import React from 'react';

function Navbar({ onLogout, isLoggedIn }) {
  return (
    <nav className="navbar">
      <div className="nav-logo">👥 Data Pengguna</div>
      <div className="nav-links">
        {isLoggedIn ? (
          <button className="logout-btn" onClick={onLogout}>Logout</button>
        ) : null}
      </div>
    </nav>
  );
}

export default Navbar;
