import type { ReactNode } from "react";

interface AdminTableProps {
  columns: string[];
  children: ReactNode;
}

export function AdminTable({ columns, children }: AdminTableProps) {
  return (
    <div className="hidden overflow-x-auto rounded-sm border border-line bg-surface md:block">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-line bg-background">
          <tr className="text-xs text-muted">
            {columns.map((column) => (
              <th key={column} scope="col" className="px-4 py-2.5 font-medium">
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-line">{children}</tbody>
      </table>
    </div>
  );
}
