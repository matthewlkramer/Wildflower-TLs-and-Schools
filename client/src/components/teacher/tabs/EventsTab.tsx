/**
 * Events tab shows the educator's participation in events, rendering
 * `EventAttendanceTable` which handles data retrieval and display.
 */
import { EventAttendanceTable } from "@/components/event-attendance-table";

export function EventsTab({ educatorId }: { educatorId: string }) {
  return (
    <div className="space-y-4">
      <EventAttendanceTable educatorId={educatorId} />
    </div>
  );
}

