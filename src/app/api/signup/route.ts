import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { name, email, password } = await request.json();

  // 🔹 1. Перевірка на пусті поля
  if (!name?.trim() || !email?.trim() || !password?.trim()) {
    return NextResponse.json(
      { field: 'form', message: 'Заповніть усі поля' },
      { status: 400 },
    );
  }

  // 🔹 2. Перевірка формату email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return NextResponse.json(
      { field: 'email', message: 'Некоректний email' },
      { status: 400 },
    );
  }

  // 🔹 3. Перевірка довжини пароля
  if (password.length < 8) {
    return NextResponse.json(
      { field: 'password', message: 'Пароль має містити мінімум 8 символів' },
      { status: 400 },
    );
  }

  // 🔹 4. Імітація перевірки на існуючий акаунт
  if (email === 'test@example.com') {
    return NextResponse.json(
      { field: 'email', message: 'Користувач з таким email вже існує' },
      { status: 409 }, // Conflict
    );
  }

  // 🔹 5. Успішна реєстрація
  return NextResponse.json(
    { message: 'Акаунт створено успішно!' },
    { status: 201 }, // Created
  );
}
