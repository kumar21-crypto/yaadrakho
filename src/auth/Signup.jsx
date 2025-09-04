import React, { useState } from 'react'
import { useAuth } from './AuthContext'
import { useNavigate } from 'react-router-dom';

const Signup = () => {

  const { signup } = useAuth();
  const nav = useNavigate();
  const [name, setName]  = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      await signup(email, password, name);
      nav("/app", { replace: true });
    } catch (err) {
      setError(err.message) || "Signup failed. Please try again.";
    }
  }

  return (
     <div className="min-h-screen grid place-items-center px-4">
      <form onSubmit={handleSubmit} className="glass w-full max-w-sm p-6">
        <h1 className="text-2xl font-semibold mb-6">Create account</h1>
        {error && <p className="text-red-600 mb-3">{error}</p>}
        <input className="w-full mb-3 input" placeholder="Name" value={name} onChange={e=>setName(e.target.value)} />
        <input className="w-full mb-3 input" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input className="w-full mb-3 input" placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
        <button className="w-full py-2 rounded-xl bg-black text-white">Sign up</button>
      </form>
    </div>
  )
}

export default Signup
