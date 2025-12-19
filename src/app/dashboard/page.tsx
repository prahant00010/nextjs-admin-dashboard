'use client';

import ProtectedRoute from '@/components/ProtectedRoute';
import DashboardLayout from '@/components/DashboardLayout';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import PeopleIcon from '@mui/icons-material/People';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';

export default function DashboardPage() {
  const router = useRouter();

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            Dashboard
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Welcome to the admin dashboard. Manage users and products from here.
          </Typography>

          <Grid container spacing={3}>
            <Grid size={{ xs: 12, sm: 6, md: 6 }}>
              <Card>
                <CardContent>
                  <PeopleIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                  <Typography variant="h5" component="h2" gutterBottom>
                    Users Management
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    View and manage all users. Search, filter, and view user details.
                  </Typography>
                  <Button
                    variant="contained"
                    onClick={() => router.push('/dashboard/users')}
                  >
                    View Users
                  </Button>
                </CardContent>
              </Card>
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 6 }}>
              <Card>
                <CardContent>
                  <ShoppingBagIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                  <Typography variant="h5" component="h2" gutterBottom>
                    Products Management
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    View and manage all products. Search, filter by category, and view product details.
                  </Typography>
                  <Button
                    variant="contained"
                    onClick={() => router.push('/dashboard/products')}
                  >
                    View Products
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </DashboardLayout>
    </ProtectedRoute>
  );
}

