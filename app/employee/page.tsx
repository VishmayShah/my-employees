import { prisma } from '@/lib/prisma';
import EmployeeProfile from './EmployeeProfile';
import { decodeToken } from '@/middleware';
import { cookies } from 'next/headers';

export default async function EmployeePage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  const user = token ? await decodeToken(token) : null;
  const isEditMode=false;
  let employee;
  if (user) {
    employee = await prisma.employee.findUnique({ where: { userId: user.id as number } });
  }
  return (
    <div className="bg-gradient-to-br from-blue-50 to-white flex items-center justify-center min-h-[calc(100vh_-_56px)]">
      <div className="bg-white shadow-xl rounded-xl p-8 max-w-md w-full">
        <div className="flex flex-col items-center mb-6">
          <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center mb-2">
            <svg className="w-12 h-12 text-blue-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5.121 17.804A13.937 13.937 0 0112 15c2.5 0 4.847.657 6.879 1.804M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-800">My Profile</h1>
        </div>
        {employee ? (
      
          <EmployeeProfile employee={employee} />

        ) : (
          <div className="text-center text-gray-500">No employee data found.</div>
        )}
      </div>
    </div>
  );
}
