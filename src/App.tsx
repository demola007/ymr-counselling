import { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/auth/AuthProvider";
import { RequireAuth } from "@/auth/RequireAuth";
import { FlameLoader } from "@/components/brand/FlameLoader";
import { PortalLayout } from "@/components/portal/PortalLayout";
import { EditionProvider } from "@/context/EditionContext";
import { ThemeProvider } from "@/context/ThemeContext";
import Home from "@/pages/public/Home";

const Counselling = lazy(() => import("@/pages/public/Counselling"));
const NewBeliever = lazy(() => import("@/pages/public/NewBeliever"));
const JoinTeam = lazy(() => import("@/pages/public/JoinTeam"));
const Login = lazy(() => import("@/pages/public/Login"));
const Signup = lazy(() => import("@/pages/public/Login").then((m) => ({ default: m.Signup })));
const NotFound = lazy(() => import("@/pages/public/NotFound"));
const PrintConvertCard = lazy(() => import("@/pages/public/PrintConvertCard"));

const Overview = lazy(() => import("@/pages/portal/Overview"));
const Capture = lazy(() => import("@/pages/portal/Capture"));
const Converts = lazy(() => import("@/pages/portal/Converts"));
const Counsellees = lazy(() => import("@/pages/portal/Counsellees"));
const Team = lazy(() => import("@/pages/portal/Team"));
const Analytics = lazy(() => import("@/pages/portal/Analytics"));
const Notifications = lazy(() => import("@/pages/portal/Notifications"));
const Exports = lazy(() => import("@/pages/portal/Exports"));
const Access = lazy(() => import("@/pages/portal/Admin").then((m) => ({ default: m.Access })));
const Editions = lazy(() => import("@/pages/portal/Admin").then((m) => ({ default: m.Editions })));
const ActivityLog = lazy(() => import("@/pages/portal/Admin").then((m) => ({ default: m.ActivityLog })));
const Profile = lazy(() => import("@/pages/portal/Admin").then((m) => ({ default: m.Profile })));

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 60_000, refetchOnWindowFocus: false, retry: 1 } },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider delayDuration={200}>
          <BrowserRouter>
            <AuthProvider>
              <EditionProvider>
                <Suspense fallback={<FlameLoader fullscreen />}>
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/counselling" element={<Counselling />} />
                    <Route path="/new-believer" element={<NewBeliever />} />
                    <Route path="/join" element={<JoinTeam />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/forms/convert" element={<PrintConvertCard />} />
                    {/* old links */}
                    <Route path="/new-convert" element={<NewBeliever />} />
                    <Route path="/add-counsellee" element={<Counselling />} />
                    <Route path="/counselor-registration" element={<JoinTeam />} />

                    <Route
                      path="/portal"
                      element={
                        <RequireAuth>
                          <PortalLayout />
                        </RequireAuth>
                      }
                    >
                      <Route index element={<Overview />} />
                      <Route path="capture" element={<RequireAuth permission="capture:use"><Capture /></RequireAuth>} />
                      <Route path="converts" element={<RequireAuth permission="converts:read"><Converts /></RequireAuth>} />
                      <Route path="counsellees" element={<RequireAuth permission="counsellees:read"><Counsellees /></RequireAuth>} />
                      <Route path="team" element={<RequireAuth permission="team:read"><Team /></RequireAuth>} />
                      <Route path="analytics" element={<RequireAuth permission="analytics:read"><Analytics /></RequireAuth>} />
                      <Route path="notifications" element={<RequireAuth permission="notifications:history"><Notifications /></RequireAuth>} />
                      <Route path="exports" element={<RequireAuth permission="exports:use"><Exports /></RequireAuth>} />
                      <Route path="activity" element={<RequireAuth permission="analytics:read"><ActivityLog /></RequireAuth>} />
                      <Route path="access" element={<RequireAuth permission="access:manage"><Access /></RequireAuth>} />
                      <Route path="editions" element={<RequireAuth permission="editions:manage"><Editions /></RequireAuth>} />
                      <Route path="profile" element={<Profile />} />
                    </Route>
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </Suspense>
                <Toaster position="top-right" richColors closeButton />
              </EditionProvider>
            </AuthProvider>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
