'use client';
import { useRouter } from 'next/navigation';

export default function AddNewEmployee() {
    const router = useRouter();
    return (
        <button
            className="px-6 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition font-semibold"
            onClick={() => router.push('/admin/employee/new')}
        >
            + Add Employee
        </button>
    );
}