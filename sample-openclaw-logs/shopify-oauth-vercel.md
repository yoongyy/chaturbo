# Shopify OAuth callback on Vercel failed
- setup webhook endpoint for /api/auth/callback
- install app in Shopify store
- deploy to Vercel and configure redirect URL
Error: OAuth state mismatch failed validation.
Fixed by setting secure cookie domain and matching callback URL.
mongodb+srv://admin:password123@cluster.mongodb.net/prod
Contact owner at admin@example.com if webhook integration fails.
