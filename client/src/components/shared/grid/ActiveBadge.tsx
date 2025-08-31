import { Badge } from "@/components/ui/badge";

export function ActiveBadge({ active }: { active: boolean }) {
  return (
    <Badge className={active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
      {active ? 'Active' : 'Inactive'}
    </Badge>
  );
}

