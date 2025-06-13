
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    )

    console.log('🚀 Début de la migration des données...')

    // Récupérer les données du serveur distant
    const serverUrl = 'https://riziky-boutic-server.onrender.com'
    
    // 1. Migrer les catégories
    try {
      const categoriesResponse = await fetch(`${serverUrl}/api/categories`)
      const categories = await categoriesResponse.json()
      
      if (categories && categories.length > 0) {
        console.log(`📦 Migration de ${categories.length} catégories...`)
        
        for (const category of categories) {
          const { error } = await supabaseClient
            .from('categories')
            .upsert({
              id: category.id,
              name: category.name,
              description: category.description,
              order: category.order,
              is_active: category.isActive,
              created_at: category.createdAt,
              updated_at: category.updatedAt
            })
          
          if (error && !error.message.includes('duplicate key')) {
            console.error('Erreur catégorie:', error)
          }
        }
        console.log('✅ Catégories migrées avec succès')
      }
    } catch (error) {
      console.error('❌ Erreur migration catégories:', error)
    }

    // 2. Migrer les produits
    try {
      const productsResponse = await fetch(`${serverUrl}/api/products`)
      const products = await productsResponse.json()
      
      if (products && products.length > 0) {
        console.log(`📦 Migration de ${products.length} produits...`)
        
        for (const product of products) {
          const { error } = await supabaseClient
            .from('products')
            .upsert({
              id: product.id,
              name: product.name,
              description: product.description,
              price: product.price,
              original_price: product.originalPrice,
              category: product.category,
              images: product.images,
              image: product.image,
              promotion: product.promotion,
              promotion_end: product.promotionEnd,
              stock: product.stock,
              is_sold: product.isSold,
              date_ajout: product.dateAjout,
              flash_sale_discount: product.flashSaleDiscount,
              flash_sale_start_date: product.flashSaleStartDate,
              flash_sale_end_date: product.flashSaleEndDate,
              flash_sale_title: product.flashSaleTitle,
              flash_sale_description: product.flashSaleDescription,
              original_flash_price: product.originalFlashPrice,
              flash_sale_price: product.flashSalePrice
            })
          
          if (error && !error.message.includes('duplicate key')) {
            console.error('Erreur produit:', error)
          }
        }
        console.log('✅ Produits migrés avec succès')
      }
    } catch (error) {
      console.error('❌ Erreur migration produits:', error)
    }

    // 3. Migrer les contacts
    try {
      const contactsResponse = await fetch(`${serverUrl}/api/contacts`)
      const contacts = await contactsResponse.json()
      
      if (contacts && contacts.length > 0) {
        console.log(`📦 Migration de ${contacts.length} contacts...`)
        
        for (const contact of contacts) {
          const { error } = await supabaseClient
            .from('contacts')
            .upsert({
              id: contact.id,
              nom: contact.nom,
              prenom: contact.prenom,
              email: contact.email,
              telephone: contact.telephone,
              adresse: contact.adresse,
              objet: contact.objet,
              message: contact.message,
              date_creation: contact.dateCreation,
              read: contact.read
            })
          
          if (error && !error.message.includes('duplicate key')) {
            console.error('Erreur contact:', error)
          }
        }
        console.log('✅ Contacts migrés avec succès')
      }
    } catch (error) {
      console.error('❌ Erreur migration contacts:', error)
    }

    // 4. Migrer les codes promos
    try {
      const codePromosResponse = await fetch(`${serverUrl}/api/code-promos`)
      const codePromos = await codePromosResponse.json()
      
      if (codePromos && codePromos.length > 0) {
        console.log(`📦 Migration de ${codePromos.length} codes promos...`)
        
        for (const codePromo of codePromos) {
          const { error } = await supabaseClient
            .from('code_promos')
            .upsert({
              id: codePromo.id,
              code: codePromo.code,
              pourcentage: codePromo.pourcentage,
              quantite: codePromo.quantite,
              product_id: codePromo.productId,
              product_name: codePromo.productName,
              created_at: codePromo.createdAt || new Date().toISOString()
            })
          
          if (error && !error.message.includes('duplicate key')) {
            console.error('Erreur code promo:', error)
          }
        }
        console.log('✅ Codes promos migrés avec succès')
      }
    } catch (error) {
      console.error('❌ Erreur migration codes promos:', error)
    }

    // 5. Migrer les avis/reviews
    try {
      const reviewsResponse = await fetch(`${serverUrl}/api/reviews`)
      const reviews = await reviewsResponse.json()
      
      if (reviews && reviews.length > 0) {
        console.log(`📦 Migration de ${reviews.length} avis...`)
        
        for (const review of reviews) {
          const { error } = await supabaseClient
            .from('reviews')
            .upsert({
              id: review.id,
              user_name: review.userName,
              product_id: review.productId,
              product_rating: review.productRating,
              delivery_rating: review.deliveryRating,
              comment: review.comment,
              photos: review.photos,
              created_at: review.createdAt,
              updated_at: review.updatedAt
            })
          
          if (error && !error.message.includes('duplicate key')) {
            console.error('Erreur avis:', error)
          }
        }
        console.log('✅ Avis migrés avec succès')
      }
    } catch (error) {
      console.error('❌ Erreur migration avis:', error)
    }

    // 6. Migrer la publicité (pub layout)
    try {
      const pubLayoutResponse = await fetch(`${serverUrl}/api/pub-layout`)
      const pubLayout = await pubLayoutResponse.json()
      
      if (pubLayout && pubLayout.length > 0) {
        console.log(`📦 Migration de ${pubLayout.length} éléments de publicité...`)
        
        for (const pub of pubLayout) {
          const { error } = await supabaseClient
            .from('pub_layout')
            .upsert({
              id: pub.id,
              icon: pub.icon,
              text: pub.text,
              created_at: pub.createdAt || new Date().toISOString()
            })
          
          if (error && !error.message.includes('duplicate key')) {
            console.error('Erreur pub layout:', error)
          }
        }
        console.log('✅ Publicités migrées avec succès')
      }
    } catch (error) {
      console.error('❌ Erreur migration publicités:', error)
    }

    // 7. Migrer les statistiques de visiteurs
    try {
      const visitorsResponse = await fetch(`${serverUrl}/api/visitors/stats`)
      const visitorsData = await visitorsResponse.json()
      
      if (visitorsData) {
        console.log('📦 Migration des statistiques de visiteurs...')
        
        const { error } = await supabaseClient
          .from('visitors')
          .upsert({
            daily: visitorsData.daily || {},
            weekly: visitorsData.weekly || {},
            monthly: visitorsData.monthly || {},
            yearly: visitorsData.yearly || {},
            current_viewing: visitorsData.currentViewing || 0,
            last_visit: new Date().toISOString(),
            online_users: []
          })
        
        if (error && !error.message.includes('duplicate key')) {
          console.error('Erreur visiteurs:', error)
        } else {
          console.log('✅ Statistiques de visiteurs migrées avec succès')
        }
      }
    } catch (error) {
      console.error('❌ Erreur migration visiteurs:', error)
    }

    // 8. Créer les paramètres de site par défaut
    try {
      console.log('📦 Configuration des paramètres de site...')
      
      const defaultSettings = {
        general: {
          siteName: "Riziky Boutic",
          siteDescription: "Votre boutique en ligne de confiance",
          companyName: "Riziky Boutic",
          contactEmail: "contact@rizikyboutic.com",
          supportEmail: "support@rizikyboutic.com",
          phone: "+33 1 23 45 67 89",
          address: "123 Rue du Commerce, 75001 Paris",
          language: "fr",
          currency: "EUR",
          timezone: "Europe/Paris"
        },
        appearance: {
          theme: "modern",
          primaryColor: "#3B82F6",
          secondaryColor: "#10B981",
          accentColor: "#F59E0B",
          logoUrl: "/images/logo/logo.png",
          faviconUrl: "/favicon.ico",
          bannerEnabled: true,
          bannerText: "Livraison gratuite à partir de 50€",
          headerStyle: "modern",
          footerStyle: "detailed"
        },
        ecommerce: {
          taxRate: 20,
          shippingFee: 5.99,
          freeShippingThreshold: 50,
          enableReviews: true,
          enableWishlist: true,
          enableCompare: true,
          stockManagement: true,
          autoReduceStock: true,
          lowStockThreshold: 5,
          outOfStockBehavior: "hide"
        },
        system: {
          registrationEnabled: true,
          maintenanceMode: false,
          maintenanceMessage: "Site en maintenance. Nous serons de retour très bientôt !"
        }
      }

      const { error } = await supabaseClient
        .from('site_settings')
        .insert(defaultSettings)
      
      if (error && !error.message.includes('duplicate key')) {
        console.error('Erreur paramètres site:', error)
      } else {
        console.log('✅ Paramètres de site configurés avec succès')
      }
    } catch (error) {
      console.error('❌ Erreur configuration paramètres:', error)
    }

    console.log('🎉 Migration terminée avec succès!')

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Migration des données terminée avec succès',
        timestamp: new Date().toISOString()
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    console.error('❌ Erreur générale de migration:', error)
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
        timestamp: new Date().toISOString()
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})
