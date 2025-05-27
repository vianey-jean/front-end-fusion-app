
import React from 'react';
import Layout from '@/components/layout/Layout';
import ReviewsList from '@/components/reviews/ReviewsList';

const ReviewsPage: React.FC = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Mes Avis</h1>
        <ReviewsList />
      </div>
    </Layout>
  );
};

export default ReviewsPage;
