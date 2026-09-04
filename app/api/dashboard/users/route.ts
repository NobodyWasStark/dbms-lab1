import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { verifyToken, AUTH_COOKIE_NAME } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get(AUTH_COOKIE_NAME)?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized access' }, { status: 401 });
    }

    const payload = await verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: 'Invalid or expired session' }, { status: 401 });
    }

    // Live Query: Fetch all users ordered by creation date descending
    // Note: Exclude passwordHash from projection for security
    const users = await prisma.user.findMany({
      select: {
        id: true,
        fullName: true,
        email: true,
        phone: true,
        gender: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({
      users,
      count: users.length,
      rawQuery: 'SELECT id, "fullName", email, phone, gender, "createdAt" FROM "User" ORDER BY "createdAt" DESC;',
    });
  } catch (error) {
    console.error('Users API error:', error);
    return NextResponse.json({ error: 'Failed to retrieve user list' }, { status: 500 });
  }
}
