
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

    console.log('🚀 Début de la migration complète des données...')

    const serverUrl = 'https://riziky-boutic-server.onrender.com'
    const migrationResults = {
      categories: 0,
      products: 0,
      contacts: 0,
      code_promos: 0,
      reviews: 0,
      pub_layout: 0,
      visitors: 0,
      site_settings: 0,
      banniereflashsale: 0,
      chat_conversations: 0
    }

    // 1. Migrer les catégories
    try {
      console.log('📦 Récupération des catégories...')
      const categoriesResponse = await fetch(`${serverUrl}/api/categories`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      })
      
      console.log('📊 Status catégories:', categoriesResponse.status)
      
      if (categoriesResponse.ok) {
        const categories = await categoriesResponse.json()
        console.log('📋 Catégories récupérées:', categories?.length || 0)
        
        if (categories && Array.isArray(categories) && categories.length > 0) {
          for (const category of categories) {
            try {
              const { error } = await supabaseClient
                .from('categories')
                .upsert({
                  id: category.id,
                  name: category.name,
                  description: category.description || '',
                  order: category.order || 0,
                  is_active: category.isActive ?? true,
                  created_at: category.createdAt || new Date().toISOString(),
                  updated_at: category.updatedAt || new Date().toISOString()
                })
              
              if (!error) {
                migrationResults.categories++
              } else {
                console.log('⚠️ Erreur insertion catégorie:', error)
              }
            } catch (err) {
              console.log('⚠️ Erreur traitement catégorie:', err)
            }
          }
        }
        console.log(`✅ ${migrationResults.categories} catégories migrées`)
      } else {
        console.log('❌ Erreur récupération catégories:', categoriesResponse.statusText)
      }
    } catch (error) {
      console.error('❌ Erreur migration catégories:', error)
    }

    // 2. Migrer les produits
    try {
      console.log('📦 Récupération des produits...')
      const productsResponse = await fetch(`${serverUrl}/api/products`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      })
      
      console.log('📊 Status produits:', productsResponse.status)
      
      if (productsResponse.ok) {
        const products = await productsResponse.json()
        console.log('📋 Produits récupérés:', products?.length || 0)
        
        if (products && Array.isArray(products) && products.length > 0) {
          for (const product of products) {
            try {
              const { error } = await supabaseClient
                .from('products')
                .upsert({
                  id: product.id,
                  name: product.name,
                  description: product.description || '',
                  price: product.price || 0,
                  original_price: product.originalPrice || product.price || 0,
                  category: product.category,
                  images: product.images || [],
                  image: product.image,
                  promotion: product.promotion,
                  promotion_end: product.promotionEnd,
                  stock: product.stock || 0,
                  is_sold: product.isSold || false,
                  date_ajout: product.dateAjout || new Date().toISOString(),
                  flash_sale_discount: product.flashSaleDiscount,
                  flash_sale_start_date: product.flashSaleStartDate,
                  flash_sale_end_date: product.flashSaleEndDate,
                  flash_sale_title: product.flashSaleTitle,
                  flash_sale_description: product.flashSaleDescription,
                  original_flash_price: product.originalFlashPrice,
                  flash_sale_price: product.flashSalePrice
                })
              
              if (!error) {
                migrationResults.products++
              } else {
                console.log('⚠️ Erreur insertion produit:', error)
              }
            } catch (err) {
              console.log('⚠️ Erreur traitement produit:', err)
            }
          }
        }
        console.log(`✅ ${migrationResults.products} produits migrés`)
      } else {
        console.log('❌ Erreur récupération produits:', productsResponse.statusText)
      }
    } catch (error) {
      console.error('❌ Erreur migration produits:', error)
    }

    // 3. Migrer les contacts
    try {
      console.log('📦 Récupération des contacts...')
      const contactsResponse = await fetch(`${serverUrl}/api/contacts`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      })
      
      if (contactsResponse.ok) {
        const contacts = await contactsResponse.json()
        console.log('📋 Contacts récupérés:', contacts?.length || 0)
        
        if (contacts && Array.isArray(contacts) && contacts.length > 0) {
          for (const contact of contacts) {
            try {
              const { error } = await supabaseClient
                .from('contacts')
                .upsert({
                  id: contact.id,
                  nom: contact.nom || '',
                  prenom: contact.prenom || '',
                  email: contact.email || '',
                  telephone: contact.telephone || '',
                  adresse: contact.adresse || '',
                  objet: contact.objet || '',
                  message: contact.message || '',
                  date_creation: contact.dateCreation || new Date().toISOString(),
                  read: contact.read || false
                })
              
              if (!error) {
                migrationResults.contacts++
              }
            } catch (err) {
              console.log('⚠️ Erreur traitement contact:', err)
            }
          }
        }
        console.log(`✅ ${migrationResults.contacts} contacts migrés`)
      }
    } catch (error) {
      console.error('❌ Erreur migration contacts:', error)
    }

    // 4. Migrer les codes promos
    try {
      console.log('📦 Récupération des codes promos...')
      const codePromosResponse = await fetch(`${serverUrl}/api/code-promos`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      })
      
      if (codePromosResponse.ok) {
        const codePromos = await codePromosResponse.json()
        console.log('📋 Codes promos récupérés:', codePromos?.length || 0)
        
        if (codePromos && Array.isArray(codePromos) && codePromos.length > 0) {
          for (const codePromo of codePromos) {
            try {
              const { error } = await supabaseClient
                .from('code_promos')
                .upsert({
                  id: codePromo.id,
                  code: codePromo.code,
                  pourcentage: codePromo.pourcentage || 0,
                  quantite: codePromo.quantite || 1,
                  product_id: codePromo.productId,
                  product_name: codePromo.productName || '',
                  created_at: codePromo.createdAt || new Date().toISOString()
                })
              
              if (!error) {
                migrationResults.code_promos++
              }
            } catch (err) {
              console.log('⚠️ Erreur traitement code promo:', err)
            }
          }
        }
        console.log(`✅ ${migrationResults.code_promos} codes promos migrés`)
      }
    } catch (error) {
      console.error('❌ Erreur migration codes promos:', error)
    }

    // 5. Migrer les avis/reviews
    try {
      console.log('📦 Récupération des avis...')
      const reviewsResponse = await fetch(`${serverUrl}/api/reviews`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      })
      
      if (reviewsResponse.ok) {
        const reviews = await reviewsResponse.json()
        console.log('📋 Avis récupérés:', reviews?.length || 0)
        
        if (reviews && Array.isArray(reviews) && reviews.length > 0) {
          for (const review of reviews) {
            try {
              const { error } = await supabaseClient
                .from('reviews')
                .upsert({
                  id: review.id,
                  user_name: review.userName || 'Anonyme',
                  product_id: review.productId,
                  product_rating: review.productRating || 5,
                  delivery_rating: review.deliveryRating || 5,
                  comment: review.comment || '',
                  photos: review.photos || [],
                  created_at: review.createdAt || new Date().toISOString(),
                  updated_at: review.updatedAt || new Date().toISOString()
                })
              
              if (!error) {
                migrationResults.reviews++
              }
            } catch (err) {
              console.log('⚠️ Erreur traitement avis:', err)
            }
          }
        }
        console.log(`✅ ${migrationResults.reviews} avis migrés`)
      }
    } catch (error) {
      console.error('❌ Erreur migration avis:', error)
    }

    // 6. Migrer la publicité (pub layout)
    try {
      console.log('📦 Récupération des publicités...')
      const pubLayoutResponse = await fetch(`${serverUrl}/api/pub-layout`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      })
      
      if (pubLayoutResponse.ok) {
        const pubLayout = await pubLayoutResponse.json()
        console.log('📋 Publicités récupérées:', pubLayout?.length || 0)
        
        if (pubLayout && Array.isArray(pubLayout) && pubLayout.length > 0) {
          for (const pub of pubLayout) {
            try {
              const { error } = await supabaseClient
                .from('pub_layout')
                .upsert({
                  id: pub.id,
                  icon: pub.icon || '',
                  text: pub.text || '',
                  created_at: pub.createdAt || new Date().toISOString()
                })
              
              if (!error) {
                migrationResults.pub_layout++
              }
            } catch (err) {
              console.log('⚠️ Erreur traitement publicité:', err)
            }
          }
        }
        console.log(`✅ ${migrationResults.pub_layout} publicités migrées`)
      }
    } catch (error) {
      console.error('❌ Erreur migration publicités:', error)
    }

    // 7. Créer une vente flash par défaut basée sur les données existantes
    try {
      console.log('📦 Création de vente flash par défaut...')
      const { error } = await supabaseClient
        .from('flash_sales')
        .upsert({
          id: 'flash-sale-default',
          title: 'Ventes Flash',
          description: 'Offres spéciales limitées dans le temps',
          discount: 30,
          start_date: new Date().toISOString(),
          end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          product_ids: ['1748532716997'], // ID du produit iPhone existant
          is_active: true,
          created_at: new Date().toISOString()
        })
      
      if (!error) {
        migrationResults.banniereflashsale = 1
      }
      console.log(`✅ Vente flash créée`)
    } catch (error) {
      console.error('❌ Erreur création vente flash:', error)
    }

    // 8. Créer une conversation de chat par défaut
    try {
      console.log('📦 Création de conversation de chat...')
      const { error } = await supabaseClient
        .from('chat_conversations')
        .upsert({
          id: 'client-service-default',
          type: 'service',
          participants: ['system'],
          messages: [{
            id: 'msg-auto-' + Date.now(),
            senderId: 'system',
            content: 'Bienvenue dans notre service client en ligne. Un conseiller va vous répondre dans les plus brefs délais.',
            timestamp: new Date().toISOString(),
            read: false,
            isSystemMessage: true
          }],
          online_users: {},
          auto_reply_sent: {},
          active_calls: {},
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
      
      if (!error) {
        migrationResults.chat_conversations = 1
      }
      console.log(`✅ Conversation de chat créée`)
    } catch (error) {
      console.error('❌ Erreur création chat:', error)
    }

    // 9. Créer les statistiques de visiteurs par défaut
    try {
      console.log('📦 Création des statistiques de visiteurs...')
      const { error } = await supabaseClient
        .from('visitors')
        .upsert({
          daily: { date: new Date().toISOString().split('T')[0], count: 0, uniqueVisitors: [] },
          weekly: { week: Math.ceil((new Date().getTime() - new Date().getFullYear(), 0, 1) / (7 * 24 * 60 * 60 * 1000)), year: new Date().getFullYear(), count: 0 },
          monthly: { month: new Date().getMonth(), year: new Date().getFullYear(), count: 0 },
          yearly: { year: new Date().getFullYear(), count: 0 },
          current_viewing: 0,
          last_visit: new Date().toISOString(),
          online_users: []
        })
      
      if (!error) {
        migrationResults.visitors = 1
      }
      console.log(`✅ Statistiques de visiteurs créées`)
    } catch (error) {
      console.error('❌ Erreur création statistiques:', error)
    }

    // 10. Créer les paramètres de site par défaut
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
        .upsert(defaultSettings)
      
      if (!error) {
        migrationResults.site_settings = 1
      }
      console.log(`✅ Paramètres de site configurés`)
    } catch (error) {
      console.error('❌ Erreur configuration paramètres:', error)
    }

    console.log('🎉 Migration complète terminée!', migrationResults)

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Migration complète des données terminée avec succès',
        results: migrationResults,
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
