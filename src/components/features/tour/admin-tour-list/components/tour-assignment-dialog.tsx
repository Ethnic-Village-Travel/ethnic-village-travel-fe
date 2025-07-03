import React, { useEffect, useState } from 'react';
import { useTourAssignmentStore } from '@/store/useTourAssignmentStore';
import { Save, Users, X } from 'lucide-react';
import { Form, FormProvider, useForm } from 'react-hook-form';
import { useShallow } from 'zustand/react/shallow';

import type { EmployeeBasicResponse } from '@/types/employee.type';
import { Tour } from '@/types/tour.type';
import { useAssignedEmployeesByDates } from '@/hooks/api/useEmployee';
import { useAssignTourEmployees } from '@/hooks/api/useTourAssignment';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { FormControl, FormField, FormItem } from '@/components/ui/form';

import { AvailableEmployeeSelect } from './available-employee-select';

interface TourAssignmentDialogProps {
  tour?: Tour;
  open: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function TourAssignmentDialog({ tour, open, onOpenChange }: TourAssignmentDialogProps) {
  const { mutateAsync: assignTourEmployees } = useAssignTourEmployees();
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const tourId = tour?.id ? String(tour.id) : null;

  // Use our store for assigned employees with new structure - chỉ lấy những gì cần thiết
  const { setActiveTourId, setTourAssignments } = useTourAssignmentStore();

  // Set active tour when dialog opens
  useEffect(() => {
    if (open && tourId) {
      console.log('Setting active tour ID:', tourId);
      setActiveTourId(tourId);
    }
  }, [open, tourId, setActiveTourId]);

  // Get current assignments for this tour với selector ổn định
  const assignedEmployeesByDate = useTourAssignmentStore(
    useShallow(state => tourId ? (state.tourAssignments[tourId] || {}) : {})
  ) as { [dateId: string]: EmployeeBasicResponse[] };

  // Get available date IDs for fetching assigned employees - memoize để tránh tạo array mới
  const availableDateIds = React.useMemo(
    () => tour?.availableDates?.map(date => String(date.id)) || [],
    [tour?.availableDates],
  );

  // Fetch assigned employees when dialog opens - chỉ fetch khi cần thiết
  const shouldFetchData = React.useMemo(() => {
    if (!open || availableDateIds.length === 0 || !tourId) return false;
    // Fetch nếu chưa có dữ liệu gì trong store cho tour này
    return !assignedEmployeesByDate || Object.keys(assignedEmployeesByDate).length === 0;
  }, [open, availableDateIds, tourId, assignedEmployeesByDate]);

  const {
    data: assignedEmployeesData,
    isLoading: isLoadingAssignedEmployees,
    error: assignedEmployeesError,
  } = useAssignedEmployeesByDates(shouldFetchData ? { availableDateIds } : undefined);

  // Update store when data is fetched
  useEffect(() => {
    if (assignedEmployeesData?.assignedEmployeesByDate && tourId && open) {
      console.log('Received assigned employees data:', assignedEmployeesData.assignedEmployeesByDate);
      // Store assignments for this specific tour
      setTourAssignments(tourId, assignedEmployeesData.assignedEmployeesByDate);
    }
  }, [assignedEmployeesData, setTourAssignments, tourId, open]);

  // Memoize default values để tránh tạo object mới mỗi render
  const defaultFormValues = React.useMemo(() => {
    const availableDates = tour?.availableDates || [];
    return {
      assignments: availableDates.reduce(
        (acc, date) => {
          acc[String(date.id)] = [];
          return acc;
        },
        {} as { [dateId: string]: EmployeeBasicResponse[] },
      ),
    };
  }, [tour?.availableDates]);

  const form = useForm<{ assignments: { [dateId: string]: EmployeeBasicResponse[] } }>({
    defaultValues: defaultFormValues,
  });
  const { handleSubmit, control, reset } = form;

  // Reset form khi dialog mở và khi có dữ liệu từ store hoặc API
  useEffect(() => {
    if (!open || !tourId) return;

    // Nếu có dữ liệu từ API response, ưu tiên dùng đó
    const dataToUse = assignedEmployeesData?.assignedEmployeesByDate || assignedEmployeesByDate || {};
    
    console.log('Using assignedEmployees from store for tour:', tourId, dataToUse);
    
    const formAssignments = tour?.availableDates?.reduce(
      (acc, date) => {
        const dateId = String(date.id);
        const assignedEmployees = dataToUse[dateId] || [];
        acc[dateId] = assignedEmployees;
        return acc;
      },
      {} as { [dateId: string]: EmployeeBasicResponse[] },
    ) || {};

    console.log('Setting form assignments:', formAssignments);

    reset({
      assignments: formAssignments,
    });
  }, [open, tourId, reset, assignedEmployeesByDate, assignedEmployeesData, tour?.availableDates]);

  const handleSave = React.useCallback(
    handleSubmit(async values => {
      if (!tourId) return;

      setLoading(true);
      try {
        console.log('Saving assignments:', values.assignments);

        // Convert EmployeeBasicResponse[] to string[] for API
        const apiPayload = {
          assignments: Object.entries(values.assignments).reduce(
            (acc, [dateId, employees]) => {
              acc[dateId] = employees.map(emp => String(emp.id));
              return acc;
            },
            {} as { [dateId: string]: string[] },
          ),
        };

        const result = await assignTourEmployees(apiPayload);

        console.log('Assignment successful, result:', result);

        // Process the response to update assigned employees by date
        if (result?.data) {
          const newAssignmentsByDate: { [dateId: string]: EmployeeBasicResponse[] } = {};

          // Group assignment responses by date
          result.data.forEach(assignment => {
            const dateId = assignment.tourAvailableDateId;
            if (!newAssignmentsByDate[dateId]) {
              newAssignmentsByDate[dateId] = [];
            }

            // Make sure the employee object is fully populated
            if (assignment.employee) {
              newAssignmentsByDate[dateId].push(assignment.employee);
            }
          });

          console.log('New assignments by date:', newAssignmentsByDate);

          // Update the store with new assignments for this specific tour
          setTourAssignments(tourId, newAssignmentsByDate);

          toast({ title: 'Đã lưu phân công người dẫn tour!' });

          // Close the dialog after a successful save
          setTimeout(() => {
            onOpenChange?.(false);
          }, 1000);
        }
      } catch (e) {
        console.error('Error saving assignments:', e);
        toast({ title: 'Có lỗi khi lưu phân công!', variant: 'destructive' });
      }
      setLoading(false);
    }),
    [handleSubmit, tourId, assignTourEmployees, setTourAssignments, toast, onOpenChange],
  );

  // Count the total number of assigned employees - memoize để tránh tính toán lại
  const totalAssignedEmployees = React.useMemo(() => {
    return Object.values(assignedEmployeesByDate || {}).reduce(
      (total, employees) => total + (employees?.length || 0),
      0,
    );
  }, [assignedEmployeesByDate]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[90vh] max-w-4xl flex-col">
        <DialogHeader className="flex-shrink-0 border-b pb-4">
          <DialogTitle className="flex items-center gap-2 text-lg">
            <Users className="h-5 w-5 text-primary" />
            Phân công người dẫn tour
          </DialogTitle>
          {tour && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Badge variant="secondary" className="font-medium">
                {tour.title}
              </Badge>
              <span>•</span>
              <span>{tour.availableDates?.length || 0} ngày khả dụng</span>
              {!isLoadingAssignedEmployees && (
                <>
                  <span>•</span>
                  <span>{totalAssignedEmployees} nhân viên đã phân công</span>
                </>
              )}
            </div>
          )}
        </DialogHeader>

        <FormProvider {...form}>
          <form onSubmit={handleSave} className="flex h-full min-h-0 flex-1 flex-col">
            <div className="flex-1 overflow-auto py-4">
              <div className="space-y-4">
                {assignedEmployeesError ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="mb-4 rounded-full bg-destructive/10 p-3">
                      <X className="h-6 w-6 text-destructive" />
                    </div>
                    <h3 className="mb-2 text-lg font-medium text-destructive">Lỗi tải dữ liệu</h3>
                    <p className="text-sm text-muted-foreground">
                      Không thể tải danh sách nhân viên đã phân công. Vui lòng thử lại.
                    </p>
                  </div>
                ) : isLoadingAssignedEmployees ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="mb-4 h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                    <p className="text-sm text-muted-foreground">Đang tải danh sách nhân viên đã phân công...</p>
                  </div>
                ) : tour && tour.availableDates && tour.availableDates.length > 0 ? (
                  <div className="grid gap-4">
                    {tour.availableDates.map((date, index) => (
                      <FormField
                        key={String(date.id)}
                        control={control}
                        name={`assignments.${date.id}`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <AvailableEmployeeSelect
                                startDate={date.startDate}
                                endDate={date.endDate}
                                value={field.value || []}
                                onChange={field.onChange}
                                placeholder="Tìm và chọn nhân viên..."
                                dateIndex={index}
                                showDateHeader={true}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <Users className="mb-4 h-12 w-12 text-muted-foreground/50" />
                    <h3 className="mb-2 text-lg font-medium text-muted-foreground">Không có ngày khả dụng</h3>
                    <p className="text-sm text-muted-foreground">
                      Tour này chưa có ngày khả dụng nào để phân công nhân viên.
                    </p>
                  </div>
                )}
              </div>
            </div>

            <DialogFooter className="flex-shrink-0 border-t pt-4">
              <Button
                variant="outline"
                type="button"
                onClick={() => onOpenChange?.(false)}
                disabled={loading || isLoadingAssignedEmployees || !!assignedEmployeesError}
                className="flex items-center gap-2"
              >
                <X className="h-4 w-4" />
                Hủy
              </Button>
              <Button
                type="submit"
                disabled={
                  loading || isLoadingAssignedEmployees || !!assignedEmployeesError || !tour?.availableDates?.length
                }
                className="flex items-center gap-2"
              >
                <Save className="h-4 w-4" />
                {loading ? 'Đang lưu và cập nhật...' : 'Lưu phân công'}
              </Button>
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}
