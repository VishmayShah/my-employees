import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { SignJWT } from 'jose'


export async function POST(req: NextRequest) {
  const { email, password } = await req.json();
  if (!email || !password) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    console.log("User not found");
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    console.log("Password:", password);
    console.log("Hashed Password:", user.password);
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }
  const token = await new SignJWT({ id: user.id, role: user.role })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('2h')
    .sign(new TextEncoder().encode(process.env.JWT_SECRET));
  const response = NextResponse.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  response.cookies.set('token', token, {
    httpOnly: true,
    secure: false,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60,
  });

  return response;
}
