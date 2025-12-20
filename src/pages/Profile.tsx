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
import { Key, AlertCircle } from "lucide-react";

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

  return (
    <SidebarProvider>
      <div className="min-h-screen w-full flex bg-gradient-to-br from-[#0F0A1F] via-[#1A1F2C] to-[#0F0A1F]">
        <DashboardSidebar />

        <main className="flex-1 overflow-auto">
          {/* Header */}
          <header className="sticky top-0 z-40 border-b border-white/10 bg-[#1A1F2C]/80 backdrop-blur-xl">
            <div className="flex items-center gap-4 px-6 py-4">
              <SidebarTrigger className="text-gray-400 hover:text-white" />
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-white via-purple-200 to-white bg-clip-text text-transparent">
                  My Profile
                </h1>
                <p className="text-sm text-gray-400">View and manage your profile</p>
              </div>
            </div>
          </header>

          {/* Animated background elements */}
          <div className="fixed inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
          </div>

          {/* Main content */}
          <div className="p-6 space-y-6 relative z-10">
            {isLoading ? (
              <Card className="bg-gradient-to-br from-[#1A1F2C]/95 to-[#2D1B4E]/95 border border-white/10">
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center gap-4">
                    <Skeleton className="h-24 w-24 rounded-full bg-white/10" />
                    <div className="space-y-2">
                      <Skeleton className="h-6 w-48 bg-white/10" />
                      <Skeleton className="h-4 w-32 bg-white/10" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[...Array(6)].map((_, i) => (
                      <Skeleton key={i} className="h-16 bg-white/10 rounded-lg" />
                    ))}
                  </div>
                </CardContent>
              </Card>
            ) : error ? (
              <Card className="bg-gradient-to-br from-[#1A1F2C]/95 to-[#2D1B4E]/95 border border-red-500/30">
                <CardContent className="p-6 flex flex-col items-center justify-center text-center">
                  <AlertCircle className="h-12 w-12 text-red-400 mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">Failed to Load Profile</h3>
                  <p className="text-gray-400 mb-4">Unable to fetch your profile information. Please try again.</p>
                  <Button
                    onClick={() => window.location.reload()}
                    className="bg-gradient-to-r from-purple-500 to-pink-500"
                  >
                    Retry
                  </Button>
                </CardContent>
              </Card>
            ) : profile ? (
              <>
                <ProfileCard profile={profile} onEdit={() => setIsEditDialogOpen(true)} />

                {/* Change Password Card */}
                <Card className="bg-gradient-to-br from-[#1A1F2C]/95 to-[#2D1B4E]/95 border border-white/10 backdrop-blur-xl">
                  <CardContent className="p-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-amber-500/20">
                          <Key className="h-6 w-6 text-amber-400" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-white">Security</h3>
                          <p className="text-sm text-gray-400">Update your password to keep your account secure</p>
                        </div>
                      </div>
                      <Button
                        onClick={() => setIsPasswordDialogOpen(true)}
                        variant="outline"
                        className="border-white/20 text-white hover:bg-white/10"
                      >
                        <Key className="w-4 h-4 mr-2" />
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
                  onSubmit={updateProfile}
                  isLoading={isUpdating}
                />

                <ChangePasswordDialog
                  open={isPasswordDialogOpen}
                  onOpenChange={setIsPasswordDialogOpen}
                  onSubmit={changePassword}
                  isLoading={isChangingPassword}
                />
              </>
            ) : null}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Profile;
