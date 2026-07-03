import type { Appointment } from '@/src/models/Appointment';

export function getAppointmentsForMonth(
  appointments: Appointment[],
  month: Date,
) {
  return appointments.filter((appointment) => {
    const date = new Date(appointment.startDate);
    return (
      date.getFullYear() === month.getFullYear() &&
      date.getMonth() === month.getMonth()
    );
  });
}

export function getMarkedDays(appointments: Appointment[]) {
  return [...new Set(
    appointments.map((appointment) =>
      new Date(appointment.startDate).getDate(),
    ),
  )];
}

export function getAppointmentsForDay(
  appointments: Appointment[],
  day: number,
) {
  return appointments.filter(
    (appointment) => new Date(appointment.startDate).getDate() === day,
  );
}

export function combineDateAndTime(date: Date, time: Date) {
  const result = new Date(date);
  result.setHours(time.getHours(), time.getMinutes(), 0, 0);
  return result;
}
