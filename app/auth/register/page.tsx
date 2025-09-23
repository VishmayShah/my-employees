'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Toastr from '@/app/components/Toastr';

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', mobile: '', address: '', role: 'employee', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const [showToast, setShowToast] = useState({ isVisible: false, message: '', type: 'success' });
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setLoading(false);
    if (data.success) {
      setShowToast({ isVisible: true, message: `Successfully registered user!`, type: 'success' });
      setTimeout(() => {setShowToast({ isVisible: false, message: '', type: 'success' });
     router.push('/auth/login');}, 3000);
     
    } else {
      setError(data.error || 'Registration failed');
      setTimeout(() => setShowToast({ isVisible: false, message: '', type: 'success' }), 3000);
      setShowToast({ isVisible: true, message: `Error registering user!`, type: 'error' });
    }
  };

  return (
    <>
      {showToast.isVisible && (
        <Toastr message={showToast.message} type={showToast.type} />
      )}
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-1 font-semibold">Name</label>
            <input name="name" type="text" className="w-full border rounded px-3 py-2" value={form.name} onChange={handleChange} required />
          </div>
          <div className="mb-4">
            <label className="block mb-1 font-semibold">Email</label>
            <input name="email" type="email" className="w-full border rounded px-3 py-2" value={form.email} onChange={handleChange} required />
          </div>
          <div className="mb-4">
            <label className="block mb-1 font-semibold">Mobile No.</label>
            <input name="mobile" type="text" className="w-full border rounded px-3 py-2" value={form.mobile} onChange={handleChange} required />
          </div>
          <div className="mb-4">
            <label className="block mb-1 font-semibold">Address</label>
            <input name="address" type="text" className="w-full border rounded px-3 py-2" value={form.address} onChange={handleChange} required />
          </div>
          <div className="mb-4">
            <label className="block mb-1 font-semibold">Password</label>
            <input name="password" type="password" className="w-full border rounded px-3 py-2" value={form.password} onChange={handleChange} required />
          </div>
          <div className="mb-6">
            <label className="block mb-1 font-semibold">Role</label>
            <select name="role" className="w-full border rounded px-3 py-2" value={form.role} onChange={handleChange} required>
              <option value="admin">Admin</option>
              <option value="employee">Employee</option>
            </select>
          </div>
          {error && <div className="text-red-600 mb-2">{error}</div>}
          <button type="submit" className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700" disabled={loading}>
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>
        <div className="mt-4 text-center">
          <Link href="/auth/login" className="text-blue-600 hover:underline">Back to Login</Link>
        </div>
      </div>
    </div>
    
      </>
  );
};

export default Register;
