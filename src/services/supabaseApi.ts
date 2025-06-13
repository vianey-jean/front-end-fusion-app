
import { supabase } from '@/integrations/supabase/client';

// Service pour migrer les données JSON vers Supabase
export const migrateAllDataToSupabase = async () => {
  try {
    console.log('🚀 Démarrage de la migration complète des données...');
    
    const { data, error } = await supabase.functions.invoke('complete-migration', {
      body: { action: 'migrate-all' }
    });

    if (error) {
      console.error('❌ Erreur lors de la migration:', error);
      throw error;
    }

    console.log('✅ Migration complète terminée avec succès:', data);
    return data;
  } catch (error) {
    console.error('❌ Erreur migration complète:', error);
    throw error;
  }
};

// Service pour synchroniser avec le serveur distant (optionnel, pour la compatibilité)
export const syncWithServer = async (action: string, table: string, data: any) => {
  try {
    const { data: result, error } = await supabase.functions.invoke('sync-server', {
      body: { action, table, data }
    });

    if (error) {
      console.error('❌ Erreur de synchronisation:', error);
      throw error;
    }

    return result;
  } catch (error) {
    console.error('❌ Erreur sync:', error);
    throw error;
  }
};

// Services CRUD pour chaque table - Utilisation exclusive de Supabase
export const categoriesService = {
  getAll: async () => {
    const { data, error } = await supabase.from('categories').select('*').order('order');
    if (error) throw error;
    return data;
  },
  
  create: async (category: any) => {
    const categoryData = {
      id: category.id || `category-${Date.now()}`,
      name: category.name,
      description: category.description,
      order: category.order || 0,
      is_active: category.isActive ?? true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    const { data, error } = await supabase.from('categories').insert(categoryData).select().single();
    if (error) throw error;
    return data;
  },
  
  update: async (id: string, updates: any) => {
    const updateData = {
      ...updates,
      updated_at: new Date().toISOString()
    };
    
    const { data, error } = await supabase.from('categories').update(updateData).eq('id', id).select().single();
    if (error) throw error;
    return data;
  },
  
  delete: async (id: string) => {
    const { error } = await supabase.from('categories').delete().eq('id', id);
    if (error) throw error;
    return { success: true };
  }
};

export const productsService = {
  getAll: async () => {
    const { data, error } = await supabase.from('products').select('*').order('date_ajout', { ascending: false });
    if (error) throw error;
    return data;
  },
  
  getByCategory: async (category: string) => {
    const { data, error } = await supabase.from('products').select('*').eq('category', category);
    if (error) throw error;
    return data;
  },
  
  getById: async (id: string) => {
    const { data, error } = await supabase.from('products').select('*').eq('id', id).single();
    if (error) throw error;
    return data;
  },
  
  create: async (product: any) => {
    const productData = {
      id: product.id || `product-${Date.now()}`,
      name: product.name,
      description: product.description,
      price: product.price,
      original_price: product.originalPrice,
      category: product.category,
      images: product.images || [],
      image: product.image,
      promotion: product.promotion,
      promotion_end: product.promotionEnd,
      stock: product.stock || 0,
      is_sold: product.isSold || false,
      date_ajout: new Date().toISOString(),
      flash_sale_discount: product.flashSaleDiscount,
      flash_sale_start_date: product.flashSaleStartDate,
      flash_sale_end_date: product.flashSaleEndDate,
      flash_sale_title: product.flashSaleTitle,
      flash_sale_description: product.flashSaleDescription,
      original_flash_price: product.originalFlashPrice,
      flash_sale_price: product.flashSalePrice
    };
    
    const { data, error } = await supabase.from('products').insert(productData).select().single();
    if (error) throw error;
    return data;
  },
  
  update: async (id: string, updates: any) => {
    const { data, error } = await supabase.from('products').update(updates).eq('id', id).select().single();
    if (error) throw error;
    return data;
  },
  
  delete: async (id: string) => {
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) throw error;
    return { success: true };
  }
};

export const ordersService = {
  create: async (order: any) => {
    const orderData = {
      id: order.id || `order-${Date.now()}`,
      user_id: order.userId,
      user_name: order.userName,
      user_email: order.userEmail,
      items: order.items,
      total_amount: order.totalAmount,
      original_amount: order.originalAmount,
      discount: order.discount,
      code_promo_used: order.codePromoUsed,
      payment_method: order.paymentMethod,
      shipping_address: order.shippingAddress,
      status: order.status || 'en attente',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    const { data, error } = await supabase.from('orders').insert(orderData).select().single();
    if (error) throw error;
    return data;
  },
  
  getUserOrders: async (userId: string) => {
    const { data, error } = await supabase.from('orders').select('*').eq('user_id', userId).order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },
  
  getAll: async () => {
    const { data, error } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },
  
  updateStatus: async (id: string, status: string) => {
    const { data, error } = await supabase.from('orders').update({ status, updated_at: new Date().toISOString() }).eq('id', id).select().single();
    if (error) throw error;
    return data;
  }
};

export const contactsService = {
  create: async (contact: any) => {
    const contactData = {
      id: `contact-${Date.now()}`,
      nom: contact.nom,
      prenom: contact.prenom,
      email: contact.email,
      telephone: contact.telephone,
      adresse: contact.adresse,
      objet: contact.objet,
      message: contact.message,
      date_creation: new Date().toISOString(),
      read: false
    };
    
    const { data, error } = await supabase.from('contacts').insert(contactData).select().single();
    if (error) throw error;
    return data;
  },
  
  getAll: async () => {
    const { data, error } = await supabase.from('contacts').select('*').order('date_creation', { ascending: false });
    if (error) throw error;
    return data;
  },
  
  markAsRead: async (id: string) => {
    const { data, error } = await supabase.from('contacts').update({ read: true }).eq('id', id).select().single();
    if (error) throw error;
    return data;
  }
};

export const reviewsService = {
  getAll: async () => {
    const { data, error } = await supabase.from('reviews').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },
  
  getByProductId: async (productId: string) => {
    const { data, error } = await supabase.from('reviews').select('*').eq('product_id', productId);
    if (error) throw error;
    return data;
  },
  
  create: async (review: any) => {
    const reviewData = {
      id: `review-${Date.now()}`,
      user_id: review.userId,
      user_name: review.userName,
      product_id: review.productId,
      product_rating: review.productRating,
      delivery_rating: review.deliveryRating,
      comment: review.comment,
      photos: review.photos || [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    const { data, error } = await supabase.from('reviews').insert(reviewData).select().single();
    if (error) throw error;
    return data;
  }
};

export const codePromosService = {
  getAll: async () => {
    const { data, error } = await supabase.from('code_promos').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },
  
  getByCode: async (code: string) => {
    const { data, error } = await supabase.from('code_promos').select('*').eq('code', code).single();
    if (error) throw error;
    return data;
  },
  
  create: async (codePromo: any) => {
    const codePromoData = {
      id: `promo-${Date.now()}`,
      code: codePromo.code,
      pourcentage: codePromo.pourcentage,
      quantite: codePromo.quantite || 1,
      product_id: codePromo.productId,
      product_name: codePromo.productName,
      created_at: new Date().toISOString()
    };
    
    const { data, error } = await supabase.from('code_promos').insert(codePromoData).select().single();
    if (error) throw error;
    return data;
  },
  
  updateQuantity: async (id: string, newQuantity: number) => {
    const { data, error } = await supabase.from('code_promos').update({ quantite: newQuantity }).eq('id', id).select().single();
    if (error) throw error;
    return data;
  }
};

export const siteSettingsService = {
  get: async () => {
    const { data, error } = await supabase.from('site_settings').select('*').single();
    if (error) throw error;
    return data;
  },
  
  update: async (settings: any) => {
    const { data, error } = await supabase.from('site_settings').update({
      ...settings,
      updated_at: new Date().toISOString()
    }).select().single();
    if (error) throw error;
    return data;
  }
};

export const pubLayoutService = {
  getAll: async () => {
    const { data, error } = await supabase.from('pub_layout').select('*').order('created_at');
    if (error) throw error;
    return data;
  },
  
  create: async (pub: any) => {
    const pubData = {
      id: `pub-${Date.now()}`,
      icon: pub.icon,
      text: pub.text,
      created_at: new Date().toISOString()
    };
    
    const { data, error } = await supabase.from('pub_layout').insert(pubData).select().single();
    if (error) throw error;
    return data;
  },
  
  update: async (id: string, updates: any) => {
    const { data, error } = await supabase.from('pub_layout').update(updates).eq('id', id).select().single();
    if (error) throw error;
    return data;
  },
  
  delete: async (id: string) => {
    const { error } = await supabase.from('pub_layout').delete().eq('id', id);
    if (error) throw error;
    return { success: true };
  }
};

export const flashSalesService = {
  getAll: async () => {
    const { data, error } = await supabase.from('flash_sales').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },
  
  getActive: async () => {
    const { data, error } = await supabase.from('flash_sales').select('*').eq('is_active', true);
    if (error) throw error;
    return data;
  },
  
  create: async (flashSale: any) => {
    const flashSaleData = {
      id: `flash-${Date.now()}`,
      title: flashSale.title,
      description: flashSale.description,
      discount: flashSale.discount,
      start_date: flashSale.startDate,
      end_date: flashSale.endDate,
      product_ids: flashSale.productIds || [],
      is_active: flashSale.isActive || false,
      created_at: new Date().toISOString()
    };
    
    const { data, error } = await supabase.from('flash_sales').insert(flashSaleData).select().single();
    if (error) throw error;
    return data;
  }
};

export const favoritesService = {
  getUserFavorites: async (userId: string) => {
    const { data, error } = await supabase.from('favorites').select('*').eq('user_id', userId);
    if (error) throw error;
    return data;
  },
  
  add: async (userId: string, productId: string) => {
    const favoriteData = {
      id: `fav-${Date.now()}`,
      user_id: userId,
      product_id: productId,
      created_at: new Date().toISOString()
    };
    
    const { data, error } = await supabase.from('favorites').insert(favoriteData).select().single();
    if (error) throw error;
    return data;
  },
  
  remove: async (userId: string, productId: string) => {
    const { error } = await supabase.from('favorites').delete().eq('user_id', userId).eq('product_id', productId);
    if (error) throw error;
    return { success: true };
  }
};

export const cartService = {
  getUserCart: async (userId: string) => {
    const { data, error } = await supabase.from('cart').select('*').eq('user_id', userId).single();
    if (error && error.code !== 'PGRST116') throw error; // PGRST116 = pas de résultat
    return data;
  },
  
  updateCart: async (userId: string, items: any[]) => {
    const cartData = {
      user_id: userId,
      items: items,
      updated_at: new Date().toISOString()
    };
    
    const { data, error } = await supabase.from('cart').upsert(cartData).select().single();
    if (error) throw error;
    return data;
  },
  
  clearCart: async (userId: string) => {
    const { error } = await supabase.from('cart').delete().eq('user_id', userId);
    if (error) throw error;
    return { success: true };
  }
};

export const visitorsService = {
  getStats: async () => {
    const { data, error } = await supabase.from('visitors').select('*').single();
    if (error) throw error;
    return data;
  },
  
  updateStats: async (stats: any) => {
    const { data, error } = await supabase.from('visitors').upsert({
      ...stats,
      last_visit: new Date().toISOString()
    }).select().single();
    if (error) throw error;
    return data;
  }
};

// Service pour les notifications de vente
export const salesNotificationsService = {
  getLatest: async () => {
    const { data, error } = await supabase.from('sales_notifications').select('*').order('timestamp', { ascending: false }).limit(1).single();
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  },
  
  create: async (notification: any) => {
    const notificationData = {
      id: `notif-${Date.now()}`,
      customer_name: notification.customerName,
      name: notification.productName,
      location: notification.location || 'France',
      timestamp: new Date().toISOString(),
      time_ago: 'à l\'instant'
    };
    
    const { data, error } = await supabase.from('sales_notifications').insert(notificationData).select().single();
    if (error) throw error;
    return data;
  }
};
