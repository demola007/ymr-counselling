import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Index from "./pages/Index";
import Upload from "./pages/Upload";
import DataView from "./pages/DataView";
import DetailView from "./pages/DetailView";
import Login from "./pages/Login";
import NewConvert from "./pages/NewConvert";
import NewConvertManual from "./pages/NewConvertManual";
import CounselorRegistration from "./pages/CounselorRegistration";
import Counsellors from "./pages/Counsellors";
import CounsellorDetail from "./pages/CounsellorDetail";
import Counsellee from "./pages/Counsellee";
import CounselleeDetail from "./pages/CounselleeDetail";
import AddCounsellor from "./pages/AddCounsellor";
import AddCounsellee from "./pages/AddCounsellee";
import ProtectedRoute from "./components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/new-convert" element={<NewConvert />} />
              <Route path="/counselor-registration" element={<CounselorRegistration />} />
              <Route path="/add-counsellee" element={<AddCounsellee />} />
              <Route path="/upload" element={
                <ProtectedRoute>
                  <Upload />
                </ProtectedRoute>
              } />
              <Route path="/counsellors" element={
                <ProtectedRoute allowedRoles={["admin", "super-admin"]}>
                  <Counsellors />
                </ProtectedRoute>
              } />
              <Route path="/counsellors/:id" element={
                <ProtectedRoute allowedRoles={["admin", "super-admin"]}>
                  <CounsellorDetail />
                </ProtectedRoute>
              } />
              <Route path="/add-counsellor" element={
                <ProtectedRoute allowedRoles={["admin", "super-admin"]}>
                  <AddCounsellor />
                </ProtectedRoute>
              } />
              <Route path="/counsellee" element={
                <ProtectedRoute allowedRoles={["admin", "super-admin"]}>
                  <Counsellee />
                </ProtectedRoute>
              } />
              <Route path="/counsellee/:id" element={
                <ProtectedRoute allowedRoles={["admin", "super-admin"]}>
                  <CounselleeDetail />
                </ProtectedRoute>
              } />
              <Route path="/data" element={
                <ProtectedRoute allowedRoles={["admin", "super-admin"]}>
                  <DataView />
                </ProtectedRoute>
              } />
              <Route path="/data/:id" element={
                <ProtectedRoute allowedRoles={["admin", "super-admin"]}>
                  <DetailView />
                </ProtectedRoute>
              } />
              <Route path="/new-convert-manual" element={
                <ProtectedRoute allowedRoles={["admin", "super-admin"]}>
                  <NewConvertManual />
                </ProtectedRoute>
              } />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;