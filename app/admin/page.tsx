import EmployeeList from './EmployeeList';
import { FetchEmployees } from '../api/employees/route';
import AddNewEmployee from './AddNewEmployee';
export default async function AdminPage() {
  const initialSort = 'name';
  const initialSortDirection = 'asc';
  const initialPageIndex = 0;
  const initialPageSize = 10;
  const employees = await FetchEmployees(initialPageIndex + 1, initialPageSize, initialSort, initialSortDirection);
  return (
    <div className="bg-gradient-to-br from-gray-50 to-white flex items-center justify-center min-h-[calc(100vh_-_56px)]">
      <div className="bg-white rounded-xl p-4 w-full min-h-[calc(100vh_-_60px)]">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Manage Employees</h1>
          <AddNewEmployee/>
        </div>
        <EmployeeList initialData={employees.employees}
          total={employees.total}
          initialSort={initialSort}
          initialSortDirection={initialSortDirection}
          initialPageIndex={initialPageIndex}
          initialPageSize={initialPageSize} />
      </div>
    </div>
  );
}
