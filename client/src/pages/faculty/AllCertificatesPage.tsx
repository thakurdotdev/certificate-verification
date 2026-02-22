import { useState, useEffect } from "react";
import { getAllCertificates } from "@/api/certificates";
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
import { Separator } from "@/components/ui/separator";
import { FileText, Eye, History } from "lucide-react";

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

export default function AllCertificatesPage() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Certificate | null>(null);

  useEffect(() => {
    getAllCertificates()
      .then(setCertificates)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">All Certificates</h1>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <FileText className="h-5 w-5" />
            Certificate History ({certificates.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-muted-foreground">Loading...</p>
          ) : certificates.length === 0 ? (
            <p className="text-muted-foreground">No certificates submitted yet.</p>
          ) : (
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
                {certificates.map((cert, i) => (
                  <TableRow key={cert._id}>
                    <TableCell>{i + 1}</TableCell>
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
