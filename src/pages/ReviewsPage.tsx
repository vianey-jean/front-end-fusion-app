
import React from 'react';
import Layout from '@/components/layout/Layout';
import ReviewsList from '@/components/reviews/ReviewsList';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const ReviewsPage: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto py-10 text-center">
          <h1 className="text-3xl font-bold mb-6">Mes Avis</h1>
          <p className="mb-6">Veuillez vous connecter pour voir vos avis.</p>
          <Button asChild className="bg-red-800 hover:bg-red-700">
            <Link to="/login">Se connecter</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto py-10">
        <h1 className="text-3xl font-bold mb-8">Mes Avis</h1>
        <ReviewsList reviews={[]} />
      </div>
    </Layout>
  );
};

export default ReviewsPage;
