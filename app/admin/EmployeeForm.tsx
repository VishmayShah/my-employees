"use client";
import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Toastr from '../components/Toastr';

type EmployeeFormProps = {
  initialData?: {
    name: string;
    email: string;
    mobile: string;
    address: string;
    id?: number;
  };
};

const EmployeeForm = ({ initialData }: EmployeeFormProps) => {
  const router = useRouter();
  const params = useParams();
  const id = params?.id || 'new';
  const isNew = id === 'new';
  const [form, setForm] = useState({
    name: initialData?.name || '',
    email: initialData?.email || '',
    mobile: initialData?.mobile || '',
    address: initialData?.address || '',
    password: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState({ isVisible: false, message: '', type: 'success' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    let res;
    if (isNew) {
      res = await fetch('/api/employees', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, role: 'employee' }),
      });
    } else {
      res = await fetch('/api/employees', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: Number(id), ...form, role: 'employee' }),
      });
    }
    if (!res.ok) {
      const data = await res.json();
      setError(data.error || 'An error occurred');
      setShowToast({ isVisible: true, message: `Error ${isNew ? 'adding' : 'updating'} employee!`, type: 'error' });
      setTimeout(() => setShowToast({ isVisible: false, message: '', type: 'success' }), 3000);
      
      return;
    }
    setShowToast({ isVisible: true, message: `Successfully ${isNew ? 'added' : 'updated'} employee!`, type: 'success' });
    setTimeout(() => setShowToast({ isVisible: false, message: '', type: 'success' }), 3000);
    router.push('/admin');
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-white flex items-center justify-center min-h-[calc(100vh_-_56px)]">
      {showToast.isVisible && (
        <Toastr message={showToast.message} type={showToast.type} />
      )}
      <div className="bg-white shadow-xl rounded-xl p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">{isNew ? 'Add Employee' : 'Edit Employee'}</h1>
        {error && (
          <div className="mb-4 text-red-600 bg-red-100 border border-red-200 rounded p-2 text-center">
            {error}
          </div>
        )}
        {loading ? (
          <div className="flex justify-center items-center h-32">
            <span className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-400"></span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input name="name" value={form.name} onChange={handleChange} className="border border-blue-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" placeholder="Name" required />
            <input name="email" value={form.email} onChange={handleChange} className="border border-blue-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" placeholder="Email" required />
            <input name="mobile" value={form.mobile} onChange={handleChange} className="border border-blue-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" placeholder="Mobile" required />
            <input name="address" value={form.address} onChange={handleChange} className="border border-blue-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" placeholder="Address" required />
            <input name="password" type="password" value={form.password} onChange={handleChange} className="border border-blue-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" placeholder="Password" required={isNew} />
            <div className="flex gap-2 justify-end mt-4">
              <button type="button" onClick={() => router.push('/admin')} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition">Cancel</button>
              <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">{isNew ? 'Add' : 'Save'}</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default EmployeeForm;
