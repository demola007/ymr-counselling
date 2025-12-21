import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Mail, Phone, MapPin, Calendar, Briefcase, GraduationCap, Church, CheckCircle2, XCircle } from "lucide-react";
import apiClient from "@/utils/apiClient";
import { useQuery } from "@tanstack/react-query";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const CounsellorDetail = () => {
  const { id } = useParams();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["counsellor", id],
    queryFn: async () => {
      const response = await apiClient.get(`counsellors/${id}/`);
      return response.data?.data;
    },
    retry: 1,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-purple-50/30">
        <div className="flex flex-col items-center gap-6">
          <div className="relative">
            <div className="h-16 w-16 rounded-full border-2 border-purple-200 border-t-purple-600 animate-spin" />
            <div className="absolute inset-0 h-16 w-16 rounded-full border-2 border-transparent border-b-purple-400 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
          </div>
          <p className="text-slate-500 font-light tracking-widest uppercase text-sm">Loading</p>
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-purple-50/30 px-6">
        <div className="text-center space-y-8 max-w-md">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-red-50 to-red-100 border border-red-200/50">
            <XCircle className="w-10 h-10 text-red-400" />
          </div>
          <div className="space-y-3">
            <h1 className="text-2xl font-light text-slate-800 tracking-tight">Counsellor Not Found</h1>
            <p className="text-slate-500 font-light leading-relaxed">The profile you're looking for doesn't exist or may have been removed.</p>
          </div>
          <Link 
            to="/counsellors" 
            className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Return to Counsellors
          </Link>
        </div>
      </div>
    );
  }

  const getInitials = (name: string) => {
    return name?.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) || "??";
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "—";
    try {
      // Handle both ISO and DD-MM-YYYY formats
      const date = dateStr.includes("T") 
        ? new Date(dateStr) 
        : new Date(dateStr.split("-").reverse().join("-"));
      return date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
    } catch {
      return dateStr;
    }
  };

  const displayName = data.name || `${data.first_name || ""} ${data.last_name || ""}`.trim() || "Counsellor";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50/30">
      {/* Subtle Header */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-white/70 border-b border-slate-100">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link 
            to="/counsellors" 
            className="group inline-flex items-center gap-3 text-slate-600 hover:text-slate-900 transition-colors"
          >
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 group-hover:bg-purple-100 transition-colors">
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            </span>
            <span className="text-sm font-medium hidden sm:block">Back</span>
          </Link>
          <img
            src="/lovable-uploads/7d495cc3-bdc8-42d6-ab11-263a4b0a731a.png"
            alt="YMR Logo"
            className="h-7 w-auto"
          />
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-6 py-12 md:py-16">
        
        {/* Profile Header */}
        <div className="text-center mb-16">
          <div className="relative inline-block mb-8">
            <div className="absolute -inset-3 bg-gradient-to-br from-purple-200/40 via-pink-100/30 to-blue-200/40 rounded-full blur-xl" />
            <Avatar className="relative w-32 h-32 ring-4 ring-white shadow-2xl shadow-purple-200/50">
              <AvatarImage src={data.profile_image_url} alt={displayName} className="object-cover" />
              <AvatarFallback className="text-3xl font-light bg-gradient-to-br from-purple-100 to-pink-50 text-purple-700">
                {getInitials(displayName)}
              </AvatarFallback>
            </Avatar>
            {/* Status Indicator */}
            <div className={`absolute bottom-2 right-2 w-5 h-5 rounded-full border-4 border-white shadow-md ${
              data.is_active ? "bg-emerald-400" : "bg-slate-300"
            }`} />
          </div>
          
          <h1 className="text-3xl md:text-4xl font-light text-slate-800 tracking-tight mb-3">
            {displayName}
          </h1>
          
          <div className="flex items-center justify-center gap-3 text-slate-500">
            {data.role && (
              <span className="capitalize font-medium text-purple-600">{data.role}</span>
            )}
            {data.role && data.denomination && <span className="w-1 h-1 rounded-full bg-slate-300" />}
            {data.denomination && (
              <span className="font-light">{data.denomination}</span>
            )}
          </div>

          {/* Quick Badges */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
            {data.is_available_for_training && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Available for Training
              </span>
            )}
            {data.will_attend_ymr && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-purple-50 text-purple-700 border border-purple-100">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Attending YMR
              </span>
            )}
            {data.has_certification && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                <GraduationCap className="w-3.5 h-3.5" />
                Certified
              </span>
            )}
          </div>
        </div>

        {/* Contact Card */}
        <div className="bg-white rounded-2xl shadow-sm shadow-slate-200/50 border border-slate-100 p-6 md:p-8 mb-8">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-6">Contact Information</h2>
          
          <div className="grid gap-6 sm:grid-cols-2">
            {data.email && (
              <a href={`mailto:${data.email}`} className="group flex items-center gap-4 p-4 -m-4 rounded-xl hover:bg-slate-50 transition-colors">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center text-purple-500 group-hover:scale-105 transition-transform">
                  <Mail className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">Email</p>
                  <p className="text-slate-700 font-medium truncate group-hover:text-purple-600 transition-colors">{data.email}</p>
                </div>
              </a>
            )}
            
            {data.phone_number && (
              <a href={`tel:${data.phone_number}`} className="group flex items-center gap-4 p-4 -m-4 rounded-xl hover:bg-slate-50 transition-colors">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center text-emerald-500 group-hover:scale-105 transition-transform">
                  <Phone className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">Phone</p>
                  <p className="text-slate-700 font-medium group-hover:text-emerald-600 transition-colors">{data.phone_number}</p>
                </div>
              </a>
            )}
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          
          {/* Personal Info */}
          <div className="bg-white rounded-2xl shadow-sm shadow-slate-200/50 border border-slate-100 p-6 md:p-8">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-6">Personal Details</h2>
            
            <div className="space-y-5">
              {data.gender && (
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 flex-shrink-0">
                    <span className="text-lg">👤</span>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-0.5">Gender</p>
                    <p className="text-slate-700 capitalize">{data.gender}</p>
                  </div>
                </div>
              )}
              
              {data.date_of_birth && (
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 flex-shrink-0">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-0.5">Date of Birth</p>
                    <p className="text-slate-700">{formatDate(data.date_of_birth)}</p>
                  </div>
                </div>
              )}

              {data.denomination && (
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 flex-shrink-0">
                    <Church className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-0.5">Denomination</p>
                    <p className="text-slate-700">{data.denomination}</p>
                  </div>
                </div>
              )}

              {data.years_of_experience !== undefined && (
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 flex-shrink-0">
                    <Briefcase className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-0.5">Experience</p>
                    <p className="text-slate-700">{data.years_of_experience} {data.years_of_experience === 1 ? 'year' : 'years'}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Location */}
          <div className="bg-white rounded-2xl shadow-sm shadow-slate-200/50 border border-slate-100 p-6 md:p-8">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-6">Location</h2>
            
            <div className="space-y-5">
              {(data.country || data.state) && (
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center text-blue-500 flex-shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-0.5">Region</p>
                    <p className="text-slate-700">{[data.state, data.country].filter(Boolean).join(", ")}</p>
                  </div>
                </div>
              )}

              {data.address && (
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 flex-shrink-0">
                    <span className="text-lg">🏠</span>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-0.5">Address</p>
                    <p className="text-slate-700">{data.address}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Timestamp Footer */}
        {data.created_at && (
          <div className="mt-12 pt-8 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-400 font-light">
              Member since {formatDate(data.created_at)}
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default CounsellorDetail;
