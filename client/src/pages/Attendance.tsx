import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Clock, LogIn, LogOut, Calendar as CalendarIcon, TrendingUp, CheckCircle2, XCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { format, subDays, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useQuery, useMutation } from '@tanstack/react-query';
import { api, type Attendance as AttendanceType } from '@/lib/api';
import { queryClient } from '@/lib/queryClient';
import { BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

export default function Attendance() {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedMonth, setSelectedMonth] = useState<Date>(new Date());

  const { data: userAttendance = [] } = useQuery<AttendanceType[]>({
    queryKey: ['/api/attendance'],
    enabled: !!currentUser,
  });

  const todayAttendance = userAttendance.find(
    (a: AttendanceType) => a.date === format(new Date(), 'yyyy-MM-dd')
  );

  const clockInMutation = useMutation({
    mutationFn: () => api.clockIn(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/attendance'] });
      queryClient.invalidateQueries({ queryKey: ['todayAttendance'] });
      toast({
        title: 'Clocked In',
        description: 'Attendance marked successfully'
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Clock In Failed',
        description: error.message || 'Failed to clock in',
        variant: 'destructive',
      });
    },
  });

  const clockOutMutation = useMutation({
    mutationFn: () => api.clockOut(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/attendance'] });
      queryClient.invalidateQueries({ queryKey: ['todayAttendance'] });
      toast({
        title: 'Clocked Out',
        description: 'Clock out recorded successfully'
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Clock Out Failed',
        description: error.message || 'Failed to clock out',
        variant: 'destructive',
      });
    },
  });

  const handleClockIn = () => {
    clockInMutation.mutate();
  };

  const handleClockOut = () => {
    clockOutMutation.mutate();
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      Present: 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400',
      Absent: 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400',
      Half: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400',
      Leave: 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400'
    };
    return colors[status] || 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300';
  };

  // Calculate attendance stats
  const thisMonthAttendance = userAttendance.filter((a: AttendanceType) => {
    const date = new Date(a.date);
    return date.getMonth() === selectedMonth.getMonth() && 
           date.getFullYear() === selectedMonth.getFullYear();
  });

  const presentDays = thisMonthAttendance.filter((a: AttendanceType) => a.status === 'Present').length;
  const absentDays = thisMonthAttendance.filter((a: AttendanceType) => a.status === 'Absent').length;
  const leaveDays = thisMonthAttendance.filter((a: AttendanceType) => a.status === 'Leave').length;
  const halfDays = thisMonthAttendance.filter((a: AttendanceType) => a.status === 'Half').length;
  
  const workingDays = eachDayOfInterval({
    start: startOfMonth(selectedMonth),
    end: endOfMonth(selectedMonth)
  }).filter(day => day.getDay() !== 0 && day.getDay() !== 6).length;

  const attendancePercentage = workingDays > 0 ? Math.round((presentDays / workingDays) * 100) : 0;

  const statusData = [
    { name: 'Present', value: presentDays, color: '#56CA6D' },
    { name: 'Absent', value: absentDays, color: '#FF6B6B' },
    { name: 'Leave', value: leaveDays, color: '#FFD93D' },
    { name: 'Half Day', value: halfDays, color: '#FF8E3C' },
  ].filter(item => item.value > 0);

  // Last 7 days chart data
  const last7DaysData = Array.from({ length: 7 }, (_, i) => {
    const date = format(subDays(new Date(), 6 - i), 'yyyy-MM-dd');
    const record = userAttendance.find((a: AttendanceType) => a.date === date);
    return {
      date: format(subDays(new Date(), 6 - i), 'EEE'),
      present: record?.status === 'Present' ? 1 : 0,
      status: record?.status || 'Absent'
    };
  });

  const MetricCard = ({ title, value, subtitle, icon: Icon, color }: any) => (
    <Card className="p-6">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-muted-foreground mb-1">{title}</p>
          <h3 className="text-3xl font-bold mb-1">{value}</h3>
          {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
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
        <h1 className="text-3xl font-bold mb-2">Attendance</h1>
        <p className="text-muted-foreground">
          Track and manage your daily attendance
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Present Days"
          value={presentDays}
          subtitle={`Out of ${workingDays} working days`}
          icon={CheckCircle2}
          color="bg-[#56CA6D]"
          data-testid="metric-present-days"
        />
        <MetricCard
          title="Attendance Rate"
          value={`${attendancePercentage}%`}
          subtitle={`This month`}
          icon={TrendingUp}
          color="bg-[#714b67]"
          data-testid="metric-attendance-rate"
        />
        <MetricCard
          title="Absent Days"
          value={absentDays}
          subtitle="This month"
          icon={XCircle}
          color="bg-[#FF6B6B]"
          data-testid="metric-absent-days"
        />
        <MetricCard
          title="Leave Days"
          value={leaveDays}
          subtitle="Approved leaves"
          icon={CalendarIcon}
          color="bg-[#FFD93D]"
          data-testid="metric-leave-days"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="p-6 lg:col-span-2">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Clock In/Out
          </h2>

          {todayAttendance ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800">
                  <p className="text-sm text-muted-foreground mb-1">Clock In Time</p>
                  <p className="text-2xl font-bold text-green-700 dark:text-green-400">{todayAttendance.inTime}</p>
                </div>
                {todayAttendance.outTime ? (
                  <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800">
                    <p className="text-sm text-muted-foreground mb-1">Clock Out Time</p>
                    <p className="text-2xl font-bold text-red-700 dark:text-red-400">{todayAttendance.outTime}</p>
                  </div>
                ) : (
                  <div className="p-4 rounded-xl bg-muted border border-border">
                    <p className="text-sm text-muted-foreground mb-1">Clock Out Time</p>
                    <p className="text-2xl font-bold">--:--</p>
                  </div>
                )}
              </div>

              {!todayAttendance.outTime && (
                <Button
                  onClick={handleClockOut}
                  className="w-full bg-[#714b67] hover:bg-[#714b67]/90"
                  data-testid="button-clock-out"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Clock Out
                </Button>
              )}

              {todayAttendance.outTime && (
                <div className="flex items-center justify-center gap-2 p-3 rounded-lg bg-green-50 dark:bg-green-900/10 text-green-700 dark:text-green-400">
                  <CheckCircle2 className="w-5 h-5" />
                  <span className="font-medium">Attendance Marked for Today</span>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-[#714b67]/10 flex items-center justify-center">
                <Clock className="w-10 h-10 text-[#714b67]" />
              </div>
              <p className="text-muted-foreground mb-6">You haven't clocked in today</p>
              <Button 
                onClick={handleClockIn} 
                data-testid="button-clock-in"
                className="bg-[#714b67] hover:bg-[#714b67]/90"
              >
                <LogIn className="w-4 h-4 mr-2" />
                Clock In Now
              </Button>
            </div>
          )}
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <CalendarIcon className="w-5 h-5" />
            Calendar
          </h2>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(date) => date && setSelectedDate(date)}
            className="rounded-md border"
            modifiers={{
              present: userAttendance
                .filter((a: AttendanceType) => a.status === 'Present')
                .map((a: AttendanceType) => new Date(a.date)),
              absent: userAttendance
                .filter((a: AttendanceType) => a.status === 'Absent')
                .map((a: AttendanceType) => new Date(a.date)),
            }}
            modifiersStyles={{
              present: { backgroundColor: '#56CA6D', color: 'white', borderRadius: '0.375rem' },
              absent: { backgroundColor: '#FF6B6B', color: 'white', borderRadius: '0.375rem' },
            }}
          />
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Last 7 Days Attendance</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={last7DaysData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
              <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} domain={[0, 1]} ticks={[0, 1]} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--popover))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '0.5rem',
                  padding: '8px 12px'
                }}
                formatter={(value, name, props) => [props.payload.status, 'Status']}
              />
              <Bar dataKey="present" fill="#714b67" radius={[8, 8, 0, 0]}>
                {last7DaysData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.status === 'Present' ? '#56CA6D' : '#FF6B6B'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {statusData.length > 0 && (
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Attendance Status (This Month)</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
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
        )}
      </div>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Attendance History</h2>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Clock In</TableHead>
                <TableHead>Clock Out</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {userAttendance.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                    No attendance records yet
                  </TableCell>
                </TableRow>
              ) : (
                userAttendance.slice().reverse().slice(0, 30).map((record: AttendanceType) => (
                  <TableRow key={record.id}>
                    <TableCell className="font-medium">{format(new Date(record.date), 'MMM dd, yyyy')}</TableCell>
                    <TableCell>{record.inTime}</TableCell>
                    <TableCell>{record.outTime || '-'}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(record.status)}>
                        {record.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}
