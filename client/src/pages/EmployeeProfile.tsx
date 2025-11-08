import { useRoute } from 'wouter';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Mail, Phone, Building2, MapPin, User, Briefcase, Calendar, Lock, DollarSign, FileText, Edit, Clock, TrendingUp, Shield } from 'lucide-react';
import { apiRequest } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { queryClient } from '@/lib/queryClient';
import { useState, useMemo } from 'react';

export default function EmployeeProfile() {
  const [, params] = useRoute('/employees/:id');
  const employeeId = params?.id;
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const [isEditSalaryOpen, setIsEditSalaryOpen] = useState(false);
  const [editBasicSalary, setEditBasicSalary] = useState('');
  const [editHra, setEditHra] = useState('');
  const [editOtherEarnings, setEditOtherEarnings] = useState('');
  const [isEditRoleOpen, setIsEditRoleOpen] = useState(false);
  const [editRole, setEditRole] = useState('');

  const { data: employee, isLoading } = useQuery({
    queryKey: ['/api/users', employeeId],
    queryFn: async () => {
      return await apiRequest('GET', `/api/users/${employeeId}`);
    },
    enabled: !!employeeId,
  });

  // Fetch attendance data for HR/Admin
  const canViewAttendance = currentUser && (currentUser.role === 'admin' || currentUser.role === 'hr');
  const { data: attendanceRecords = [], isLoading: isLoadingAttendance } = useQuery({
    queryKey: ['/api/attendance/user', employeeId],
    queryFn: async () => {
      return await apiRequest('GET', `/api/attendance/user/${employeeId}`);
    },
    enabled: !!employeeId && !!canViewAttendance,
  });

  // Calculate attendance statistics
  const attendanceStats = useMemo(() => {
    if (!attendanceRecords.length) return null;
    
    const total = attendanceRecords.length;
    const present = attendanceRecords.filter((r: any) => r.status === 'Present').length;
    const absent = attendanceRecords.filter((r: any) => r.status === 'Absent').length;
    const halfDay = attendanceRecords.filter((r: any) => r.status === 'Half').length;
    const leave = attendanceRecords.filter((r: any) => r.status === 'Leave').length;
    const percentage = total > 0 ? ((present + halfDay * 0.5) / total * 100).toFixed(1) : '0';
    
    return { total, present, absent, halfDay, leave, percentage };
  }, [attendanceRecords]);

  const updateSalaryMutation = useMutation({
    mutationFn: (data: { basicSalary: number; hra: number; otherEarnings: number }) =>
      apiRequest('PATCH', `/api/users/${employeeId}`, data),
    onSuccess: () => {
      toast({
        title: 'Salary Updated',
        description: 'Employee salary has been updated successfully',
      });
      queryClient.invalidateQueries({ queryKey: ['/api/users', employeeId] });
      queryClient.invalidateQueries({ queryKey: ['/api/users'] });
      setIsEditSalaryOpen(false);
    },
    onError: (error: any) => {
      toast({
        title: 'Update Failed',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const updateRoleMutation = useMutation({
    mutationFn: (data: { role: string }) =>
      apiRequest('PATCH', `/api/users/${employeeId}`, data),
    onSuccess: () => {
      toast({
        title: 'Role Updated',
        description: 'Employee role has been updated successfully',
      });
      queryClient.invalidateQueries({ queryKey: ['/api/users', employeeId] });
      queryClient.invalidateQueries({ queryKey: ['/api/users'] });
      setIsEditRoleOpen(false);
    },
    onError: (error: any) => {
      toast({
        title: 'Update Failed',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const handleEditSalary = () => {
    if (employee) {
      setEditBasicSalary(String(employee.basicSalary || 0));
      setEditHra(String(employee.hra || 0));
      setEditOtherEarnings(String(employee.otherEarnings || 0));
      setIsEditSalaryOpen(true);
    }
  };

  const handleSaveSalary = () => {
    const basicSalary = parseFloat(editBasicSalary) || 0;
    const hra = parseFloat(editHra) || 0;
    const otherEarnings = parseFloat(editOtherEarnings) || 0;

    updateSalaryMutation.mutate({ basicSalary, hra, otherEarnings });
  };

  const handleEditRole = () => {
    if (employee) {
      setEditRole(employee.role);
      setIsEditRoleOpen(true);
    }
  };

  const handleSaveRole = () => {
    if (!editRole) {
      toast({
        title: 'Error',
        description: 'Please select a role',
        variant: 'destructive',
      });
      return;
    }

    updateRoleMutation.mutate({ role: editRole });
  };

  const canEditSalary = currentUser && (currentUser.role === 'admin' || currentUser.role === 'payroll');
  const canEditRole = currentUser && currentUser.role === 'admin';

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/4"></div>
          <div className="h-64 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="p-6">
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">Employee not found</p>
          <Button className="mt-4" onClick={() => window.history.back()}>
            Go Back
          </Button>
        </Card>
      </div>
    );
  }

  const initials = employee.name
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .toUpperCase();

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => window.history.back()}
          data-testid="button-back"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-3xl font-bold">Employee Profile</h1>
      </div>

      <Card className="p-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex flex-col items-center md:items-start">
            <Avatar className="w-32 h-32 text-4xl">
              <AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-500 text-white">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="mt-4 flex items-center gap-2">
              <Badge className="capitalize" data-testid="badge-role">
                {employee.role}
              </Badge>
              {canEditRole && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleEditRole}
                  data-testid="button-edit-role"
                  title="Change Role"
                >
                  <Shield className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>

          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Full Name</p>
              <p className="font-semibold flex items-center gap-2" data-testid="text-employee-name">
                <User className="w-4 h-4 text-muted-foreground" />
                {employee.name}
              </p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-1">Login ID</p>
              <p className="font-semibold font-mono text-sm" data-testid="text-login-id">
                {employee.loginId}
              </p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-1">Email</p>
              <p className="font-semibold flex items-center gap-2" data-testid="text-email">
                <Mail className="w-4 h-4 text-muted-foreground" />
                {employee.email}
              </p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-1">Mobile</p>
              <p className="font-semibold flex items-center gap-2" data-testid="text-mobile">
                <Phone className="w-4 h-4 text-muted-foreground" />
                {employee.mobile || 'Not provided'}
              </p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-1">Company</p>
              <p className="font-semibold flex items-center gap-2" data-testid="text-company">
                <Building2 className="w-4 h-4 text-muted-foreground" />
                {employee.company || 'Organization Inc'}
              </p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-1">Department</p>
              <p className="font-semibold flex items-center gap-2" data-testid="text-department">
                <Briefcase className="w-4 h-4 text-muted-foreground" />
                {employee.department}
              </p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-1">Manager</p>
              <p className="font-semibold" data-testid="text-manager">
                {employee.manager || 'N/A'}
              </p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-1">Location</p>
              <p className="font-semibold flex items-center gap-2" data-testid="text-location">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                {employee.location || 'Not specified'}
              </p>
            </div>
          </div>
        </div>
      </Card>

      <Tabs defaultValue="resume" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="resume" data-testid="tab-resume">
            <FileText className="w-4 h-4 mr-2" />
            Resume
          </TabsTrigger>
          <TabsTrigger value="private" data-testid="tab-private">
            <User className="w-4 h-4 mr-2" />
            Private Info
          </TabsTrigger>
          <TabsTrigger value="salary" data-testid="tab-salary">
            <DollarSign className="w-4 h-4 mr-2" />
            Salary Info
          </TabsTrigger>
          {(currentUser?.role === 'admin' || currentUser?.role === 'hr') && (
            <TabsTrigger value="attendance" data-testid="tab-attendance">
              <Clock className="w-4 h-4 mr-2" />
              Attendance
            </TabsTrigger>
          )}
          <TabsTrigger value="security" data-testid="tab-security">
            <Lock className="w-4 h-4 mr-2" />
            Security
          </TabsTrigger>
        </TabsList>

        <TabsContent value="resume" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Professional Information</h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Year of Joining</p>
                <p className="font-semibold flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  {employee.yearOfJoining}
                </p>
              </div>
              <Separator />
              <div>
                <p className="text-sm text-muted-foreground mb-1">Role</p>
                <p className="font-semibold capitalize">{employee.role}</p>
              </div>
              <Separator />
              <div>
                <p className="text-sm text-muted-foreground mb-1">Department</p>
                <p className="font-semibold">{employee.department}</p>
              </div>
              <Separator />
              <div>
                <p className="text-sm text-muted-foreground mb-1">Leave Balance</p>
                <div className="flex gap-4 mt-2">
                  <div className="flex-1 p-3 bg-accent rounded-md">
                    <p className="text-xs text-muted-foreground">Annual Leave</p>
                    <p className="text-xl font-bold">{employee.annualLeave} days</p>
                  </div>
                  <div className="flex-1 p-3 bg-accent rounded-md">
                    <p className="text-xs text-muted-foreground">Sick Leave</p>
                    <p className="text-xl font-bold">{employee.sickLeave} days</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="private" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Full Name</p>
                <p className="font-semibold">{employee.name}</p>
              </div>
              <Separator />
              <div>
                <p className="text-sm text-muted-foreground mb-1">Email Address</p>
                <p className="font-semibold">{employee.email}</p>
              </div>
              <Separator />
              <div>
                <p className="text-sm text-muted-foreground mb-1">Mobile Number</p>
                <p className="font-semibold">{employee.mobile || 'Not provided'}</p>
              </div>
              <Separator />
              <div>
                <p className="text-sm text-muted-foreground mb-1">Location</p>
                <p className="font-semibold">{employee.location || 'Not specified'}</p>
              </div>
              <Separator />
              <div>
                <p className="text-sm text-muted-foreground mb-1">Date of Birth</p>
                <p className="font-semibold">{employee.dateOfBirth || 'Not provided'}</p>
              </div>
              <Separator />
              <div>
                <p className="text-sm text-muted-foreground mb-1">Address</p>
                <p className="font-semibold">{employee.address || 'Not provided'}</p>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="salary" className="space-y-4">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Salary Breakdown</h3>
              {canEditSalary && (
                <Button variant="outline" size="sm" onClick={handleEditSalary} data-testid="button-edit-salary">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Salary
                </Button>
              )}
            </div>
            <div className="space-y-4">
              <div className="p-4 bg-accent rounded-md">
                <p className="text-sm text-muted-foreground mb-1">Basic Salary</p>
                <p className="text-2xl font-bold">₹{employee.basicSalary.toLocaleString()}</p>
              </div>
              <div className="p-4 bg-accent rounded-md">
                <p className="text-sm text-muted-foreground mb-1">HRA (House Rent Allowance)</p>
                <p className="text-2xl font-bold">₹{employee.hra.toLocaleString()}</p>
              </div>
              <div className="p-4 bg-accent rounded-md">
                <p className="text-sm text-muted-foreground mb-1">Other Earnings</p>
                <p className="text-2xl font-bold">₹{employee.otherEarnings.toLocaleString()}</p>
              </div>
              <Separator className="my-4" />
              <div className="p-4 bg-primary/10 rounded-md border-2 border-primary/20">
                <p className="text-sm text-muted-foreground mb-1">Total Gross Salary</p>
                <p className="text-3xl font-bold text-primary">
                  ₹{(employee.basicSalary + employee.hra + employee.otherEarnings).toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground mt-1">Per Month</p>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Security & Access</h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Login ID</p>
                <p className="font-semibold font-mono bg-accent px-3 py-2 rounded-md inline-block">
                  {employee.loginId}
                </p>
              </div>
              <Separator />
              <div>
                <p className="text-sm text-muted-foreground mb-1">Role</p>
                <Badge className="capitalize">{employee.role}</Badge>
              </div>
              <Separator />
              <div>
                <p className="text-sm text-muted-foreground mb-1">Account Status</p>
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  Active
                </Badge>
              </div>
              <Separator />
              <div>
                <p className="text-sm text-muted-foreground mb-1">Last Password Change</p>
                <p className="font-semibold">{employee.lastPasswordChange || 'Never'}</p>
              </div>
              <Separator />
              <div className="mt-6">
                <Button variant="outline" data-testid="button-reset-password">
                  Reset Password
                </Button>
              </div>
            </div>
          </Card>
        </TabsContent>

        {canViewAttendance && (
          <TabsContent value="attendance" className="space-y-4">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Attendance Statistics
              </h3>
              
              {isLoadingAttendance ? (
                <div className="space-y-3">
                  <div className="h-20 bg-muted rounded-md animate-pulse"></div>
                  <div className="h-20 bg-muted rounded-md animate-pulse"></div>
                  <div className="h-20 bg-muted rounded-md animate-pulse"></div>
                </div>
              ) : attendanceStats ? (
                <>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                    <div className="p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-900">
                      <p className="text-sm text-blue-600 dark:text-blue-400 mb-1">Total Days</p>
                      <p className="text-3xl font-bold text-blue-700 dark:text-blue-300">{attendanceStats.total}</p>
                    </div>
                    <div className="p-4 bg-green-50 dark:bg-green-950/30 rounded-lg border border-green-200 dark:border-green-900">
                      <p className="text-sm text-green-600 dark:text-green-400 mb-1">Present</p>
                      <p className="text-3xl font-bold text-green-700 dark:text-green-300">{attendanceStats.present}</p>
                    </div>
                    <div className="p-4 bg-amber-50 dark:bg-amber-950/30 rounded-lg border border-amber-200 dark:border-amber-900">
                      <p className="text-sm text-amber-600 dark:text-amber-400 mb-1">Attendance %</p>
                      <p className="text-3xl font-bold text-amber-700 dark:text-amber-300">{attendanceStats.percentage}%</p>
                    </div>
                    <div className="p-4 bg-red-50 dark:bg-red-950/30 rounded-lg border border-red-200 dark:border-red-900">
                      <p className="text-sm text-red-600 dark:text-red-400 mb-1">Absent</p>
                      <p className="text-3xl font-bold text-red-700 dark:text-red-300">{attendanceStats.absent}</p>
                    </div>
                    <div className="p-4 bg-purple-50 dark:bg-purple-950/30 rounded-lg border border-purple-200 dark:border-purple-900">
                      <p className="text-sm text-purple-600 dark:text-purple-400 mb-1">Half Day</p>
                      <p className="text-3xl font-bold text-purple-700 dark:text-purple-300">{attendanceStats.halfDay}</p>
                    </div>
                    <div className="p-4 bg-sky-50 dark:bg-sky-950/30 rounded-lg border border-sky-200 dark:border-sky-900">
                      <p className="text-sm text-sky-600 dark:text-sky-400 mb-1">Leave</p>
                      <p className="text-3xl font-bold text-sky-700 dark:text-sky-300">{attendanceStats.leave}</p>
                    </div>
                  </div>

                  <Separator className="my-6" />

                  <h4 className="font-semibold mb-4">Recent Attendance Records</h4>
                  <div className="border rounded-md">
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
                        {attendanceRecords.slice(0, 10).map((record: any) => (
                          <TableRow key={record.id} data-testid={`row-attendance-${record.id}`}>
                            <TableCell className="font-medium">{record.date}</TableCell>
                            <TableCell>{record.inTime || '-'}</TableCell>
                            <TableCell>{record.outTime || '-'}</TableCell>
                            <TableCell>
                              <Badge 
                                className={
                                  record.status === 'Present' 
                                    ? 'bg-green-100 text-green-700 border-green-200' 
                                    : record.status === 'Absent'
                                    ? 'bg-red-100 text-red-700 border-red-200'
                                    : record.status === 'Half'
                                    ? 'bg-yellow-100 text-yellow-700 border-yellow-200'
                                    : 'bg-blue-100 text-blue-700 border-blue-200'
                                }
                              >
                                {record.status}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                  {attendanceRecords.length > 10 && (
                    <p className="text-sm text-muted-foreground mt-2 text-center">
                      Showing 10 most recent records out of {attendanceRecords.length} total
                    </p>
                  )}
                </>
              ) : (
                <div className="text-center py-12">
                  <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground">No attendance records found</p>
                </div>
              )}
            </Card>
          </TabsContent>
        )}
      </Tabs>

      <Dialog open={isEditSalaryOpen} onOpenChange={setIsEditSalaryOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Employee Salary</DialogTitle>
            <DialogDescription>
              Update the salary components for {employee?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-basic-salary">Basic Salary (₹)</Label>
              <Input
                id="edit-basic-salary"
                type="number"
                value={editBasicSalary}
                onChange={(e) => setEditBasicSalary(e.target.value)}
                placeholder="Enter basic salary"
                data-testid="input-edit-basic-salary"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-hra">HRA - House Rent Allowance (₹)</Label>
              <Input
                id="edit-hra"
                type="number"
                value={editHra}
                onChange={(e) => setEditHra(e.target.value)}
                placeholder="Enter HRA amount"
                data-testid="input-edit-hra"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-other-earnings">Other Earnings (₹)</Label>
              <Input
                id="edit-other-earnings"
                type="number"
                value={editOtherEarnings}
                onChange={(e) => setEditOtherEarnings(e.target.value)}
                placeholder="Enter other earnings"
                data-testid="input-edit-other-earnings"
              />
            </div>
            <div className="p-4 bg-muted rounded-md">
              <p className="text-sm text-muted-foreground mb-1">Total Gross Salary</p>
              <p className="text-2xl font-bold">
                ₹{((parseFloat(editBasicSalary) || 0) + (parseFloat(editHra) || 0) + (parseFloat(editOtherEarnings) || 0)).toLocaleString()}
              </p>
              <p className="text-xs text-muted-foreground mt-1">Per Month</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditSalaryOpen(false)} data-testid="button-cancel-edit-salary">
              Cancel
            </Button>
            <Button onClick={handleSaveSalary} disabled={updateSalaryMutation.isPending} data-testid="button-save-salary">
              {updateSalaryMutation.isPending ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditRoleOpen} onOpenChange={setIsEditRoleOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Employee Role</DialogTitle>
            <DialogDescription>
              Update the role for {employee?.name}. This will change their access permissions in the system.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-role">Select Role</Label>
              <Select value={editRole} onValueChange={setEditRole}>
                <SelectTrigger id="edit-role" data-testid="select-role">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="employee">Employee</SelectItem>
                  <SelectItem value="hr">HR Officer</SelectItem>
                  <SelectItem value="payroll">Payroll Officer</SelectItem>
                  <SelectItem value="admin">Administrator</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="p-4 bg-muted rounded-md space-y-2">
              <p className="text-sm font-semibold">Role Permissions:</p>
              {editRole === 'employee' && (
                <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
                  <li>View own profile and attendance</li>
                  <li>Apply for leaves</li>
                  <li>View own payroll information</li>
                </ul>
              )}
              {editRole === 'hr' && (
                <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
                  <li>All employee permissions</li>
                  <li>Manage employee records</li>
                  <li>View and manage attendance</li>
                  <li>Manage leave balances</li>
                </ul>
              )}
              {editRole === 'payroll' && (
                <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
                  <li>All employee permissions</li>
                  <li>Approve/reject leave requests</li>
                  <li>Generate payroll reports</li>
                  <li>View salary information</li>
                </ul>
              )}
              {editRole === 'admin' && (
                <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
                  <li>Full system access</li>
                  <li>Manage all employees and roles</li>
                  <li>Configure system settings</li>
                  <li>Access all reports and data</li>
                </ul>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditRoleOpen(false)} data-testid="button-cancel-edit-role">
              Cancel
            </Button>
            <Button onClick={handleSaveRole} disabled={updateRoleMutation.isPending} data-testid="button-save-role">
              {updateRoleMutation.isPending ? 'Updating...' : 'Update Role'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
