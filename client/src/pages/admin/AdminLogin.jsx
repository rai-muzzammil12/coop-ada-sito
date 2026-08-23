import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function AdminLogin() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const redirectTo = location.state?.from?.pathname || '/admin';

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(email, password);
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="admin-login">
      <form className="admin-login__card" onSubmit={handleSubmit}>
        <h1>Accesso amministratore</h1>
        <p className="admin-login__sub">COOP ADA — pannello di gestione contenuti</p>

        <label htmlFor="email">Email</label>
        <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} autoFocus />

        <label htmlFor="password">Password</label>
        <input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />

        {error && <p className="admin-login__error" role="alert">{error}</p>}

        <button className="btn btn-primary" type="submit" disabled={loading}>
          {loading ? 'Accesso in corso…' : 'Accedi'}
        </button>
      </form>
    </div>
  );
}
