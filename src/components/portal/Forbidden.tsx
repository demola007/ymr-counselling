import { Link } from "react-router-dom";
import { Lock } from "lucide-react";
import { useAuth } from "@/auth/AuthProvider";
import { ROLE_LABEL } from "@/auth/permissions";
import { Button } from "@/components/ui/button";

export function Forbidden() {
  const { user } = useAuth();
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
        <Lock className="h-7 w-7" />
      </span>
      <h1 className="mt-6 font-display text-2xl font-bold">This area is restricted</h1>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">
        Your role ({user ? ROLE_LABEL[user.role] : "guest"}) doesn't include access to this page. Ask a super admin if you need it.
      </p>
      <Button asChild className="mt-6">
        <Link to="/portal">Back to overview</Link>
      </Button>
    </div>
  );
}
