# Database Setup - Quick Reference

## ✅ WHAT HAS BEEN DONE

1. ✅ Prisma Client generated
2. ✅ .env file created
3. ✅ Helper scripts created
4. ✅ Documentation created

---

## 📍 WHERE: Update DATABASE_URL

**File:** `lineup-backend/.env`

**Current line:**
```
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/lineup_db?schema=public"
```

---

## 🔧 HOW: Update DATABASE_URL

### Quick Method:
1. Open `lineup-backend/.env`
2. Change this line:
   ```
   DATABASE_URL="postgresql://YOUR_USERNAME:YOUR_PASSWORD@localhost:5432/lineup_db?schema=public"
   ```
3. Save the file

### Interactive Method:
```powershell
cd lineup-backend
.\update-database-url.ps1
```

---

## 🚀 HOW: Run Migrations

### Quick Method:
```powershell
cd lineup-backend
npx prisma migrate dev --name init
```

### Interactive Method:
```powershell
cd lineup-backend
.\run-migrations.ps1
```

---

## ⚠️ BEFORE RUNNING MIGRATIONS

1. **PostgreSQL must be running**
   - Check: `Get-Service "*postgresql*"`
   - Start if needed: `Start-Service "postgresql-x64-XX"`

2. **DATABASE_URL must be correct**
   - Edit `.env` file with your credentials

3. **Database should exist** (or user needs CREATE permission)

---

## 📚 Full Documentation

- **QUICK_START.md** - Complete step-by-step guide
- **DATABASE_SETUP_GUIDE.md** - Detailed reference
- **PRISMA_SETUP.md** - PrismaService documentation

---

## 🎯 Typical Workflow

```powershell
# 1. Navigate to backend
cd lineup-backend

# 2. Update DATABASE_URL (edit .env or use script)
# Edit .env file manually

# 3. Run migrations
npx prisma migrate dev --name init

# 4. Verify
npx prisma migrate status

# 5. Start app
npm run start:dev
```

---

## 🆘 Common Issues

**"Can't reach database server"**
→ PostgreSQL not running. Start the service.

**"Authentication failed"**
→ Wrong username/password in DATABASE_URL

**"Database does not exist"**
→ Create it: `CREATE DATABASE lineup_db;`

