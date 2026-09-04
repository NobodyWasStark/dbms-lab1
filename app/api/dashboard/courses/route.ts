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

    // Live Query: Fetch independent sample course catalog
    const courses = await prisma.course.findMany({
      orderBy: {
        code: 'asc',
      },
    });

    return NextResponse.json({
      courses,
      count: courses.length,
      rawQuery: 'SELECT id, title, code, credits, description FROM "Course" ORDER BY "code" ASC;',
    });
  } catch (error) {
    console.error('Courses API error:', error);
    return NextResponse.json({ error: 'Failed to retrieve course list' }, { status: 500 });
  }
}
