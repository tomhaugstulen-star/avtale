export type Appointment = {
  id: string;
  title: string;
  startDate: string;
  calendarType: 'private';
  createdAt: string;
  notificationId?: string;
};
