import { useCallback, useMemo, useState } from 'react';
import { cn } from '@/utils';
import dayjs from 'dayjs';
import { CalendarDays, Clock, Loader2 } from 'lucide-react';

import { EmployeeBasicResponse, EmployeeSelectedResponse } from '@/types/employee.type';
import { useAvailableEmployeesByDateRange } from '@/hooks/api/useEmployee';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FormLabel } from '@/components/ui/form';
import { MultiSelect } from '@/components/shared/multiple-select';

interface AvailableEmployeeSelectProps {
  startDate: string;
  endDate: string;
  value: EmployeeSelectedResponse[];
  onChange: (employees: EmployeeSelectedResponse[]) => void;
  placeholder?: string;
  className?: string;
  dateIndex?: number;
  showDateHeader?: boolean;
}

export function AvailableEmployeeSelect({
  startDate,
  endDate,
  value,
  onChange,
  placeholder = 'Chọn nhân viên',
  className,
  dateIndex,
  showDateHeader = false,
}: AvailableEmployeeSelectProps) {
  const [open, setOpen] = useState(false);

  // Memoize API params để tránh re-fetch không cần thiết
  const apiParams = useMemo(
    () =>
      open && startDate && endDate
        ? {
            startDate: dayjs(startDate).format('YYYY-MM-DD'),
            endDate: dayjs(endDate).format('YYYY-MM-DD'),
          }
        : undefined,
    [open, startDate, endDate],
  );

  const { data, isLoading } = useAvailableEmployeesByDateRange(apiParams);
  const employees: EmployeeBasicResponse[] = Array.isArray(data) ? data : [];

  console.log(`AvailableEmployeeSelect for ${startDate}-${endDate}:`, {
    open,
    isLoading,
    employeesCount: employees.length,
    value,
  });

  // Memoize employee options để tránh tính toán lại
  const employeeOptions = useMemo(
    () =>
      employees
        .filter(e => e && e.id) // Filter out undefined or null employees or those without id
        .map((e: EmployeeBasicResponse) => ({
          id: String(e.id),
          name: e.personal ? `${e.personal.firstName} ${e.personal.lastName}` : e.email || `Nhân viên ${e.id}`,
        })),
    [employees],
  );

  // Memoize assigned employee options
  const assignedEmployeeOptions = useMemo(
    () =>
      value
        .filter(
          assignedEmp =>
            assignedEmp &&
            assignedEmp.id &&
            !employees.some(emp => emp && emp.id && String(emp.id) === String(assignedEmp.id)),
        )
        .map((e: EmployeeSelectedResponse) => {
          console.log('Creating option for assigned employee:', e);
          return {
            id: String(e.id),
            name: e.personal ? `${e.personal.firstName} ${e.personal.lastName}` : e.email || `Nhân viên ${e.id}`,
          };
        }),
    [value, employees],
  );

  // Memoize all options
  const allOptions = useMemo(
    () => [...employeeOptions, ...assignedEmployeeOptions],
    [employeeOptions, assignedEmployeeOptions],
  );

  // Memoize selected IDs
  const selectedIds = useMemo(
    () =>
      value
        .filter(emp => emp && emp.id) // Filter out undefined or null employees
        .map(emp => String(emp.id)),
    [value],
  );

  // Memoize handle change function
  const handleChange = useCallback(
    (selectedEmployeeIds: string[]) => {
      // Get all available employees (both from API and current value)
      const allEmployees = [...employees, ...value].filter(emp => emp && emp.id); // Filter out invalid employees

      // Find employee objects for selected IDs
      const selectedEmployees = selectedEmployeeIds
        .map(id => allEmployees.find(emp => emp && emp.id && String(emp.id) === id))
        .filter(Boolean) as EmployeeBasicResponse[];

      onChange(selectedEmployees);
    },
    [employees, value, onChange],
  );

  // Memoize setOpen callback
  const handleFocus = useCallback(() => setOpen(true), []);

  if (showDateHeader) {
    return (
      <Card className="border-l-primary/20 border-l-4">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm font-medium">
            <CalendarDays className="h-4 w-4 text-primary" />
            <span>
              {dateIndex !== undefined && `Ngày ${dateIndex + 1}: `}
              {dayjs(startDate).format('DD/MM/YYYY')} - {dayjs(endDate).format('DD/MM/YYYY')}
            </span>
            <Badge variant="outline" className="ml-auto">
              <Clock className="mr-1 h-3 w-3" />
              {dayjs(endDate).diff(dayjs(startDate), 'day') + 1} ngày
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <FormLabel className="text-sm font-medium">Chọn nhân viên phụ trách</FormLabel>
          <div className={cn('mt-2 space-y-2', className)}>
            {isLoading && (
              <div className="flex items-center gap-2 rounded-md bg-muted/50 p-2 text-xs text-muted-foreground">
                <Loader2 className="h-3 w-3 animate-spin" />
                Đang tải danh sách nhân viên...
              </div>
            )}
            <MultiSelect
              options={allOptions}
              onValueChange={handleChange}
              value={selectedIds}
              placeholder={placeholder}
              onFocus={handleFocus}
              className="min-h-[40px]"
            />
            {value.length > 0 && <div className="text-xs text-muted-foreground">Đã chọn {value.length} nhân viên</div>}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={cn('space-y-2', className)}>
      {isLoading && (
        <div className="flex items-center gap-2 rounded-md bg-muted/50 p-2 text-xs text-muted-foreground">
          <Loader2 className="h-3 w-3 animate-spin" />
          Đang tải danh sách nhân viên...
        </div>
      )}
      <MultiSelect
        options={allOptions}
        onValueChange={handleChange}
        value={selectedIds}
        placeholder={placeholder}
        onFocus={handleFocus}
        className="min-h-[40px]"
      />
      {value.length > 0 && <div className="text-xs text-muted-foreground">Đã chọn {value.length} nhân viên</div>}
    </div>
  );
}
