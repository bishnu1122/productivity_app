"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/lib/store';
import LoginForm from '@/components/login-form';
import Dashboard from '@/components/dashboard';

export default function Home() {
  const { userName } = useUserStore();
  const router = useRouter();

  useEffect(() => {
    if (!userName) {
      router.push('/');
    }
  }, [userName, router]);

  if (!userName) {
    return <LoginForm />;
  }

  return <Dashboard />;
}