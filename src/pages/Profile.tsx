import { useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { ProfileCard } from "@/components/profile/ProfileCard";
import { EditProfileDialog } from "@/components/profile/EditProfileDialog";
import { ChangePasswordDialog } from "@/components/profile/ChangePasswordDialog";
import { useProfile } from "@/hooks/useProfile";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Key, AlertCircle, Shield } from "lucide-react";

const Profile = () => {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);

  const {
    profile,
    isLoading,
    error,
    updateProfile,
    isUpdating,
    changePassword,
    isChangingPassword,
  } = useProfile();

  const handleUpdateProfile = (data: any) => {
    updateProfile(data, {
      onSuccess: () => {
        setIsEditDialogOpen(false);
      },
    });
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen w-full flex bg-background">
        <DashboardSidebar />

        <main className="flex-1 overflow-auto">
          {/* Header */}
          <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur-sm">
            <div className="flex items-center gap-4 px-6 py-4">
              <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
              <div className="flex-1">
                <h1 className="text-xl font-semibold text-foreground">
                  My Profile
                </h1>
                <p className="text-sm text-muted-foreground">Manage your personal information</p>
              </div>
            </div>
          </header>

          {/* Main content */}
          <div className="p-6 max-w-5xl mx-auto">
            {isLoading ? (
              <ProfileSkeleton />
            ) : error ? (
              <Card className="bg-card border-destructive/30">
                <CardContent className="p-8 flex flex-col items-center justify-center text-center">
                  <div className="p-3 rounded-full bg-destructive/10 mb-4">
                    <AlertCircle className="h-8 w-8 text-destructive" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">Failed to Load Profile</h3>
                  <p className="text-muted-foreground mb-6 max-w-md">
                    We couldn't fetch your profile information. Please check your connection and try again.
                  </p>
                  <Button
                    onClick={() => window.location.reload()}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    Try Again
                  </Button>
                </CardContent>
              </Card>
            ) : profile ? (
              <div className="space-y-6 animate-fade-in">
                <ProfileCard profile={profile} onEdit={() => setIsEditDialogOpen(true)} />

                {/* Security Card */}
                <Card className="bg-card border-border">
                  <CardContent className="p-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="p-3 rounded-lg bg-accent/10">
                          <Shield className="h-5 w-5 text-accent" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-foreground">Account Security</h3>
                          <p className="text-sm text-muted-foreground">Keep your account protected with a strong password</p>
                        </div>
                      </div>
                      <Button
                        onClick={() => setIsPasswordDialogOpen(true)}
                        variant="outline"
                        className="border-border text-foreground hover:bg-muted gap-2"
                      >
                        <Key className="w-4 h-4" />
                        Change Password
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Dialogs */}
                <EditProfileDialog
                  open={isEditDialogOpen}
                  onOpenChange={setIsEditDialogOpen}
                  profile={profile}
                  onSubmit={handleUpdateProfile}
                  isLoading={isUpdating}
                />

                <ChangePasswordDialog
                  open={isPasswordDialogOpen}
                  onOpenChange={setIsPasswordDialogOpen}
                  onSubmit={changePassword}
                  isLoading={isChangingPassword}
                />
              </div>
            ) : null}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

const ProfileSkeleton = () => (
  <div className="space-y-6">
    {/* Header skeleton */}
    <Card className="bg-card border-border overflow-hidden">
      <div className="h-32 bg-muted" />
      <CardContent className="p-6">
        <div className="flex items-end gap-6 -mt-16">
          <Skeleton className="h-28 w-28 rounded-full bg-muted" />
          <div className="flex-1 space-y-3 pb-2">
            <Skeleton className="h-7 w-48 bg-muted" />
            <Skeleton className="h-4 w-32 bg-muted" />
            <div className="flex gap-2">
              <Skeleton className="h-6 w-20 rounded-full bg-muted" />
              <Skeleton className="h-6 w-24 rounded-full bg-muted" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>

    {/* Details skeleton */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {[...Array(4)].map((_, i) => (
        <Card key={i} className="bg-card border-border">
          <CardContent className="p-6 space-y-4">
            <Skeleton className="h-6 w-40 bg-muted" />
            <div className="space-y-3">
              <Skeleton className="h-12 w-full bg-muted" />
              <Skeleton className="h-12 w-full bg-muted" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
);

export default Profile;
