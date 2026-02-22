import { useState, useEffect } from "react";
import { toast } from "sonner";
import { getPendingCertificates, verifyCertificate } from "@/api/certificates";
import type { Certificate } from "@/types";
import { Button } from "@/components/ui/button";
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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ClipboardCheck, Check, X, Eye, FileText } from "lucide-react";

export default function PendingCertificatesPage() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Certificate | null>(null);
  const [remarks, setRemarks] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchData = async () => {
    try {
      const data = await getPendingCertificates();
      setCertificates(data);
    } catch {
      /* handled by interceptor */
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleVerify = async (status: "APPROVED" | "REJECTED") => {
    if (!selected) return;
    if (!remarks.trim()) {
      toast.error("Please add remarks");
      return;
    }
    setSubmitting(true);
    try {
      await verifyCertificate(selected._id, { status, remarks: remarks.trim() });
      toast.success(`Certificate ${status.toLowerCase()}`);
      setSelected(null);
      setRemarks("");
      fetchData();
    } catch {
      /* handled by interceptor */
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Pending Reviews</h1>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <ClipboardCheck className="h-5 w-5" />
            Pending Certificates ({certificates.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-muted-foreground">Loading...</p>
          ) : certificates.length === 0 ? (
            <p className="text-muted-foreground">No pending certificates to review.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>#</TableHead>
                  <TableHead>Student</TableHead>
                  <TableHead>Enrollment No</TableHead>
                  <TableHead>Certificate</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Subject Date</TableHead>
                  <TableHead>File</TableHead>
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
                    <TableCell>{cert.name}</TableCell>
                    <TableCell>{cert.title}</TableCell>
                    <TableCell>
                      {cert.subjectDate
                        ? new Date(cert.subjectDate).toLocaleDateString()
                        : "—"}
                    </TableCell>
                    <TableCell>
                      {cert.fileUrl && (
                        <a
                          href={cert.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-primary hover:underline"
                        >
                          <FileText className="h-3 w-3" />
                          View
                        </a>
                      )}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelected(cert);
                          setRemarks("");
                        }}
                      >
                        <Eye className="mr-1 h-3 w-3" />
                        Review
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Review Certificate</DialogTitle>
          </DialogHeader>
          {selected && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-muted-foreground">Student:</span>
                  <p className="font-medium">
                    {typeof selected.studentId === "object" ? selected.studentId.name : "—"}
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground">Certificate Name:</span>
                  <p className="font-medium">{selected.name}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Title:</span>
                  <p className="font-medium">{selected.title}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Status:</span>
                  <Badge variant="secondary">{selected.status}</Badge>
                </div>
              </div>
              {selected.description && (
                <div className="text-sm">
                  <span className="text-muted-foreground">Description:</span>
                  <p>{selected.description}</p>
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
                  View Uploaded File
                </a>
              )}
              <div className="space-y-2">
                <Label>Remarks</Label>
                <Textarea
                  placeholder="Add your review remarks..."
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => handleVerify("APPROVED")}
                  disabled={submitting}
                  className="flex-1"
                >
                  <Check className="mr-2 h-4 w-4" />
                  Approve
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleVerify("REJECTED")}
                  disabled={submitting}
                  className="flex-1"
                >
                  <X className="mr-2 h-4 w-4" />
                  Reject
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
