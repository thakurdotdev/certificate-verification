import { useState, useEffect, useRef } from "react";
import { getAllFaculty, createUser, updateUser } from "@/api/users";
import { getDepartments } from "@/api/departments";
import type { Department } from "@/types";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import PasswordInput from "@/components/PasswordInput";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UserPlus, GraduationCap, Pencil, Camera } from "lucide-react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type FacultyUser = any;

const emptyForm = {
  name: "",
  email: "",
  password: "",
  departmentId: "",
  phone: "",
  gender: "",
};

export default function ManageFacultyPage() {
  const [faculty, setFaculty] = useState<FacultyUser[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ ...emptyForm });
  const [editId, setEditId] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const fetchData = async () => {
    try {
      const [f, d] = await Promise.all([getAllFaculty(), getDepartments()]);
      setFaculty(f);
      setDepartments(d);
    } catch {
      /* handled by interceptor */
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const resetForm = () => {
    setForm({ ...emptyForm });
    setImageFile(null);
    setPreview(null);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleCreate = async () => {
    if (!form.name || !form.email || !form.password) {
      toast.error("Name, email, and password are required");
      return;
    }
    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append("name", form.name);
      fd.append("email", form.email);
      fd.append("password", form.password);
      fd.append("role", "FACULTY");
      if (form.departmentId) fd.append("departmentId", form.departmentId);
      if (form.phone) fd.append("phone", form.phone);
      if (form.gender) fd.append("gender", form.gender);
      if (imageFile) fd.append("profileImage", imageFile);
      await createUser(fd);
      toast.success("Faculty added successfully");
      resetForm();
      setCreateOpen(false);
      fetchData();
    } catch {
      /* handled by interceptor */
    } finally {
      setSubmitting(false);
    }
  };

  const openEdit = (f: FacultyUser) => {
    setEditId(f._id);
    setForm({
      name: f.name || "",
      email: f.email || "",
      password: "",
      departmentId: f.departmentId?._id || "",
      phone: f.phone || "",
      gender: f.gender || "",
    });
    setPreview(f.profileImage || null);
    setImageFile(null);
    setEditOpen(true);
  };

  const handleUpdate = async () => {
    if (!editId) return;
    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append("name", form.name);
      if (form.departmentId) fd.append("departmentId", form.departmentId);
      if (form.phone) fd.append("phone", form.phone);
      if (form.gender) fd.append("gender", form.gender);
      if (imageFile) fd.append("profileImage", imageFile);
      await updateUser(editId, fd);
      toast.success("Faculty updated successfully");
      resetForm();
      setEditOpen(false);
      setEditId(null);
      fetchData();
    } catch {
      /* handled by interceptor */
    } finally {
      setSubmitting(false);
    }
  };

  const formFields = (isEdit: boolean) => (
    <div className="space-y-4">
      <input ref={fileRef} type="file" accept="image/jpeg,image/png" className="hidden" onChange={handleImageChange} />
      <div className="flex justify-center">
        <div className="relative">
          <Avatar className="h-20 w-20">
            <AvatarImage src={preview || undefined} />
            <AvatarFallback>{form.name?.[0]?.toUpperCase() || "F"}</AvatarFallback>
          </Avatar>
          <Button type="button" variant="secondary" size="icon" className="absolute -bottom-1 -right-1 h-7 w-7 rounded-full" onClick={() => fileRef.current?.click()}>
            <Camera className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>Full Name *</Label>
          <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Dr. John Doe" />
        </div>
        <div className="space-y-2">
          <Label>Email *</Label>
          <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="faculty@university.edu" disabled={isEdit} />
        </div>
        {!isEdit && (
          <div className="space-y-2">
            <Label>Password *</Label>
            <PasswordInput value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Set password" />
          </div>
        )}
        <div className="space-y-2">
          <Label>Department</Label>
          <Select value={form.departmentId} onValueChange={(val) => setForm({ ...form, departmentId: val })}>
            <SelectTrigger><SelectValue placeholder="Assign department" /></SelectTrigger>
            <SelectContent>
              {departments.map((dept) => (
                <SelectItem key={dept._id} value={dept._id}>{dept.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Phone</Label>
          <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="9876543210" />
        </div>
        <div className="space-y-2">
          <Label>Gender</Label>
          <Select value={form.gender} onValueChange={(val) => setForm({ ...form, gender: val })}>
            <SelectTrigger><SelectValue placeholder="Select gender" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="MALE">Male</SelectItem>
              <SelectItem value="FEMALE">Female</SelectItem>
              <SelectItem value="OTHER">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Manage Faculty</h1>
        <Dialog open={createOpen} onOpenChange={(o) => { setCreateOpen(o); if (!o) resetForm(); }}>
          <DialogTrigger asChild>
            <Button><UserPlus className="mr-2 h-4 w-4" />Add Faculty</Button>
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] overflow-y-auto">
            <DialogHeader><DialogTitle>Add New Faculty</DialogTitle></DialogHeader>
            {formFields(false)}
            <DialogFooter>
              <Button onClick={handleCreate} disabled={submitting} className="w-full">
                {submitting ? "Adding..." : "Add Faculty"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Dialog open={editOpen} onOpenChange={(o) => { setEditOpen(o); if (!o) { resetForm(); setEditId(null); } }}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Edit Faculty</DialogTitle></DialogHeader>
          {formFields(true)}
          <DialogFooter>
            <Button onClick={handleUpdate} disabled={submitting} className="w-full">
              {submitting ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <GraduationCap className="h-5 w-5" />
            Faculty Members ({faculty.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-muted-foreground">Loading...</p>
          ) : faculty.length === 0 ? (
            <p className="text-muted-foreground">No faculty members yet.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>#</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Gender</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {faculty.map((f: FacultyUser, i: number) => (
                  <TableRow key={f._id}>
                    <TableCell>{i + 1}</TableCell>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-7 w-7">
                          <AvatarImage src={f.profileImage || undefined} />
                          <AvatarFallback className="text-xs">{f.name?.[0]}</AvatarFallback>
                        </Avatar>
                        {f.name}
                      </div>
                    </TableCell>
                    <TableCell>{f.email}</TableCell>
                    <TableCell>{f.departmentId?.name || "—"}</TableCell>
                    <TableCell>{f.phone || "—"}</TableCell>
                    <TableCell>{f.gender || "—"}</TableCell>
                    <TableCell>
                      <Badge variant={f.isActive ? "default" : "secondary"}>
                        {f.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" onClick={() => openEdit(f)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
