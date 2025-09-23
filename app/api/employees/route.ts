import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function FetchEmployees(page:number, pageSize:number, sort:string, order:'asc'|'desc') {
  return {
    employees:await prisma.employee.findMany({
      orderBy: { [sort]: order },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    total: await prisma.employee.count()
  }
}
export async function GET(req: NextRequest) {
  const url = req.nextUrl;
  const page = url.searchParams.get('page');
  const pageSize = url.searchParams.get('pageSize');
  let sort = url.searchParams.get('sort');
  sort = sort || 'name';
  const order = url.searchParams.get('order');
  if (!page || !pageSize || !sort || !order || (order !== 'asc' && order !== 'desc')) {
    return NextResponse.json({ error: 'Missing query parameters' }, { status: 400 });
  }
  const employees = await FetchEmployees(+page, +pageSize, sort, order);
  return NextResponse.json(employees);
}

export async function POST(req: NextRequest) {
  const { name, email, mobile, address, password, role } = await req.json();
  if (!name || !email || !mobile || !address || !password || !role) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    // Create user first
    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword, mobile, address, role },
    });
    // Then create employee linked to userId
    const employee = await prisma.employee.create({
      data: { name, email, mobile, address, userId: user.id },
    });
    return NextResponse.json(employee);
  } catch (err) {
    return NextResponse.json({ error: 'DB error' }, { status: 400 });
  }
}

export async function PUT(req: NextRequest) {
  const { id, name, email, mobile, address, password, role } = await req.json();
  if (!id || !name || !email || !mobile || !address) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }
  try {
    // Find employee
    const employeeFound = await prisma.employee.findUnique({ where: { id } });
    if (!employeeFound) {
      return NextResponse.json({ error: 'Employee not found' }, { status: 404 });
    }
    // Update employee
    const employee = await prisma.employee.update({
      where: { id },
      data: { name, email, mobile, address },
    });
    // Update related user
    const userUpdateData: any = { name, email, mobile, address };
    if (password){
      const hashedPassword = await bcrypt.hash(password, 10);
      userUpdateData.password = hashedPassword;
    }

    await prisma.user.update({
      where: { id: employeeFound.userId },
      data: userUpdateData,
    });
    return NextResponse.json(employee);
  } catch (err) {
    return NextResponse.json({ error: 'DB error' }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest) {
  const { id } = await req.json();
  if (!id) {
    return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  }
  try {
    await prisma.employee.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: 'DB error' }, { status: 400 });
  }
}
