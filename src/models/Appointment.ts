export type CalendarType = 'private' | 'work';
export type AppointmentSource = 'local' | 'website';

export type Appointment = {
  id: string;
  title: string;
  startDate: string;
  endDate?: string;
  calendarType: CalendarType;
  createdAt: string;
  notificationId?: string;
  source?: AppointmentSource;
  externalId?: string;
};
