"use client";
import { useState } from "react";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // пока просто выводим данные в консоль
    console.log("Email:", email, "Password:", password);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="w-96 space-y-4 rounded bg-white p-6 shadow-md"
      >
        <h2 className="text-center text-xl font-bold text-blue-800">
          Вхід до кабінету
        </h2>

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

        <p className="text-left text-sm">
          <a
            href="/forgot-password"
            className="text-blue-600 hover:text-red-700 hover:underline"
          >
            Забули пароль?
          </a>
        </p>

        <button
          type="submit"
          className="w-full cursor-pointer rounded border border-blue-600 bg-white px-3 py-2 font-semibold text-blue-800 transition-colors duration-300 hover:bg-blue-700 hover:text-white"
        >
          Увійти до кабінету
        </button>

        <p className="mt-3 text-center text-sm text-red-600">
          Ще немає акаунту?{' '}
          <a
            href="/signup"
            className="rounded border border-blue-600 px-5 py-1 text-blue-600 hover:text-red-700 hover:underline"
          >
            Зареєструватися
          </a>
        </p>
      </form>
    </div>
  );
}

