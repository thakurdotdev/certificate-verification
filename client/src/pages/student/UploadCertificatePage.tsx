import { useState, useEffect } from "react";
import { toast } from "sonner";
import { uploadCertificate } from "@/api/certificates";
import { getSubjects } from "@/api/subjects";
import type { Subject } from "@/types";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Upload } from "lucide-react";

export default function UploadCertificatePage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [form, setForm] = useState({
    name: user?.name || "",
    title: "",
    description: "",
    subjectId: "",
    subjectDate: "",
  });

  useEffect(() => {
    getSubjects().then(setSubjects).catch(() => {});
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.title || !file) {
      toast.error("Name, title, and file are required");
      return;
    }
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("title", form.title);
      if (form.description) formData.append("description", form.description);
      if (form.subjectId) formData.append("subjectId", form.subjectId);
      if (form.subjectDate) formData.append("subjectDate", form.subjectDate);
      formData.append("file", file);

      await uploadCertificate(formData);
      toast.success("Certificate uploaded successfully");
      navigate("/certificates");
    } catch {
      /* handled by interceptor */
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Upload Certificate</h1>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Certificate Details</CardTitle>
          <CardDescription>
            Submit a certificate for faculty verification
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Your Name</Label>
              <Input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Full name as on certificate"
              />
            </div>

            <div className="space-y-2">
              <Label>Certificate Title</Label>
              <Input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="e.g. AWS Solutions Architect"
              />
            </div>

            <div className="space-y-2">
              <Label>Description (optional)</Label>
              <Textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Brief description of the certificate"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Subject (optional)</Label>
                <Select
                  value={form.subjectId}
                  onValueChange={(val) => setForm({ ...form, subjectId: val })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {subjects.map((sub) => (
                      <SelectItem key={sub._id} value={sub._id}>
                        {sub.name} ({sub.subjectCode})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Date</Label>
                <Input
                  type="date"
                  value={form.subjectDate}
                  onChange={(e) => setForm({ ...form, subjectDate: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Certificate File</Label>
              <Input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />
              <p className="text-xs text-muted-foreground">
                Accepted: PDF, JPG, PNG
              </p>
            </div>

            <Button type="submit" disabled={submitting} className="w-full">
              <Upload className="mr-2 h-4 w-4" />
              {submitting ? "Uploading..." : "Upload Certificate"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
