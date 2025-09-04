import React, { useState } from 'react'
import { useAuth } from './AuthContext'
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {

  const { login } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      await login(email, password);
      nav("/app", { replace: true });
    } catch (err) {
      setError(err.message || "Login failed" );
    }
  }

  return (
     <div className="min-h-screen grid place-items-center px-4">
      
      <form onSubmit={onSubmit} className="glass w-full max-w-sm p-6">
        <div className='text-center'>
        <img src="https://cdn-icons-png.flaticon.com/512/9227/9227549.png" alt="Logo" className="h-16 w-16 mb-4 mx-auto" />
        <h2 className="text-3xl font-bold text-center mb-6">Yaadrakho</h2>
      </div>
        <h1 className="text-2xl font-semibold mb-6">Welcome back</h1>
        {error && <p className="text-red-600 mb-3">{error}</p>}
        <input className="w-full mb-3 input" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input className="w-full mb-3 input" placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
        <button className="w-full py-2 rounded-xl bg-black text-white">Login</button>
        <p className="mt-3 text-sm text-center">No account? <Link className="underline" to="/signup">Sign up</Link></p>
      </form>
    </div>
  )
}

export default Login
