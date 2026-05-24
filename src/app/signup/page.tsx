'use client';
import { useState } from 'react';

export default function SignUpPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // базовая валидация
    if (password.length < 8) {
      setError('Пароль має містити мінімум 8 символів');
      return;
    }
    if (password !== confirmPassword) {
      setError('Паролі не збігаються');
      return;
    }

    setError('');
    console.log('Name:', name, 'Email:', email, 'Password:', password);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="w-96 space-y-4 rounded bg-white p-6 shadow-md"
      >
        <h2 className="text-center text-xl font-bold text-blue-800">
          Реєстрація
        </h2>

        <input
          type="text"
          placeholder="Ім’я"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full rounded border border-blue-600 px-3 py-2 focus:ring focus:outline-none"
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full rounded border border-blue-600 px-3 py-2 focus:ring focus:outline-none"
        />

        <input
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full rounded border border-blue-600 px-3 py-2 focus:ring focus:outline-none"
        />

        <input
          type="password"
          placeholder="Підтвердження паролю"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          className="w-full rounded border border-blue-600 px-3 py-2 focus:ring focus:outline-none"
        />

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          className="w-full rounded border border-blue-600 bg-white px-3 px-4 py-2 font-semibold text-blue-800 transition-colors duration-300 hover:bg-blue-700 hover:text-white cursor-pointer"
        >
          Зареєструватися
        </button>
      </form>
    </div>
  );
}
