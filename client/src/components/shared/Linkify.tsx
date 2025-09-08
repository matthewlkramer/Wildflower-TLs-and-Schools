import { Link } from "wouter";

export function LinkifyEducatorNames({ names, educatorByName }: { names: string[] | string | undefined; educatorByName: Map<string, string> }) {
  const arr = Array.isArray(names)
    ? names
    : (names ? String(names).split(/[,;]+/).map((s) => s.trim()).filter(Boolean) : []);
  if (!arr.length) return <span className="text-slate-400">-</span> as any;
  return (
    <span className="flex flex-wrap gap-1 items-center h-full">
      {arr.map((n, i) => {
        const id = educatorByName.get(String(n || '').toLowerCase());
        return (
          <span key={`${n}-${i}`} className="inline-flex items-center">
            {i > 0 && <span className="mx-0.5">,</span>}
            {id ? (
              <Link href={`/teacher/${id}`} className="text-blue-600 hover:underline">
                {n}
              </Link>
            ) : (
              <span>{n}</span>
            )}
          </span>
        );
      })}
    </span>
  ) as any;
}

export function LinkifySchoolName({ name, schoolByName }: { name?: string | null; schoolByName: Map<string, string> }) {
  const n = (name || '').trim();
  if (!n) return <span>-</span> as any;
  const id = schoolByName.get(n.toLowerCase());
  if (!id) return <span className="font-semibold text-lg">{n}</span> as any;
  return (
    <a href={`/school/${id}`} className="font-semibold text-lg text-blue-600 hover:underline">
      {n}
    </a>
  ) as any;
}

