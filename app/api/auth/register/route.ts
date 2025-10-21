import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';


export async function POST(req: NextRequest) {
  const { name, email, password, mobile, address, role } = await req.json();
  if (!name || !email || !password || !mobile || !address || !role) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword, mobile, address, role },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: 'User already exists or DB error' }, { status: 400 });
  }
}
