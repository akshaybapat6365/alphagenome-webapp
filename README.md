# AlphaGenome Web Application

A modern web application for analyzing genetic variants using Google DeepMind's AlphaGenome model.

🔗 **Live Demo**: https://alphagenome-webapp-vhl20kpvo-akshay-bapats-projects.vercel.app

## Features

- 🧬 **Multi-format Support**: Upload genetic data in VCF, 23andMe, or custom tab-delimited formats
- 🤖 **AI-Powered Analysis**: Leverages AlphaGenome for variant effect prediction
- 📊 **Comprehensive Results**: Get pathogenicity scores, functional effects, and confidence levels
- 💾 **Export Results**: Download analysis results as CSV
- 🌓 **Dark/Light Theme**: Comfortable viewing in any lighting condition
- ⚡ **Real-time Analysis**: Fast processing of genetic variants

## Architecture

```
┌─────────────────┐     ┌─────────────────┐     ┌──────────────────┐
│   Web Browser   │────▶│ Vercel Frontend │────▶│  Render Backend  │
│                 │     │   (Next.js)     │     │ (Python/Flask)   │
└─────────────────┘     └─────────────────┘     └──────────────────┘
                                                          │
                                                          ▼
                                                 ┌──────────────────┐
                                                 │   AlphaGenome    │
                                                 │  Python Library  │
                                                 └──────────────────┘
```

## Repositories

- **Frontend (This Repo)**: Next.js application deployed on Vercel
- **Backend**: https://github.com/akshaybapat6365/alphagenome-backend - Python Flask API with AlphaGenome integration

## Deployment Status

| Component | Status | URL |
|-----------|--------|-----|
| Frontend | ✅ Deployed | https://alphagenome-webapp.vercel.app |
| Backend | 📦 Ready to Deploy | [Deploy to Render](https://dashboard.render.com/select-repo?type=web&repo=https://github.com/akshaybapat6365/alphagenome-backend) |

## Quick Start

### Frontend Development

```bash
# Clone the repository
git clone https://github.com/akshaybapat6365/alphagenome-webapp.git
cd alphagenome-webapp

# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

### Environment Variables

Create a `.env.local` file:

```env
# Backend URL (once deployed to Render)
NEXT_PUBLIC_BACKEND_URL=https://alphagenome-backend.onrender.com

# Use local mock API (for development without backend)
NEXT_PUBLIC_USE_LOCAL_MOCK=false
```

## Backend Deployment

The backend needs to be deployed to Render for full functionality:

1. Visit: https://dashboard.render.com/select-repo?type=web
2. Select the `alphagenome-backend` repository
3. Render will auto-configure from `render.yaml`
4. Click "Create Web Service"

## Usage

1. **Select Input Format**: Choose between VCF, 23andMe, or custom tab format
2. **Load Sample Data**: Use the "Load Sample" button to test with example data
3. **Paste Your Data**: Input your genetic variant data
4. **Analyze**: Click "Analyze SNPs" to process your variants
5. **View Results**: See pathogenicity scores and functional predictions
6. **Export**: Download results as CSV for further analysis

## Sample Data Format

### VCF Format
```
##fileformat=VCFv4.2
#CHROM  POS     ID              REF ALT
1       69869   rs548049170     T   C
```

### 23andMe Format
```
# rsid  chromosome  position    genotype
rs548049170 1       69869       TT
```

### Custom Tab Format
```
rs548049170 1 69869 TT
rs9283150 1 565508 AA
```

## Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS, Radix UI
- **Backend**: Python, Flask, AlphaGenome, Gunicorn
- **Deployment**: Vercel (Frontend), Render (Backend)
- **AI Model**: Google DeepMind AlphaGenome

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is for educational and research purposes. AlphaGenome is provided by Google DeepMind for non-commercial use.

## Acknowledgments

- Google DeepMind for the AlphaGenome model
- Vercel for frontend hosting
- Render for backend hosting capabilities