
import React from 'react';
import { useParams } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import ProductDetail from '@/pages/ProductDetail';

const ProductDetailsPage: React.FC = () => {
  return (
    <Layout>
      <ProductDetail />
    </Layout>
  );
};

export default ProductDetailsPage;
