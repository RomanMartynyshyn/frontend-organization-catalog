'use client';
import { useState } from 'react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // пока просто выводим сообщение
    setMessage('Інструкції для відновлення паролю надіслані на ' + email);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="w-96 space-y-4 rounded bg-white p-6 shadow-md"
      >
        <h2 className="text-center text-xl text-blue-800 font-bold">Відновлення паролю</h2>

        <input
          type="email"
          placeholder="Введіть ваш Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full rounded border border-blue-600 px-3 py-2 focus:ring focus:outline-none"
        />

        <button
          type="submit"
          className="w-full rounded bg-white border border-blue-600 py-2 text-blue-800 transition-colors duration-300 hover:bg-blue-700 hover:text-white transition-colors duration-300 cursor-pointer"
        >
          Надіслати інструкції
        </button>

        {message && <p className="text-sm text-red-600">{message}</p>}
      </form>
    </div>
  );
}
