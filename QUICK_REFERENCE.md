# WorkZen HRMS - Quick Reference Guide

## 🔌 Database Connection

**Connection String Format:**
```
postgresql://postgres:YOUR_PASSWORD@localhost:5432/workzen_hrms
```

**Components:**
- Protocol: `postgresql://`
- Username: `postgres` (default PostgreSQL user)
- Password: `YOUR_PASSWORD` (set during PostgreSQL installation)
- Host: `localhost` (your computer)
- Port: `5432` (default PostgreSQL port)
- Database: `workzen_hrms`

## ⚡ Quick Start Commands

```cmd
# Install dependencies
npm install

# Create database tables
npm run db:push

# Start development server
npm run dev

# Build for production
npm run build

# Run production server
npm run start
```

## 🔐 Default Login Credentials

| Role | Email | Password |
|------|-------|----------|
| **Admin** | admin@workzen.com | admin123 |
| **HR** | hr@workzen.com | hr123 |
| **Payroll** | payroll@workzen.com | payroll123 |
| **Employee** | john@workzen.com | employee123 |

## 📊 Database Tables

### Core Tables:
1. **users** - All employee/staff records
2. **attendance** - Daily attendance tracking
3. **leaves** - Leave applications and approvals
4. **payruns** - Monthly payroll runs
5. **settings** - System configuration

### Additional Tables:
6. **user_permissions** - Role-based access control
7. **salary_components** - Detailed salary breakdown
8. **skills** - Employee skills
9. **certifications** - Employee certifications

## 🌐 Application URLs

- **Development:** http://localhost:5000
- **API Base:** http://localhost:5000/api
- **Login Page:** http://localhost:5000/login

## 📝 Environment Variables (.env)

```env
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/workzen_hrms
SESSION_SECRET=your-secret-key-change-this-in-production
NODE_ENV=development
```

## 🛠️ Common Tasks

### Reset Database:
```sql
-- In PostgreSQL (psql or pgAdmin)
DROP DATABASE workzen_hrms;
CREATE DATABASE workzen_hrms;
```
Then run: `npm run db:push` and `npm run dev`

### Check Database Connection:
```cmd
psql -U postgres -d workzen_hrms
```

### Stop Application:
Press `Ctrl + C` in the terminal

### Clear Node Modules (if issues):
```cmd
rmdir /s /q node_modules
npm install
```

## 🎯 Features by Role

### Admin:
- Full access to all modules
- Employee management
- System settings
- Payroll processing
- Reports generation

### HR:
- Employee management
- Attendance tracking
- Leave approvals
- View reports

### Payroll Officer:
- Payroll processing
- Salary reports
- View employee data

### Employee:
- View own profile
- Mark attendance
- Apply for leaves
- View salary slips
- Download payroll statements

## 📂 Important Files

- `server/index.ts` - Backend server entry
- `server/routes.ts` - API endpoints
- `server/seed.ts` - Database seeding
- `shared/schema.ts` - Database schema
- `drizzle.config.ts` - ORM configuration
- `.env` - Environment variables
- `package.json` - Dependencies

## 🔍 Troubleshooting

### Database Connection Failed:
1. Check PostgreSQL is running
2. Verify password in .env
3. Confirm database exists
4. Test with: `psql -U postgres`

### Port 5000 In Use:
```cmd
netstat -ano | findstr :5000
taskkill /PID [PID_NUMBER] /F
```

### Application Won't Start:
1. Delete `node_modules` folder
2. Run `npm install`
3. Verify `.env` file exists
4. Check PostgreSQL is running

## 📱 API Endpoints (Examples)

### Authentication:
- `POST /api/login` - Login
- `POST /api/logout` - Logout
- `GET /api/user` - Get current user

### Users:
- `GET /api/users` - List all users
- `GET /api/users/:id` - Get user details
- `POST /api/users` - Create user
- `PATCH /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Attendance:
- `GET /api/attendance` - Get attendance records
- `POST /api/attendance` - Mark attendance
- `PATCH /api/attendance/:id` - Update attendance

### Leaves:
- `GET /api/leaves` - Get leave requests
- `POST /api/leaves` - Apply for leave
- `PATCH /api/leaves/:id` - Update leave status

### Payroll:
- `GET /api/payruns` - Get payroll runs
- `POST /api/payruns` - Generate payroll
- `GET /api/reports/salary-statement` - Salary report

## 💾 Database Backup (Windows)

### Create Backup:
```cmd
pg_dump -U postgres -d workzen_hrms -F c -f workzen_backup.dump
```

### Restore Backup:
```cmd
pg_restore -U postgres -d workzen_hrms -c workzen_backup.dump
```

## 🔢 Default Settings

- **Working Days:** 22 days/month
- **PF Percentage:** 12%
- **Professional Tax:** ₹200/month
- **Annual Leave:** 12 days/year
- **Sick Leave:** 6 days/year
- **Session Duration:** 7 days

## 📞 Support

For issues:
1. Check the terminal/console for error messages
2. Review the `WINDOWS_SETUP_GUIDE.md`
3. Check database connection
4. Verify all dependencies are installed

---

**Quick Access:** http://localhost:5000
**Documentation:** See `WINDOWS_SETUP_GUIDE.md` for detailed setup instructions
