
-- Créer la fonction Edge pour migrer les données
CREATE OR REPLACE FUNCTION migrate_json_data_to_supabase()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result jsonb := '{"success": true, "migrated": {}}';
BEGIN
  -- Cette fonction sera appelée par l'Edge Function
  -- qui récupérera les données du serveur JSON
  RETURN result;
END;
$$;

-- Assurer que toutes les tables ont les bonnes politiques RLS
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.code_promos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sales_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.flash_sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pub_layout ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.visitors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Politiques pour les catégories (lecture publique, écriture admin)
DROP POLICY IF EXISTS "Lecture publique des catégories" ON public.categories;
CREATE POLICY "Lecture publique des catégories" ON public.categories
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin peut modifier catégories" ON public.categories;
CREATE POLICY "Admin peut modifier catégories" ON public.categories
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Politiques pour les produits (lecture publique, écriture admin)
DROP POLICY IF EXISTS "Lecture publique des produits" ON public.products;
CREATE POLICY "Lecture publique des produits" ON public.products
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin peut modifier produits" ON public.products;
CREATE POLICY "Admin peut modifier produits" ON public.products
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Politiques pour les commandes (utilisateur peut voir ses commandes, admin peut tout voir)
DROP POLICY IF EXISTS "Utilisateur peut voir ses commandes" ON public.orders;
CREATE POLICY "Utilisateur peut voir ses commandes" ON public.orders
  FOR SELECT USING (
    user_id = auth.uid() OR 
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

DROP POLICY IF EXISTS "Utilisateur peut créer ses commandes" ON public.orders;
CREATE POLICY "Utilisateur peut créer ses commandes" ON public.orders
  FOR INSERT WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "Admin peut modifier commandes" ON public.orders;
CREATE POLICY "Admin peut modifier commandes" ON public.orders
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Politiques pour les contacts (création publique, lecture admin)
DROP POLICY IF EXISTS "Création publique des contacts" ON public.contacts;
CREATE POLICY "Création publique des contacts" ON public.contacts
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Admin peut voir contacts" ON public.contacts;
CREATE POLICY "Admin peut voir contacts" ON public.contacts
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

DROP POLICY IF EXISTS "Admin peut modifier contacts" ON public.contacts;
CREATE POLICY "Admin peut modifier contacts" ON public.contacts
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Politiques pour les avis (lecture publique, écriture utilisateur connecté)
DROP POLICY IF EXISTS "Lecture publique des avis" ON public.reviews;
CREATE POLICY "Lecture publique des avis" ON public.reviews
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Utilisateur peut créer ses avis" ON public.reviews;
CREATE POLICY "Utilisateur peut créer ses avis" ON public.reviews
  FOR INSERT WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "Utilisateur peut modifier ses avis" ON public.reviews;
CREATE POLICY "Utilisateur peut modifier ses avis" ON public.reviews
  FOR UPDATE USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Utilisateur peut supprimer ses avis" ON public.reviews;
CREATE POLICY "Utilisateur peut supprimer ses avis" ON public.reviews
  FOR DELETE USING (
    user_id = auth.uid() OR 
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Politiques pour les favoris (utilisateur peut gérer ses favoris)
DROP POLICY IF EXISTS "Utilisateur peut voir ses favoris" ON public.favorites;
CREATE POLICY "Utilisateur peut voir ses favoris" ON public.favorites
  FOR SELECT USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Utilisateur peut gérer ses favoris" ON public.favorites;
CREATE POLICY "Utilisateur peut gérer ses favoris" ON public.favorites
  FOR ALL WITH CHECK (user_id = auth.uid());

-- Politiques pour le panier (utilisateur peut gérer son panier)
DROP POLICY IF EXISTS "Utilisateur peut voir son panier" ON public.cart;
CREATE POLICY "Utilisateur peut voir son panier" ON public.cart
  FOR SELECT USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Utilisateur peut gérer son panier" ON public.cart;
CREATE POLICY "Utilisateur peut gérer son panier" ON public.cart
  FOR ALL WITH CHECK (user_id = auth.uid());

-- Politiques pour les préférences (utilisateur peut gérer ses préférences)
DROP POLICY IF EXISTS "Utilisateur peut voir ses préférences" ON public.preferences;
CREATE POLICY "Utilisateur peut voir ses préférences" ON public.preferences
  FOR SELECT USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Utilisateur peut gérer ses préférences" ON public.preferences;
CREATE POLICY "Utilisateur peut gérer ses préférences" ON public.preferences
  FOR ALL WITH CHECK (user_id = auth.uid());

-- Politiques pour les codes promos (lecture publique pour vérification, gestion admin)
DROP POLICY IF EXISTS "Lecture publique des codes promos" ON public.code_promos;
CREATE POLICY "Lecture publique des codes promos" ON public.code_promos
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin peut gérer codes promos" ON public.code_promos;
CREATE POLICY "Admin peut gérer codes promos" ON public.code_promos
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Politiques pour les ventes flash (lecture publique, gestion admin)
DROP POLICY IF EXISTS "Lecture publique des ventes flash" ON public.flash_sales;
CREATE POLICY "Lecture publique des ventes flash" ON public.flash_sales
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin peut gérer ventes flash" ON public.flash_sales;
CREATE POLICY "Admin peut gérer ventes flash" ON public.flash_sales
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Politiques pour les notifications de vente (lecture publique, écriture système)
DROP POLICY IF EXISTS "Lecture publique des notifications" ON public.sales_notifications;
CREATE POLICY "Lecture publique des notifications" ON public.sales_notifications
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Système peut créer notifications" ON public.sales_notifications;
CREATE POLICY "Système peut créer notifications" ON public.sales_notifications
  FOR INSERT WITH CHECK (true);

-- Politiques pour la publicité (lecture publique, gestion admin)
DROP POLICY IF EXISTS "Lecture publique des publicités" ON public.pub_layout;
CREATE POLICY "Lecture publique des publicités" ON public.pub_layout
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin peut gérer publicités" ON public.pub_layout;
CREATE POLICY "Admin peut gérer publicités" ON public.pub_layout
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Politiques pour les conversations de chat (admin peut tout voir)
DROP POLICY IF EXISTS "Admin peut voir conversations" ON public.chat_conversations;
CREATE POLICY "Admin peut voir conversations" ON public.chat_conversations
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

DROP POLICY IF EXISTS "Admin peut gérer conversations" ON public.chat_conversations;
CREATE POLICY "Admin peut gérer conversations" ON public.chat_conversations
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Politiques pour les visiteurs (lecture admin, écriture système)
DROP POLICY IF EXISTS "Admin peut voir visiteurs" ON public.visitors;
CREATE POLICY "Admin peut voir visiteurs" ON public.visitors
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

DROP POLICY IF EXISTS "Système peut modifier visiteurs" ON public.visitors;
CREATE POLICY "Système peut modifier visiteurs" ON public.visitors
  FOR ALL WITH CHECK (true);

-- Politiques pour les paramètres du site (lecture publique, gestion admin)
DROP POLICY IF EXISTS "Lecture publique des paramètres" ON public.site_settings;
CREATE POLICY "Lecture publique des paramètres" ON public.site_settings
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin peut gérer paramètres" ON public.site_settings;
CREATE POLICY "Admin peut gérer paramètres" ON public.site_settings
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Politiques pour les profils (utilisateur peut voir/modifier son profil, admin peut tout voir)
DROP POLICY IF EXISTS "Utilisateur peut voir son profil" ON public.profiles;
CREATE POLICY "Utilisateur peut voir son profil" ON public.profiles
  FOR SELECT USING (
    id = auth.uid() OR 
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

DROP POLICY IF EXISTS "Utilisateur peut modifier son profil" ON public.profiles;
CREATE POLICY "Utilisateur peut modifier son profil" ON public.profiles
  FOR UPDATE USING (id = auth.uid());

DROP POLICY IF EXISTS "Admin peut gérer profils" ON public.profiles;
CREATE POLICY "Admin peut gérer profils" ON public.profiles
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Créer un trigger pour créer automatiquement un profil lors de l'inscription
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role)
  VALUES (new.id, new.email, 'client');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
