# 🚀 Quick Start: Database Setup & Migrations

## 📍 WHERE to Update DATABASE_URL

**File Location:** `lineup-backend/.env`

**Current Value:**
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/lineup_db?schema=public"
```

---

## 🔧 HOW to Update DATABASE_URL

### Method 1: Edit .env File Directly (Easiest)

1. Open `lineup-backend/.env` in any text editor
2. Find the line starting with `DATABASE_URL=`
3. Replace with your PostgreSQL credentials:

```env
DATABASE_URL="postgresql://YOUR_USERNAME:YOUR_PASSWORD@localhost:5432/lineup_db?schema=public"
```

**Example if your PostgreSQL:**
- Username: `myuser`
- Password: `mypass123`
- Host: `localhost`
- Port: `5432`
- Database: `lineup_db`

Then your DATABASE_URL would be:
```env
DATABASE_URL="postgresql://myuser:mypass123@localhost:5432/lineup_db?schema=public"
```

### Method 2: Use Helper Script (Interactive)

```powershell
cd lineup-backend
.\update-database-url.ps1
```

This will prompt you for:
- Username
- Password
- Host (default: localhost)
- Port (default: 5432)
- Database name (default: lineup_db)

---

## 🚀 HOW to Run Migrations

### Prerequisites First:
1. ✅ PostgreSQL must be installed
2. ✅ PostgreSQL service must be running
3. ✅ DATABASE_URL in `.env` must be correct
4. ✅ Database must exist (or user must have CREATE DATABASE permission)

### Step 1: Check PostgreSQL is Running

**Windows:**
```powershell
# Check if PostgreSQL service is running
Get-Service -Name "*postgresql*"

# If not running, start it:
Start-Service -Name "postgresql-x64-XX"  # Replace XX with your version
```

**Or manually:**
- Open Services (`services.msc`)
- Find "postgresql" service
- Right-click → Start

### Step 2: Create Database (if needed)

**Option A: Let Prisma create it (if user has permission)**
- Skip this step, Prisma will create it automatically

**Option B: Create manually**
```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE lineup_db;

# Exit
\q
```

### Step 3: Update DATABASE_URL
Edit `.env` file as shown above.

### Step 4: Run Migrations

**Option 1: Interactive Script (Recommended)**
```powershell
cd lineup-backend
.\run-migrations.ps1
```

**Option 2: Direct Command**
```powershell
cd lineup-backend
npx prisma migrate dev --name init
```

**What happens:**
1. Prisma reads your `schema.prisma`
2. Creates migration files in `prisma/migrations/`
3. Applies SQL to your database
4. Creates all tables, indexes, etc.
5. Regenerates Prisma Client

**Expected Output:**
```
✔ Created migration: 20240101120000_init
✔ Applied migration: 20240101120000_init
✔ Generated Prisma Client
```

---

## 📋 Complete Step-by-Step Example

### Scenario: First time setup with local PostgreSQL

```powershell
# 1. Navigate to backend directory
cd "C:\Users\shrav\OneDrive\Desktop\new project\Lineup\lineup-backend"

# 2. Check PostgreSQL is running
Get-Service -Name "*postgresql*"

# 3. Update .env file (edit manually or use script)
# Edit .env and change:
# DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/lineup_db?schema=public"

# 4. Run migrations
npx prisma migrate dev --name init

# 5. Verify it worked
npx prisma migrate status

# 6. (Optional) Open Prisma Studio to view database
npx prisma studio
```

---

## 🔍 Troubleshooting

### Error: "Can't reach database server"
**Problem:** PostgreSQL is not running or wrong host/port

**Solution:**
```powershell
# Check if PostgreSQL is running
Get-Service -Name "*postgresql*"

# If not running, start it
Start-Service -Name "postgresql-x64-XX"

# Or check if it's on a different port
# Update DATABASE_URL with correct port (e.g., 5433)
```

### Error: "Database does not exist"
**Problem:** Database hasn't been created

**Solution:**
```bash
# Create database manually
psql -U postgres
CREATE DATABASE lineup_db;
\q
```

### Error: "Authentication failed"
**Problem:** Wrong username or password

**Solution:**
- Verify username and password in DATABASE_URL
- Test connection: `psql -U your_username -d lineup_db`

### Error: "Migration already applied"
**Problem:** Migration was already run

**Solution:**
```bash
# Check status
npx prisma migrate status

# If needed, mark as applied
npx prisma migrate resolve --applied <migration_name>
```

---

## ✅ Verification Checklist

After running migrations:

- [ ] Migration files created in `prisma/migrations/` folder
- [ ] No errors in console
- [ ] Can see tables in database
- [ ] Prisma Client regenerated
- [ ] Application can start without database errors

**Verify with:**
```bash
# Check migration status
npx prisma migrate status

# View database in GUI
npx prisma studio

# Test connection
npx prisma db execute --stdin
```

---

## 📚 Migration Commands Reference

| Command | Purpose | When to Use |
|---------|---------|-------------|
| `npx prisma migrate dev` | Create & apply migration | Development |
| `npx prisma migrate dev --name init` | Create initial migration | First time setup |
| `npx prisma migrate deploy` | Apply migrations | Production |
| `npx prisma migrate status` | Check status | Anytime |
| `npx prisma migrate reset` | Reset database | ⚠️ Deletes all data! |
| `npx prisma studio` | Open database GUI | View/edit data |
| `npx prisma generate` | Regenerate client | After schema changes |

---

## 🎯 Next Steps After Migrations

1. **Start your application:**
   ```bash
   npm run start:dev
   ```

2. **Look for this in console:**
   ```
   ✅ Prisma connected to database
   ```

3. **Test database queries** in your services

4. **View data:**
   ```bash
   npx prisma studio
   ```

---

## 📁 Important Files

- **`.env`** - Database connection string (UPDATE THIS!)
- **`prisma/schema.prisma`** - Database schema definition
- **`prisma/migrations/`** - Migration history (auto-generated)
- **`src/common/prisma.service.ts`** - Prisma service (already set up)

---

## 💡 Pro Tips

1. **Always backup before migrations in production**
2. **Test migrations on staging first**
3. **Use descriptive migration names**: `npx prisma migrate dev --name add_user_table`
4. **Check migration status before deploying**
5. **Use Prisma Studio for quick data inspection**

---

## 🆘 Still Having Issues?

1. Check PostgreSQL is installed: `psql --version`
2. Check service is running: `Get-Service "*postgresql*"`
3. Test connection: `psql -U postgres -h localhost`
4. Verify DATABASE_URL format is correct
5. Check firewall isn't blocking port 5432
6. Review `DATABASE_SETUP_GUIDE.md` for detailed troubleshooting

