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
  Button,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  Divider,
  Chip,
  Rating,
  ImageList,
  ImageListItem,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Product } from '@/types';

/**
 * Single Product Detail Page
 * Displays comprehensive product information with image carousel
 * Optimized with useCallback
 */
export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const fetchProduct = useCallback(async () => {
    if (!params.id) return;

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`https://dummyjson.com/products/${params.id}`);
      if (!response.ok) throw new Error('Failed to fetch product');

      const data: Product = await response.json();
      setProduct(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [params.id]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  const handleBack = useCallback(() => {
    router.push('/dashboard/products');
  }, [router]);

  const handleImageSelect = useCallback((index: number) => {
    setSelectedImageIndex(index);
  }, []);

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

  if (error || !product) {
    return (
      <ProtectedRoute>
        <DashboardLayout>
          <Alert severity="error">{error || 'Product not found'}</Alert>
          <Button startIcon={<ArrowBackIcon />} onClick={handleBack} sx={{ mt: 2 }}>
            Back to Products
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
            Back to Products
          </Button>

          <Paper sx={{ p: 4 }}>
            <Grid container spacing={4}>
              {/* Image Carousel */}
              <Grid size={{ xs: 12, md: 6 }}>
                <Box sx={{ mb: 2 }}>
                  <Box
                    component="img"
                    src={product.images[selectedImageIndex] || product.thumbnail}
                    alt={product.title}
                    sx={{
                      width: '100%',
                      height: 'auto',
                      maxHeight: 500,
                      objectFit: 'contain',
                      borderRadius: 2,
                    }}
                  />
                </Box>
                {product.images.length > 1 && (
                  <ImageList cols={4} rowHeight={100} gap={8}>
                    {product.images.map((image, index) => (
                      <ImageListItem
                        key={index}
                        onClick={() => handleImageSelect(index)}
                        sx={{
                          cursor: 'pointer',
                          border: selectedImageIndex === index ? 2 : 0,
                          borderColor: 'primary.main',
                          borderRadius: 1,
                          overflow: 'hidden',
                        }}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={image}
                          alt={`${product.title} ${index + 1}`}
                          loading="lazy"
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                          }}
                        />
                      </ImageListItem>
                    ))}
                  </ImageList>
                )}
              </Grid>

              {/* Product Details */}
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                  {product.title}
                </Typography>
                <Typography variant="h5" color="primary" fontWeight="bold" gutterBottom>
                  ${product.price}
                </Typography>
                {product.discountPercentage > 0 && (
                  <Chip
                    label={`${product.discountPercentage}% OFF`}
                    color="secondary"
                    sx={{ mb: 2 }}
                  />
                )}

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <Rating value={product.rating} readOnly />
                  <Typography variant="body2" color="text.secondary">
                    ({product.rating}) • {product.reviews?.length || 0} reviews
                  </Typography>
                </Box>

                <Chip
                  label={product.category}
                  color="primary"
                  sx={{ mb: 2, mr: 1 }}
                />
                <Chip
                  label={product.brand}
                  variant="outlined"
                  sx={{ mb: 2 }}
                />

                <Divider sx={{ my: 3 }} />

                <Typography variant="h6" gutterBottom>
                  Description
                </Typography>
                <Typography variant="body1" color="text.secondary" paragraph>
                  {product.description}
                </Typography>

                <Box sx={{ mt: 3 }}>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Stock:</strong> {product.stock} units
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>SKU:</strong> {product.sku}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Weight:</strong> {product.weight} kg
                  </Typography>
                </Box>
              </Grid>

              {/* Specifications */}
              <Grid size={{ xs: 12 }}>
                <Divider sx={{ my: 3 }} />
                <Typography variant="h5" gutterBottom>
                  Specifications
                </Typography>
                <Grid container spacing={3} sx={{ mt: 1 }}>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Card>
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          Dimensions
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Width: {product.dimensions.width} cm
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Height: {product.dimensions.height} cm
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Depth: {product.dimensions.depth} cm
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
                          <strong>Warranty:</strong> {product.warrantyInformation}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          <strong>Shipping:</strong> {product.shippingInformation}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          <strong>Availability:</strong> {product.availabilityStatus}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          <strong>Min Order:</strong> {product.minimumOrderQuantity}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>

                  {product.tags && product.tags.length > 0 && (
                    <Grid size={{ xs: 12 }}>
                      <Typography variant="h6" gutterBottom>
                        Tags
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        {product.tags.map((tag, index) => (
                          <Chip key={index} label={tag} size="small" />
                        ))}
                      </Box>
                    </Grid>
                  )}

                  {product.reviews && product.reviews.length > 0 && (
                    <Grid size={{ xs: 12 }}>
                      <Typography variant="h6" gutterBottom>
                        Reviews ({product.reviews.length})
                      </Typography>
                      {product.reviews.map((review, index) => (
                        <Card key={index} sx={{ mb: 2 }}>
                          <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                              <Rating value={review.rating} readOnly size="small" />
                              <Typography variant="body2" sx={{ ml: 1, fontWeight: 'bold' }}>
                                {review.reviewerName}
                              </Typography>
                              <Typography variant="caption" color="text.secondary" sx={{ ml: 2 }}>
                                {new Date(review.date).toLocaleDateString()}
                              </Typography>
                            </Box>
                            <Typography variant="body2">{review.comment}</Typography>
                          </CardContent>
                        </Card>
                      ))}
                    </Grid>
                  )}
                </Grid>
              </Grid>
            </Grid>
          </Paper>
        </Box>
      </DashboardLayout>
    </ProtectedRoute>
  );
}

