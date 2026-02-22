import { useState, useEffect, useCallback, useRef } from "react";
import { getAllCertificates, type PaginatedCertificates } from "@/api/certificates";
import type { Certificate } from "@/types";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { FileText, Eye, History, Search, ChevronLeft, ChevronRight } from "lucide-react";

const statusVariant = (status: string) => {
  switch (status) {
    case "APPROVED":
      return "default" as const;
    case "REJECTED":
      return "destructive" as const;
    default:
      return "secondary" as const;
  }
};

const PER_PAGE = 10;

export default function AllCertificatesPage() {
  const [data, setData] = useState<PaginatedCertificates>({ certificates: [], total: 0, page: 1, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Certificate | null>(null);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [page, setPage] = useState(1);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(null);

  const fetchData = useCallback(async (p: number, q: string, status: string) => {
    setLoading(true);
    try {
      const result = await getAllCertificates({ page: p, limit: PER_PAGE, search: q || undefined, status: status !== "ALL" ? status : undefined });
      setData(result);
    } catch {
      /* handled by interceptor */
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData(page, debouncedSearch, statusFilter);
  }, [page, debouncedSearch, statusFilter, fetchData]);

  const handleSearch = (val: string) => {
    setSearch(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setDebouncedSearch(val);
      setPage(1);
    }, 400);
  };

  const handleFilter = (val: string) => {
    setStatusFilter(val);
    setPage(1);
  };

  const tabs = [
    { key: "ALL", label: "All" },
    { key: "PENDING", label: "Pending" },
    { key: "APPROVED", label: "Approved" },
    { key: "REJECTED", label: "Rejected" },
  ] as const;

  const start = (data.page - 1) * PER_PAGE + 1;
  const end = Math.min(data.page * PER_PAGE, data.total);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">All Certificates</h1>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
              <FileText className="h-5 w-5" />
              Certificates ({data.total})
            </CardTitle>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search name, enrollment, title..."
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
          <div className="flex gap-1 pt-2">
            {tabs.map((tab) => (
              <Button
                key={tab.key}
                variant={statusFilter === tab.key ? "default" : "outline"}
                size="sm"
                onClick={() => handleFilter(tab.key)}
              >
                {tab.label}
              </Button>
            ))}
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-muted-foreground">Loading...</p>
          ) : data.certificates.length === 0 ? (
            <p className="text-muted-foreground">No certificates found.</p>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>#</TableHead>
                    <TableHead>Student</TableHead>
                    <TableHead>Enrollment No</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Verified By</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.certificates.map((cert, i) => (
                    <TableRow key={cert._id}>
                      <TableCell>{start + i}</TableCell>
                      <TableCell className="font-medium">
                        {typeof cert.studentId === "object" ? cert.studentId.name : "—"}
                      </TableCell>
                      <TableCell>
                        {typeof cert.studentId === "object" ? cert.studentId.rollNo || "—" : "—"}
                      </TableCell>
                      <TableCell>{cert.title}</TableCell>
                      <TableCell>
                        {cert.subjectDate
                          ? new Date(cert.subjectDate).toLocaleDateString()
                          : "—"}
                      </TableCell>
                      <TableCell>
                        <Badge variant={statusVariant(cert.status)}>{cert.status}</Badge>
                      </TableCell>
                      <TableCell>
                        {cert.verifiedBy
                          ? typeof cert.verifiedBy === "object"
                            ? cert.verifiedBy.name
                            : "—"
                          : "—"}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelected(cert)}
                        >
                          <Eye className="mr-1 h-3 w-3" />
                          Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="flex items-center justify-between pt-4">
                <p className="text-sm text-muted-foreground">
                  Showing {start}–{end} of {data.total}
                </p>
                <div className="flex gap-1">
                  <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(page - 1)}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" disabled={page >= data.totalPages} onClick={() => setPage(page + 1)}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Certificate Details</DialogTitle>
          </DialogHeader>
          {selected && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-muted-foreground">Student</span>
                  <p className="font-medium">
                    {typeof selected.studentId === "object" ? selected.studentId.name : "—"}
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground">Name on Certificate</span>
                  <p className="font-medium">{selected.name}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Title</span>
                  <p className="font-medium">{selected.title}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Status</span>
                  <Badge variant={statusVariant(selected.status)}>{selected.status}</Badge>
                </div>
              </div>

              {selected.description && (
                <div className="text-sm">
                  <span className="text-muted-foreground">Description</span>
                  <p>{selected.description}</p>
                </div>
              )}

              {selected.remarks && (
                <div className="text-sm">
                  <span className="text-muted-foreground">Remarks</span>
                  <p>{selected.remarks}</p>
                </div>
              )}

              {selected.fileUrl && (
                <a
                  href={selected.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-primary hover:underline text-sm"
                >
                  <FileText className="h-4 w-4" />
                  View File
                </a>
              )}

              <Separator />

              <div className="space-y-3">
                <h4 className="flex items-center gap-2 text-sm font-semibold">
                  <History className="h-4 w-4" />
                  Status History
                </h4>
                {selected.statusHistory?.length > 0 ? (
                  <div className="space-y-2">
                    {selected.statusHistory.map((entry, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-3 rounded-lg border p-3 text-sm"
                      >
                        <Badge variant={statusVariant(entry.status)} className="mt-0.5 shrink-0">
                          {entry.status}
                        </Badge>
                        <div className="flex-1">
                          <p className="font-medium">
                            {typeof entry.changedBy === "object"
                              ? `${entry.changedBy.name} (${entry.changedBy.role})`
                              : "System"}
                          </p>
                          {entry.comment && <p className="text-muted-foreground">{entry.comment}</p>}
                          <p className="text-xs text-muted-foreground">
                            {new Date(entry.changedAt).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No history available</p>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
