import React, { useEffect, useState } from 'react';
import './App.css';
import axios from 'axios';
import Navbar from './components/Navbar';
import Header from './components/Header';
import Footer from './components/Footer';
import Login from './components/Login';

function App() {
  const [users, setUsers] = useState([]);
  const [nama, setNama] = useState('');
  const [email, setEmail] = useState('');
  const [kota, setKota] = useState('');
  const [usia, setUsia] = useState('');
  const [gender, setGender] = useState('L');
  const [editId, setEditId] = useState(null);
  const [loggedIn, setLoggedIn] = useState(() => {
    return localStorage.getItem('loggedIn') === 'true';
  });
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (loggedIn) getAllData();
  }, [loggedIn]);

  async function getAllData() {
    try {
      const response = await axios.get(`${API_URL}/person`);
      // langsung pakai response.data jika backend mengembalikan array
      setUsers(response.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!nama || !email || !kota || !usia || !gender)
      return alert('Semua field wajib diisi!');
    try {
      const payload = { nama, email, kota, usia, gender };
      if (editId) {
        await axios.put(`${API_URL}/person/${editId}`, payload);
        setEditId(null);
      } else {
        await axios.post(`${API_URL}/person`, payload);
      }
      setNama('');
      setEmail('');
      setKota('');
      setUsia('');
      setGender('L');
      getAllData();
    } catch (error) {
      console.error('Error saving data:', error);
    }
  }

  async function deleteUser(id) {
    if (!window.confirm('Yakin ingin menghapus pengguna ini?')) return;
    try {
      await axios.delete(`${API_URL}/person/${id}`);
      getAllData();
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  }

  function editUser(user) {
    setNama(user.nama);
    setEmail(user.email);
    setKota(user.kota || '');
    setUsia(user.usia || '');
    setGender(user.gender || 'L');
    setEditId(user.id);
  }

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Hitung jumlah halaman
  const totalPages = Math.ceil((users || []).length / itemsPerPage);

  // Ambil data yang ditampilkan di halaman sekarang
  const currentUsers = (users || []).slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (!loggedIn) return <Login onLogin={() => setLoggedIn(true)} />;

  return (
    <>
        <Navbar onLogout={() => {
          localStorage.removeItem('loggedIn'); // hapus status login
          setLoggedIn(false);
        }} isLoggedIn={loggedIn} />
      <div className="wrapper">
        <Header />
        <div className="header">
          <h3>{editId ? 'Edit Pengguna' : 'Tambah Pengguna'}</h3>
          <form className="input-box" onSubmit={handleSubmit}>
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
            <input
              type="text"
              placeholder="Kota"
              value={kota}
              onChange={(e) => setKota(e.target.value)}
            />
            <input
              type="number"
              placeholder="Usia"
              value={usia}
              onChange={(e) => setUsia(e.target.value)}
            />
            <select value={gender} onChange={(e) => setGender(e.target.value)}>
              <option value="L">Laki-laki</option>
              <option value="P">Perempuan</option>
            </select>
            <button type="submit">{editId ? 'Update' : 'Simpan'}</button>
          </form>
        </div>

        <div className="data-pengguna">
          <h3>Data Pengguna</h3>
          <table>
            <thead>
              <tr>
                <th>Nama</th>
                <th>Email</th>
                <th>Kota</th>
                <th>Usia</th>
                <th>Gender</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {currentUsers.map((user) => (
                <tr key={user.id}>
                  <td>{user.nama}</td>
                  <td>{user.email}</td>
                  <td>{user.kota}</td>
                  <td>{user.usia}</td>
                  <td>{user.gender === 'L' ? 'Laki-laki' : 'Perempuan'}</td>
                  <td>
                    <a href="#" className="edit" onClick={() => editUser(user)}>Edit</a> |{' '}
                    <a href="#" className="delete" onClick={() => deleteUser(user.id)}>Delete</a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {totalPages > 1 && (
            <div className="pagination">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  className={currentPage === i + 1 ? 'active' : ''}
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </div>
        <Footer />
      </div>
    </>
  );
}

export default App;
