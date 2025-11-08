import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { FileText, Printer, Download } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

type SelectUser = {
  id: string;
  loginId: string;
  name: string;
  email: string;
  role: string;
  department: string;
  mobile: string | null;
  company: string | null;
  manager: string | null;
  location: string | null;
  yearOfJoining: number;
  basicSalary: number;
  hra: number;
  otherEarnings: number;
  annualLeave: number;
  sickLeave: number;
  about: string | null;
  hobbies: string | null;
  createdAt: Date;
};

interface MonthlyStatement {
  month: string;
  monthName: string;
  year: number;
  workingDays: number;
  presentDays: number;
  paidLeaves: number;
  totalPayableDays: number;
  attendanceRatio: string;
  earnings: {
    basicSalary: { full: number; prorated: number };
    hra: { full: number; prorated: number };
    otherEarnings: { full: number; prorated: number };
    grossSalary: { full: number; prorated: number };
  };
  deductions: {
    providentFund: { full: number; prorated: number; percentage: number };
    professionalTax: number;
    total: number;
  };
  netSalary: number;
}

interface SalaryStatementData {
  employee: {
    id: string;
    loginId: string;
    name: string;
    email: string;
    department: string;
    location: string | null;
    yearOfJoining: number;
  };
  year: number;
  monthlyStatements: MonthlyStatement[];
}

export default function Reports() {
  const [selectedEmployee, setSelectedEmployee] = useState<string>('');
  const [selectedYear, setSelectedYear] = useState<string>(new Date().getFullYear().toString());
  const [showReport, setShowReport] = useState(false);

  const { data: employees = [], isLoading: loadingEmployees } = useQuery<SelectUser[]>({
    queryKey: ['/api/users'],
  });

  const { data: reportData, isLoading: loadingReport, refetch } = useQuery<SalaryStatementData>({
    queryKey: ['/api/reports/salary-statement', selectedEmployee, selectedYear],
    enabled: false,
  });

  const handleGenerateReport = async () => {
    if (selectedEmployee && selectedYear) {
      await refetch();
      setShowReport(true);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

  const selectedEmployeeData = employees.find(emp => emp.id === selectedEmployee);

  return (
    <div className="p-6 space-y-6">
      <div className="print:hidden">
        <h1 className="text-3xl font-bold mb-2" data-testid="text-page-title">Salary Statement Report</h1>
        <p className="text-muted-foreground">
          Generate detailed salary statements for employees
        </p>
      </div>

      <Card className="print:hidden">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Generate Report
          </CardTitle>
          <CardDescription>
            Select an employee and year to view their annual salary statement
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="employee">Employee</Label>
              <Select
                value={selectedEmployee}
                onValueChange={setSelectedEmployee}
              >
                <SelectTrigger id="employee" data-testid="select-employee">
                  <SelectValue placeholder="Select employee" />
                </SelectTrigger>
                <SelectContent>
                  {loadingEmployees ? (
                    <SelectItem value="loading" disabled>Loading employees...</SelectItem>
                  ) : employees.length === 0 ? (
                    <SelectItem value="none" disabled>No employees found</SelectItem>
                  ) : (
                    employees.map((emp) => (
                      <SelectItem key={emp.id} value={emp.id}>
                        {emp.name} - {emp.department}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="year">Year</Label>
              <Select
                value={selectedYear}
                onValueChange={setSelectedYear}
              >
                <SelectTrigger id="year" data-testid="select-year">
                  <SelectValue placeholder="Select year" />
                </SelectTrigger>
                <SelectContent>
                  {years.map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button
            onClick={handleGenerateReport}
            disabled={!selectedEmployee || !selectedYear || loadingReport}
            data-testid="button-generate-report"
          >
            {loadingReport ? 'Generating...' : 'Generate Report'}
          </Button>
        </CardContent>
      </Card>

      {showReport && reportData && (
        <>
          <Card className="print:shadow-none">
            <CardHeader className="print:pb-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <CardTitle className="text-2xl mb-2">Annual Salary Statement</CardTitle>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Employee: </span>
                      <span className="font-semibold" data-testid="text-employee-name">{reportData.employee.name}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Employee ID: </span>
                      <span className="font-semibold">{reportData.employee.loginId}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Department: </span>
                      <span className="font-semibold">{reportData.employee.department}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Year: </span>
                      <span className="font-semibold" data-testid="text-report-year">{reportData.year}</span>
                    </div>
                    {reportData.employee.location && (
                      <div>
                        <span className="text-muted-foreground">Location: </span>
                        <span className="font-semibold">{reportData.employee.location}</span>
                      </div>
                    )}
                    <div>
                      <span className="text-muted-foreground">Year of Joining: </span>
                      <span className="font-semibold">{reportData.employee.yearOfJoining}</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 print:hidden">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handlePrint}
                    data-testid="button-print"
                  >
                    <Printer className="w-4 h-4 mr-2" />
                    Print
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-32">Month</TableHead>
                      <TableHead className="text-right">Working Days</TableHead>
                      <TableHead className="text-right">Present Days</TableHead>
                      <TableHead className="text-right">Basic Salary</TableHead>
                      <TableHead className="text-right">HRA</TableHead>
                      <TableHead className="text-right">Other Earnings</TableHead>
                      <TableHead className="text-right">Gross Salary</TableHead>
                      <TableHead className="text-right">PF Deduction</TableHead>
                      <TableHead className="text-right">Prof. Tax</TableHead>
                      <TableHead className="text-right">Total Deductions</TableHead>
                      <TableHead className="text-right font-semibold">Net Salary</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {reportData.monthlyStatements.map((statement) => (
                      <TableRow key={statement.month} data-testid={`row-month-${statement.month}`}>
                        <TableCell className="font-medium">{statement.monthName}</TableCell>
                        <TableCell className="text-right">{statement.workingDays}</TableCell>
                        <TableCell className="text-right">{statement.totalPayableDays}</TableCell>
                        <TableCell className="text-right">₹{statement.earnings.basicSalary.prorated.toLocaleString()}</TableCell>
                        <TableCell className="text-right">₹{statement.earnings.hra.prorated.toLocaleString()}</TableCell>
                        <TableCell className="text-right">₹{statement.earnings.otherEarnings.prorated.toLocaleString()}</TableCell>
                        <TableCell className="text-right font-medium">₹{statement.earnings.grossSalary.prorated.toLocaleString()}</TableCell>
                        <TableCell className="text-right">₹{statement.deductions.providentFund.prorated.toLocaleString()}</TableCell>
                        <TableCell className="text-right">₹{statement.deductions.professionalTax.toLocaleString()}</TableCell>
                        <TableCell className="text-right">₹{statement.deductions.total.toLocaleString()}</TableCell>
                        <TableCell className="text-right font-semibold text-green-600 dark:text-green-400">
                          ₹{statement.netSalary.toLocaleString()}
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow className="bg-muted/50 font-semibold">
                      <TableCell colSpan={3}>Annual Total</TableCell>
                      <TableCell className="text-right">
                        ₹{reportData.monthlyStatements.reduce((sum, s) => sum + s.earnings.basicSalary.prorated, 0).toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right">
                        ₹{reportData.monthlyStatements.reduce((sum, s) => sum + s.earnings.hra.prorated, 0).toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right">
                        ₹{reportData.monthlyStatements.reduce((sum, s) => sum + s.earnings.otherEarnings.prorated, 0).toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right">
                        ₹{reportData.monthlyStatements.reduce((sum, s) => sum + s.earnings.grossSalary.prorated, 0).toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right">
                        ₹{reportData.monthlyStatements.reduce((sum, s) => sum + s.deductions.providentFund.prorated, 0).toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right">
                        ₹{reportData.monthlyStatements.reduce((sum, s) => sum + s.deductions.professionalTax, 0).toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right">
                        ₹{reportData.monthlyStatements.reduce((sum, s) => sum + s.deductions.total, 0).toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right text-green-600 dark:text-green-400" data-testid="text-annual-net-salary">
                        ₹{reportData.monthlyStatements.reduce((sum, s) => sum + s.netSalary, 0).toLocaleString()}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>

              <div className="mt-6 p-4 bg-muted/50 rounded-lg print:bg-gray-50">
                <h3 className="font-semibold mb-2">Notes:</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Salaries are prorated based on actual attendance</li>
                  <li>• PF deduction is calculated at {reportData.monthlyStatements[0]?.deductions.providentFund.percentage}% of basic salary</li>
                  <li>• Professional tax is a fixed amount per month</li>
                  <li>• Paid leaves are included in payable days calculation</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {showReport && !reportData && !loadingReport && (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            No data available for the selected employee and year.
          </CardContent>
        </Card>
      )}
    </div>
  );
}
