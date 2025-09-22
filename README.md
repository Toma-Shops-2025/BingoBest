# BingoBest - Ultimate Money Bingo Experience

A modern, feature-rich online bingo platform built with React, TypeScript, and Supabase. Play bingo with real money, join tournaments, earn achievements, and connect with friends!

## Features

- 🎯 **Real Money Bingo Games** - Play with cryptocurrency payments
- 🏆 **Tournaments** - Compete in various tournament formats
- 🎮 **Achievement System** - Unlock rewards and track progress
- 👥 **Social Features** - Add friends and chat during games
- 💎 **VIP System** - Exclusive benefits for premium players
- 📅 **Daily Challenges** - Complete daily tasks for rewards
- 🎪 **Seasonal Events** - Special limited-time events
- 🔴 **Live Game Feed** - Watch games in real-time
- 🎲 **Power-ups** - Enhance your gameplay experience

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **UI Components**: Radix UI, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Real-time)
- **Payments**: Cryptocurrency (Bitcoin, Ethereum, Litecoin, Dogecoin)
- **Deployment**: Netlify

## Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Toma-Shops-2025/BingoBest.git
   cd BingoBest
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Supabase**
   - Create a new project at [supabase.com](https://supabase.com)
   - Copy your project URL and anon key
   - Run the SQL schema from `supabase-schema.sql` in your Supabase SQL editor

4. **Configure environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_SITE_URL=https://your-domain.com
   VITE_APP_NAME=BingoBest
   VITE_APP_VERSION=1.0.0
   VITE_PAYPAL_CLIENT_ID=your_paypal_client_id
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to `http://localhost:5173`

## PayPal Setup

1. **Create PayPal Developer Account**
   - Go to [PayPal Developer](https://developer.paypal.com/)
   - Sign in with your PayPal account
   - Create a new application

2. **Get Client ID**
   - Copy your Sandbox Client ID for testing
   - Copy your Live Client ID for production
   - Add to your `.env.local` file

3. **Configure Webhooks (Optional)**
   - Set up webhook endpoints for payment notifications
   - Configure return/cancel URLs

## Database Setup

1. **Run the SQL schema**
   - Open your Supabase project dashboard
   - Go to SQL Editor
   - Copy and paste the contents of `supabase-schema.sql`
   - Execute the script

2. **Configure Row Level Security**
   - The schema includes RLS policies
   - Customize them based on your security requirements

## Deployment

### Netlify (Recommended)

1. **Connect your repository**
   - Link your GitHub repository to Netlify
   - The `netlify.toml` file is already configured

2. **Set environment variables**
   - Add your Supabase credentials in Netlify's environment variables section

3. **Deploy**
   - Netlify will automatically build and deploy on every push to main

### Manual Deployment

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Deploy the `dist` folder**
   - Upload to your preferred hosting service
   - Ensure all routes redirect to `index.html` for SPA routing

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_SUPABASE_URL` | Your Supabase project URL | Yes |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anonymous key | Yes |
| `VITE_SITE_URL` | Your production site URL for email confirmations | Yes |
| `VITE_APP_NAME` | Application name | No |
| `VITE_APP_VERSION` | Application version | No |

## Project Structure

```
src/
├── components/          # React components
│   ├── ui/             # Reusable UI components
│   └── ...             # Feature components
├── contexts/           # React contexts
├── hooks/              # Custom hooks
├── lib/                # Utility libraries
├── pages/              # Page components
├── types/              # TypeScript type definitions
└── utils/              # Utility functions
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, email support@bingobest.com or join our Discord community.

## Roadmap

- [ ] Mobile app (React Native)
- [ ] Advanced analytics dashboard
- [ ] More payment methods
- [ ] AI-powered game recommendations
- [ ] Voice chat integration
- [ ] Custom bingo card themes
