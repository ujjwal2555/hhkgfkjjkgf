import { useState, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Download, Building2, Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

export default function MyPayroll() {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const [selectedMonth, setSelectedMonth] = useState(format(new Date(), 'yyyy-MM'));
  const salarySlipRef = useRef<HTMLDivElement>(null);

  const { data: user, isLoading } = useQuery<any>({
    queryKey: ['/api/users', currentUser?.id],
    enabled: !!currentUser?.id,
  });

  const { data: attendance = [] } = useQuery<any[]>({
    queryKey: ['/api/attendance'],
  });

  const { data: leaves = [] } = useQuery<any[]>({
    queryKey: ['/api/leaves'],
  });

  const { data: settings } = useQuery<any>({
    queryKey: ['/api/settings'],
  });

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

  if (!user) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="p-6">
            <p className="text-muted-foreground">Unable to load payroll data. Please try again.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const monthDate = new Date(selectedMonth + '-01');
  const monthStart = format(monthDate, 'yyyy-MM-dd');
  const monthEnd = format(new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0), 'yyyy-MM-dd');

  const monthAttendance = attendance.filter((a: any) => 
    a.date >= monthStart && 
    a.date <= monthEnd &&
    a.status === 'Present'
  );

  const paidLeaves = leaves.filter((l: any) =>
    l.status === 'Approved' &&
    l.startDate >= monthStart &&
    l.endDate <= monthEnd
  );

  const totalPaidLeaveDays = paidLeaves.reduce((sum: number, leave: any) => {
    const start = new Date(leave.startDate);
    const end = new Date(leave.endDate);
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    return sum + days;
  }, 0);

  const workingDays = settings?.workingDays || 22;
  const pfPercent = parseFloat(settings?.pfPercent || '12') / 100;
  const professionalTaxAmount = settings?.professionalTax || 200;

  const attendanceDays = monthAttendance.length;
  const totalDays = attendanceDays + totalPaidLeaveDays;
  const attendanceRatio = Math.min(totalDays / workingDays, 1);

  const basicSalary = user.basicSalary || 0;
  const hra = user.hra || 0;
  const otherEarnings = user.otherEarnings || 0;

  const proratedBasic = Math.round(basicSalary * attendanceRatio);
  const proratedHRA = Math.round(hra * attendanceRatio);
  const proratedOther = Math.round(otherEarnings * attendanceRatio);

  const pfDeduction = Math.round(basicSalary * pfPercent * attendanceRatio);
  const professionalTax = professionalTaxAmount;

  const grossEarnings = proratedBasic + proratedHRA + proratedOther;
  const totalDeductions = pfDeduction + professionalTax;
  const netPayable = grossEarnings - totalDeductions;

  const handleDownloadSlip = () => {
    const printContent = salarySlipRef.current;
    if (!printContent) return;

    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <html>
        <head>
          <title>Salary Slip - ${format(monthDate, 'MMMM yyyy')}</title>
          <style>
            body { 
              font-family: Arial, sans-serif; 
              padding: 40px; 
              max-width: 900px; 
              margin: 0 auto;
              line-height: 1.6;
            }
            .header {
              text-align: center;
              border-bottom: 3px solid #7c3aed;
              padding-bottom: 20px;
              margin-bottom: 30px;
            }
            .header h1 {
              color: #7c3aed;
              margin: 0 0 5px 0;
              font-size: 28px;
            }
            .header p {
              color: #666;
              margin: 0;
            }
            .section-title {
              background: #7c3aed;
              color: white;
              padding: 10px 15px;
              margin: 20px 0 15px 0;
              font-weight: bold;
              font-size: 16px;
            }
            .info-grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 20px;
              margin-bottom: 20px;
            }
            .info-row {
              display: flex;
              justify-content: space-between;
              padding: 8px 0;
              border-bottom: 1px solid #eee;
            }
            .info-row .label {
              color: #666;
              font-weight: 500;
            }
            .info-row .value {
              font-weight: 600;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin: 15px 0;
            }
            th, td {
              border: 1px solid #ddd;
              padding: 12px;
              text-align: left;
            }
            th {
              background: #7c3aed;
              color: white;
              font-weight: 600;
            }
            .amount {
              text-align: right;
              font-family: 'Courier New', monospace;
            }
            .total-row {
              background: #f3f4f6;
              font-weight: 700;
              font-size: 15px;
            }
            .net-payable {
              background: #7c3aed;
              color: white;
              font-weight: 700;
              font-size: 16px;
            }
            .footer {
              margin-top: 40px;
              padding-top: 20px;
              border-top: 2px solid #ddd;
              text-align: center;
              color: #666;
              font-size: 12px;
            }
            @media print {
              body { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>WorkZen HRMS</h1>
            <p>Salary Slip for ${format(monthDate, 'MMMM yyyy')}</p>
          </div>

          <div class="section-title">Employee Information</div>
          <div class="info-grid">
            <div>
              <div class="info-row">
                <span class="label">Employee Name:</span>
                <span class="value">${user.name}</span>
              </div>
              <div class="info-row">
                <span class="label">Employee Code:</span>
                <span class="value">${user.loginId}</span>
              </div>
              <div class="info-row">
                <span class="label">Department:</span>
                <span class="value">${user.department}</span>
              </div>
              <div class="info-row">
                <span class="label">Location:</span>
                <span class="value">${user.location || 'N/A'}</span>
              </div>
            </div>
            <div>
              <div class="info-row">
                <span class="label">Pay Period:</span>
                <span class="value">${format(monthDate, 'dd/MM/yyyy')} - ${format(new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0), 'dd/MM/yyyy')}</span>
              </div>
              <div class="info-row">
                <span class="label">Working Days:</span>
                <span class="value">${workingDays} days</span>
              </div>
              <div class="info-row">
                <span class="label">Days Worked:</span>
                <span class="value">${totalDays} days</span>
              </div>
              <div class="info-row">
                <span class="label">Pay Date:</span>
                <span class="value">${format(new Date(), 'dd/MM/yyyy')}</span>
              </div>
            </div>
          </div>

          <div class="section-title">Salary Breakdown</div>
          <table>
            <thead>
              <tr>
                <th>Earnings</th>
                <th class="amount">Full Month</th>
                <th class="amount">Prorated</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Basic Salary</td>
                <td class="amount">₹ ${basicSalary.toLocaleString()}</td>
                <td class="amount">₹ ${proratedBasic.toLocaleString()}</td>
              </tr>
              <tr>
                <td>House Rent Allowance (HRA)</td>
                <td class="amount">₹ ${hra.toLocaleString()}</td>
                <td class="amount">₹ ${proratedHRA.toLocaleString()}</td>
              </tr>
              <tr>
                <td>Other Earnings</td>
                <td class="amount">₹ ${otherEarnings.toLocaleString()}</td>
                <td class="amount">₹ ${proratedOther.toLocaleString()}</td>
              </tr>
              <tr class="total-row">
                <td>Gross Earnings</td>
                <td class="amount">₹ ${(basicSalary + hra + otherEarnings).toLocaleString()}</td>
                <td class="amount">₹ ${grossEarnings.toLocaleString()}</td>
              </tr>
            </tbody>
          </table>

          <table>
            <thead>
              <tr>
                <th>Deductions</th>
                <th class="amount">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Provident Fund (${(pfPercent * 100).toFixed(2)}%)</td>
                <td class="amount">₹ ${pfDeduction.toLocaleString()}</td>
              </tr>
              <tr>
                <td>Professional Tax</td>
                <td class="amount">₹ ${professionalTax.toLocaleString()}</td>
              </tr>
              <tr class="total-row">
                <td>Total Deductions</td>
                <td class="amount">₹ ${totalDeductions.toLocaleString()}</td>
              </tr>
            </tbody>
          </table>

          <table>
            <tbody>
              <tr class="net-payable">
                <td>NET PAYABLE</td>
                <td class="amount">₹ ${netPayable.toLocaleString()}</td>
              </tr>
            </tbody>
          </table>

          <div class="footer">
            <p>This is a system-generated document. No signature is required.</p>
            <p>Generated on ${format(new Date(), 'dd/MM/yyyy HH:mm')}</p>
          </div>
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();

    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);

    toast({
      title: 'Salary Slip Ready',
      description: 'Your salary slip is ready for download',
    });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold" data-testid="text-page-title">My Payroll</h1>
          <p className="text-muted-foreground">
            View your salary breakdown and download salary slips
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <CalendarIcon className="w-4 h-4 text-muted-foreground" />
          <input
            type="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="px-3 min-h-9 border rounded-md"
            data-testid="input-month-selector"
          />
        </div>
      </div>

      <Tabs defaultValue="salary-breakdown" className="w-full">
        <TabsList className="grid w-full grid-cols-3" data-testid="tabs-payroll">
          <TabsTrigger value="salary-breakdown" data-testid="tab-salary-breakdown">Salary Breakdown</TabsTrigger>
          <TabsTrigger value="attendance" data-testid="tab-attendance">Attendance Details</TabsTrigger>
          <TabsTrigger value="salary-slip" data-testid="tab-salary-slip">Download Slip</TabsTrigger>
        </TabsList>

        <TabsContent value="salary-breakdown" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Salary Components for {format(monthDate, 'MMMM yyyy')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-primary">Earnings</h3>
                <div className="border rounded-md overflow-hidden">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-muted">
                        <th className="text-left p-3">Component</th>
                        <th className="text-right p-3">Full Month</th>
                        <th className="text-right p-3">Prorated Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b">
                        <td className="p-3">Basic Salary</td>
                        <td className="text-right p-3">₹ {basicSalary.toLocaleString()}</td>
                        <td className="text-right p-3 font-semibold">₹ {proratedBasic.toLocaleString()}</td>
                      </tr>
                      <tr className="border-b">
                        <td className="p-3">House Rent Allowance (HRA)</td>
                        <td className="text-right p-3">₹ {hra.toLocaleString()}</td>
                        <td className="text-right p-3 font-semibold">₹ {proratedHRA.toLocaleString()}</td>
                      </tr>
                      <tr className="border-b">
                        <td className="p-3">Other Earnings</td>
                        <td className="text-right p-3">₹ {otherEarnings.toLocaleString()}</td>
                        <td className="text-right p-3 font-semibold">₹ {proratedOther.toLocaleString()}</td>
                      </tr>
                      <tr className="font-bold bg-primary/10">
                        <td className="p-3">Gross Earnings</td>
                        <td className="text-right p-3">₹ {(basicSalary + hra + otherEarnings).toLocaleString()}</td>
                        <td className="text-right p-3 text-primary">₹ {grossEarnings.toLocaleString()}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-destructive">Deductions</h3>
                <div className="border rounded-md overflow-hidden">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-muted">
                        <th className="text-left p-3">Component</th>
                        <th className="text-right p-3">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b">
                        <td className="p-3">Provident Fund ({(pfPercent * 100).toFixed(2)}%)</td>
                        <td className="text-right p-3 font-semibold">- ₹ {pfDeduction.toLocaleString()}</td>
                      </tr>
                      <tr className="border-b">
                        <td className="p-3">Professional Tax</td>
                        <td className="text-right p-3 font-semibold">- ₹ {professionalTax.toLocaleString()}</td>
                      </tr>
                      <tr className="font-bold bg-destructive/10">
                        <td className="p-3">Total Deductions</td>
                        <td className="text-right p-3 text-destructive">- ₹ {totalDeductions.toLocaleString()}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="border-2 border-primary rounded-md overflow-hidden">
                <div className="bg-primary text-primary-foreground p-4">
                  <div className="flex flex-wrap justify-between items-center gap-2">
                    <span className="text-lg font-bold">NET PAYABLE</span>
                    <span className="text-2xl font-bold">₹ {netPayable.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="bg-muted/50 p-4 rounded-md text-sm text-muted-foreground">
                <p>
                  Your salary is calculated based on attendance ({totalDays}/{workingDays} days).
                  The prorated amount reflects your actual working days for {format(monthDate, 'MMMM yyyy')}.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="attendance" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Attendance Summary for {format(monthDate, 'MMMM yyyy')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-primary/10 p-4 rounded-md">
                    <div className="text-sm text-muted-foreground">Working Days</div>
                    <div className="text-2xl font-bold text-primary">{workingDays} days</div>
                  </div>
                  <div className="bg-green-100 dark:bg-green-900/30 p-4 rounded-md">
                    <div className="text-sm text-muted-foreground">Days Present</div>
                    <div className="text-2xl font-bold text-green-700 dark:text-green-300">{attendanceDays} days</div>
                  </div>
                  <div className="bg-blue-100 dark:bg-blue-900/30 p-4 rounded-md">
                    <div className="text-sm text-muted-foreground">Paid Leaves</div>
                    <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">{totalPaidLeaveDays} days</div>
                  </div>
                </div>

                <div className="border rounded-md overflow-hidden">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-muted">
                        <th className="text-left p-3">Type</th>
                        <th className="text-right p-3">Days</th>
                        <th className="text-right p-3">Percentage</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b">
                        <td className="p-3">Total Days Worked</td>
                        <td className="text-right p-3 font-semibold">{totalDays}</td>
                        <td className="text-right p-3 font-semibold">{((totalDays / workingDays) * 100).toFixed(1)}%</td>
                      </tr>
                      <tr className="border-b">
                        <td className="p-3">Absent Days</td>
                        <td className="text-right p-3">{workingDays - totalDays}</td>
                        <td className="text-right p-3">{(((workingDays - totalDays) / workingDays) * 100).toFixed(1)}%</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="bg-muted/50 p-4 rounded-md text-sm text-muted-foreground">
                  <p>
                    Your attendance record shows {attendanceDays} days present and {totalPaidLeaveDays} days of paid leave,
                    totaling {totalDays} payable days out of {workingDays} working days.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="salary-slip" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <div className="flex flex-wrap justify-between items-center gap-4">
                <CardTitle>Salary Slip - {format(monthDate, 'MMMM yyyy')}</CardTitle>
                <Button onClick={handleDownloadSlip} data-testid="button-download-slip">
                  <Download className="w-4 h-4 mr-2" />
                  Download / Print
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div ref={salarySlipRef} className="space-y-6">
                <div className="text-center border-b pb-4">
                  <div className="flex justify-center mb-3">
                    <div className="w-16 h-16 bg-primary/10 rounded-md flex items-center justify-center">
                      <Building2 className="w-8 h-8 text-primary" />
                    </div>
                  </div>
                  <h2 className="text-2xl font-bold">WorkZen HRMS</h2>
                  <p className="text-muted-foreground">Salary Slip for {format(monthDate, 'MMMM yyyy')}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 bg-muted/30 p-4 rounded-md text-sm">
                  <div className="space-y-2">
                    <div className="flex justify-between gap-4">
                      <span className="text-muted-foreground">Employee Name:</span>
                      <span className="font-medium">{user.name}</span>
                    </div>
                    <div className="flex justify-between gap-4">
                      <span className="text-muted-foreground">Employee Code:</span>
                      <span className="font-medium">{user.loginId}</span>
                    </div>
                    <div className="flex justify-between gap-4">
                      <span className="text-muted-foreground">Department:</span>
                      <span className="font-medium">{user.department}</span>
                    </div>
                    <div className="flex justify-between gap-4">
                      <span className="text-muted-foreground">Location:</span>
                      <span className="font-medium">{user.location || 'N/A'}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between gap-4">
                      <span className="text-muted-foreground">Pay Period:</span>
                      <span className="font-medium">
                        {format(monthDate, 'dd/MM/yyyy')} - {format(new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0), 'dd/MM/yyyy')}
                      </span>
                    </div>
                    <div className="flex justify-between gap-4">
                      <span className="text-muted-foreground">Working Days:</span>
                      <span className="font-medium">{workingDays} days</span>
                    </div>
                    <div className="flex justify-between gap-4">
                      <span className="text-muted-foreground">Days Worked:</span>
                      <span className="font-medium">{totalDays} days</span>
                    </div>
                    <div className="flex justify-between gap-4">
                      <span className="text-muted-foreground">Pay Date:</span>
                      <span className="font-medium">{format(new Date(), 'dd/MM/yyyy')}</span>
                    </div>
                  </div>
                </div>

                <div className="border-2 rounded-md p-6 space-y-4">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-bold text-lg mb-3 text-primary">Earnings</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Basic Salary</span>
                          <span className="font-medium">₹ {proratedBasic.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>HRA</span>
                          <span className="font-medium">₹ {proratedHRA.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Other Earnings</span>
                          <span className="font-medium">₹ {proratedOther.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between pt-2 border-t font-bold">
                          <span>Gross Earnings</span>
                          <span>₹ {grossEarnings.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-bold text-lg mb-3 text-destructive">Deductions</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Provident Fund</span>
                          <span className="font-medium">₹ {pfDeduction.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Professional Tax</span>
                          <span className="font-medium">₹ {professionalTax.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between pt-2 border-t font-bold">
                          <span>Total Deductions</span>
                          <span>₹ {totalDeductions.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-primary text-primary-foreground p-4 rounded-md">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold">NET PAYABLE</span>
                      <span className="text-2xl font-bold">₹ {netPayable.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div className="text-center text-sm text-muted-foreground pt-4 border-t">
                  <p>This is a system-generated document. No signature is required.</p>
                  <p className="mt-1">Generated on {format(new Date(), 'dd/MM/yyyy HH:mm')}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
