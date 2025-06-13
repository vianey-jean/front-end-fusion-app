
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

    const { action, table, data } = await req.json()
    console.log(`🔄 Synchronisation ${action} sur ${table}`)

    const serverUrl = 'https://riziky-boutic-server.onrender.com'

    // Synchroniser avec le serveur distant
    switch (table) {
      case 'products':
        if (action === 'INSERT' || action === 'UPDATE') {
          // Envoyer au serveur distant
          await fetch(`${serverUrl}/api/products`, {
            method: action === 'INSERT' ? 'POST' : 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
          })
        }
        break

      case 'categories':
        if (action === 'INSERT' || action === 'UPDATE') {
          await fetch(`${serverUrl}/api/categories`, {
            method: action === 'INSERT' ? 'POST' : 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
          })
        }
        break

      case 'orders':
        if (action === 'INSERT') {
          // Notifier le serveur d'une nouvelle commande
          await fetch(`${serverUrl}/api/orders`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
          })

          // Enregistrer une notification de vente
          await fetch(`${serverUrl}/api/sales-notifications/record`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              customerName: data.user_name,
              productName: data.items?.[0]?.name || 'Produit',
              location: 'France'
            })
          })
        }
        break

      case 'contacts':
        if (action === 'INSERT') {
          await fetch(`${serverUrl}/api/contacts`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
          })
        }
        break
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: `Synchronisation ${action} sur ${table} réussie`,
        timestamp: new Date().toISOString()
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    console.error('❌ Erreur de synchronisation:', error)
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
