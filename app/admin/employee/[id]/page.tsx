import EmployeeForm from '../../EmployeeForm';
import { prisma } from '@/lib/prisma';

export default async function EditEmployeePage({ params }: { params: { id: string } }) {
  const id = Number(params.id);
  const employee = await prisma.employee.findUnique({ where: { id } });
  // If not found, you could redirect or show a not found message
  if(!employee) return <div>Employee not found</div>;
  return <EmployeeForm initialData={employee} />;
}
