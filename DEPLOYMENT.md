# RoomAI Frontend Deployment Guide

## Quick Start (Local Development)

### Prerequisites
- Node.js 18+
- npm or yarn

### Step 1: Install Dependencies
```bash
# Install Node.js dependencies
npm install
```

### Step 2: Start Development Server
```bash
# Start the development server
npm run dev

# Your app will be available at:
# http://localhost:3000
```

### Step 3: Test the App
1. Visit http://localhost:3000
2. Upload a room photo
3. Select style and room type
4. Click "Redesign my room"
5. View the generated result

---

## Production Deployment

### Option 1: Vercel (Recommended)

1. **Install Vercel CLI**
```bash
npm install -g vercel
```

2. **Login to Vercel**
```bash
vercel login
```

3. **Deploy to Vercel**
```bash
vercel --prod
```

4. **Follow the prompts:**
   - Link to existing Vercel project or create new
   - Confirm build settings
   - Wait for deployment

5. **Your app will be live at:**
   - `https://your-app-name.vercel.app`

### Option 2: Netlify

1. **Build the app**
```bash
npm run build
```

2. **Deploy to Netlify**
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login and deploy
netlify login
netlify deploy --prod --dir=.next
```

### Option 3: Railway

1. **Install Railway CLI**
```bash
npm install -g @railway/cli
```

2. **Login and deploy**
```bash
railway login
railway init
railway up
```

### Option 4: Traditional Hosting (VPS/Dedicated)

1. **Build for production**
```bash
npm run build
npm start
```

2. **Use PM2 for process management**
```bash
npm install -g pm2
pm2 start npm --name "roomai" -- start
```

---

## Environment Variables

### Required for Production
```
# For Vercel (in Vercel dashboard)
NEXT_PUBLIC_API_URL=https://your-domain.com/api

# For custom domains
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

---

## Deployment Checklist

### Before Deploying
- [ ] Test locally with `npm run dev`
- [ ] Run `npm run build` to ensure no build errors
- [ ] Check all pages load correctly
- [ ] Test upload functionality
- [ ] Verify responsive design

### After Deploying
- [ ] Test live deployment
- [ ] Check console for errors
- [ ] Verify all navigation links work
- [ ] Test mobile responsiveness
- [ ] Set up custom domain (if needed)

---

## Troubleshooting

### Common Issues

1. **Build fails**
   - Check for TypeScript errors
   - Verify all imports are correct
   - Run `npm install` to update dependencies

2. **App not loading**
   - Check build logs for errors
   - Verify environment variables
   - Check console in browser

3. **Upload not working**
   - Check API route is deployed
   - Verify CORS settings
   - Check network tab in browser

### Debug Mode
```bash
# Build and run locally in production mode
npm run build
npm start

# Check build output
ls -la .next
```

---

## Performance Optimization

### Build Optimization
```bash
# Analyze bundle size
npm run build
npx @next/bundle-analyzer

# Enable production optimizations
NODE_ENV=production npm run build
```

### Runtime Optimization
- Enable Next.js Image Optimization
- Use static generation where possible
- Implement proper caching headers
- Optimize images and assets

---

## Security Checklist

- [ ] Use HTTPS in production
- [ ] Validate file uploads
- [ ] Sanitize user inputs
- [ ] Implement rate limiting
- [ ] Use environment variables for secrets
- [ ] Set proper CORS headers

---

## Cost Estimates (Monthly)

### Vercel (Recommended)
- **Hobby**: $0/month (perfect for MVP)
- **Pro**: $20/month (for production)
- **Enterprise**: Custom pricing

### Netlify
- **Free**: $0/month (100GB bandwidth)
- **Pro**: $19/month (300GB bandwidth)
- **Business**: $99/month (400GB bandwidth)

### Railway
- **Free**: $0/month (500 hours)
- **Pro**: $5/month (unlimited hours)
- **Scale**: Custom pricing

### Traditional VPS
- **DigitalOcean**: $5-50/month
- **AWS EC2**: $10-100/month
- **Google Cloud**: $10-100/month
