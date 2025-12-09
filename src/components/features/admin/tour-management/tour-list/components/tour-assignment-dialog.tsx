import React, { useEffect, useState } from 'react';
import { useTourAssignmentStore } from '@/stores/useTourAssignmentStore';
import { Calendar, CheckCircle2, Loader2, Save, Users, X } from 'lucide-react';
import { FormProvider, useForm } from 'react-hook-form';
import { useShallow } from 'zustand/react/shallow';

import type { EmployeeBasicResponse } from '@/types/employee.type';
import { Tour } from '@/types/tour.type';
import { useAssignedEmployeesByDates } from '@/hooks/api/useEmployee';
import { useAssignTourEmployees } from '@/hooks/api/useTourAssignment';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { FormControl, FormField, FormItem } from '@/components/ui/form';
import { Separator } from '@/components/ui/separator';

import { AvailableEmployeeSelect } from './available-employee-select';

interface TourAssignmentDialogProps {
  tour?: Tour;
  open: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function TourAssignmentDialog({ tour, open, onOpenChange }: TourAssignmentDialogProps) {
  const { mutateAsync: assignTourEmployees } = useAssignTourEmployees();
  const [loading, setLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
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
  const assignedGuideByDate = useTourAssignmentStore(
    useShallow(state => (tourId ? state.tourAssignments[tourId] || {} : {})),
  ) as { [dateId: string]: EmployeeBasicResponse | null };

  // Get available date IDs for fetching assigned employees - memoize để tránh tạo array mới
  const availableDateIds = React.useMemo(
    () => tour?.availableDates?.map(date => String(date.id)) || [],
    [tour?.availableDates],
  );

  // Fetch assigned employees when dialog opens - chỉ fetch khi cần thiết
  const shouldFetchData = React.useMemo(() => {
    if (!open || availableDateIds.length === 0 || !tourId) return false;
    // Fetch nếu chưa có dữ liệu gì trong store cho tour này
    return !assignedGuideByDate || Object.keys(assignedGuideByDate).length === 0;
  }, [open, availableDateIds, tourId, assignedGuideByDate]);

  const {
    data: assignedEmployeesData,
    isLoading: isLoadingAssignedEmployees,
    error: assignedEmployeesError,
  } = useAssignedEmployeesByDates(shouldFetchData ? { availableDateIds } : undefined);

  // Update store when data is fetched
  useEffect(() => {
    if (assignedEmployeesData?.assignedEmployeesByDate && tourId && open) {
      console.log('Received assigned employees data:', assignedEmployeesData.assignedEmployeesByDate);
      // Convert from API format { [dateId]: EmployeeBasicResponse[] } to store format { [dateId]: EmployeeBasicResponse | null }
      const convertedAssignments: { [dateId: string]: EmployeeBasicResponse | null } = {};
      Object.entries(assignedEmployeesData.assignedEmployeesByDate).forEach(([dateId, guides]) => {
        // Take first guide if array, or null if empty
        convertedAssignments[dateId] = Array.isArray(guides) && guides.length > 0 ? guides[0] : null;
      });
      // Store assignments for this specific tour
      setTourAssignments(tourId, convertedAssignments);
    }
  }, [assignedEmployeesData, setTourAssignments, tourId, open]);

  // Memoize default values để tránh tạo object mới mỗi render
  const defaultFormValues = React.useMemo(() => {
    const availableDates = tour?.availableDates || [];
    return {
      assignments: availableDates.reduce(
        (acc, date) => {
          acc[String(date.id)] = null;
          return acc;
        },
        {} as { [dateId: string]: EmployeeBasicResponse | null },
      ),
    };
  }, [tour?.availableDates]);

  const form = useForm<{ assignments: { [dateId: string]: EmployeeBasicResponse | null } }>({
    defaultValues: defaultFormValues,
  });
  const { handleSubmit, control, reset } = form;

  // Reset form khi dialog mở và khi có dữ liệu từ store hoặc API
  // Không reset nếu đang trong quá trình save hoặc loading để tránh giật về giá trị cũ
  useEffect(() => {
    if (!open || !tourId || isSaving || loading) return;

    // Nếu có dữ liệu từ API response, ưu tiên dùng đó
    const dataToUse = assignedEmployeesData?.assignedEmployeesByDate || assignedGuideByDate || {};

    console.log('Using assignedGuide from store for tour:', tourId, dataToUse);

    const formAssignments =
      tour?.availableDates?.reduce(
        (acc, date) => {
          const dateId = String(date.id);
          // Handle both array format [guide] and direct guide format
          const assignedGuide = Array.isArray(dataToUse[dateId])
            ? dataToUse[dateId]?.[0] || null
            : dataToUse[dateId] || null;
          acc[dateId] = assignedGuide;
          return acc;
        },
        {} as { [dateId: string]: EmployeeBasicResponse | null },
      ) || {};

    console.log('Setting form assignments:', formAssignments);

    reset(
      {
        assignments: formAssignments,
      },
      { keepValues: false },
    );
  }, [open, tourId, reset, assignedGuideByDate, assignedEmployeesData, tour?.availableDates, isSaving, loading]);

  const handleSave = React.useCallback(
    handleSubmit(async values => {
      if (!tourId) return;

      setLoading(true);
      setIsSaving(true);
      try {
        console.log('Saving assignments:', values.assignments);

        // Convert EmployeeBasicResponse to string for API
        const apiPayload = {
          assignments: Object.entries(values.assignments).reduce(
            (acc, [dateId, guide]) => {
              if (guide) {
                acc[dateId] = String(guide.id);
              }
              return acc;
            },
            {} as { [dateId: string]: string },
          ),
        };

        const result = await assignTourEmployees(apiPayload);

        console.log('Assignment successful, result:', result);

        // Process the response to update assigned guide by date
        if (result?.data) {
          const newAssignmentsByDate: { [dateId: string]: EmployeeBasicResponse | null } = {};

          // Map assignment responses by date (1 guide per date)
          result.data.forEach(assignment => {
            const dateId = assignment.tourAvailableDateId;
            if (assignment.guide) {
              newAssignmentsByDate[dateId] = assignment.guide;
            }
          });

          console.log('New assignments by date:', newAssignmentsByDate);

          // Update the store with new assignments for this specific tour
          setTourAssignments(tourId, newAssignmentsByDate);

          // Update form với giá trị mới ngay lập tức để tránh giật về giá trị cũ
          const updatedFormValues =
            tour?.availableDates?.reduce(
              (acc, date) => {
                const dateId = String(date.id);
                acc[dateId] = newAssignmentsByDate[dateId] || null;
                return acc;
              },
              {} as { [dateId: string]: EmployeeBasicResponse | null },
            ) || {};

          // Reset loading states ngay lập tức
          setLoading(false);
          setIsSaving(false);

          // Update form với giá trị mới ngay lập tức để tránh giật về giá trị cũ
          reset(
            {
              assignments: updatedFormValues,
            },
            { keepValues: false },
          );

          toast({ title: 'Đã lưu phân công người dẫn tour!' });
          return;
        }
      } catch (e: any) {
        console.error('Error saving assignments:', e);
        
        let errorMessage = 'Có lỗi khi lưu phân công!';
        
        if (e?.response?.data?.message) {
          errorMessage = e.response.data.message;
        } else if (e?.message) {
          errorMessage = e.message;
        }
        
        if (errorMessage.includes('đã được phân công cho tour khác') || errorMessage.includes('conflict')) {
          errorMessage = 'Guide đã được phân công cho tour khác trong khoảng thời gian này. Vui lòng chọn guide khác.';
        } else if (errorMessage.includes('đủ số lượng khách') || errorMessage.includes('capacity')) {
          errorMessage = 'Tour đã đủ số lượng khách, không thể assign guide.';
        }
        
        toast({ 
          title: 'Lỗi phân công', 
          description: errorMessage,
          variant: 'destructive' 
        });
        setLoading(false);
        setIsSaving(false);
      }
    }),
    [handleSubmit, tourId, assignTourEmployees, setTourAssignments, toast, onOpenChange, tour?.availableDates, reset],
  );

  // Count the total number of assigned guides - memoize để tránh tính toán lại
  const totalAssignedGuides = React.useMemo(() => {
    return Object.values(assignedGuideByDate || {}).filter(guide => guide !== null).length;
  }, [assignedGuideByDate]);

  // Reset isSaving khi dialog đóng
  useEffect(() => {
    if (!open) {
      setIsSaving(false);
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="flex max-h-[90vh] max-w-5xl flex-col p-0"
        onOpenAutoFocus={e => e.preventDefault()}
        onInteractOutside={e => {
          // Prevent closing when clicking on SelectContent
          const target = e.target as HTMLElement;
          if (target.closest('[role="listbox"]')) {
            e.preventDefault();
          }
        }}
      >
        <DialogHeader className="flex-shrink-0 space-y-3 border-b bg-muted/30 px-6 py-5">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <DialogTitle className="flex items-center gap-2 text-xl font-semibold">
                <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-lg">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                Phân công người dẫn tour
              </DialogTitle>
              {tour && (
                <DialogDescription className="flex flex-wrap items-center gap-2 pt-1 text-sm">
                  <Badge variant="secondary" className="gap-1.5 font-medium">
                    <Calendar className="h-3 w-3" />
                    {tour.title}
                  </Badge>
                  <span className="text-muted-foreground">•</span>
                  <span className="text-muted-foreground">{tour.availableDates?.length || 0} ngày khả dụng</span>
                  {!isLoadingAssignedEmployees && (
                    <>
                      <span className="text-muted-foreground">•</span>
                      <span className="flex items-center gap-1.5 font-medium text-primary">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        {totalAssignedGuides}/{tour.availableDates?.length || 0} ngày đã có HDV
                      </span>
                    </>
                  )}
                </DialogDescription>
              )}
            </div>
          </div>
        </DialogHeader>

        <FormProvider {...form}>
          <form onSubmit={handleSave} className="flex h-full min-h-0 flex-1 flex-col">
            <div className="min-h-0 flex-1 overflow-y-auto">
              <div className="space-y-4 px-6 py-6">
                {assignedEmployeesError ? (
                  <div className="flex flex-col items-center justify-center rounded-lg border border-destructive/20 bg-destructive/5 py-16 text-center">
                    <div className="mb-4 rounded-full bg-destructive/10 p-4">
                      <X className="h-8 w-8 text-destructive" />
                    </div>
                    <h3 className="mb-2 text-lg font-semibold text-destructive">Lỗi tải dữ liệu</h3>
                    <p className="max-w-md text-sm text-muted-foreground">
                      Không thể tải danh sách nhân viên đã phân công. Vui lòng thử lại sau.
                    </p>
                  </div>
                ) : isLoadingAssignedEmployees ? (
                  <div className="flex flex-col items-center justify-center rounded-lg border border-dashed bg-muted/30 py-16 text-center">
                    <div className="mb-4 h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                    <p className="text-sm font-medium text-muted-foreground">
                      Đang tải danh sách nhân viên đã phân công...
                    </p>
                  </div>
                ) : tour && tour.availableDates && tour.availableDates.length > 0 ? (
                  <div className="grid gap-4">
                    {tour.availableDates.map((date, index) => {
                      const bookedSlots =
                        date.bookedPersonCounts?.reduce(
                          (total, booking) => total + (booking.adult || 0) + (booking.child || 0),
                          0,
                        ) || 0;
                      return (
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
                                  value={field.value || null}
                                  onChange={field.onChange}
                                  placeholder="Tìm và chọn nhân viên..."
                                  dateIndex={index}
                                  showDateHeader={true}
                                  bookedSlots={bookedSlots}
                                  maxSlots={date.maxSlots || 0}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      );
                    })}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center rounded-lg border border-dashed bg-muted/30 py-16 text-center">
                    <Users className="mb-4 h-16 w-16 text-muted-foreground/30" />
                    <h3 className="mb-2 text-lg font-semibold text-muted-foreground">Không có ngày khả dụng</h3>
                    <p className="max-w-md text-sm text-muted-foreground">
                      Tour này chưa có ngày khả dụng nào để phân công nhân viên. Vui lòng thêm ngày khả dụng trước.
                    </p>
                  </div>
                )}
              </div>
            </div>

            <Separator />
            <DialogFooter className="flex-shrink-0 gap-2 bg-muted/30 px-6 py-4">
              <Button
                variant="outline"
                type="button"
                onClick={() => onOpenChange?.(false)}
                disabled={loading || isLoadingAssignedEmployees || !!assignedEmployeesError}
                className="min-w-[100px]"
              >
                <X className="mr-2 h-4 w-4" />
                Hủy
              </Button>
              <Button
                type="submit"
                disabled={
                  loading || isLoadingAssignedEmployees || !!assignedEmployeesError || !tour?.availableDates?.length
                }
                className="min-w-[140px]"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Đang lưu...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Lưu phân công
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}
