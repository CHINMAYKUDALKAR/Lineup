# Database Setup & Migration Guide

## 📍 WHERE to Update DATABASE_URL

The DATABASE_URL is located in: **`lineup-backend/.env`**

## 🔧 HOW to Update DATABASE_URL

### Step 1: Open the .env file
Open `lineup-backend/.env` in your editor.

### Step 2: Update the DATABASE_URL line

The format is:
```
DATABASE_URL="postgresql://username:password@host:port/database_name?schema=public"
```

### Common Examples:

**1. Local PostgreSQL (default installation):**
```env
DATABASE_URL="postgresql://postgres:yourpassword@localhost:5432/lineup_db?schema=public"
```

**2. Local PostgreSQL with different user:**
```env
DATABASE_URL="postgresql://myuser:mypassword@localhost:5432/lineup_db?schema=public"
```

**3. PostgreSQL on different port:**
```env
DATABASE_URL="postgresql://postgres:password@localhost:5433/lineup_db?schema=public"
```

**4. Remote PostgreSQL (cloud/hosted):**
```env
DATABASE_URL="postgresql://user:password@your-server.com:5432/lineup_db?schema=public"
```

**5. PostgreSQL with SSL (production):**
```env
DATABASE_URL="postgresql://user:password@host:5432/lineup_db?schema=public&sslmode=require"
```

### Step 3: Save the file
Save the `.env` file after updating.

---

## 🚀 HOW to Run Migrations

### Prerequisites:
1. ✅ PostgreSQL must be installed and running
2. ✅ DATABASE_URL in `.env` must be correct
3. ✅ The database must exist (or Prisma will try to create it)

### Migration Commands:

#### 1. **Create and Apply Migration** (Development)
```bash
cd lineup-backend
npx prisma migrate dev
```

**What this does:**
- Creates a new migration file based on your schema changes
- Applies the migration to your database
- Regenerates Prisma Client
- Prompts you to name the migration

**Example output:**
```
✔ Created migration: 20240101120000_init
✔ Applied migration: 20240101120000_init
✔ Generated Prisma Client
```

#### 2. **Apply Existing Migrations** (Production)
```bash
npx prisma migrate deploy
```

**What this does:**
- Applies all pending migrations
- Does NOT create new migrations
- Safe for production environments

#### 3. **Reset Database** (⚠️ DANGER - Deletes all data!)
```bash
npx prisma migrate reset
```

**What this does:**
- Drops the database
- Recreates it
- Applies all migrations
- Runs seed script (if configured)

#### 4. **Check Migration Status**
```bash
npx prisma migrate status
```

**What this does:**
- Shows which migrations are applied
- Shows which migrations are pending

#### 5. **Create Migration Without Applying**
```bash
npx prisma migrate dev --create-only
```

**What this does:**
- Creates migration file only
- Does NOT apply it
- Useful for reviewing before applying

---

## 📋 Step-by-Step: First Time Setup

### Step 1: Ensure PostgreSQL is Running
```bash
# Check if PostgreSQL is running (Windows)
# Open Services (services.msc) and look for "postgresql"

# Or check via command:
Get-Service -Name "*postgresql*"
```

### Step 2: Create Database (if it doesn't exist)
```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE lineup_db;

# Exit
\q
```

**OR** Prisma can create it automatically if your user has permissions.

### Step 3: Update DATABASE_URL
Edit `lineup-backend/.env`:
```env
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/lineup_db?schema=public"
```

### Step 4: Run Initial Migration
```bash
cd lineup-backend
npx prisma migrate dev --name init
```

This will:
1. Create the database tables
2. Apply all schema changes
3. Generate Prisma Client

### Step 5: Verify
```bash
# Check migration status
npx prisma migrate status

# Open Prisma Studio to view data
npx prisma studio
```

---

## 🔍 Troubleshooting

### Error: "Can't reach database server"
**Solution:**
- Check PostgreSQL is running
- Verify DATABASE_URL is correct
- Check firewall settings
- Verify port (default: 5432)

### Error: "Database does not exist"
**Solution:**
- Create database manually: `CREATE DATABASE lineup_db;`
- Or ensure your user has CREATE DATABASE permission

### Error: "Authentication failed"
**Solution:**
- Verify username and password in DATABASE_URL
- Check PostgreSQL user exists
- Verify password is correct

### Error: "Migration already applied"
**Solution:**
- Check migration status: `npx prisma migrate status`
- If needed, mark as applied: `npx prisma migrate resolve --applied <migration_name>`

---

## 📁 Migration Files Location

Migrations are stored in: **`lineup-backend/prisma/migrations/`**

Each migration is a folder containing:
- `migration.sql` - SQL statements
- `migration_lock.toml` - Lock file

---

## 🎯 Quick Reference

| Command | Purpose |
|---------|---------|
| `npx prisma migrate dev` | Create & apply migration (dev) |
| `npx prisma migrate deploy` | Apply migrations (production) |
| `npx prisma migrate status` | Check migration status |
| `npx prisma migrate reset` | Reset database (⚠️ deletes data) |
| `npx prisma studio` | Open database GUI |
| `npx prisma generate` | Regenerate Prisma Client |

---

## ✅ Verification Checklist

After running migrations, verify:
- [ ] Migration files created in `prisma/migrations/`
- [ ] Tables created in database
- [ ] Prisma Client regenerated
- [ ] Application can connect to database
- [ ] No errors in console

---

## 🎓 Next Steps

After migrations are complete:
1. Start your application: `npm run start:dev`
2. Check logs for: "✅ Prisma connected to database"
3. Test database queries in your services
4. Use Prisma Studio to view data: `npx prisma studio`

