'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/ProtectedRoute';
import DashboardLayout from '@/components/DashboardLayout';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Avatar,
  Button,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  Divider,
  Chip,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { User } from '@/types';

/**
 * Single User Detail Page
 * Displays comprehensive user information
 * Optimized with useCallback
 */
export default function UserDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchUser = useCallback(async () => {
    if (!params.id) return;

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`https://dummyjson.com/users/${params.id}`);
      if (!response.ok) throw new Error('Failed to fetch user');

      const data: User = await response.json();
      setUser(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [params.id]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const handleBack = useCallback(() => {
    router.push('/dashboard/users');
  }, [router]);

  if (loading) {
    return (
      <ProtectedRoute>
        <DashboardLayout>
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        </DashboardLayout>
      </ProtectedRoute>
    );
  }

  if (error || !user) {
    return (
      <ProtectedRoute>
        <DashboardLayout>
          <Alert severity="error">{error || 'User not found'}</Alert>
          <Button startIcon={<ArrowBackIcon />} onClick={handleBack} sx={{ mt: 2 }}>
            Back to Users
          </Button>
        </DashboardLayout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <Box>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={handleBack}
            sx={{ mb: 3 }}
          >
            Back to Users
          </Button>

          <Paper sx={{ p: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 4 }}>
              <Avatar
                src={user.image}
                alt={`${user.firstName} ${user.lastName}`}
                sx={{ width: 120, height: 120 }}
              />
              <Box>
                <Typography variant="h4" component="h1">
                  {user.firstName} {user.lastName}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {user.email}
                </Typography>
                <Chip
                  label={user.gender}
                  color={user.gender === 'male' ? 'primary' : 'secondary'}
                  sx={{ mt: 1 }}
                />
              </Box>
            </Box>

            <Divider sx={{ my: 3 }} />

            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Personal Information
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Username:</strong> {user.username}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Age:</strong> {user.age}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Birth Date:</strong> {user.birthDate}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Phone:</strong> {user.phone}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Blood Group:</strong> {user.bloodGroup}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Height:</strong> {user.height} cm
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Weight:</strong> {user.weight} kg
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Eye Color:</strong> {user.eyeColor}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Hair:</strong> {user.hair.color} ({user.hair.type})
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Address
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {user.address.address}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {user.address.city}, {user.address.state} {user.address.postalCode}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {user.address.country}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                      <strong>Coordinates:</strong> {user.address.coordinates.lat}, {user.address.coordinates.lng}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Company Information
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Company:</strong> {user.company.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Department:</strong> {user.company.department}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Title:</strong> {user.company.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                      <strong>Address:</strong> {user.company.address.address}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {user.company.address.city}, {user.company.address.state}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Additional Information
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <strong>University:</strong> {user.university}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <strong>IP Address:</strong> {user.ip}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <strong>MAC Address:</strong> {user.macAddress}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <strong>EIN:</strong> {user.ein}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <strong>SSN:</strong> {user.ssn}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Paper>
        </Box>
      </DashboardLayout>
    </ProtectedRoute>
  );
}

