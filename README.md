# Endaoment API Sample App

This is a sample application that demonstrates the capabilities of the Endaoment
API for managing donor-advised funds (DAFs).

## Local Development Setup

### Prerequisites

- Node.js
- Docker Desktop
- Supabase CLI (`npm install -g supabase`)

### Database Setup

1. Make sure Docker Desktop is running
2. Start the local Supabase instance:
   ```bash
   npm run supabase:start
   ```
3. Copy the generated environment variables to `.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=<generated_local_url>
   NEXT_PUBLIC_SUPABASE_ANON_KEY=<generated_anon_key>
   ```
4. Start your Next.js development server:
   ```bash
   npm run dev
   ```

### Useful Commands

- `npm run supabase:start` - Start local Supabase
- `npm run supabase:stop` - Stop local Supabase
- `npm run supabase:status` - Check Supabase status
