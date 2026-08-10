import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import styles from '../styles/AdminDashboard.module.css';

export default function AdminDashboard() {
  const router = useRouter();
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [cierres, setCierres] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const isAuth = localStorage.getItem('adminAuth') === 'true';
    if (isAuth) {
      setAuthenticated(true);
      fetchCierres();
    } else {
      setLoading(false);
    }
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === 'admin3b89a297cb') {
      localStorage.setItem('adminAuth', 'true');
      setAuthenticated(true);
      fetchCierres();
    } else {
      alert('Contraseña incorrecta');
    }
  };

  const fetchCierres = async () => {
    try {
      const response = await fetch('/api/cierres');
      const data = await response.json();
      setCierres(data || []);
    } catch (error) {
      console.error('Error fetching cierres:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminAuth');
    setAuthenticated(false);
  };

  if (loading) return <div>Cargando...</div>;

  if (!authenticated) {
    return (
      <div className={styles.authContainer}>
        <div className={styles.authBox}>
          <h2>Acceso Restringido</h2>
          <form onSubmit={handleLogin}>
            <input
              type="password"
              className={styles.authInput}
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button type="submit" className={styles.authBtn}>
              Entrar
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Dashboard de Cierres de Turno</h1>
        <button onClick={handleLogout} className={styles.logoutBtn}>
          Salir
        </button>
      </div>

      <div className={styles.kpiGrid}>
        <div className={styles.kpiCard}>
          <div className={styles.kpiValue}>{cierres.length}</div>
          <div className={styles.kpiLabel}>Total de Cierres</div>
        </div>
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Mindori</th>
              <th>Sucursal</th>
              <th>Fecha</th>
              <th>Hora</th>
            </tr>
          </thead>
          <tbody>
            {cierres.map((cierre) => (
              <tr key={cierre.id}>
                <td>{cierre.id}</td>
                <td>{cierre.mindori_id}</td>
                <td>{cierre.sucursal}</td>
                <td>{new Date(cierre.fecha).toLocaleDateString()}</td>
                <td>{cierre.hora}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
