import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { email, password } = await request.json();

  if (email.trim() === '' || password.trim() === '') {
    return NextResponse.json(
      { field: 'form', message: 'Заповніть усі поля' },
      { status: 400 },
    );
  }

  if (email !== 'test@example.com') {
    return NextResponse.json(
      { field: 'email', message: 'Невірний email' },
      { status: 401 },
    );
  }

  if (password !== '123456') {
    return NextResponse.json(
      { field: 'password', message: 'Невірний пароль' },
      { status: 401 },
    );
  }

  return NextResponse.json({ token: 'mock-token-123' }, { status: 200 });
}
