-- WorkZen HRMS Database Schema
-- PostgreSQL Database Schema
-- Database Name: workzen_hrms

-- ============================================
-- TABLE: users
-- ============================================
CREATE TABLE users (
    id TEXT PRIMARY KEY,
    login_id TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    role TEXT NOT NULL,  -- 'admin' | 'hr' | 'payroll' | 'employee'
    department TEXT NOT NULL,
    mobile TEXT,
    company TEXT,
    manager TEXT,
    location TEXT,
    year_of_joining INTEGER NOT NULL,
    basic_salary INTEGER NOT NULL,
    hra INTEGER NOT NULL,
    other_earnings INTEGER NOT NULL,
    annual_leave INTEGER NOT NULL DEFAULT 12,
    sick_leave INTEGER NOT NULL DEFAULT 6,
    about TEXT,
    hobbies TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- ============================================
-- TABLE: attendance
-- ============================================
CREATE TABLE attendance (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    date TEXT NOT NULL,  -- YYYY-MM-DD format
    in_time TEXT NOT NULL,
    out_time TEXT,
    status TEXT NOT NULL,  -- 'Present' | 'Absent' | 'Half' | 'Leave'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- ============================================
-- TABLE: leaves
-- ============================================
CREATE TABLE leaves (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type TEXT NOT NULL,  -- 'Annual' | 'Sick' | 'Casual'
    start_date TEXT NOT NULL,
    end_date TEXT NOT NULL,
    reason TEXT NOT NULL,
    status TEXT NOT NULL,  -- 'Pending' | 'Approved' | 'Rejected' | 'Cancelled'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- ============================================
-- TABLE: payruns
-- ============================================
CREATE TABLE payruns (
    id TEXT PRIMARY KEY,
    month TEXT NOT NULL,  -- YYYY-MM format
    generated_by TEXT NOT NULL REFERENCES users(id),
    total_payroll INTEGER NOT NULL,
    items JSON NOT NULL,  -- Array of { userId, gross, deductions, net }
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- ============================================
-- TABLE: settings
-- ============================================
CREATE TABLE settings (
    id TEXT PRIMARY KEY,
    working_days INTEGER NOT NULL DEFAULT 22,
    pf_percent DECIMAL(5, 2) NOT NULL,
    professional_tax INTEGER NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- ============================================
-- TABLE: user_permissions
-- ============================================
CREATE TABLE user_permissions (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    employees TEXT NOT NULL DEFAULT 'none',  -- 'none' | 'view' | 'edit'
    attendance TEXT NOT NULL DEFAULT 'none',
    time_off TEXT NOT NULL DEFAULT 'none',
    payroll TEXT NOT NULL DEFAULT 'none',
    reports TEXT NOT NULL DEFAULT 'none',
    settings TEXT NOT NULL DEFAULT 'none',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- ============================================
-- TABLE: salary_components
-- ============================================
CREATE TABLE salary_components (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    monthly_wage INTEGER NOT NULL,
    yearly_wage INTEGER NOT NULL,
    working_days INTEGER NOT NULL DEFAULT 22,
    working_hours DECIMAL(5, 2) NOT NULL DEFAULT 8.00,
    break_time DECIMAL(5, 2) NOT NULL DEFAULT 1.00,
    basic_salary INTEGER NOT NULL,
    basic_salary_percent DECIMAL(5, 2) NOT NULL,
    overtime_allowance INTEGER NOT NULL DEFAULT 0,
    overtime_percent DECIMAL(5, 2) NOT NULL DEFAULT 0.00,
    performance_bonus INTEGER NOT NULL DEFAULT 0,
    performance_bonus_percent DECIMAL(5, 2) NOT NULL DEFAULT 0.00,
    leave_travel_allowance INTEGER NOT NULL DEFAULT 0,
    leave_travel_percent DECIMAL(5, 2) NOT NULL DEFAULT 0.00,
    fixed_allowance INTEGER NOT NULL DEFAULT 0,
    fixed_allowance_percent DECIMAL(5, 2) NOT NULL DEFAULT 0.00,
    pf_employer INTEGER NOT NULL DEFAULT 0,
    pf_employer_percent DECIMAL(5, 2) NOT NULL DEFAULT 12.00,
    pf_employee INTEGER NOT NULL DEFAULT 0,
    pf_employee_percent DECIMAL(5, 2) NOT NULL DEFAULT 12.00,
    professional_tax INTEGER NOT NULL DEFAULT 0,
    income_tax INTEGER NOT NULL DEFAULT 0,
    income_tax_percent DECIMAL(5, 2) NOT NULL DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- ============================================
-- TABLE: skills
-- ============================================
CREATE TABLE skills (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    skill_name TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- ============================================
-- TABLE: certifications
-- ============================================
CREATE TABLE certifications (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    certification_name TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- ============================================
-- INDEXES
-- ============================================

-- Index on user_id for faster lookups
CREATE INDEX idx_attendance_user_id ON attendance(user_id);
CREATE INDEX idx_attendance_date ON attendance(date);
CREATE INDEX idx_leaves_user_id ON leaves(user_id);
CREATE INDEX idx_leaves_status ON leaves(status);
CREATE INDEX idx_user_permissions_user_id ON user_permissions(user_id);
CREATE INDEX idx_salary_components_user_id ON salary_components(user_id);
CREATE INDEX idx_skills_user_id ON skills(user_id);
CREATE INDEX idx_certifications_user_id ON certifications(user_id);

-- ============================================
-- INITIAL SEED DATA (Optional - run after creating tables)
-- ============================================

-- Settings
INSERT INTO settings (id, working_days, pf_percent, professional_tax) 
VALUES ('1', 22, 12.00, 200);

-- Note: The application will automatically seed users and other data
-- when you run 'npm run dev' for the first time.
-- The seed data includes:
-- - 1 Admin user
-- - 1 HR Manager
-- - 1 Payroll Officer
-- - 3 Employees
-- - Sample attendance records
-- - Sample leave requests
-- - Sample payrun

-- ============================================
-- USEFUL QUERIES
-- ============================================

-- View all users
-- SELECT * FROM users;

-- View attendance for a specific user
-- SELECT * FROM attendance WHERE user_id = 'USER_ID' ORDER BY date DESC;

-- View pending leave requests
-- SELECT l.*, u.name as employee_name 
-- FROM leaves l 
-- JOIN users u ON l.user_id = u.id 
-- WHERE l.status = 'Pending';

-- Calculate total payroll for a month
-- SELECT SUM((basic_salary + hra + other_earnings)) as total_gross
-- FROM users WHERE role = 'employee';

-- View user permissions
-- SELECT u.name, u.email, u.role, up.*
-- FROM users u
-- LEFT JOIN user_permissions up ON u.id = up.user_id;
