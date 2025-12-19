'use client';

import { useState, useCallback } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress,
} from '@mui/material';
import { useAuthStore } from '@/store/authStore';

/**
 * Login Page Component
 * Uses NextAuth for authentication and Zustand for state management
 * Optimized with useCallback to prevent unnecessary re-renders
 */
export default function LoginPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuthStore();

  // Sync session with Zustand store
  useEffect(() => {
    if (session?.user) {
      const user = session.user as {
        id?: string;
        accessToken?: string;
        username?: string;
        email?: string;
        firstName?: string;
        lastName?: string;
        image?: string;
      };
      login(
        user.accessToken || '',
        {
          id: user.id ? parseInt(user.id) : 0,
          username: user.username || '',
          email: user.email || '',
          firstName: user.firstName || '',
          lastName: user.lastName || '',
          image: user.image || '',
        }
      );
      router.push('/dashboard');
    }
  }, [session, login, router]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setError('');
      setLoading(true);

      try {
        const result = await signIn('credentials', {
          username,
          password,
          redirect: false,
        });

        if (result?.error) {
          setError('Invalid username or password');
          setLoading(false);
          return;
        }

        if (result?.ok) {
          // Session will be updated and useEffect will handle the redirect
          setLoading(false);
        }
      } catch (err) {
        setError('An error occurred. Please try again.');
        setLoading(false);
      }
    },
    [username, password]
  );

  return (
    <Container
      maxWidth="sm"
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          width: '100%',
          maxWidth: 400,
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Admin Login
        </Typography>
        <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 3 }}>
          Use DummyJSON credentials to login
        </Typography>

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <TextField
            fullWidth
            label="Username"
            variant="outlined"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            margin="normal"
            required
            autoComplete="username"
            disabled={loading}
          />

          <TextField
            fullWidth
            label="Password"
            type="password"
            variant="outlined"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            margin="normal"
            required
            autoComplete="current-password"
            disabled={loading}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 3, mb: 2 }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Login'}
          </Button>

          <Typography variant="caption" color="text.secondary" align="center" display="block">
            Test credentials: username: &quot;emilys&quot;, password: &quot;emilyspass&quot;
          </Typography>
          <Typography variant="caption" color="text.secondary" align="center" display="block" sx={{ mt: 1 }}>
            Or use any valid user credentials from DummyJSON API
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}

