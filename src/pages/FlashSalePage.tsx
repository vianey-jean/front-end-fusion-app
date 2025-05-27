
import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Layout from '@/components/layout/Layout';
import ProductCatalogGrid from '@/components/products/ProductGrid';
import CountdownTimer from '@/components/promotions/CountdownTimer';
import { flashSaleAPI } from '@/services/flashSaleAPI';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Flame, ShoppingBag } from 'lucide-react';

const FlashSalePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const { data: flashSale, isLoading: isLoadingFlashSale } = useQuery({
    queryKey: ['flash-sale', id],
    queryFn: () => flashSaleAPI.getById(id!),
    enabled: !!id,
  });

  const { data: products, isLoading: isLoadingProducts } = useQuery({
    queryKey: ['flash-sale-products', id],
    queryFn: () => flashSaleAPI.getProducts(id!),
    enabled: !!id,
  });

  if (isLoadingFlashSale || isLoadingProducts) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-red-600 mx-auto mb-6"></div>
            <h2 className="text-xl font-semibold mb-2">Chargement de la vente flash...</h2>
          </div>
        </div>
      </Layout>
    );
  }

  if (!flashSale?.data) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-20">
            <ShoppingBag className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Vente flash non trouvée</h2>
            <p className="text-gray-600">Cette vente flash n'existe pas ou a expiré.</p>
          </div>
        </div>
      </Layout>
    );
  }

  const sale = flashSale.data;
  const saleProducts = products?.data || [];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* En-tête de la vente flash */}
        <Card className="mb-8 bg-gradient-to-r from-red-600 to-orange-600 text-white">
          <CardHeader>
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center space-x-3">
                <Flame className="h-8 w-8 text-yellow-300 animate-pulse" />
                <div>
                  <CardTitle className="text-3xl font-bold">{sale.title}</CardTitle>
                  <p className="text-lg opacity-90 mt-2">{sale.description}</p>
                </div>
                <span className="bg-yellow-400 text-black px-4 py-2 rounded-full text-lg font-bold">
                  -{sale.discount}%
                </span>
              </div>
              
              <div className="bg-black/20 backdrop-blur rounded-lg p-4">
                <CountdownTimer
                  endTime={new Date(sale.endDate)}
                  title="Offre expire dans"
                />
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Produits de la vente flash */}
        {saleProducts.length > 0 ? (
          <ProductCatalogGrid
            products={saleProducts}
            title={`Produits en vente flash - ${sale.discount}% de réduction`}
            showViewAllButton={false}
          />
        ) : (
          <div className="text-center py-20">
            <ShoppingBag className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Aucun produit disponible</h2>
            <p className="text-gray-600">Cette vente flash ne contient aucun produit pour le moment.</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default FlashSalePage;
