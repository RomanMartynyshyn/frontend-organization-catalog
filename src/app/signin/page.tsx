'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [serverError, setServerError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError('');
    setPasswordError('');
    setServerError('');

    const savedEmail = localStorage.getItem('registeredEmail');
    const savedPassword = localStorage.getItem('registeredPassword');

    if (email === savedEmail && password === savedPassword) {
      alert('Вхід успішний!');
      router.push('/dashboard'); // або будь-яка сторінка кабінету
    } else {
      alert('Невірний email або пароль');
    }

    // 🔹 базова валідація на клієнті
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError('Некоректний email');
      return;
    }
    if (password.length < 6) {
      setPasswordError('Пароль має містити мінімум 6 символів');
      return;
    }

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const savedEmail = localStorage.getItem('registeredEmail');
      const savedPassword = localStorage.getItem('registeredPassword');

      if (email === savedEmail && password === savedPassword) {
        alert('Вхід успішний!');
        localStorage.setItem('isLoggedIn', 'true');
        router.push('/dashboard');
      } else {
        alert('Невірний email або пароль');
      }

      if (res.status === 200) {
        const data = await res.json();
        sessionStorage.setItem('token', data.token);
        alert('Вхід успішний!');
        setEmail('');
        setPassword('');
      } else {
        const data = await res.json();

        if (data.field === 'email') {
          setEmailError(data.message);
        } else if (data.field === 'password') {
          setPasswordError(data.message);
        } else {
          setServerError(data.message);
        }

        sessionStorage.removeItem('token');
      }
    } catch {
      setServerError('Помилка сервера');
      sessionStorage.removeItem('token');
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Увійти до кабінету</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ borderColor: emailError ? 'red' : undefined }}
          />
          {emailError && <p style={{ color: 'red' }}>{emailError}</p>}
        </div>
        <div>
          <label>Пароль:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ borderColor: passwordError ? 'red' : undefined }}
          />
          {passwordError && <p style={{ color: 'red' }}>{passwordError}</p>}
        </div>
        <button type="submit">Увійти до кабінету</button>
      </form>
      {serverError && <p style={{ color: 'red' }}>{serverError}</p>}
      <h2>Не маєте аккаунту?</h2>
      <a href="/signup">Зареєструватися</a>
    </div>
  );
}
