'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const router = useRouter();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (isLoggedIn !== 'true') {
      router.push('/signin');
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn'); // видаляємо тільки токен
    if (confirm('Ви дійсно хочете вийти з кабінету?')) {
      router.push('/signin');
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Вітаємо у кабінеті</h1>
      <p>Тут може бути ваш контент після входу.</p>
      <button onClick={handleLogout} style={{ marginTop: '20px' }}>
        Вийти
      </button>
    </div>
  );
}
