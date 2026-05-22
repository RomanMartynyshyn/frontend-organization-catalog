'use client';
// import router from 'next/dist/shared/lib/router/router';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SignUpPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmError, setConfirmError] = useState('');
  const [serverError, setServerError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setNameError('');
    setEmailError('');
    setPasswordError('');
    setConfirmError('');
    setServerError('');

    // зберігаємо дані у LocalStorage
    localStorage.setItem('registeredEmail', email);
    localStorage.setItem('registeredPassword', password);

    alert('Реєстрація успішна!');
    router.push('/signin'); // повертаємо на сторінку входу

    // 🔹 1. Перевірка на пусті поля
    if (
      name.trim() === '' ||
      email.trim() === '' ||
      password.trim() === '' ||
      confirmPassword.trim() === ''
    ) {
      setServerError('Заповніть усі поля');
      return;
    }

    // 🔹 2. Перевірка формату email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError('Некоректний email');
      return;
    }

    // 🔹 3. Перевірка довжини пароля
    if (password.length < 8) {
      setPasswordError('Пароль має містити мінімум 8 символів');
      return;
    }

    // 🔹 4. Перевірка збігу паролів
    if (password !== confirmPassword) {
      setConfirmError('Паролі не збігаються');
      return;
    }

    try {
      const res = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      if (res.status === 201) {
        alert('Реєстрація успішна!');
        setName('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        router.push('/signin');
      } else {
        const data = await res.json();
        setServerError(data.message || 'Помилка реєстрації');
      }
    } catch {
      setServerError('Помилка сервера');
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Створити акаунт</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Ім’я:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ borderColor: nameError ? 'red' : undefined }}
          />
          {nameError && <p style={{ color: 'red' }}>{nameError}</p>}
        </div>
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
        <div>
          <label>Підтвердження паролю:</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            style={{ borderColor: confirmError ? 'red' : undefined }}
          />
          {confirmError && <p style={{ color: 'red' }}>{confirmError}</p>}
        </div>
        <button type="submit">Зареєструватися</button>
      </form>
      {serverError && <p style={{ color: 'red' }}>{serverError}</p>}
      <a href="/signin">Уже маєте акаунт? Увійти</a>
    </div>
  );
}
