import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { hashPassword } from '@/lib/auth';
import { registerSchema } from '@/lib/validation';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // 1. Zod Validation
    const validationResult = registerSchema.safeParse(body);
    if (!validationResult.success) {
      const errorMap = validationResult.error.flatten().fieldErrors;
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: errorMap,
        },
        { status: 400 }
      );
    }

    const { fullName, email, password, phone, gender } = validationResult.data;

    // 2. Check for duplicate email (demonstrating unique constraint query)
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        {
          error: 'An account with this email address already exists. Please log in instead.',
        },
        { status: 409 }
      );
    }

    // 3. Hash password using bcrypt (salt rounds 12)
    const passwordHash = await hashPassword(password);

    // 4. Insert new user into PostgreSQL via Prisma
    const newUser = await prisma.user.create({
      data: {
        fullName,
        email,
        passwordHash,
        phone,
        gender,
      },
      select: {
        id: true,
        fullName: true,
        email: true,
        phone: true,
        gender: true,
        createdAt: true,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Registration successful! Please log in with your credentials.',
        user: newUser,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration API error:', error);
    return NextResponse.json(
      {
        error: 'An internal server error occurred while processing registration.',
      },
      { status: 500 }
    );
  }
}
