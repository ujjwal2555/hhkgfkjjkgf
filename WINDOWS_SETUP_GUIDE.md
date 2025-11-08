# WorkZen HRMS - Windows Local Setup Guide

This guide will help you set up and run the WorkZen HRMS application locally on your Windows computer.

## 📋 Prerequisites

Before you begin, ensure you have the following installed on your Windows machine:

1. **Node.js** (v20.x or higher)
   - Download from: https://nodejs.org/
   - Verify installation: Open Command Prompt and run `node --version`

2. **PostgreSQL** (v14.x or higher)
   - Download from: https://www.postgresql.org/download/windows/
   - During installation, remember the password you set for the `postgres` user
   - Verify installation: Run `psql --version` in Command Prompt

3. **Git** (optional, for cloning)
   - Download from: https://git-scm.com/download/win

## 🗄️ Database Setup

### Step 1: Create the Database

1. Open **pgAdmin 4** (installed with PostgreSQL) or use the command line
2. Connect to your PostgreSQL server using the password you set during installation

#### Using pgAdmin:
- Right-click on "Databases" → Create → Database
- Database name: `workzen_hrms`
- Click "Save"

#### Using Command Line:
```cmd
psql -U postgres
CREATE DATABASE workzen_hrms;
\q
```

### Step 2: Get the Database Connection String

Your database connection string will be:
```
postgresql://postgres:YOUR_PASSWORD@localhost:5432/workzen_hrms
```

Replace `YOUR_PASSWORD` with the password you set for the PostgreSQL `postgres` user.

**Example:**
If your password is `mypassword123`, the connection string is:
```
postgresql://postgres:mypassword123@localhost:5432/workzen_hrms
```

## 📦 Project Setup

### Step 1: Extract/Copy Project Files

If you're on Replit, download all files. If you have a zip, extract it to a folder like:
```
C:\Projects\workzen-hrms
```

### Step 2: Navigate to Project Directory

Open Command Prompt and navigate to your project:
```cmd
cd C:\Projects\workzen-hrms
```

### Step 3: Install Dependencies

Run the following command to install all required packages:
```cmd
npm install
```

This will install all packages listed in `package.json` including:
- Express.js (backend framework)
- React (frontend framework)
- Drizzle ORM (database operations)
- PostgreSQL driver
- And all other dependencies

### Step 4: Configure Environment Variables

1. Copy the `.env.example` file and rename it to `.env`
2. Open `.env` in a text editor (Notepad, VS Code, etc.)
3. Update the configuration:

```env
# Database Configuration
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/workzen_hrms

# Session Secret (change this to a random string in production)
SESSION_SECRET=your-secret-key-change-this-in-production

# Environment
NODE_ENV=development
```

**Important:** Replace `YOUR_PASSWORD` with your actual PostgreSQL password!

### Step 5: Create Database Tables

Run the following command to create all database tables:
```cmd
npm run db:push
```

This will create the following tables in your database:
- `users` - Employee and staff information
- `attendance` - Daily attendance records
- `leaves` - Leave requests and approvals
- `payruns` - Monthly payroll data
- `settings` - System settings (PF%, Professional Tax, etc.)
- `user_permissions` - Role-based permissions
- `salary_components` - Detailed salary breakdowns
- `skills` - Employee skills
- `certifications` - Employee certifications

## 🚀 Running the Application

### Development Mode (with hot reload)

Run this command to start the development server:
```cmd
npm run dev
```

The application will:
1. Automatically seed the database with test data (if empty)
2. Start the backend server on port 5000
3. Start the frontend development server
4. Open automatically in your browser

**Access the application at:** http://localhost:5000

### Production Mode

To run in production mode:

1. Build the application:
```cmd
npm run build
```

2. Start the production server:
```cmd
npm run start
```

## 🔐 Test Login Credentials

After the first run, the database will be automatically seeded with the following test accounts:

| Role | Email | Password | Access Level |
|------|-------|----------|--------------|
| Admin | admin@workzen.com | admin123 | Full system access |
| HR Manager | hr@workzen.com | hr123 | Employee & leave management |
| Payroll Officer | payroll@workzen.com | payroll123 | Payroll & reports |
| Employee | john@workzen.com | employee123 | Personal dashboard |

**Additional Employees:**
- jane@workzen.com / employee123
- mike@workzen.com / employee123

## 📊 Database Schema Details

### Users Table
Stores all employee and staff information including:
- Personal details (name, email, mobile)
- Employment details (department, location, manager, joining year)
- Salary components (basic salary, HRA, other earnings)
- Leave balances (annual leave, sick leave)

### Attendance Table
Records daily attendance with:
- Check-in and check-out times
- Status (Present, Absent, Half, Leave)
- Automatic linking to users

### Leaves Table
Manages leave requests:
- Leave type (Annual, Sick, Casual)
- Date range
- Approval status (Pending, Approved, Rejected, Cancelled)

### Payruns Table
Monthly payroll processing:
- Month identifier (YYYY-MM format)
- Generated by (admin/payroll officer)
- Total payroll amount
- Individual salary items (JSON)

### Settings Table
System-wide configurations:
- Working days per month (default: 22)
- PF percentage (default: 12%)
- Professional tax amount (default: ₹200)

## 🛠️ Common Windows-Specific Issues & Solutions

### Issue 1: "PostgreSQL command not found"
**Solution:** Add PostgreSQL to your PATH:
1. Find your PostgreSQL installation path (usually `C:\Program Files\PostgreSQL\[version]\bin`)
2. Add it to System Environment Variables → Path
3. Restart Command Prompt

### Issue 2: "Port 5000 already in use"
**Solution:** 
1. Find the process using the port:
```cmd
netstat -ano | findstr :5000
```
2. Kill the process (replace PID with actual process ID):
```cmd
taskkill /PID [PID] /F
```

### Issue 3: Database connection fails
**Solutions:**
- Verify PostgreSQL is running (check Services or Task Manager)
- Check your password in the `.env` file
- Ensure the database `workzen_hrms` exists
- Test connection using pgAdmin

### Issue 4: "npm: command not found"
**Solution:** 
- Reinstall Node.js from https://nodejs.org/
- Make sure to check "Add to PATH" during installation
- Restart Command Prompt after installation

### Issue 5: Permission errors during npm install
**Solution:** Run Command Prompt as Administrator

## 📁 Project Structure

```
workzen-hrms/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   └── lib/            # Utilities and configurations
├── server/                 # Backend Express application
│   ├── index.ts            # Server entry point
│   ├── routes.ts           # API routes
│   ├── storage.ts          # Database operations
│   └── seed.ts             # Database seeding
├── shared/                 # Shared code between frontend and backend
│   └── schema.ts           # Database schema definitions
├── package.json            # Project dependencies
├── drizzle.config.ts       # Database ORM configuration
├── vite.config.ts          # Frontend build configuration
└── .env                    # Environment variables (create this)
```

## 🔄 Updating the Application

When pulling new changes:

1. Install any new dependencies:
```cmd
npm install
```

2. Update database schema:
```cmd
npm run db:push
```

3. Restart the development server:
```cmd
npm run dev
```

## 🗑️ Resetting the Database

To start fresh:

1. Drop and recreate the database:
```sql
-- In psql or pgAdmin
DROP DATABASE workzen_hrms;
CREATE DATABASE workzen_hrms;
```

2. Push the schema again:
```cmd
npm run db:push
```

3. Restart the application (it will auto-seed):
```cmd
npm run dev
```

## 📞 Features Available

1. **Employee Management** - Add, edit, view employee profiles
2. **Attendance Tracking** - Mark daily attendance with check-in/out times
3. **Leave Management** - Apply for leaves, approve/reject requests
4. **Payroll Processing** - Generate monthly payrolls with automatic calculations
5. **My Payroll** - Employees can view their salary breakdown and download slips
6. **Reports** - Generate salary statements and attendance reports
7. **Settings** - Configure system-wide parameters (PF%, tax, working days)
8. **Role-Based Access** - Different access levels for Admin, HR, Payroll, and Employees

## 🔒 Security Notes

1. **Change the SESSION_SECRET** in `.env` to a random string
2. **Never commit `.env`** file to version control
3. **Use strong passwords** for the database
4. **Change default test passwords** before deploying to production
5. **Enable HTTPS** in production environments

## 📚 Technology Stack

- **Frontend:** React, TypeScript, Vite, TailwindCSS, Shadcn UI
- **Backend:** Express.js, TypeScript
- **Database:** PostgreSQL with Drizzle ORM
- **Authentication:** Express Session with bcrypt password hashing
- **Forms:** React Hook Form with Zod validation
- **State Management:** TanStack Query (React Query)

## 🆘 Need Help?

If you encounter any issues:

1. Check the console output for error messages
2. Verify all environment variables are set correctly
3. Ensure PostgreSQL is running
4. Check that port 5000 is not in use
5. Review the database connection string format

## ✅ Verification Checklist

Before using the application, ensure:

- [ ] Node.js is installed (v20+)
- [ ] PostgreSQL is installed and running
- [ ] Database `workzen_hrms` is created
- [ ] `.env` file exists with correct DATABASE_URL
- [ ] `npm install` completed successfully
- [ ] `npm run db:push` created all tables
- [ ] `npm run dev` starts without errors
- [ ] Application opens at http://localhost:5000
- [ ] You can log in with test credentials

---

**Congratulations!** 🎉 Your WorkZen HRMS application is now running locally on Windows!
