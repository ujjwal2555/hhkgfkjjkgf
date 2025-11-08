8# WorkZen HRMS - Complete Detailed Explanation

This document provides an in-depth explanation of every aspect of setting up and running the WorkZen HRMS application locally on Windows.

---

## 📋 PART 1: Understanding the Prerequisites

### 1.1 What is Node.js and Why Do We Need It?

**What is Node.js?**
- Node.js is a JavaScript runtime environment that allows you to run JavaScript code on your computer (not just in a web browser)
- Think of it as a translator that understands JavaScript and can execute it on Windows

**Why do we need it?**
- Our application is written in JavaScript/TypeScript
- The backend server (Express.js) runs on Node.js
- The frontend build tools (Vite) run on Node.js
- Package management (npm) comes with Node.js

**What is npm?**
- npm = Node Package Manager
- It's like an app store for JavaScript code
- We use it to download and install libraries/packages that our application depends on
- Example: Instead of writing code to handle user passwords, we use the `bcrypt` package

**Installation Details:**
1. Download from https://nodejs.org/
2. Choose the LTS (Long Term Support) version - currently v20.x
3. Run the installer (.msi file)
4. **IMPORTANT:** During installation, check "Add to PATH" - this allows you to run `node` and `npm` commands from any folder in Command Prompt
5. After installation, verify by opening Command Prompt and typing:
   ```cmd
   node --version
   ```
   You should see something like: `v20.11.0`

### 1.2 What is PostgreSQL and Why Do We Need It?

**What is PostgreSQL?**
- PostgreSQL (often called "Postgres") is a database management system
- It stores all your application data in organized tables
- Think of it as a very sophisticated Excel spreadsheet that multiple programs can access simultaneously

**Why do we need it?**
- We need to store employee data, attendance records, leave requests, payroll information, etc.
- Unlike storing data in files, databases provide:
  - **Reliability:** Data isn't lost if the app crashes
  - **Speed:** Very fast searching and filtering
  - **Relationships:** Connect related data (e.g., link attendance records to employees)
  - **Concurrent Access:** Multiple users can read/write data at the same time
  - **Security:** Control who can access what data

**What data will be stored?**
Our application stores 9 types of data in separate tables:
1. **users** - Employee information (name, email, salary, department)
2. **attendance** - Daily check-in/check-out records
3. **leaves** - Leave applications (vacation requests, sick days)
4. **payruns** - Monthly payroll calculations
5. **settings** - System configuration (working days, tax rates)
6. **user_permissions** - What each user role can do
7. **salary_components** - Detailed salary breakdowns
8. **skills** - Employee skills (JavaScript, Marketing, etc.)
9. **certifications** - Employee certifications (AWS, PMP, etc.)

**Installation Details:**
1. Download from https://www.postgresql.org/download/windows/
2. Run the installer
3. During installation, you'll be asked to set a password for the `postgres` user
   - **Write this password down!** You'll need it later
   - Example: `mySecurePassword123`
4. Accept default port: 5432
5. Accept default data directory
6. The installer includes:
   - **PostgreSQL Server** - The actual database engine
   - **pgAdmin 4** - A graphical tool to manage databases
   - **Command Line Tools** - To interact with PostgreSQL via terminal

**What happens after installation?**
- PostgreSQL runs as a Windows service (always running in the background)
- You can check if it's running: Task Manager → Services → Look for "postgresql"
- Default user is `postgres` (like "administrator" for the database)

---

## 🗄️ PART 2: Understanding the Database Setup

### 2.1 Creating the Database

**What is a database?**
- A database is a container that holds multiple tables
- Our application needs its own database called `workzen_hrms`
- Think of it like creating a new folder to organize your files

**Why create a separate database?**
- Isolation: Our app's data doesn't mix with other applications
- Organization: All related tables are in one place
- Backup: Easy to backup/restore just this application's data

**Two ways to create the database:**

**Method 1: Using pgAdmin 4 (Graphical Interface)**
1. Open pgAdmin 4 (installed with PostgreSQL)
2. You'll see a tree structure on the left
3. Expand "Servers" → "PostgreSQL [version]"
4. Enter the password you set during installation
5. Right-click on "Databases" → Create → Database
6. In the "Database" field, type: `workzen_hrms`
7. Click "Save"

**Method 2: Using Command Line**
1. Open Command Prompt
2. Type: `psql -U postgres`
3. Enter your password
4. You'll see a prompt like: `postgres=#`
5. Type: `CREATE DATABASE workzen_hrms;`
6. Press Enter
7. Type: `\q` to exit

**What just happened?**
- PostgreSQL created a new empty database
- The database is ready to store tables, but has no tables yet
- Our application will create the tables later using Drizzle ORM

### 2.2 Understanding the Database Connection String

**The connection string:**
```
postgresql://postgres:YOUR_PASSWORD@localhost:5432/workzen_hrms
```

**Breaking it down piece by piece:**

1. **`postgresql://`**
   - This is the protocol
   - Tells the application we're connecting to a PostgreSQL database
   - Like `https://` tells your browser it's a secure website

2. **`postgres`**
   - This is the username
   - The default superuser account created during PostgreSQL installation
   - Has full access to create/modify/delete databases

3. **`YOUR_PASSWORD`**
   - The password you set during PostgreSQL installation
   - Example: If your password is `secret123`, it becomes: `postgres:secret123`
   - **SECURITY NOTE:** Never share this password or commit it to public repositories

4. **`@localhost`**
   - The hostname/address of the database server
   - `localhost` means "this computer" (127.0.0.1)
   - If PostgreSQL was on another computer, you'd use its IP address

5. **`:5432`**
   - The port number PostgreSQL listens on
   - Default PostgreSQL port is 5432
   - Like how websites use port 80 (HTTP) or 443 (HTTPS)

6. **`/workzen_hrms`**
   - The specific database name
   - We're connecting to the `workzen_hrms` database we created

**Complete Example:**
If your password is `mypassword`, the full connection string is:
```
postgresql://postgres:mypassword@localhost:5432/workzen_hrms
```

**Where does this go?**
- In a file called `.env` in your project folder
- The `.env` file stores sensitive configuration
- Never commit this file to Git (it's in `.gitignore`)

---

## 📦 PART 3: Understanding Project Installation

### 3.1 Downloading Project Files

**What files make up the application?**

The project contains several types of files:

**A. Source Code Files (.ts, .tsx)**
- `client/src/` - Frontend React code (what users see)
- `server/` - Backend Express code (API, database operations)
- `shared/` - Code used by both frontend and backend

**B. Configuration Files**
- `package.json` - Lists all required packages
- `tsconfig.json` - TypeScript compiler settings
- `vite.config.ts` - Frontend build tool configuration
- `drizzle.config.ts` - Database ORM configuration
- `tailwind.config.ts` - CSS framework configuration

**C. Environment Files**
- `.env.example` - Template for environment variables
- `.env` - Your actual configuration (you create this)

**D. Asset Files**
- Images, icons, fonts used in the application

**How to download from Replit:**
1. In Replit, click the three dots (⋮) menu
2. Select "Download as ZIP"
3. Extract the ZIP file to a folder on your Windows computer
   - Example: `C:\Projects\workzen-hrms`

### 3.2 Understanding npm install

**What is `npm install`?**
- This command reads `package.json`
- Downloads all required packages from the internet
- Installs them in a folder called `node_modules`

**What packages does our application need?**

Our `package.json` lists 80+ packages. Here are the important ones:

**Frontend Packages:**
1. **react** - UI library for building user interfaces
   - Creates components like buttons, forms, tables
   
2. **wouter** - Client-side routing
   - Handles navigation between pages (Employees → Attendance → Payroll)
   
3. **@tanstack/react-query** - Data fetching and caching
   - Automatically fetches data from backend
   - Caches results to avoid repeated requests
   
4. **tailwindcss** - CSS framework
   - Provides pre-made styles for rapid UI development
   
5. **shadcn/ui components** - Pre-built UI components
   - Buttons, dialogs, forms, tables, etc.
   
6. **zod** - Data validation
   - Ensures form inputs are valid before submission
   
7. **react-hook-form** - Form management
   - Handles form state, validation, submission

**Backend Packages:**
1. **express** - Web server framework
   - Handles HTTP requests (GET, POST, PUT, DELETE)
   - Serves API endpoints
   
2. **@neondatabase/serverless** - PostgreSQL client
   - Connects to and queries the database
   
3. **drizzle-orm** - Object-Relational Mapping
   - Translates JavaScript code to SQL queries
   - Example: `db.select().from(users)` becomes `SELECT * FROM users`
   
4. **bcrypt** - Password hashing
   - Encrypts passwords before storing in database
   - Never stores passwords in plain text
   
5. **express-session** - Session management
   - Keeps users logged in
   - Stores session data (who is logged in, their role, etc.)
   
6. **passport** - Authentication middleware
   - Handles login/logout logic
   - Verifies credentials

**Build Tools:**
1. **vite** - Frontend build tool
   - Bundles JavaScript files for production
   - Provides fast development server with hot reload
   
2. **typescript** - Type checking
   - Catches errors before runtime
   
3. **esbuild** - JavaScript bundler
   - Bundles backend code for production

**What happens during npm install?**
1. npm reads `package.json`
2. Downloads each package from npmjs.com registry
3. Installs them in `node_modules/` folder
4. Creates `package-lock.json` (locks exact versions)
5. Total download size: ~300-500 MB
6. Time: 2-5 minutes (depending on internet speed)

**Important notes:**
- The `node_modules` folder will contain 1000+ folders (packages and their dependencies)
- This is normal - modern apps depend on many small packages
- Never edit files in `node_modules` - they get overwritten
- Never commit `node_modules` to Git (it's huge and regenerable)

### 3.3 Understanding Environment Variables (.env)

**What is the .env file?**
- A text file that stores configuration
- Each line has a variable: `NAME=value`
- Read by the application at startup
- Keeps secrets separate from source code

**Why separate configuration?**
- **Security:** Passwords aren't in code files
- **Flexibility:** Change settings without changing code
- **Environment-specific:** Different settings for development vs production

**Our .env file contains:**

```env
# Database Configuration
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/workzen_hrms

# Session Secret
SESSION_SECRET=your-secret-key-change-this-in-production

# Environment
NODE_ENV=development
```

**Explaining each variable:**

1. **DATABASE_URL**
   - Where to find the database
   - Used by Drizzle ORM to connect
   - Replace YOUR_PASSWORD with your actual PostgreSQL password
   
2. **SESSION_SECRET**
   - A secret key to encrypt session cookies
   - Should be a random string
   - Used to verify session cookies haven't been tampered with
   - Example good value: `k9mP2x8QrW5vN3bZ7hY6tF4jL0sA1cE`
   - Example bad value: `password` (too simple, guessable)
   
3. **NODE_ENV**
   - Tells the app which mode it's running in
   - `development` - Shows detailed errors, enables hot reload
   - `production` - Optimized for performance, minimal errors shown

**How to create .env:**
1. Copy `.env.example` to `.env`
2. Open `.env` in any text editor (Notepad, VS Code, etc.)
3. Replace placeholder values with real ones
4. Save the file

**Example complete .env:**
```env
DATABASE_URL=postgresql://postgres:mySecurePass123@localhost:5432/workzen_hrms
SESSION_SECRET=k9mP2x8QrW5vN3bZ7hY6tF4jL0sA1cE8fG
NODE_ENV=development
```

---

## 🏗️ PART 4: Understanding Database Tables Creation

### 4.1 What is Drizzle ORM?

**ORM = Object-Relational Mapping**

**The problem:**
- Databases understand SQL (Structured Query Language)
- Our application is written in TypeScript
- We need a translator

**How Drizzle helps:**
Instead of writing:
```sql
SELECT * FROM users WHERE email = 'john@workzen.com';
```

We can write:
```typescript
db.select().from(users).where(eq(users.email, 'john@workzen.com'))
```

**Benefits:**
- Type-safe: TypeScript checks for errors
- Readable: Looks like normal code
- Maintainable: Easier to modify
- Protection: Prevents SQL injection attacks

### 4.2 Understanding the Schema File

**Location:** `shared/schema.ts`

This file defines the database structure in TypeScript.

**Example - Users Table:**
```typescript
export const users = pgTable("users", {
  id: text("id").primaryKey(),
  loginId: text("login_id").notNull().unique(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull(),
  // ... more fields
});
```

**Breaking it down:**

1. **`pgTable("users", { ... })`**
   - Creates a table named "users"
   - `pg` = PostgreSQL
   
2. **`id: text("id").primaryKey()`**
   - Creates a column named "id"
   - Type is text (stores strings like "USR-001")
   - `.primaryKey()` means this uniquely identifies each row
   - No two users can have the same ID
   
3. **`email: text("email").notNull().unique()`**
   - Column named "email"
   - `.notNull()` means it must have a value
   - `.unique()` means no duplicate emails allowed
   
4. **`role: text("role").notNull()`**
   - Stores user role: 'admin', 'hr', 'payroll', or 'employee'
   - Determines what features the user can access

**All 9 tables in our database:**

**1. users table** (Employee/Staff Information)
```
Columns:
- id: Unique identifier (USR-001, USR-002, etc.)
- loginId: Login ID for the system
- name: Full name
- email: Email address
- password: Hashed password (encrypted)
- role: admin | hr | payroll | employee
- department: Engineering, HR, Finance, etc.
- mobile: Phone number
- company: Company name
- manager: Who manages this employee
- location: Office location
- yearOfJoining: When they joined
- basicSalary: Base salary amount
- hra: House Rent Allowance
- otherEarnings: Other fixed allowances
- annualLeave: Annual leave balance (default 12)
- sickLeave: Sick leave balance (default 6)
- about: Bio/description
- hobbies: Personal hobbies
- createdAt: When record was created
```

**2. attendance table** (Daily Attendance)
```
Columns:
- id: Unique identifier
- userId: Links to users table (which employee)
- date: Date in YYYY-MM-DD format (2024-11-08)
- inTime: Check-in time (09:00)
- outTime: Check-out time (18:00)
- status: Present | Absent | Half | Leave
- createdAt: When record was created
```

**3. leaves table** (Leave Requests)
```
Columns:
- id: Unique identifier
- userId: Which employee requested leave
- type: Annual | Sick | Casual
- startDate: Leave start date
- endDate: Leave end date
- reason: Why they need leave
- status: Pending | Approved | Rejected | Cancelled
- createdAt: When leave was applied
```

**4. payruns table** (Monthly Payroll)
```
Columns:
- id: Unique identifier
- month: Which month (2024-11)
- generatedBy: Who generated this payroll
- totalPayroll: Total amount for all employees
- items: JSON array of individual salaries
  Example: [
    { userId: "USR-001", gross: 100000, deductions: 12000, net: 88000 },
    { userId: "USR-002", gross: 75000, deductions: 9000, net: 66000 }
  ]
- createdAt: When payroll was generated
```

**5. settings table** (System Configuration)
```
Columns:
- id: Unique identifier
- workingDays: Days per month (default 22)
- pfPercent: Provident Fund % (default 12.00)
- professionalTax: Professional tax amount (default 200)
- updatedAt: Last updated time
```

**6. user_permissions table** (Role Permissions)
```
Columns:
- id: Unique identifier
- userId: Which user
- employees: none | view | edit
- attendance: none | view | edit
- timeOff: none | view | edit
- payroll: none | view | edit
- reports: none | view | edit
- settings: none | view | edit
- createdAt: When permissions set
```

**7. salary_components table** (Detailed Salary Breakdown)
```
Columns:
- id: Unique identifier
- userId: Which employee
- monthlyWage: Total monthly salary
- yearlyWage: Annual CTC
- workingDays: Working days
- workingHours: Hours per day
- breakTime: Break duration
- basicSalary: Basic pay
- basicSalaryPercent: Basic as % of total
- overtimeAllowance: OT amount
- performanceBonus: Bonus amount
- leaveTravelAllowance: LTA
- fixedAllowance: Other fixed amounts
- pfEmployer: Employer PF contribution
- pfEmployee: Employee PF deduction
- professionalTax: PT deduction
- incomeTax: TDS deduction
- createdAt, updatedAt: Timestamps
```

**8. skills table** (Employee Skills)
```
Columns:
- id: Unique identifier
- userId: Which employee
- skillName: Skill (JavaScript, Marketing, etc.)
- createdAt: When added
```

**9. certifications table** (Employee Certifications)
```
Columns:
- id: Unique identifier
- userId: Which employee
- certificationName: Certification (AWS, PMP, etc.)
- createdAt: When added
```

### 4.3 Running db:push

**Command:** `npm run db:push`

**What this command does:**

1. **Reads shared/schema.ts**
   - Understands your table definitions
   
2. **Connects to database**
   - Uses DATABASE_URL from .env
   
3. **Compares schema with database**
   - Checks what tables exist
   - Checks what columns exist
   
4. **Generates SQL statements**
   - Creates CREATE TABLE statements for new tables
   - Creates ALTER TABLE statements for changes
   
5. **Executes SQL**
   - Runs the statements against your database
   - Creates all 9 tables
   - Creates indexes for performance

**What you'll see:**
```
Drizzle Kit v0.31.4

Reading config from drizzle.config.ts
Pushing schema to database...
✓ Done!
```

**What happened in the database:**
- 9 tables were created
- Each table has all specified columns
- Primary keys were set
- Foreign keys were created (links between tables)
- Indexes were created for fast searching

**Verification:**
You can verify tables were created:
```cmd
psql -U postgres -d workzen_hrms
\dt
```
You'll see a list of all 9 tables.

---

## 🚀 PART 5: Running the Application

### 5.1 Development Mode (npm run dev)

**What happens when you run `npm run dev`:**

**Step 1: Command execution**
```json
// package.json
"scripts": {
  "dev": "cross-env NODE_ENV=development tsx server/index.ts"
}
```

- `cross-env NODE_ENV=development` - Sets environment variable
- `tsx` - TypeScript execution tool
- `server/index.ts` - Entry point file

**Step 2: Server startup (server/index.ts)**

```typescript
// 1. Create Express app
const app = express();

// 2. Configure middleware
app.use(express.json()); // Parse JSON requests
app.use(session({ ... })); // Enable sessions

// 3. Seed database (if empty)
await seedDatabase();

// 4. Register API routes
registerRoutes(app);

// 5. Start server
app.listen(5000, "0.0.0.0");

// 6. Setup Vite (development frontend server)
await setupVite(app, server);
```

**Step 3: Database seeding (server/seed.ts)**

The application checks if the users table is empty:
```typescript
const existingUsers = await storage.getAllUsers();
if (existingUsers.length > 0) {
  console.log('Database already seeded, skipping...');
  return;
}
```

If empty, it creates:
- 1 Admin user (admin@workzen.com)
- 1 HR manager (hr@workzen.com)
- 1 Payroll officer (payroll@workzen.com)
- 3 Employees (john@, jane@, mike@workzen.com)
- 7 days of attendance for each user
- Sample leave requests
- Sample payroll run
- Default settings

**Step 4: Route registration (server/routes.ts)**

Creates API endpoints:

**Authentication endpoints:**
- `POST /api/login` - User login
- `POST /api/logout` - User logout  
- `GET /api/user` - Get current user

**User management:**
- `GET /api/users` - List all users
- `GET /api/users/:id` - Get specific user
- `POST /api/users` - Create new user
- `PATCH /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

**Attendance:**
- `GET /api/attendance` - Get attendance records
- `POST /api/attendance` - Mark attendance
- `PATCH /api/attendance/:id` - Update attendance

**Leaves:**
- `GET /api/leaves` - Get leave requests
- `POST /api/leaves` - Apply for leave
- `PATCH /api/leaves/:id` - Update leave status

**Payroll:**
- `GET /api/payruns` - Get payroll runs
- `POST /api/payruns` - Generate payroll

**Reports:**
- `GET /api/reports/salary-statement` - Salary report

**Settings:**
- `GET /api/settings` - Get settings
- `PATCH /api/settings` - Update settings

**Step 5: Vite setup (development)**

Vite starts a second server that:
- Watches frontend files for changes
- Hot-reloads when you edit code (no manual refresh needed)
- Compiles TypeScript to JavaScript
- Bundles dependencies
- Serves the React application

**Step 6: Ready to use**

Console output:
```
Database already seeded, skipping...
8:12:45 PM [express] serving on port 5000
```

Now you can visit: http://localhost:5000

### 5.2 What Happens When You Access http://localhost:5000

**Step 1: Browser requests the page**
- Your browser sends an HTTP GET request to localhost:5000
- Request reaches the Express server

**Step 2: Server responds**
- In development: Vite serves the React app
- Sends index.html with JavaScript bundles
- Browser downloads and executes JavaScript

**Step 3: React renders the UI**
```
App.tsx loads
├── Checks authentication (GET /api/user)
├── If not logged in: Shows Landing Page
│   └── Landing page with "Get Started" button
└── If logged in: Shows Dashboard with Sidebar
    ├── Sidebar navigation (Employees, Attendance, etc.)
    └── Main content area
```

**Step 4: User clicks "Sign In"**
- Navigates to `/login` route
- Shows login form

**Step 5: User enters credentials**
- Email: admin@workzen.com
- Password: admin123
- Clicks "Sign In" button

**Step 6: Frontend submits login**
```typescript
// POST /api/login
fetch('/api/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password })
})
```

**Step 7: Backend processes login**
```typescript
// server/routes.ts
app.post('/api/login', async (req, res) => {
  // 1. Get email and password from request
  const { email, password } = req.body;
  
  // 2. Find user in database
  const user = await storage.getUserByEmail(email);
  
  // 3. Verify password using bcrypt
  const isValid = await bcrypt.compare(password, user.password);
  
  // 4. If valid, create session
  if (isValid) {
    req.session.userId = user.id;
    res.json({ user });
  }
});
```

**Step 8: Frontend receives response**
- Stores user data in React Query cache
- Redirects to dashboard
- Sidebar shows appropriate menu items based on role

**Step 9: Dashboard loads data**
Multiple queries execute in parallel:
```typescript
// Fetch recent attendance
useQuery({ queryKey: '/api/attendance', ... })

// Fetch pending leaves
useQuery({ queryKey: '/api/leaves', ... })

// Fetch user list
useQuery({ queryKey: '/api/users', ... })
```

**Step 10: User interacts**
- Clicks "Employees" in sidebar
- Employees page loads
- Shows table of all employees
- Can add/edit/delete employees

---

## 🔐 PART 6: Understanding Authentication & Security

### 6.1 Password Hashing with bcrypt

**Why we hash passwords:**

**Bad approach (Never do this):**
```typescript
// Storing plain text password - VERY BAD!
password: "admin123"
```

If someone hacks the database, they see all passwords.

**Good approach (What we do):**
```typescript
// Hashing the password
import bcrypt from 'bcrypt';

// When user registers:
const hashedPassword = await bcrypt.hash("admin123", 10);
// Result: "$2b$10$K8kx3..." (60 characters, completely different)

// Store the hash:
password: "$2b$10$K8kx3..."

// When user logs in:
const isValid = await bcrypt.compare("admin123", storedHash);
// Returns: true (passwords match)
```

**How bcrypt works:**
1. Takes the plain password
2. Adds random "salt" (random data)
3. Runs it through a one-way hashing algorithm multiple times
4. Generates a hash that can't be reversed

**Benefits:**
- Even if database is hacked, passwords are safe
- Each hash is unique (same password = different hash due to salt)
- Cannot be reversed to get original password

### 6.2 Session Management

**What is a session?**
- A way to remember who is logged in
- Without sessions, you'd have to login for every page

**How sessions work:**

**Step 1: User logs in**
```typescript
// Server creates session
req.session.userId = "USR-001";
```

**Step 2: Session stored**
```typescript
// In memory (during development)
sessions = {
  "abc123def456": { userId: "USR-001" }
}
```

**Step 3: Cookie sent to browser**
```
Set-Cookie: connect.sid=abc123def456; HttpOnly; Secure
```

**Step 4: Browser stores cookie**
- Automatically included in future requests
- Browser sends it with every request

**Step 5: Subsequent requests**
```
GET /api/users
Cookie: connect.sid=abc123def456
```

**Step 6: Server verifies**
```typescript
// Server checks session
const session = sessions["abc123def456"];
const userId = session.userId; // "USR-001"
// User is authenticated!
```

**Session configuration:**
```typescript
session({
  secret: process.env.SESSION_SECRET, // Encrypts cookie
  cookie: {
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    httpOnly: true, // JavaScript can't access
    secure: false, // true in production (HTTPS only)
    sameSite: "lax" // CSRF protection
  }
})
```

### 6.3 Role-Based Access Control

**Four user roles:**

**1. Admin**
- Full access to everything
- Can manage employees
- Can process payroll
- Can change settings
- Can view all reports

**2. HR**
- Manage employees
- View/approve attendance
- Approve/reject leaves
- View reports
- Cannot access payroll
- Cannot change settings

**3. Payroll Officer**
- Process payroll
- Generate salary statements
- View employee data
- View reports
- Cannot manage employees
- Cannot change settings

**4. Employee**
- View own profile
- Mark own attendance
- Apply for leaves
- View own payslips
- Download salary statements
- Cannot see other employees' data

**How it's enforced:**

**Backend (server/routes.ts):**
```typescript
// Middleware checks role
function requireRole(allowedRoles: string[]) {
  return async (req, res, next) => {
    const user = await getCurrentUser(req);
    
    if (!allowedRoles.includes(user.role)) {
      return res.status(403).json({ 
        message: "Access denied" 
      });
    }
    
    next();
  };
}

// Protect route
app.get('/api/settings', 
  requireRole(['admin']), 
  async (req, res) => {
    // Only admins reach here
  }
);
```

**Frontend (client/src/components/app-sidebar.tsx):**
```typescript
// Show/hide menu based on role
{user?.role !== 'employee' && (
  <SidebarMenuItem>
    <Link to="/payroll">Payroll</Link>
  </SidebarMenuItem>
)}
```

---

## 📊 PART 7: Understanding Data Flow

### 7.1 Example: Marking Attendance

Let's trace what happens when an employee marks attendance:

**Step 1: User action**
- Employee clicks "Mark Attendance" button
- Modal opens with form

**Step 2: Form submission**
```typescript
// client/src/pages/attendance.tsx
const mutation = useMutation({
  mutationFn: (data) => 
    apiRequest('/api/attendance', {
      method: 'POST',
      body: JSON.stringify(data)
    })
});

// User clicks submit
mutation.mutate({
  userId: currentUser.id,
  date: '2024-11-08',
  inTime: '09:15',
  outTime: null,
  status: 'Present'
});
```

**Step 3: Request sent**
```
POST http://localhost:5000/api/attendance
Headers:
  Content-Type: application/json
  Cookie: connect.sid=abc123...
  
Body:
{
  "userId": "USR-004",
  "date": "2024-11-08",
  "inTime": "09:15",
  "outTime": null,
  "status": "Present"
}
```

**Step 4: Backend receives request**
```typescript
// server/routes.ts
app.post('/api/attendance', async (req, res) => {
  // 1. Verify user is logged in
  if (!req.session.userId) {
    return res.status(401).json({ message: "Not authenticated" });
  }
  
  // 2. Validate data
  const validatedData = insertAttendanceSchema.parse(req.body);
  
  // 3. Create in database
  const attendance = await storage.createAttendance(validatedData);
  
  // 4. Return result
  res.json(attendance);
});
```

**Step 5: Storage layer**
```typescript
// server/storage.ts
async createAttendance(data: InsertAttendance) {
  // 1. Generate unique ID
  const id = await this.generateId('ATT');
  
  // 2. Insert into database using Drizzle
  const [attendance] = await db.insert(attendance).values({
    id,
    ...data,
  }).returning();
  
  return attendance;
}
```

**Step 6: Database operation**
```sql
-- Drizzle generates and executes this SQL:
INSERT INTO attendance (id, user_id, date, in_time, out_time, status, created_at)
VALUES ('ATT-001', 'USR-004', '2024-11-08', '09:15', NULL, 'Present', NOW())
RETURNING *;
```

**Step 7: Response sent back**
```json
{
  "id": "ATT-001",
  "userId": "USR-004",
  "date": "2024-11-08",
  "inTime": "09:15",
  "outTime": null,
  "status": "Present",
  "createdAt": "2024-11-08T09:15:00Z"
}
```

**Step 8: Frontend updates**
```typescript
// React Query automatically:
// 1. Invalidates cache
queryClient.invalidateQueries(['/api/attendance']);

// 2. Refetches data
// 3. Updates UI with new attendance record

// User sees success message
toast({
  title: "Success",
  description: "Attendance marked successfully"
});
```

**Step 9: UI reflects change**
- Table updates with new row
- Today's attendance shows check-in time
- Modal closes
- Data is now persistent in database

### 7.2 Example: Generating Monthly Payroll

**Step 1: Payroll officer clicks "Generate Payroll"**

**Step 2: Frontend collects data**
```typescript
// Select month: November 2024
const month = '2024-11';

// Fetch all employees
const users = await fetch('/api/users').then(r => r.json());

// Fetch settings
const settings = await fetch('/api/settings').then(r => r.json());
```

**Step 3: Calculate salaries**
```typescript
const items = users.map(user => {
  // Gross salary
  const gross = user.basicSalary + user.hra + user.otherEarnings;
  
  // Deductions
  const pf = (user.basicSalary * settings.pfPercent) / 100;
  const tax = settings.professionalTax;
  const deductions = pf + tax;
  
  // Net salary
  const net = gross - deductions;
  
  return {
    userId: user.id,
    gross,
    deductions: Math.round(deductions),
    net: Math.round(net)
  };
});

// Total
const totalPayroll = items.reduce((sum, item) => sum + item.net, 0);
```

**Step 4: Submit to backend**
```typescript
POST /api/payruns
{
  "month": "2024-11",
  "generatedBy": "USR-002",
  "totalPayroll": 450000,
  "items": [
    { "userId": "USR-001", "gross": 105000, "deductions": 9800, "net": 95200 },
    { "userId": "USR-002", "gross": 78000, "deductions": 7000, "net": 71000 },
    ...
  ]
}
```

**Step 5: Backend stores payroll**
```typescript
// Generate unique ID
const id = await this.generateId('PAY');

// Insert into database
await db.insert(payruns).values({
  id,
  month,
  generatedBy,
  totalPayroll,
  items: JSON.stringify(items), // Store as JSON
});
```

**Step 6: Database storage**
```sql
INSERT INTO payruns (id, month, generated_by, total_payroll, items, created_at)
VALUES (
  'PAY-001',
  '2024-11',
  'USR-002',
  450000,
  '[{"userId":"USR-001","gross":105000,...}]',
  NOW()
);
```

**Step 7: Employees can view**
- Employees log in
- Navigate to "My Payroll"
- See November 2024 salary slip
- Download as PDF

---

## 🛠️ PART 8: Common Issues and Solutions

### 8.1 Database Connection Errors

**Error:** `ECONNREFUSED` or `could not connect to server`

**Cause:** PostgreSQL is not running

**Solution:**
1. Open Task Manager
2. Go to Services tab
3. Look for `postgresql-x64-[version]`
4. If not running, right-click → Start

**Alternative:** Open Services app
1. Press Win + R
2. Type `services.msc`
3. Find PostgreSQL service
4. Right-click → Start

---

**Error:** `password authentication failed for user "postgres"`

**Cause:** Wrong password in .env file

**Solution:**
1. Open `.env` file
2. Verify DATABASE_URL password matches PostgreSQL password
3. If forgotten, you can reset PostgreSQL password:
   - Open pgAdmin 4
   - Right-click on server → Properties
   - Change password

---

**Error:** `database "workzen_hrms" does not exist`

**Cause:** Database wasn't created

**Solution:**
```cmd
psql -U postgres
CREATE DATABASE workzen_hrms;
\q
```

---

### 8.2 Port Conflicts

**Error:** `EADDRINUSE: address already in use :::5000`

**Cause:** Another process is using port 5000

**Solution 1: Find and kill the process**
```cmd
# Find process using port 5000
netstat -ano | findstr :5000

# Output:
# TCP    0.0.0.0:5000    0.0.0.0:0    LISTENING    1234

# Kill process (1234 is the PID)
taskkill /PID 1234 /F
```

**Solution 2: Change port**
Edit `.env`:
```env
PORT=3000
```

---

### 8.3 npm Errors

**Error:** `npm: command not found`

**Cause:** Node.js not installed or not in PATH

**Solution:**
1. Reinstall Node.js from https://nodejs.org/
2. During installation, ensure "Add to PATH" is checked
3. Restart Command Prompt
4. Verify: `node --version`

---

**Error:** `EPERM: operation not permitted`

**Cause:** Permission issues on Windows

**Solution:**
1. Close VS Code or any editors
2. Run Command Prompt as Administrator
3. Navigate to project folder
4. Run `npm install` again

---

**Error:** `ERR_PACKAGE_NOT_FOUND`

**Cause:** Missing dependencies

**Solution:**
```cmd
# Delete node_modules and package-lock.json
rmdir /s /q node_modules
del package-lock.json

# Reinstall
npm install
```

---

### 8.4 Application Not Starting

**Error:** `Cannot find module 'cross-env'`

**Cause:** Dependencies not installed

**Solution:**
```cmd
npm install
```

---

**Error:** TypeScript errors during `npm run dev`

**Cause:** Type conflicts or missing types

**Solution:**
```cmd
# Check for TypeScript errors
npm run check

# If there are errors, they'll be listed
# Usually auto-fixed by ensuring all packages are installed
npm install
```

---

**Error:** `Unexpected token` or syntax errors

**Cause:** Using old Node.js version

**Solution:**
1. Check version: `node --version`
2. Ensure it's v20 or higher
3. If not, download and install latest from nodejs.org

---

## 🎯 PART 9: Application Architecture Deep Dive

### 9.1 Project Structure Explained

```
workzen-hrms/
│
├── client/                          # Frontend application
│   ├── src/
│   │   ├── components/              # Reusable UI components
│   │   │   ├── ui/                  # Base shadcn components
│   │   │   │   ├── button.tsx       # Button component
│   │   │   │   ├── card.tsx         # Card component
│   │   │   │   ├── dialog.tsx       # Modal dialogs
│   │   │   │   └── ...              # 40+ components
│   │   │   ├── app-sidebar.tsx      # Main navigation sidebar
│   │   │   └── theme-provider.tsx   # Dark/light mode
│   │   │
│   │   ├── pages/                   # Page components (routes)
│   │   │   ├── landing.tsx          # Landing page
│   │   │   ├── login.tsx            # Login page
│   │   │   ├── dashboard.tsx        # Main dashboard
│   │   │   ├── employees.tsx        # Employee management
│   │   │   ├── attendance.tsx       # Attendance tracking
│   │   │   ├── leaves.tsx           # Leave management
│   │   │   ├── payroll.tsx          # Payroll processing
│   │   │   ├── my-payroll.tsx       # Employee payroll view
│   │   │   ├── reports.tsx          # Salary reports
│   │   │   ├── settings.tsx         # System settings
│   │   │   └── not-found.tsx        # 404 page
│   │   │
│   │   ├── lib/                     # Utilities
│   │   │   ├── queryClient.ts       # React Query setup
│   │   │   └── utils.ts             # Helper functions
│   │   │
│   │   ├── hooks/                   # Custom React hooks
│   │   │   ├── use-toast.ts         # Toast notifications
│   │   │   └── use-user.ts          # Current user data
│   │   │
│   │   ├── App.tsx                  # Main app component
│   │   └── main.tsx                 # Entry point
│   │
│   └── index.html                   # HTML template
│
├── server/                          # Backend application
│   ├── index.ts                     # Server entry point
│   ├── routes.ts                    # API route definitions
│   ├── storage.ts                   # Database operations
│   ├── seed.ts                      # Database seeding
│   └── vite.ts                      # Vite integration
│
├── shared/                          # Shared code
│   └── schema.ts                    # Database schema & types
│
├── migrations/                      # Database migrations (auto-generated)
│
├── node_modules/                    # Installed packages (auto-generated)
│
├── .env                             # Environment variables (create this)
├── .env.example                     # Template
├── .gitignore                       # Git ignore rules
├── package.json                     # Project configuration
├── package-lock.json                # Locked dependency versions
├── tsconfig.json                    # TypeScript configuration
├── vite.config.ts                   # Vite configuration
├── drizzle.config.ts                # Drizzle ORM configuration
├── tailwind.config.ts               # Tailwind CSS configuration
│
└── README.md                        # Project documentation
```

### 9.2 Technology Stack Detailed

**Frontend Technologies:**

1. **React 18**
   - Component-based UI library
   - Virtual DOM for performance
   - Hooks for state management
   
2. **TypeScript**
   - Type-safe JavaScript
   - Catches errors at compile time
   - Better IDE autocomplete
   
3. **Vite**
   - Lightning-fast dev server
   - Hot Module Replacement (HMR)
   - Optimized production builds
   
4. **Wouter**
   - Lightweight routing (2KB)
   - `<Route>` components
   - `useLocation()` hook
   
5. **TanStack Query (React Query)**
   - Data fetching & caching
   - Automatic refetching
   - Optimistic updates
   
6. **React Hook Form**
   - Form state management
   - Validation
   - Error handling
   
7. **Zod**
   - Schema validation
   - TypeScript integration
   - Runtime type checking
   
8. **Tailwind CSS**
   - Utility-first CSS
   - Responsive design
   - Dark mode support
   
9. **Shadcn/ui**
   - Pre-built accessible components
   - Customizable
   - Built on Radix UI

**Backend Technologies:**

1. **Express.js**
   - Web server framework
   - Middleware system
   - Routing
   
2. **Node.js**
   - JavaScript runtime
   - Event-driven
   - Non-blocking I/O
   
3. **TypeScript**
   - Type safety on backend too
   - Shared types with frontend
   
4. **Drizzle ORM**
   - Type-safe database queries
   - Migrations
   - Schema management
   
5. **PostgreSQL**
   - Relational database
   - ACID compliance
   - JSON support
   
6. **bcrypt**
   - Password hashing
   - Salt generation
   - Secure by design
   
7. **Express Session**
   - Session management
   - Cookie-based
   - Store-agnostic
   
8. **Passport.js**
   - Authentication middleware
   - Strategy-based
   - Local strategy for our app

---

## ✅ PART 10: Verification & Testing

### 10.1 Verify Installation Checklist

**Before running the app:**

✓ **Node.js installed**
```cmd
node --version
# Should show: v20.x.x or higher
```

✓ **npm available**
```cmd
npm --version
# Should show: 10.x.x or higher
```

✓ **PostgreSQL installed**
```cmd
psql --version
# Should show: psql (PostgreSQL) 14.x or higher
```

✓ **PostgreSQL running**
```cmd
# Windows: Check Services
services.msc
# Look for "postgresql-x64-XX"
# Status should be "Running"
```

✓ **Database created**
```cmd
psql -U postgres -c "\l" | findstr workzen_hrms
# Should show workzen_hrms database
```

✓ **Project files downloaded**
```cmd
dir
# Should show package.json, client/, server/, etc.
```

✓ **Dependencies installed**
```cmd
dir node_modules
# Should show many folders
```

✓ **.env file created**
```cmd
type .env
# Should show DATABASE_URL, SESSION_SECRET, NODE_ENV
```

✓ **Database tables created**
```cmd
psql -U postgres -d workzen_hrms -c "\dt"
# Should list 9 tables
```

### 10.2 Test the Application

**Test 1: Server starts**
```cmd
npm run dev
```
Expected output:
```
> rest-express@1.0.0 dev
> cross-env NODE_ENV=development tsx server/index.ts

Database already seeded, skipping...
8:15:00 PM [express] serving on port 5000
```

**Test 2: Open in browser**
1. Go to http://localhost:5000
2. Should see WorkZen landing page
3. Click "Sign In"

**Test 3: Login works**
1. Email: admin@workzen.com
2. Password: admin123
3. Click "Sign In"
4. Should redirect to dashboard

**Test 4: Navigation works**
1. Click "Employees" in sidebar
2. Should see list of 6 employees
3. Click "Attendance" 
4. Should see attendance records

**Test 5: Data operations work**
1. Click "Add Employee" button
2. Fill form
3. Submit
4. New employee should appear in list

**Test 6: Role-based access**
1. Logout
2. Login as employee (john@workzen.com / employee123)
3. Sidebar should show limited options
4. No "Settings" or "Payroll" menu items
5. Can access "My Payroll"

---

## 🎓 Summary

You now understand:

1. ✅ **Prerequisites** - Why Node.js and PostgreSQL are needed
2. ✅ **Database Setup** - How to create and connect to PostgreSQL
3. ✅ **Project Installation** - What npm install does
4. ✅ **Environment Configuration** - Purpose of .env file
5. ✅ **Database Schema** - All 9 tables and their purposes
6. ✅ **Running the App** - What happens during npm run dev
7. ✅ **Authentication** - How passwords and sessions work
8. ✅ **Data Flow** - Complete request/response cycle
9. ✅ **Troubleshooting** - Common issues and solutions
10. ✅ **Architecture** - How all pieces fit together

**Next Steps:**

1. Download all project files from Replit
2. Install Node.js and PostgreSQL on Windows
3. Create the workzen_hrms database
4. Configure .env file
5. Run npm install
6. Run npm run db:push
7. Run npm run dev
8. Access http://localhost:5000
9. Login and explore!

**You're ready to run WorkZen HRMS on your Windows computer! 🎉**
