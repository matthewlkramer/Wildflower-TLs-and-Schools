/**
 * Online Forms tab lists SSJ Fillout form submissions for the educator. It
 * fetches forms with React Query, derives the most recent submission date, and
 * renders the results in `SSJFilloutFormsTable`.
 */
import { SSJFilloutFormsTable } from "@/components/ssj-fillout-forms-table";
import { useQuery } from "@tanstack/react-query";
import type { SSJFilloutForm } from "@shared/schema";

export function OnlineFormsTab({ educatorId }: { educatorId: string }) {
  const { data: forms = [], isLoading } = useQuery<SSJFilloutForm[]>({
    queryKey: ["/api/ssj-fillout-forms/educator", educatorId],
    queryFn: async () => {
      const response = await fetch(`/api/ssj-fillout-forms/educator/${educatorId}`, {
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to fetch SSJ fillout forms");
      return response.json();
    },
  });

  const mostRecentDate = (() => {
    if (!forms || forms.length === 0) return null;
    const dates = forms
      .map((f) => f.dateSubmitted)
      .filter(Boolean)
      .map((d) => new Date(d as string))
      .filter((d) => !isNaN(d.getTime()));
    if (dates.length === 0) return null;
    const max = new Date(Math.max(...dates.map((d) => d.getTime())));
    return max.toLocaleDateString();
  })();

  return (
    <div className="space-y-4">
      <div className="text-sm text-slate-600">
        <span className="font-medium">Most recent submission:</span>{" "}
        {isLoading ? "Loading..." : mostRecentDate || "-"}
      </div>
      <SSJFilloutFormsTable educatorId={educatorId} />
    </div>
  );
}
