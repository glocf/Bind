
'use client'

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getIconForUrl } from "@/components/icons";

export default function TopLinks({ data }: { data: any[] }) {
  if (!data || data.length === 0) {
    return <p className="text-muted-foreground text-center">No link clicks recorded yet.</p>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Link</TableHead>
          <TableHead className="text-right">Clicks</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((link) => {
            const Icon = getIconForUrl(link.url);
            return (
                <TableRow key={link.id}>
                    <TableCell>
                        <div className="flex items-center gap-4">
                            <Icon className="h-5 w-5 text-muted-foreground" />
                            <div className="flex flex-col">
                                <a href={link.url} target="_blank" rel="noopener noreferrer" className="font-medium hover:underline">{link.title}</a>
                                <span className="text-sm text-muted-foreground">{link.url}</span>
                            </div>
                        </div>
                    </TableCell>
                    <TableCell className="text-right font-medium">{link.clicks.toLocaleString()}</TableCell>
                </TableRow>
            )
        })}
      </TableBody>
    </Table>
  );
}
