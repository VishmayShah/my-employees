'use client';
import { useRouter, usePathname  } from 'next/navigation';
import { useEffect, useState } from 'react';

const Navbar = () => {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const pathname = usePathname();
  const isAuthPages = pathname.includes('/auth/');

  useEffect(() => {
    const loadUser = () => {
      const storedUser = localStorage.getItem('user');
      setUser(storedUser ? JSON.parse(storedUser) : null);
    };

    loadUser(); // initial load

    window.addEventListener('userUpdated', loadUser);
    return () => window.removeEventListener('userUpdated', loadUser);
  }, []);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    router.push('/auth/login');
  };

  return (
    <>
      {!isAuthPages && (
        <nav className="w-full bg-gray-800 text-white px-4 py-2 flex justify-between items-center">
          <span className="font-bold">Welcome, {user ? (user.name + ` (${user.role})`) : ''}</span>
          <button onClick={handleLogout} className="bg-red-600 px-4 py-2 rounded">Logout</button>
        </nav>
      )}
    </>
  );
};

export default Navbar;