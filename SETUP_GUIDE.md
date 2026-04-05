# FitHub CRM - Quick Start Guide

## Prerequisites
- Node.js v14+
- MongoDB (local or Atlas)
- npm/yarn

## 🚀 One-Command Setup (Recommended)

### Windows
```bash
cd fithub-crm && cd backend && npm install && cd ../frontend && npm install
```

### Mac/Linux
```bash
cd fithub-crm && cd backend && npm install && cd ../frontend && npm install
```

## 📦 Setup Steps

### Step 1: Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your configuration
npm run dev
```

### Step 2: Frontend Setup (in new terminal)
```bash
cd frontend
npm install
npm start
```

## ✅ Verification

- Backend: http://localhost:5000/api/health
- Frontend: http://localhost:3000

## 🔑 Demo Credentials

Use these to test:
- Register new account
- Email: test@example.com
- Password: Test123456

## 📱 Features to Try

1. **Dashboard** - View system statistics
2. **Members** - Add, search, manage members
3. **Classes** - Create classes and assign trainers
4. **Trainers** - Add trainers with specializations
5. **Filters** - Search and filter data
6. **Forms** - Add new records with validation

## 🛠️ Development Commands

**Backend**
```bash
npm run dev          # Start dev server with hot reload
npm start            # Start production server
npm test             # Run tests
```

**Frontend**
```bash
npm start            # Start dev server
npm build            # Build for production
npm test             # Run tests
```

## 📚 API Documentation

See [API Endpoints](./README.md#-api-endpoints) in README.md

## 🆘 Troubleshooting

### Port Already in Use
```bash
# Kill process on port 5000
lsof -i :5000
kill -9 <PID>
```

### MongoDB Connection Error
- Ensure MongoDB is running
- Check connection string in .env
- Use MongoDB Atlas for cloud database

### Dependencies Issues
```bash
# Clear cache and reinstall
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

## 📖 Next Steps

1. Configure Salesforce integration
2. Set up email notifications
3. Add payment processing
4. Deploy to production

---

Happy coding! 🎉
