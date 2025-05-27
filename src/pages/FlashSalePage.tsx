
import React from 'react';
import { useParams } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { useFlashSaleProducts, useActiveFlashSale } from '@/hooks/useFlashSales';
import ProductCard from '@/components/products/ProductCard';
import CountdownTimer from '@/components/promotions/CountdownTimer';
import { Card, CardContent } from '@/components/ui/card';
import { Flame, Clock } from 'lucide-react';

const FlashSalePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data: flashSale } = useActiveFlashSale();
  const { data: products = [], isLoading } = useFlashSaleProducts(id);

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-red-600 mx-auto mb-6"></div>
            <h2 className="text-xl font-semibold mb-2">Chargement des offres flash...</h2>
          </div>
        </div>
      </Layout>
    );
  }

  if (!flashSale) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-20">
            <h2 className="text-2xl font-semibold mb-4">Aucune vente flash active</h2>
            <p className="text-gray-600">Revenez bientôt pour découvrir nos prochaines offres exceptionnelles !</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* En-tête de la vente flash */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Flame className="h-8 w-8 text-red-600" />
            <h1 className="text-3xl lg:text-4xl font-bold text-red-800">
              {flashSale.title}
            </h1>
            <div className="bg-red-600 text-white px-4 py-2 rounded-full text-lg font-bold">
              -{flashSale.discount}%
            </div>
          </div>
          
          {flashSale.description && (
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              {flashSale.description}
            </p>
          )}
          
          {/* Compte à rebours */}
          <Card className="max-w-md mx-auto">
            <CardContent className="p-4">
              <CountdownTimer 
                endTime={new Date(flashSale.endDate)}
                title="Offre se termine dans"
              />
            </CardContent>
          </Card>
        </div>

        {/* Grille des produits */}
        {products.length > 0 ? (
          <div>
            <h2 className="text-2xl font-semibold mb-6 text-center">
              Produits en promotion ({products.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map(product => (
                <div key={product.id} className="relative">
                  <ProductCard 
                    product={{
                      ...product,
                      price: product.discountedPrice,
                      originalPrice: product.originalPrice,
                      promotion: flashSale.discount
                    }} 
                  />
                  {/* Badge flash sale */}
                  <div className="absolute top-2 left-2 bg-red-600 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center space-x-1">
                    <Flame className="h-3 w-3" />
                    <span>FLASH</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-20">
            <h2 className="text-xl font-semibold mb-4">Aucun produit disponible</h2>
            <p className="text-gray-600">Cette vente flash ne contient actuellement aucun produit.</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default FlashSalePage;
