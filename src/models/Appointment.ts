export type CalendarType = 'private' | 'work';

export type Appointment = {
  id: string;
  title: string;
  startDate: string;
  calendarType: CalendarType;
  createdAt: string;
  notificationId?: string;
};
