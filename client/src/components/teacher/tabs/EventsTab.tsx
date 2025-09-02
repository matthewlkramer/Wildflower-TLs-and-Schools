/**
 * Educator “Events” tab. Delegates to `EventAttendanceTable` which fetches and
 * lists all event attendance records for the given educator id. The table shows
 * each event’s name, date, and attendance status and supports adding or removing
 * attendance entries. This tab merely provides spacing and wires through the
 * educator id prop.
 */
import { EventAttendanceTable } from "@/components/event-attendance-table";

export function EventsTab({ educatorId }: { educatorId: string }) {
  return (
    <div className="space-y-4">
      <EventAttendanceTable educatorId={educatorId} />
    </div>
  );
}

