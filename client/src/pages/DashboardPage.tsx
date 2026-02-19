import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {user?.name}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Your Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Name:</span>
            <span className="text-sm font-medium">{user?.name}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Email:</span>
            <span className="text-sm font-medium">{user?.email}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Role:</span>
            <Badge variant="secondary">{user?.role}</Badge>
          </div>
          {user?.studentId && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Student ID:</span>
              <span className="text-sm font-medium">{user.studentId}</span>
            </div>
          )}
          {user?.department && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Department:</span>
              <span className="text-sm font-medium">{user.department}</span>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
