import { useState, useEffect } from "react";
import { getMyCertificates, deleteCertificate } from "@/api/certificates";
import type { Certificate } from "@/types";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FileText, Trash2, Eye, History } from "lucide-react";
import { Link } from "react-router-dom";

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

export default function MyCertificatesPage() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Certificate | null>(null);

  const fetchData = async () => {
    try {
      const data = await getMyCertificates();
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

  const handleDelete = async (id: string) => {
    try {
      await deleteCertificate(id);
      toast.success("Certificate deleted");
      fetchData();
    } catch {
      /* handled by interceptor */
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">My Certificates</h1>
        <Button asChild>
          <Link to="/certificates/upload">Upload New</Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <FileText className="h-5 w-5" />
            Certificates ({certificates.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-muted-foreground">Loading...</p>
          ) : certificates.length === 0 ? (
            <p className="text-muted-foreground">
              No certificates yet.{" "}
              <Link to="/certificates/upload" className="text-primary hover:underline">
                Upload one
              </Link>
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>#</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Verified By</TableHead>
                  <TableHead>File</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {certificates.map((cert, i) => (
                  <TableRow key={cert._id}>
                    <TableCell>{i + 1}</TableCell>
                    <TableCell className="font-medium">{cert.title}</TableCell>
                    <TableCell>
                      {cert.subjectDate
                        ? new Date(cert.subjectDate).toLocaleDateString()
                        : "—"}
                    </TableCell>
                    <TableCell>
                      <Badge variant={statusVariant(cert.status)}>
                        {cert.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {cert.verifiedBy
                        ? typeof cert.verifiedBy === "object"
                          ? cert.verifiedBy.name
                          : "—"
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
                      <div className="flex gap-1">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => setSelected(cert)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        {cert.status === "PENDING" && (
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Certificate</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure? This cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDelete(cert._id)}>
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        )}
                      </div>
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
                  <span className="text-muted-foreground">Title</span>
                  <p className="font-medium">{selected.title}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Status</span>
                  <Badge variant={statusVariant(selected.status)}>{selected.status}</Badge>
                </div>
              </div>

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
                  Verification History
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
                              : "You"}
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
