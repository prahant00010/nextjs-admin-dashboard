'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import DashboardLayout from '@/components/DashboardLayout';
import { useProductsStore } from '@/store/productsStore';
import {
  Box,
  Typography,
  TextField,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Pagination,
  CircularProgress,
  Alert,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Rating,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useRouter } from 'next/navigation';
import React from 'react';
import { Product } from '@/types';

// Available categories from DummyJSON
const CATEGORIES = [
  'All Categories',
  'smartphones',
  'laptops',
  'fragrances',
  'skincare',
  'groceries',
  'home-decoration',
  'furniture',
  'tops',
  'womens-dresses',
  'womens-shoes',
  'mens-shirts',
  'mens-shoes',
  'mens-watches',
  'womens-watches',
  'womens-bags',
  'womens-jewellery',
  'sunglasses',
  'automotive',
  'motorcycle',
  'lighting',
];

/**
 * ProductCard Component
 * Memoized to prevent unnecessary re-renders
 */
const ProductCard = React.memo(({ product }: { product: Product }) => {
  const router = useRouter();

  const handleClick = useCallback(() => {
    router.push(`/dashboard/products/${product.id}`);
  }, [router, product.id]);

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        cursor: 'pointer',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 4,
        },
      }}
      onClick={handleClick}
    >
      <CardMedia
        component="img"
        height="200"
        image={product.thumbnail}
        alt={product.title}
        sx={{ objectFit: 'contain', p: 2 }}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h6" component="h2" gutterBottom noWrap>
          {product.title}
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          {product.brand}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Rating value={product.rating} readOnly size="small" />
          <Typography variant="body2" sx={{ ml: 1 }}>
            {product.rating}
          </Typography>
        </Box>
        <Chip
          label={product.category}
          size="small"
          color="primary"
          sx={{ mb: 1 }}
        />
        <Typography variant="h6" color="primary" fontWeight="bold">
          ${product.price}
        </Typography>
        {product.discountPercentage > 0 && (
          <Typography variant="body2" color="text.secondary">
            {product.discountPercentage}% off
          </Typography>
        )}
      </CardContent>
    </Card>
  );
});

ProductCard.displayName = 'ProductCard';

/**
 * Products List Page
 * Features: Pagination, Search, Category Filter, Responsive Grid
 * Optimized with useMemo and useCallback
 */
export default function ProductsPage() {
  const {
    products,
    total,
    skip,
    limit,
    loading,
    error,
    selectedCategory,
    fetchProducts,
    setCategory,
  } = useProductsStore();
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
      const category = selectedCategory === 'All Categories' ? undefined : selectedCategory;
      fetchProducts(0, limit, searchQuery || undefined, category || undefined);
    }, 500);

    setSearchDebounce(timer);

    return () => {
      if (searchDebounce) clearTimeout(searchDebounce);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, selectedCategory]);

  // Initial load and page change
  useEffect(() => {
    const currentSkip = (page - 1) * limit;
    const category = selectedCategory === 'All Categories' ? undefined : selectedCategory;
    fetchProducts(currentSkip, limit, searchQuery || undefined, category || undefined);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, limit]);

  const handlePageChange = useCallback((event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  }, []);

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  }, []);

  const handleCategoryChange = useCallback(
    (e: { target: { value: string } }) => {
      const category = e.target.value;
      setCategory(category === 'All Categories' ? null : category);
      setPage(1);
    },
    [setCategory]
  );

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            Products Management
          </Typography>

          <Box sx={{ mb: 3, mt: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <TextField
              placeholder="Search products..."
              value={searchQuery}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              sx={{ flexGrow: 1, minWidth: 200 }}
            />
            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel>Category</InputLabel>
              <Select
                value={selectedCategory || 'All Categories'}
                label="Category"
                onChange={handleCategoryChange}
              >
                <MenuItem value="All Categories">All Categories</MenuItem>
                {CATEGORIES.filter((cat) => cat !== 'All Categories').map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {loading && products.length === 0 ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              <Grid container spacing={3}>
                {products.map((product) => (
                  <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={product.id}>
                    <ProductCard product={product} />
                  </Grid>
                ))}
              </Grid>

              {products.length === 0 && !loading && (
                <Box sx={{ textAlign: 'center', p: 4 }}>
                  <Typography variant="h6" color="text.secondary">
                    No products found
                  </Typography>
                </Box>
              )}

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
                Showing {skip + 1} - {Math.min(skip + limit, total)} of {total} products
              </Typography>
            </>
          )}
        </Box>
      </DashboardLayout>
    </ProtectedRoute>
  );
}

