import { EventAttendanceTable } from "@/components/event-attendance-table";

export function EventsTab({ educatorId }: { educatorId: string }) {
  return (
    <div className="space-y-4">
      <EventAttendanceTable educatorId={educatorId} />
    </div>
  );
}

