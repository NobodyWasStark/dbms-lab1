import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { comparePassword, signToken, AUTH_COOKIE_NAME } from '@/lib/auth';
import { loginSchema } from '@/lib/validation';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // 1. Zod Validation
    const validationResult = loginSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: validationResult.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { email, password, rememberMe } = validationResult.data;

    // 2. Look up user by email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    // 3. Generic error if user not found (security best practice against account enumeration)
    if (!user) {
      return NextResponse.json(
        {
          error: 'Invalid email or password. Please try again.',
        },
        { status: 401 }
      );
    }

    // 4. Compare bcrypt password hash
    const isPasswordValid = await comparePassword(password, user.passwordHash);
    if (!isPasswordValid) {
      return NextResponse.json(
        {
          error: 'Invalid email or password. Please try again.',
        },
        { status: 401 }
      );
    }

    // 5. Generate signed JWT token
    const token = await signToken(
      {
        userId: user.id,
        email: user.email,
        fullName: user.fullName,
      },
      rememberMe
    );

    // 6. Set httpOnly, secure cookie
    const response = NextResponse.json({
      success: true,
      message: 'Login successful! Redirecting to dashboard...',
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        gender: user.gender,
      },
    });

    const maxAge = rememberMe ? 7 * 24 * 60 * 60 : 2 * 60 * 60; // 7 days vs 2 hours

    response.cookies.set({
      name: AUTH_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge,
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Login API error:', error);
    return NextResponse.json(
      {
        error: 'An internal server error occurred while processing login.',
      },
      { status: 500 }
    );
  }
}
