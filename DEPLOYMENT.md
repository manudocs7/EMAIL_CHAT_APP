# Production Deployment Guide 🚀

## Quick Deployment Checklist

- [ ] Update environment variables for production
- [ ] Update CORS origins in backend
- [ ] Update OAuth redirect URI
- [ ] Build frontend for production
- [ ] Set up HTTPS
- [ ] Configure production server

## Environment Configuration

### Backend (.env)
```env
CLIENT_ID=your_production_client_id
CLIENT_SECRET=your_production_client_secret
```

### Update main.py
```python
# Change REDIRECT_URI to production URL
REDIRECT_URI = "https://yourdomain.com/auth/callback"

# Update CORS origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://yourdomain.com"],  # Your production frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Update Google Cloud Console
1. Go to OAuth 2.0 credentials
2. Add production redirect URI: `https://yourdomain.com/auth/callback`
3. Add production origin: `https://yourdomain.com`

## Build & Deploy

### Frontend Build
```bash
cd frontend
npm run build
# Output will be in frontend/dist/
```

### Backend Production Server
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4
```

## Deployment Options

### Option 1: Vercel (Frontend) + Railway (Backend)

**Frontend (Vercel):**
1. Push code to GitHub
2. Import project in Vercel
3. Build command: `npm run build`
4. Output directory: `dist`

**Backend (Railway):**
1. Create new project
2. Add environment variables
3. Deploy from GitHub
4. Railway will auto-detect FastAPI

### Option 2: Docker

**Dockerfile (Backend):**
```dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

**Dockerfile (Frontend):**
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
FROM nginx:alpine
COPY --from=0 /app/dist /usr/share/nginx/html
```

### Option 3: VPS (DigitalOcean, AWS, etc.)

1. Set up Ubuntu server
2. Install Python, Node.js, Nginx
3. Clone repository
4. Set up systemd services
5. Configure Nginx reverse proxy
6. Set up SSL with Let's Encrypt

## Production Best Practices

### Security
- ✅ Use HTTPS only
- ✅ Set secure environment variables
- ✅ Enable rate limiting
- ✅ Add request validation
- ✅ Implement proper error handling
- ✅ Never expose .env file

### Performance
- ✅ Use production build for frontend
- ✅ Enable gzip compression
- ✅ Add caching headers
- ✅ Use CDN for static assets
- ✅ Monitor server resources

### Monitoring
- ✅ Set up error logging (Sentry)
- ✅ Monitor uptime
- ✅ Track API usage
- ✅ Set up alerts

## Testing Before Production

```bash
# Test backend
cd backend
pytest  # If you add tests

# Test frontend build
cd frontend
npm run build
npm run preview
```

## Troubleshooting

### CORS errors in production
- Verify `allow_origins` matches your frontend URL
- Check browser console for exact error

### OAuth redirect error
- Ensure redirect URI in Google Cloud matches production URL
- Must use HTTPS in production

### 502 Bad Gateway
- Check backend is running
- Verify port configuration
- Check firewall rules

## Support

For production issues, check:
- Server logs
- Browser console
- Network tab in DevTools
