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

    // Live PostgreSQL Aggregate Queries
    const [totalUsers, totalCourses] = await Promise.all([
      prisma.user.count(),
      prisma.course.count(),
    ]);

    return NextResponse.json({
      totalUsers,
      totalCourses,
      timestamp: new Date().toISOString(),
      rawQuery: {
        usersCountSql: 'SELECT COUNT(*) FROM "User";',
        coursesCountSql: 'SELECT COUNT(*) FROM "Course";',
      },
    });
  } catch (error) {
    console.error('Stats API error:', error);
    return NextResponse.json({ error: 'Failed to retrieve stats' }, { status: 500 });
  }
}
