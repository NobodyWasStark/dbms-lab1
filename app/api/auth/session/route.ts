import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { verifyToken, AUTH_COOKIE_NAME } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get(AUTH_COOKIE_NAME)?.value;

    if (!token) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    const payload = await verifyToken(token);
    if (!payload) {
      const response = NextResponse.json({ user: null }, { status: 401 });
      response.cookies.set({
        name: AUTH_COOKIE_NAME,
        value: '',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 0,
        path: '/',
      });
      return response;
    }

    // Fetch up-to-date user details from PostgreSQL (excluding passwordHash)
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: {
        id: true,
        fullName: true,
        email: true,
        phone: true,
        gender: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      // User from previous database/session not found in current database
      const response = NextResponse.json({ user: null }, { status: 401 });
      response.cookies.set({
        name: AUTH_COOKIE_NAME,
        value: '',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 0,
        path: '/',
      });
      return response;
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error('Session API error:', error);
    return NextResponse.json({ user: null, error: 'Internal server error' }, { status: 500 });
  }
}
