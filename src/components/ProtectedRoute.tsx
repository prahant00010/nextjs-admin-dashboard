'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useAuthStore } from '@/store/authStore';
import { CircularProgress, Box } from '@mui/material';

/**
 * Protected Route Component
 * Redirects unauthenticated users to login page
 */
export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { status } = useSession();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (status === 'unauthenticated' && !isAuthenticated) {
      router.push('/login');
    }
  }, [status, isAuthenticated, router]);

  if (status === 'loading') {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (status === 'unauthenticated' || !isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}

