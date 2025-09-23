'use client'
import { useEffect, useState } from 'react';
import Toastr from '../components/Toastr';


type Employee = { id?: number; name: string; email: string; mobile: string; address: string };
type EmployeeProfileProps = { employee: Employee; };

const EmployeeProfile = ({ employee }: EmployeeProfileProps) => {
  const [editMode, setEditMode] = useState(false);
  const [employeeData, setEmployeeData] = useState<Employee>(employee);
  const [form, setForm] = useState<Employee>(employee);
  const [showToast, setShowToast] = useState({ isVisible: false, message: '', type: 'success' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    // Optionally, update on server as well
    const res=await fetch('/api/employees', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: form.id, ...form }),
    });
     if (!res.ok) {
      setShowToast({ isVisible: true, message: `Error updating employee!`, type: 'error' });
      setTimeout(() => setShowToast({ isVisible: false, message: '', type: 'success' }), 3000);
      return;
    }
    setShowToast({ isVisible: true, message: `Successfully updated employee!`, type: 'success' });
    setTimeout(() => setShowToast({ isVisible: false, message: '', type: 'success' }), 3000);
    setEmployeeData(form);
    setEditMode(false);
  };

  const handleCancel = async (e: React.FormEvent) => {
    e.preventDefault();
    setForm(employeeData);
    setEditMode(false);
  };
  return editMode ? (
    <form onSubmit={handleSave} className="flex flex-col gap-4">
      <input name="name" value={form.name} onChange={handleChange} className="border border-blue-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" placeholder="Name" required />
      <input name="email" value={form.email} onChange={handleChange} className="border border-blue-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" placeholder="Email" required />
      <input name="mobile" value={form.mobile} onChange={handleChange} className="border border-blue-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" placeholder="Mobile" required />
      <input name="address" value={form.address} onChange={handleChange} className="border border-blue-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" placeholder="Address" required />
      <div className="flex gap-2 justify-end mt-4">
        <button type="button" onClick={handleCancel} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition">Cancel</button>
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">Save</button>
      </div>
    </form>
  ) : (
    <>
      <div className="flex flex-col gap-3 w-full max-w-md bg-white p-4 rounded-md shadow-sm">
            <div className="flex items-start">
              <span className="w-24 shrink-0 font-medium text-gray-600">Name:</span>
              <span className="text-gray-900 break-words">{employeeData.name}</span>
            </div>
            <div className="flex items-start">
              <span className="w-24 shrink-0 font-medium text-gray-600">Email:</span>
              <span className="text-gray-900 break-words">{employeeData.email}</span>
            </div>
            <div className="flex items-start">
              <span className="w-24 shrink-0 font-medium text-gray-600">Mobile:</span>
              <span className="text-gray-900">{employeeData.mobile}</span>
            </div>
            <div className="flex items-start">
              <span className="w-24 shrink-0 font-medium text-gray-600">Address:</span>
              <span className="text-gray-900 break-words">{employeeData.address}</span>
            </div>
      </div>
      <button onClick={() => setEditMode(true)} className="mt-6 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition w-full">Edit</button>
      {showToast.isVisible && (
        <Toastr message={showToast.message} type={showToast.type} />
      )}
    </>
  );
};

export default EmployeeProfile;
