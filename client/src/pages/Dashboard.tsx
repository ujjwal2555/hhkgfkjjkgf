import { Card } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { format, subDays } from 'date-fns';
import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/api';
import { useLocation } from 'wouter';
import { Users, Clock, Calendar, Wallet, TrendingUp, TrendingDown } from 'lucide-react';

export default function Dashboard() {
  const { currentUser } = useAuth();
  const [, setLocation] = useLocation();

  const { data: employees = [] } = useQuery({
    queryKey: ['/api/users'],
    queryFn: () => apiRequest<any[]>('GET', '/api/users'),
    enabled: currentUser?.role === 'admin' || currentUser?.role === 'hr',
  });

  const { data: attendance = [], isLoading: isLoadingAttendance } = useQuery({
    queryKey: ['/api/attendance'],
    queryFn: () => apiRequest<any[]>('GET', '/api/attendance'),
  });

  const totalEmployees = employees.length;
  const today = format(new Date(), 'yyyy-MM-dd');
  const presentToday = attendance.filter((a: any) => a.date === today && a.status === 'Present').length;
  const absentToday = totalEmployees - presentToday;

  const last30DaysAttendance = Array.from({ length: 30 }, (_, i) => {
    const date = format(subDays(new Date(), 29 - i), 'yyyy-MM-dd');
    const present = attendance.filter((a: any) => a.date === date && a.status === 'Present').length;
    return {
      date: format(subDays(new Date(), 29 - i), 'dd'),
      present: present
    };
  });

  const attendanceStats = [
    { name: 'Present', value: presentToday, color: '#56CA6D' },
    { name: 'Absent', value: absentToday, color: '#FF6B6B' },
  ];

  const departmentData = employees.reduce((acc: any, emp: any) => {
    const dept = emp.department || 'Unassigned';
    acc[dept] = (acc[dept] || 0) + 1;
    return acc;
  }, {});

  const departmentChart = Object.entries(departmentData).map(([name, value]) => ({
    name,
    value,
  }));

  const COLORS = ['#714b67', '#56CA6D', '#FFD93D', '#6BCF7F', '#FF8E3C'];

  const payrollData = [
    { month: 'Jul', amount: 78000 },
    { month: 'Aug', amount: 82000 },
    { month: 'Sep', amount: 85000 },
    { month: 'Oct', amount: 88000 }
  ];

  const getTodayCheckInStatus = (userId: string) => {
    return attendance.find((a: any) => a.userId === userId && a.date === today);
  };

  const MetricCard = ({ title, value, icon: Icon, color, trend }: any) => (
    <Card className="p-6">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-muted-foreground mb-1">{title}</p>
          <h3 className="text-3xl font-bold mb-2">{value}</h3>
          {trend && (
            <div className="flex items-center gap-1">
              {trend.positive ? (
                <TrendingUp className="h-4 w-4 text-green-500" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-500" />
              )}
              <span className={`text-sm ${trend.positive ? 'text-green-500' : 'text-red-500'}`}>
                {trend.value}
              </span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-xl ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
    </Card>
  );

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {currentUser?.name}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Employees"
          value={totalEmployees}
          icon={Users}
          color="bg-[#714b67]"
          data-testid="metric-total-employees"
        />
        <MetricCard
          title="Present Today"
          value={presentToday}
          icon={Clock}
          color="bg-[#56CA6D]"
          trend={{ value: `${((presentToday/totalEmployees)*100).toFixed(0)}%`, positive: true }}
          data-testid="metric-present-today"
        />
        <MetricCard
          title="Absent Today"
          value={absentToday}
          icon={Calendar}
          color="bg-[#FF6B6B]"
          data-testid="metric-absent-today"
        />
        {(currentUser?.role === 'admin' || currentUser?.role === 'payroll') && (
          <MetricCard
            title="Payroll This Month"
            value={`₹${(88000 / 1000).toFixed(0)}K`}
            icon={Wallet}
            color="bg-[#FFD93D]"
            data-testid="metric-payroll"
          />
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Daily Attendance (30 Days)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={last30DaysAttendance}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
              <XAxis 
                dataKey="date" 
                stroke="hsl(var(--muted-foreground))" 
                fontSize={12}
              />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--popover))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '0.5rem',
                  padding: '8px 12px'
                }}
              />
              <Bar dataKey="present" fill="#714b67" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Today's Attendance Status</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={attendanceStats}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {attendanceStats.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--popover))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '0.5rem',
                  padding: '8px 12px'
                }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {(currentUser?.role === 'admin' || currentUser?.role === 'payroll') && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Payroll Cost Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={payrollData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
              <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--popover))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '0.5rem',
                  padding: '8px 12px'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="amount" 
                stroke="#714b67" 
                strokeWidth={3}
                dot={{ fill: '#714b67', r: 5 }}
                activeDot={{ r: 7 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      )}

      {departmentChart.length > 0 && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Department Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={departmentChart} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
              <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis type="category" dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} width={120} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--popover))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '0.5rem',
                  padding: '8px 12px'
                }}
              />
              <Bar dataKey="value" radius={[0, 8, 8, 0]}>
                {departmentChart.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>
      )}

      {(currentUser?.role === 'admin' || currentUser?.role === 'hr') && employees.length > 0 && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Employee Directory</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {employees.map((employee: any) => {
              const checkedIn = getTodayCheckInStatus(employee.id);
              return (
                <Card 
                  key={employee.id} 
                  className="p-4 hover-elevate cursor-pointer relative"
                  onClick={() => setLocation(`/employees/${employee.id}`)}
                  data-testid={`card-employee-${employee.id}`}
                >
                  <div 
                    className={`absolute top-2 right-2 w-3 h-3 rounded-full ${
                      checkedIn ? 'bg-green-500' : 'bg-red-500'
                    }`}
                    title={checkedIn ? 'Checked In' : 'Not Checked In'}
                  />
                  <div className="flex flex-col items-center text-center">
                    <div className="w-20 h-20 rounded-full bg-[#714b67] flex items-center justify-center text-white text-2xl font-bold mb-3">
                      {employee.name.split(' ').map((n: string) => n[0]).join('').toUpperCase()}
                    </div>
                    <h4 className="font-semibold text-sm mb-1">{employee.name}</h4>
                    <p className="text-xs text-muted-foreground mb-1 font-mono">{employee.loginId}</p>
                    <p className="text-xs text-muted-foreground mb-2 capitalize">{employee.role}</p>
                    <div className="w-full pt-2 border-t">
                      <p className="text-xs text-muted-foreground">{employee.department}</p>
                      <p className="text-xs font-medium mt-1">₹{(employee.basicSalary / 1000).toFixed(0)}K</p>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </Card>
      )}
    </div>
  );
}
