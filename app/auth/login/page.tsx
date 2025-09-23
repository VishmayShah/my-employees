'use client';
import { useState } from 'react';
import Link from 'next/link';
import {  useRouter  } from 'next/navigation';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setLoading(false);
    if (data.token && data.user) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      window.dispatchEvent(new Event('userUpdated'));

      if (data.user.role === 'admin') {
        router.push('/admin');
      } else {
        router.push('/employee');
      }
    } else {
      setError(data.error || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-1 font-semibold">Email</label>
            <input name="email" type="email" className="w-full border rounded px-3 py-2" value={form.email} onChange={handleChange} required />
          </div>
          <div className="mb-6">
            <label className="block mb-1 font-semibold">Password</label>
            <input name="password" type="password" className="w-full border rounded px-3 py-2" value={form.password} onChange={handleChange} required />
          </div>
          {error && <div className="text-red-600 mb-2">{error}</div>}
          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <div className="mt-4 text-center">
          <Link href="/auth/register" className="text-blue-600 hover:underline">Register</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
