import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  LayoutDashboard,
  Upload,
  FileText,
  ClipboardCheck,
  Users,
  BookOpen,
  Building2,
  LogOut,
  FileStack,
  GraduationCap,
} from "lucide-react";

const navItems = {
  STUDENT: [
    { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/certificates/upload", label: "Upload", icon: Upload },
    { to: "/certificates", label: "My Certificates", icon: FileText },
  ],
  FACULTY: [
    { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/certificates/pending", label: "Pending Reviews", icon: ClipboardCheck },
    { to: "/certificates/all", label: "All Certificates", icon: FileStack },
    { to: "/students", label: "Manage Students", icon: Users },
    { to: "/faculty", label: "Manage Faculty", icon: GraduationCap },
    { to: "/departments", label: "Departments", icon: Building2 },
    { to: "/subjects", label: "Subjects", icon: BookOpen },
  ],
};

export default function AppLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const items = navItems[user?.role ?? "STUDENT"];
  const initials = user?.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase() ?? "U";

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <aside className="flex w-64 flex-col border-r bg-card">
        <div className="flex h-14 items-center gap-2 px-4 font-semibold">
          <FileText className="h-5 w-5 text-primary" />
          <span className="text-lg">CertVerify</span>
        </div>

        <Separator />

        <nav className="flex-1 space-y-1 p-3">
          {items.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/dashboard"}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`
              }
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <Separator />

        <div className="flex items-center gap-3 p-4">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user?.profileImage || undefined} />
            <AvatarFallback className="text-xs">{initials}</AvatarFallback>
          </Avatar>
          <div className="flex-1 overflow-hidden">
            <p className="truncate text-sm font-medium">{user?.name}</p>
            <p className="truncate text-xs text-muted-foreground">
              {user?.role}
            </p>
          </div>
          <Button variant="ghost" size="icon" onClick={handleLogout}>
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
