
'use client'

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getIconForUrl } from "@/components/icons";

const topLinksData = [
  { id: 1, title: "My Portfolio", url: "https://github.com", clicks: 1023 },
  { id: 2, title: "Follow me on Twitter", url: "https://twitter.com", clicks: 789 },
  { id: 3, title: "YouTube Channel", url: "https://youtube.com", clicks: 543 },
  { id: 4, title: "LinkedIn Profile", url: "https://linkedin.com", clicks: 321 },
  { id: 5, title: "Twitch Stream", url: "https://twitch.tv", clicks: 123 },
];

export default function TopLinks() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Link</TableHead>
          <TableHead className="text-right">Clicks</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {topLinksData.map((link) => {
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
