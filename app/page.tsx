"use client";
import { useRouter } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';

export default function Home() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    if (!storedUser) {
      router.push('/auth/login');
    }
    else if(JSON.parse(storedUser).role !== 'admin'){
      router.push('/employee');
    }
    else if(JSON.parse(storedUser).role === 'admin'){
      router.push('/admin');
    }

  }, []);
  return (
    <Suspense fallback={<div>Loading...</div>}>
    </Suspense>
  );
}
