# Stoic Wisdom Frontend

A modern, vintage-themed web application that consumes the Stoic Wisdom API. Built with Next.js 15, TypeScript, and Tailwind CSS, deployed on Azure Static Web Apps.

## Features

- **Vintage Design**: Classic serif typography and aged paper aesthetic
- **Responsive Layout**: Mobile-friendly design that works on all devices
- **Core Pages**:
  - Landing page with random quote generator
  - Philosophers list and detail pages
  - Quotes explorer with search and filtering
  - Stoic themes overview
  - Historical timeline
  - "Surprise Me" page with random content

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Data Fetching**: SWR for client-side caching
- **Fonts**: Crimson Text (serif) and Lato (sans-serif)
- **Deployment**: Azure Static Web Apps

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

### Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_API_BASE_URL=http://stoic-wisdom-api.eastus.azurecontainer.io:3000
```

## Building for Production

```bash
# Build the application
npm run build

# Start production server
npm run start
```

## Project Structure

```
frontend/
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Landing page
│   ├── philosophers/      # Philosophers pages
│   ├── quotes/           # Quotes explorer
│   ├── themes/           # Themes overview
│   ├── timeline/         # Historical timeline
│   └── surprise/         # Random content page
├── components/           # Reusable components
│   ├── Navigation.tsx
│   ├── Loading.tsx
│   └── ErrorDisplay.tsx
├── lib/                  # Utilities and API client
│   └── api.ts           # API client library
└── public/              # Static assets
```

## API Integration

The app connects to the Stoic Wisdom API with the following endpoints:

- `/philosophers` - List all philosophers
- `/philosophers/:id` - Get philosopher details
- `/philosophers/:id/quotes` - Get philosopher with quotes
- `/quotes` - List all quotes with filtering
- `/quotes/random` - Random quote
- `/themes` - List themes
- `/timeline` - Historical timeline
- `/incidents` - List historical incidents

## Deployment to Azure Static Web Apps

### Prerequisites

1. Azure subscription
2. GitHub repository
3. Azure CLI installed

### Steps

1. **Create Azure Static Web App**:

```bash
az staticwebapp create \
  --name stoic-wisdom-frontend \
  --resource-group stoic-wisdom-rg \
  --source https://github.com/YOUR_ORG/stoic-wisdom-api \
  --location "East US" \
  --branch main \
  --app-location "/frontend" \
  --output-location "" \
  --login-with-github
```

2. **Configure GitHub Secret**:

Get the deployment token:
```bash
az staticwebapp secrets list \
  --name stoic-wisdom-frontend \
  --resource-group stoic-wisdom-rg
```

Add it as `AZURE_STATIC_WEB_APPS_API_TOKEN` in GitHub repository secrets.

3. **Set Environment Variables**:

In Azure Portal, navigate to your Static Web App and add:
- `NEXT_PUBLIC_API_BASE_URL`: Your API base URL

### GitHub Actions

The workflow automatically deploys on push to main branch. See `.github/workflows/azure-static-web-apps.yml`.

## Design Philosophy

The frontend features a vintage aesthetic inspired by classical books and ancient manuscripts:

- **Color Palette**: Aged paper (#f4f1e8), sepia tones, and warm browns
- **Typography**: Crimson Text for a classic serif feel, Lato for clean sans-serif
- **Visual Elements**: Ornamental dividers, decorative flourishes (❦), paper texture overlay
- **Interactions**: Smooth transitions and hover effects that feel tactile and substantial

## Performance

- Client-side caching with SWR for instant navigation
- Optimized images and fonts
- Responsive design with mobile-first approach
- Static generation where possible

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT License - see LICENSE file for details

## Support

For issues or questions:
- Check the main project README
- Open an issue on GitHub
- Review API documentation in API_EXAMPLES.md
