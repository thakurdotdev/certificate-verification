import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { getAllStudents, createUser, updateUser } from "@/api/users";
import { getDepartments } from "@/api/departments";
import type { Department } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Label } from "@/components/ui/label";
import { Plus, Users, Pencil, Camera } from "lucide-react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type StudentUser = any;

const emptyForm = {
  name: "",
  email: "",
  rollNo: "",
  departmentId: "",
  semester: "",
  grNo: "",
  phone: "",
  gender: "",
  dob: "",
};

export default function ManageStudentsPage() {
  const [students, setStudents] = useState<StudentUser[]>([]);
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
      const [studentsData, deptsData] = await Promise.all([
        getAllStudents(),
        getDepartments(),
      ]);
      setStudents(studentsData);
      setDepartments(deptsData);
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

  const buildFormData = () => {
    const fd = new FormData();
    fd.append("name", form.name);
    fd.append("email", form.email);
    if (form.rollNo) fd.append("rollNo", form.rollNo);
    if (form.departmentId) fd.append("departmentId", form.departmentId);
    if (form.semester) fd.append("semester", form.semester);
    if (form.grNo) fd.append("grNo", form.grNo);
    if (form.phone) fd.append("phone", form.phone);
    if (form.gender) fd.append("gender", form.gender);
    if (form.dob) fd.append("dob", form.dob);
    if (imageFile) fd.append("profileImage", imageFile);
    return fd;
  };

  const handleCreate = async () => {
    if (!form.name || !form.email || !form.rollNo || !form.departmentId) {
      toast.error("Name, email, enrollment no, and department are required");
      return;
    }
    setSubmitting(true);
    try {
      const fd = buildFormData();
      fd.append("role", "STUDENT");
      await createUser(fd);
      toast.success("Student added successfully");
      resetForm();
      setCreateOpen(false);
      fetchData();
    } catch {
      /* handled by interceptor */
    } finally {
      setSubmitting(false);
    }
  };

  const openEdit = (s: StudentUser) => {
    setEditId(s._id);
    setForm({
      name: s.name || "",
      email: s.email || "",
      rollNo: s.rollNo || "",
      departmentId: s.departmentId?._id || "",
      semester: s.semester?.toString() || "",
      grNo: s.grNo || "",
      phone: s.phone || "",
      gender: s.gender || "",
      dob: s.dob ? s.dob.split("T")[0] : "",
    });
    setPreview(s.profileImage || null);
    setImageFile(null);
    setEditOpen(true);
  };

  const handleUpdate = async () => {
    if (!editId) return;
    setSubmitting(true);
    try {
      const fd = buildFormData();
      await updateUser(editId, fd);
      toast.success("Student updated successfully");
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

  const studentFormFields = (
    <div className="space-y-4">
      <input ref={fileRef} type="file" accept="image/jpeg,image/png" className="hidden" onChange={handleImageChange} />
      <div className="flex justify-center">
        <div className="relative">
          <Avatar className="h-20 w-20">
            <AvatarImage src={preview || undefined} />
            <AvatarFallback>{form.name?.[0]?.toUpperCase() || "S"}</AvatarFallback>
          </Avatar>
          <Button type="button" variant="secondary" size="icon" className="absolute -bottom-1 -right-1 h-7 w-7 rounded-full" onClick={() => fileRef.current?.click()}>
            <Camera className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>Full Name *</Label>
          <Input placeholder="John Doe" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </div>
        <div className="space-y-2">
          <Label>Email *</Label>
          <Input type="email" placeholder="john@student.edu" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} disabled={!!editId} />
        </div>
        <div className="space-y-2">
          <Label>Enrollment Number *</Label>
          <Input placeholder="21CS001" value={form.rollNo} onChange={(e) => setForm({ ...form, rollNo: e.target.value })} />
        </div>
        <div className="space-y-2">
          <Label>Department *</Label>
          <Select value={form.departmentId} onValueChange={(val) => setForm({ ...form, departmentId: val })}>
            <SelectTrigger><SelectValue placeholder="Select department" /></SelectTrigger>
            <SelectContent>
              {departments.map((dept) => (
                <SelectItem key={dept._id} value={dept._id}>{dept.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Semester</Label>
          <Select value={form.semester} onValueChange={(val) => setForm({ ...form, semester: val })}>
            <SelectTrigger><SelectValue placeholder="Select semester" /></SelectTrigger>
            <SelectContent>
              {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                <SelectItem key={s} value={s.toString()}>Semester {s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>GR No</Label>
          <Input placeholder="GR12345" value={form.grNo} onChange={(e) => setForm({ ...form, grNo: e.target.value })} />
        </div>
        <div className="space-y-2">
          <Label>Phone</Label>
          <Input placeholder="9876543210" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
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
        <div className="space-y-2 sm:col-span-2">
          <Label>Date of Birth</Label>
          <Input type="date" value={form.dob} onChange={(e) => setForm({ ...form, dob: e.target.value })} />
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Manage Students</h1>
        <Dialog open={createOpen} onOpenChange={(o) => { setCreateOpen(o); if (!o) resetForm(); }}>
          <DialogTrigger asChild>
            <Button><Plus className="mr-2 h-4 w-4" />Add Student</Button>
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] overflow-y-auto">
            <DialogHeader><DialogTitle>Add Student</DialogTitle></DialogHeader>
            {studentFormFields}
            <DialogFooter>
              <Button onClick={handleCreate} disabled={submitting} className="w-full">
                {submitting ? "Adding..." : "Add Student"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Dialog open={editOpen} onOpenChange={(o) => { setEditOpen(o); if (!o) { resetForm(); setEditId(null); } }}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Edit Student</DialogTitle></DialogHeader>
          {studentFormFields}
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
            <Users className="h-5 w-5" />
            All Students ({students.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-muted-foreground">Loading...</p>
          ) : students.length === 0 ? (
            <p className="text-muted-foreground">No students yet.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>#</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Enrollment No</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Semester</TableHead>
                  <TableHead>GR No</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Gender</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.map((s: StudentUser, i: number) => (
                  <TableRow key={s._id}>
                    <TableCell>{i + 1}</TableCell>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-7 w-7">
                          <AvatarImage src={s.profileImage || undefined} />
                          <AvatarFallback className="text-xs">{s.name?.[0]}</AvatarFallback>
                        </Avatar>
                        {s.name}
                      </div>
                    </TableCell>
                    <TableCell>{s.email}</TableCell>
                    <TableCell>{s.rollNo || "—"}</TableCell>
                    <TableCell>{s.departmentId?.name || "—"}</TableCell>
                    <TableCell>{s.semester || "—"}</TableCell>
                    <TableCell>{s.grNo || "—"}</TableCell>
                    <TableCell>{s.phone || "—"}</TableCell>
                    <TableCell>{s.gender || "—"}</TableCell>
                    <TableCell>
                      <Badge variant={s.isActive ? "default" : "secondary"}>
                        {s.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" onClick={() => openEdit(s)}>
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
