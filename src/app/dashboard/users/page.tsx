'use client';

import React, { useEffect, useState, useCallback, useMemo } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import DashboardLayout from '@/components/DashboardLayout';
import { useUsersStore } from '@/store/usersStore';
import {
  Box,
  Typography,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Pagination,
  CircularProgress,
  Alert,
  Avatar,
  Chip,
  InputAdornment,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useRouter } from 'next/navigation';
import { User } from '@/types';

/**
 * UserRow Component
 * Memoized to prevent unnecessary re-renders when parent updates
 */
const UserRow = React.memo(({ user }: { user: User }) => {
  const router = useRouter();

  const handleClick = useCallback(() => {
    router.push(`/dashboard/users/${user.id}`);
  }, [router, user.id]);

  return (
    <TableRow
      hover
      onClick={handleClick}
      sx={{ cursor: 'pointer' }}
    >
      <TableCell>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar src={user.image} alt={`${user.firstName} ${user.lastName}`} />
          <Box>
            <Typography variant="body2" fontWeight="medium">
              {user.firstName} {user.lastName}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {user.username}
            </Typography>
          </Box>
        </Box>
      </TableCell>
      <TableCell>{user.email}</TableCell>
      <TableCell>
        <Chip
          label={user.gender}
          size="small"
          color={user.gender === 'male' ? 'primary' : 'secondary'}
        />
      </TableCell>
      <TableCell>{user.phone}</TableCell>
      <TableCell>{user.company?.name || 'N/A'}</TableCell>
    </TableRow>
  );
});

UserRow.displayName = 'UserRow';

/**
 * Users List Page
 * Features: Pagination, Search, Responsive Design
 * Optimized with useMemo and useCallback
 */
export default function UsersPage() {
  const { users, total, skip, limit, loading, error, fetchUsers } = useUsersStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [searchDebounce, setSearchDebounce] = useState<NodeJS.Timeout | null>(null);

  // Calculate total pages
  const totalPages = useMemo(() => Math.ceil(total / limit), [total, limit]);

  // Debounced search
  useEffect(() => {
    if (searchDebounce) {
      clearTimeout(searchDebounce);
    }

    const timer = setTimeout(() => {
      setPage(1);
      fetchUsers(0, limit, searchQuery || undefined);
    }, 500);

    setSearchDebounce(timer);

    return () => {
      if (searchDebounce) clearTimeout(searchDebounce);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);

  // Initial load and page change
  useEffect(() => {
    const currentSkip = (page - 1) * limit;
    fetchUsers(currentSkip, limit, searchQuery || undefined);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, limit]);

  const handlePageChange = useCallback((event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  }, []);

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  }, []);

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            Users Management
          </Typography>

          <Box sx={{ mb: 3, mt: 3 }}>
            <TextField
              fullWidth
              placeholder="Search users by name, email, or username..."
              value={searchQuery}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              sx={{ maxWidth: 600 }}
            />
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {loading && users.length === 0 ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell>Gender</TableCell>
                      <TableCell>Phone</TableCell>
                      <TableCell>Company</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {users.map((user) => (
                      <UserRow key={user.id} user={user} />
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              {totalPages > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                  <Pagination
                    count={totalPages}
                    page={page}
                    onChange={handlePageChange}
                    color="primary"
                  />
                </Box>
              )}

              <Typography variant="body2" color="text.secondary" sx={{ mt: 2, textAlign: 'center' }}>
                Showing {skip + 1} - {Math.min(skip + limit, total)} of {total} users
              </Typography>
            </>
          )}
        </Box>
      </DashboardLayout>
    </ProtectedRoute>
  );
}

