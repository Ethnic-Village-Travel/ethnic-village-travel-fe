import { useCallback, useMemo, useState } from 'react';
import { cn } from '@/utils';
import dayjs from 'dayjs';
import { CalendarDays, CheckCircle2, Clock, Loader2, UserCheck, Users } from 'lucide-react';

import { EmployeeBasicResponse, EmployeeSelectedResponse } from '@/types/employee.type';
import { useAvailableEmployeesByDateRange } from '@/hooks/api/useEmployee';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FormLabel } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';

interface AvailableEmployeeSelectProps {
  startDate: string;
  endDate: string;
  value: EmployeeSelectedResponse | null;
  onChange: (guide: EmployeeSelectedResponse | null) => void;
  placeholder?: string;
  className?: string;
  dateIndex?: number;
  showDateHeader?: boolean;
  bookedSlots?: number;
  maxSlots?: number;
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
  bookedSlots = 0,
  maxSlots = 0,
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

  // Memoize assigned guide option
  const assignedGuideOption = useMemo(() => {
    if (!value || !value.id) return [];
    const isInEmployees = employees.some(emp => emp && emp.id && String(emp.id) === String(value.id));
    if (isInEmployees) return [];

    return [
      {
        id: String(value.id),
        name: value.personal
          ? `${value.personal.firstName} ${value.personal.lastName}`
          : value.email || `Nhân viên ${value.id}`,
      },
    ];
  }, [value, employees]);

  // Memoize all options
  const allOptions = useMemo(
    () => [...employeeOptions, ...assignedGuideOption],
    [employeeOptions, assignedGuideOption],
  );

  // Memoize selected ID
  const selectedId = useMemo(() => (value && value.id ? String(value.id) : ''), [value]);

  // Memoize handle change function
  const handleChange = useCallback(
    (selectedGuideId: string) => {
      if (!selectedGuideId) {
        onChange(null);
        return;
      }

      // Get all available employees (both from API and current value)
      const allEmployees = value ? [...employees, value] : employees;
      const allValidEmployees = allEmployees.filter(emp => emp && emp.id);

      // Find employee object for selected ID
      const selectedGuide = allValidEmployees.find(emp => String(emp.id) === selectedGuideId);

      onChange(selectedGuide || null);
    },
    [employees, value, onChange],
  );

  // Memoize setOpen callback
  const handleFocus = useCallback(() => setOpen(true), []);

  if (showDateHeader) {
    const isAssigned = !!value;
    const daysCount = dayjs(endDate).diff(dayjs(startDate), 'day') + 1;
    const slotsPercentage = maxSlots > 0 ? Math.round((bookedSlots / maxSlots) * 100) : 0;

    return (
      <Card
        className={cn(
          'transition-all hover:shadow-md',
          isAssigned
            ? 'bg-primary/5 border-l-4 border-l-primary'
            : 'hover:border-l-primary/50 border-l-4 border-l-muted',
        )}
      >
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 space-y-2">
              <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                <CalendarDays className={cn('h-4 w-4', isAssigned ? 'text-primary' : 'text-muted-foreground')} />
                <span>
                  {dateIndex !== undefined && <span className="text-muted-foreground">Ngày {dateIndex + 1}: </span>}
                  {dayjs(startDate).format('DD/MM/YYYY')} - {dayjs(endDate).format('DD/MM/YYYY')}
                </span>
              </CardTitle>
              <div className="flex flex-wrap items-center gap-3 text-xs">
                <Badge variant="outline" className="gap-1.5">
                  <Clock className="h-3 w-3" />
                  {daysCount} ngày
                </Badge>
                {maxSlots > 0 && (
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Users className="h-3 w-3" />
                    <span className={cn(slotsPercentage >= 80 && 'font-medium text-orange-600')}>
                      {bookedSlots}/{maxSlots} chỗ
                    </span>
                    {slotsPercentage > 0 && <span className="text-muted-foreground/70">({slotsPercentage}%)</span>}
                  </div>
                )}
              </div>
            </div>
            {isAssigned && (
              <Badge variant="default" className="gap-1.5">
                <CheckCircle2 className="h-3 w-3" />
                Đã phân công
              </Badge>
            )}
          </div>
        </CardHeader>
        <Separator />
        <CardContent className="pt-4">
          <FormLabel className="mb-3 flex items-center gap-2 text-sm font-medium">
            <UserCheck className="h-4 w-4 text-muted-foreground" />
            Chọn nhân viên phụ trách
          </FormLabel>
          <div className={cn('space-y-3', className)}>
            {isLoading && (
              <div className="flex items-center gap-2 rounded-lg border border-dashed bg-muted/30 p-3 text-xs text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Đang tải danh sách nhân viên...</span>
              </div>
            )}
            <Select value={selectedId} onValueChange={handleChange} onOpenChange={setOpen}>
              <SelectTrigger
                className={cn('min-h-[44px] w-full transition-colors', isAssigned && 'border-primary/50 bg-primary/5')}
              >
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
              <SelectContent
                className="z-[100] max-h-[300px]"
                onCloseAutoFocus={e => e.preventDefault()}
                sideOffset={4}
              >
                {allOptions.length === 0 && !isLoading ? (
                  <div className="py-6 text-center text-sm text-muted-foreground">Không có nhân viên khả dụng</div>
                ) : (
                  allOptions.map(option => (
                    <SelectItem key={option.id} value={option.id}>
                      {option.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
            {value && (
              <div className="bg-primary/10 flex items-center gap-2 rounded-lg p-2.5 text-sm">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                <div className="flex-1">
                  <div className="font-medium text-primary">
                    {value.personal ? `${value.personal.firstName} ${value.personal.lastName}` : value.email}
                  </div>
                  {value.email && value.personal && <div className="text-xs text-muted-foreground">{value.email}</div>}
                </div>
              </div>
            )}
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
      <Select value={selectedId} onValueChange={handleChange} onOpenChange={setOpen}>
        <SelectTrigger className="min-h-[40px]">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent className="z-[100] max-h-[300px]" onCloseAutoFocus={e => e.preventDefault()} sideOffset={4}>
          {allOptions.map(option => (
            <SelectItem key={option.id} value={option.id}>
              {option.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {value && (
        <div className="text-xs text-muted-foreground">
          HDV: {value.personal ? `${value.personal.firstName} ${value.personal.lastName}` : value.email}
        </div>
      )}
    </div>
  );
}
