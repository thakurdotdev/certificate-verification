import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { updateMyProfile } from "@/api/users";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Camera, Save, Pencil, X } from "lucide-react";

const genderLabel: Record<string, string> = {
  MALE: "Male",
  FEMALE: "Female",
  OTHER: "Other",
};

export default function DashboardPage() {
  const { user, refreshProfile } = useAuth();
  const fileRef = useRef<HTMLInputElement>(null);
  const [editing, setEditing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    alternateEmail: "",
    gender: "",
    dob: "",
  });

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || "",
        phone: user.phone || "",
        alternateEmail: user.alternateEmail || "",
        gender: user.gender || "",
        dob: user.dob ? user.dob.split("T")[0] : "",
      });
    }
  }, [user]);

  const initials =
    user?.name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase() ?? "U";

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("name", form.name);
      if (form.phone) formData.append("phone", form.phone);
      if (form.alternateEmail) formData.append("alternateEmail", form.alternateEmail);
      if (form.gender) formData.append("gender", form.gender);
      if (user?.role === "STUDENT" && form.dob) formData.append("dob", form.dob);
      if (imageFile) formData.append("profileImage", imageFile);

      await updateMyProfile(formData);
      await refreshProfile();
      setImageFile(null);
      setPreview(null);
      setEditing(false);
      toast.success("Profile updated successfully");
    } catch {
      /* handled by interceptor */
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    setEditing(false);
    setImageFile(null);
    setPreview(null);
    if (user) {
      setForm({
        name: user.name || "",
        phone: user.phone || "",
        alternateEmail: user.alternateEmail || "",
        gender: user.gender || "",
        dob: user.dob ? user.dob.split("T")[0] : "",
      });
    }
  };

  const avatarSrc = preview || user?.profileImage || undefined;
  const isStudent = user?.role === "STUDENT";

  const infoRows: { label: string; value: string }[] = [
    { label: "Email", value: user?.email || "—" },
    { label: "Phone", value: user?.phone || "—" },
    { label: "Alternate Email", value: user?.alternateEmail || "—" },
    { label: "Gender", value: user?.gender ? genderLabel[user.gender] || user.gender : "—" },
    { label: "Date of Birth", value: user?.dob ? new Date(user.dob).toLocaleDateString() : "—" },
  ];

  if (isStudent) {
    infoRows.push(
      { label: "Enrollment No", value: user?.rollNo || "—" },
      { label: "GR No", value: user?.grNo || "—" },
      { label: "Semester", value: user?.semester ? `Semester ${user.semester}` : "—" },
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back, {user?.name}</p>
      </div>

      <Card className="max-w-2xl">
        <CardContent className="pt-6">
          {!editing ? (
            <div className="space-y-6">
              <div className="flex items-center gap-5">
                <Avatar className="h-20 w-20 shrink-0">
                  <AvatarImage src={avatarSrc} />
                  <AvatarFallback className="text-xl">{initials}</AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="text-xl font-semibold">{user?.name}</p>
                  <p className="text-sm text-muted-foreground">{user?.email}</p>
                  <Badge variant="secondary" className="mt-1.5">{user?.role}</Badge>
                </div>
                <Button variant="outline" size="sm" onClick={() => setEditing(true)}>
                  <Pencil className="mr-1.5 h-3.5 w-3.5" />
                  Edit
                </Button>
              </div>

              {infoRows.length > 0 && (
                <>
                  <Separator />
                  <div className="grid gap-3 sm:grid-cols-2">
                    {infoRows.map((row) => (
                      <div key={row.label}>
                        <p className="text-xs text-muted-foreground">{row.label}</p>
                        <p className="text-sm font-medium">{row.value}</p>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center gap-5">
                <div className="relative shrink-0">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={avatarSrc} />
                    <AvatarFallback className="text-xl">{initials}</AvatarFallback>
                  </Avatar>
                  <Button
                    type="button"
                    variant="secondary"
                    size="icon"
                    className="absolute -bottom-1 -right-1 h-7 w-7 rounded-full"
                    onClick={() => fileRef.current?.click()}
                  >
                    <Camera className="h-3.5 w-3.5" />
                  </Button>
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/jpeg,image/png,image/jpg"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </div>
                <div className="min-w-0">
                  <p className="text-xl font-semibold">{user?.name}</p>
                  <p className="text-sm text-muted-foreground">{user?.email}</p>
                </div>
              </div>

              <Separator />

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Full Name</Label>
                  <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Phone</Label>
                  <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="e.g. 9876543210" />
                </div>
                <div className="space-y-2">
                  <Label>Alternate Email</Label>
                  <Input type="email" value={form.alternateEmail} onChange={(e) => setForm({ ...form, alternateEmail: e.target.value })} placeholder="e.g. personal@gmail.com" />
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
                {isStudent && (
                  <div className="space-y-2 sm:col-span-2">
                    <Label>Date of Birth</Label>
                    <Input type="date" value={form.dob} onChange={(e) => setForm({ ...form, dob: e.target.value })} />
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={handleCancel}>
                  <X className="mr-1.5 h-3.5 w-3.5" />
                  Cancel
                </Button>
                <Button onClick={handleSave} disabled={submitting}>
                  <Save className="mr-1.5 h-3.5 w-3.5" />
                  {submitting ? "Saving..." : "Save"}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
