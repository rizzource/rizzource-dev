import { useState, useEffect, Suspense } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Search,
  MapPin,
  Briefcase,
  Clock,
  Users,
  ArrowRight,
  Filter,
  Sparkles,
  TrendingUp,
  LayoutGrid,
  List,
  FileText,
  Zap,
} from "lucide-react";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ResumeEditor from "@/components/resume/ResumeEditor";

import { useDispatch, useSelector } from "react-redux";
import {
  getScrappedJobs,
  getFavoriteJobs,
  setSelectedJob,
} from "@/redux/slices/userApiSlice";

import { toast, Toaster } from "sonner";
import { track } from "@/lib/analytics";
import { usePostHog } from "posthog-js/react";
import JobListView from "./JobListView";

export default function JobPortal() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const posthog = usePostHog();

  // Redux state
  const { scrappedJobs, loading, favoriteJobs, tempResume } = useSelector(
    (state) => state.userApi
  );

  // UI state
  const [scrollY, setScrollY] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFirm, setSelectedFirm] = useState("All");
  const [selectedLocation, setSelectedLocation] = useState("All");
  const [selectedType, setSelectedType] = useState("All");
  const [viewMode, setViewMode] = useState("grid");
  const [animatedCards, setAnimatedCards] = useState({});
  const [showResumeUpload, setShowResumeUpload] = useState(false);

  // ------------------------------------------------------------
  // FETCH JOBS
  // ------------------------------------------------------------
  useEffect(() => {
    const isFavorites = window.location.href.includes("favoritejobs");

    if (isFavorites) {
      dispatch(getFavoriteJobs());
      track("FavoritesViewed");
      posthog?.capture("favorites_page_viewed");
    } else {
      dispatch(getScrappedJobs());
      track("JobPortalViewed");
      posthog?.capture("$pageview");
    }
  }, [dispatch, posthog]);

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Card animation on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setAnimatedCards((prev) => ({
              ...prev,
              [entry.target.id]: true,
            }));
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll("[data-card]").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // ------------------------------------------------------------
  // FILTER HELPERS (FROM ORIGINAL COMPONENT)
  // ------------------------------------------------------------
  const extractState = (location = "") => {
    if (!location) return null;
    const loc = location.toLowerCase();

    const cityToState = {
      atlanta: "Georgia",
      boston: "Massachusetts",
      chicago: "Illinois",
      "new york": "New York",
      "los angeles": "California",
      "san francisco": "California",
      washington: "District of Columbia",
    };

    for (const city in cityToState) {
      if (loc.includes(city)) return cityToState[city];
    }

    const abbrMap = {
      GA: "Georgia",
      NY: "New York",
      CA: "California",
      DC: "District of Columbia",
      MA: "Massachusetts",
      IL: "Illinois",
    };

    const match = location.match(/,\s*([A-Z]{2})$/);
    if (match) return abbrMap[match[1]] || null;

    return null;
  };

  const isBadJob = (job) =>
    !job ||
    !job.firmName ||
    !job.jobTitle ||
    job.jobTitle.toLowerCase().includes("no 1l");

  const jobsSource = window.location.href.includes("favoritejobs")
    ? favoriteJobs
    : scrappedJobs;

  const cleanJobs = (jobsSource || []).filter((j) => !isBadJob(j));

  // Auto-apply Georgia filter on load
  useEffect(() => {
    if (cleanJobs.length && selectedLocation === "All") {
      setSelectedLocation("Georgia");
      track("AutoStateFilterApplied", { state: "Georgia" });
    }
  }, [cleanJobs.length]);

  // Extract unique states and firms for filters
  const statesList = Array.from(
    new Set(cleanJobs.map((j) => extractState(j.location)).filter(Boolean))
  ).sort();

  const firmsList = Array.from(
    new Set(cleanJobs.map((j) => j.firmName).filter(Boolean))
  ).sort();

  const areasList = Array.from(
    new Set(
      cleanJobs.flatMap((j) =>
        j.areaOfLaw ? j.areaOfLaw.split(/,|\//).map((a) => a.trim()) : []
      )
    )
  ).sort();

  // ------------------------------------------------------------
  // FILTER LOGIC
  // ------------------------------------------------------------
  const filteredJobs = cleanJobs.filter((job) => {
    const matchesSearch =
      !searchTerm ||
      job.jobTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.firmName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.jobDescription?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFirm =
      selectedFirm === "All" || job.firmName === selectedFirm;

    const matchesLocation =
      selectedLocation === "All" || extractState(job.location) === selectedLocation;

    const matchesType =
      selectedType === "All" || job.areaOfLaw?.toLowerCase().includes(selectedType.toLowerCase());

    return matchesSearch && matchesFirm && matchesLocation && matchesType;
  });

  const heroOpacity = Math.max(0, 1 - scrollY / 400);

  // ------------------------------------------------------------
  // DEADLINE HELPERS
  // ------------------------------------------------------------
  const isDeadlineUrgent = (date) => {
    if (!date) return false;
    const diff = new Date(date) - new Date();
    return diff > 0 && diff <= 7 * 24 * 60 * 60 * 1000;
  };

  const formatDeadline = (date) => {
    if (!date) return "Rolling";
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const getDeadlineColor = (deadline) => {
    return isDeadlineUrgent(deadline) ? "text-warm-pop" : "text-charcoal";
  };

  const getDeadlineText = (deadline) => {
    if (!deadline) return "Rolling";
    const daysUntil = Math.ceil((new Date(deadline) - new Date()) / (1000 * 60 * 60 * 24));
    return daysUntil < 7 ? `${daysUntil} days` : formatDeadline(deadline);
  };

  // ------------------------------------------------------------
  // ROUTING HANDLERS
  // ------------------------------------------------------------
  const handleJobClick = (job) => {
    dispatch(setSelectedJob(job));
    track("JobViewed", { jobId: job.id });
    posthog?.capture("job_card_clicked", {
      job_id: job.id,
      firm: job.firmName,
      view_mode: viewMode,
    });
    navigate(`/jobs/${job.id}`);
  };

  const handleOpenCoverLetter = (job, e) => {
    e?.stopPropagation();
    dispatch(setSelectedJob(null));
    track("AICoverLetterOpened", { jobId: job.id });
    posthog?.capture("ai_cover_letter_opened", {
      job_id: job.id,
      firm: job.firmName,
    });
    navigate("/cover-letter/generator", {
      state: {
        jobId: job.id,
        title: job.jobTitle,
        jobCompany: job.firmName,
        description: job.jobDescription,
      },
    });
  };

  const handleOpenResume = (job, e) => {
    e?.stopPropagation();
    if (!tempResume?.text) {
      toast.error("Please upload your resume first");
      setShowResumeUpload(true);
      return;
    }
    track("AIResumeOpened", { jobId: job.id });
    posthog?.capture("ai_resume_opened", {
      job_id: job.id,
      firm: job.firmName,
    });
    navigate("/resume/editor", {
      state: {
        extractedText: tempResume.text,
        jobId: job.id,
      },
    });
  };

  // ------------------------------------------------------------
  // RESUME UPLOAD FLOW
  // ------------------------------------------------------------
  if (showResumeUpload) {
    return (
      <>
        <Header />
        <ResumeEditor onBack={() => setShowResumeUpload(false)} />
        <Footer />
      </>
    );
  }

  return (
    <>
      <Toaster richColors closeButton position="top-center" />
      <Header />

      <div className="min-h-screen bg-warm-cream text-charcoal">
        <section
          className="relative pt-20 sm:pt-24 md:pt-32 pb-12 sm:pb-16 md:pb-20 px-4 sm:px-6 overflow-hidden"
          style={{ opacity: heroOpacity, transform: `translateY(${scrollY * 0.3}px)` }}
        >
          {/* Background Gradient with animated blobs */}
          <div className="absolute inset-0 pointer-events-none opacity-30">
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-electric-teal/20 rounded-full blur-[150px] animate-blob-float" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-ai-violet/20 rounded-full blur-[120px] animate-blob-rotate" />
          </div>

          <div className="container mx-auto relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <Badge className="bg-ai-violet/10 text-ai-violet border-ai-violet/20 font-black uppercase tracking-[0.2em] px-4 sm:px-6 py-1.5 sm:py-2 mb-4 sm:mb-8 text-[9px] sm:text-[10px] animate-scale-in">
                <TrendingUp className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-1.5 sm:mr-2" />
                {filteredJobs.length} Live Opportunities
              </Badge>

              <h1 className="text-4xl sm:text-6xl md:text-8xl font-black uppercase tracking-tighter leading-[0.9] mb-4 sm:mb-6 animate-in fade-in slide-in-from-bottom-8 duration-1000">
                Land Your
                <br />
                <span className="text-electric-teal animate-pulse-glow inline-block">BigLaw Offer</span>
              </h1>

              <p className="text-base sm:text-xl md:text-2xl text-warm-gray font-bold uppercase tracking-wider mb-8 sm:mb-12 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-100">
                Vault 10 Firms. Real Positions. Your Future.
              </p>

              {/* Search Bar */}
              <div className="relative max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-16 duration-1000 delay-200">
                <Search className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 w-5 h-5 sm:w-6 sm:h-6 text-warm-gray animate-pulse" />
                <Input
                  type="text"
                  placeholder="Search firms, positions..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    track("JobSearchPerformed", { query: e.target.value });
                  }}
                  className="h-12 sm:h-14 md:h-16 pl-12 sm:pl-16 pr-4 sm:pr-6 text-sm sm:text-base md:text-lg font-medium bg-surface border-2 border-charcoal/10 rounded-2xl sm:rounded-[2rem] focus:border-electric-teal focus:ring-0 placeholder:text-warm-gray/50 transition-all hover:border-electric-teal/50"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Filters Section */}
        <section className="sticky top-16 sm:top-20 z-40 bg-warm-cream/95 backdrop-blur-xl border-y border-charcoal/5 py-4 sm:py-6 px-4 sm:px-6 overflow-x-auto">
          <div className="container mx-auto">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
              <div className="flex items-center gap-2">
                <Filter className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-warm-gray" />
                <span className="text-[9px] sm:text-xs font-black uppercase tracking-widest text-warm-gray">Filters</span>
              </div>

              {/* View Toggle Buttons */}
              <div className="flex items-center gap-2 ml-auto sm:ml-0">
                <Button
                  size="sm"
                  variant={viewMode === "grid" ? "default" : "outline"}
                  onClick={() => {
                    setViewMode("grid");
                    track("ViewModeChanged", { mode: "grid" });
                  }}
                  className={`rounded-lg font-bold uppercase tracking-widest text-[10px] sm:text-[11px] p-1.5 sm:p-2 ${viewMode === "grid"
                    ? "bg-electric-teal hover:bg-deep-teal text-white"
                    : "border-charcoal/20 hover:border-electric-teal hover:text-electric-teal"
                    }`}
                  title="Grid View"
                >
                  <LayoutGrid className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </Button>
                <Button
                  size="sm"
                  variant={viewMode === "list" ? "default" : "outline"}
                  onClick={() => {
                    setViewMode("list");
                    track("ViewModeChanged", { mode: "list" });
                  }}
                  className={`rounded-lg font-bold uppercase tracking-widest text-[10px] sm:text-[11px] p-1.5 sm:p-2 ${viewMode === "list"
                    ? "bg-electric-teal hover:bg-deep-teal text-white"
                    : "border-charcoal/20 hover:border-electric-teal hover:text-electric-teal"
                    }`}
                  title="List View"
                >
                  <List className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </Button>
              </div>
            </div>

            {/* Firm and Location Filters */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 overflow-x-auto pb-2">
              {/* Firm Filter */}
              <div className="flex flex-wrap gap-2 whitespace-nowrap">
                <Button
                  size="sm"
                  variant={selectedFirm === "All" ? "default" : "outline"}
                  onClick={() => {
                    setSelectedFirm("All");
                    track("FirmFilterChanged", { firm: "All" });
                  }}
                  className={`rounded-full font-bold uppercase tracking-wider text-[9px] sm:text-[10px] px-2 sm:px-3 py-1 sm:py-1.5 ${selectedFirm === "All"
                    ? "bg-electric-teal hover:bg-deep-teal text-white"
                    : "border-charcoal/20 hover:border-electric-teal hover:text-electric-teal"
                    }`}
                >
                  All
                </Button>
                {firmsList.slice(0, 10).map((firm) => (
                  <Button
                    key={firm}
                    size="sm"
                    variant={selectedFirm === firm ? "default" : "outline"}
                    onClick={() => {
                      setSelectedFirm(firm);
                      track("FirmFilterChanged", { firm });
                    }}
                    className={`rounded-full font-bold uppercase tracking-wider text-[9px] sm:text-[10px] px-2 sm:px-3 py-1 sm:py-1.5 ${selectedFirm === firm
                      ? "bg-electric-teal hover:bg-deep-teal text-white"
                      : "border-charcoal/20 hover:border-electric-teal hover:text-electric-teal"
                      }`}
                  >
                    {firm}
                  </Button>
                ))}
              </div>

              {/* Location Filter */}
              <div className="flex flex-wrap gap-2 whitespace-nowrap">
                <Button
                  size="sm"
                  variant={selectedLocation === "All" ? "default" : "outline"}
                  onClick={() => {
                    setSelectedLocation("All");
                    track("LocationFilterChanged", { location: "All" });
                  }}
                  className={`rounded-full font-bold uppercase tracking-wider text-[9px] sm:text-[10px] px-2 sm:px-3 py-1 sm:py-1.5 ${selectedLocation === "All"
                    ? "bg-electric-teal hover:bg-deep-teal text-white"
                    : "border-charcoal/20 hover:border-electric-teal hover:text-electric-teal"
                    }`}
                >
                  All
                </Button>
                {statesList.map((state) => (
                  <Button
                    key={state}
                    size="sm"
                    variant={selectedLocation === state ? "default" : "outline"}
                    onClick={() => {
                      setSelectedLocation(state);
                      track("LocationFilterChanged", { location: state });
                    }}
                    className={`rounded-full font-bold uppercase tracking-wider text-[9px] sm:text-[10px] px-2 sm:px-3 py-1 sm:py-1.5 ${selectedLocation === state
                      ? "bg-electric-teal hover:bg-deep-teal text-white"
                      : "border-charcoal/20 hover:border-electric-teal hover:text-electric-teal"
                      }`}
                  >
                    {state}
                  </Button>
                ))}
              </div>

              {/* Area of Law Filter */}
              {areasList.length > 0 && (
                <div className="flex flex-wrap gap-2 whitespace-nowrap">
                  <Button
                    size="sm"
                    variant={selectedType === "All" ? "default" : "outline"}
                    onClick={() => {
                      setSelectedType("All");
                      track("AreaFilterChanged", { area: "All" });
                    }}
                    className={`rounded-full font-bold uppercase tracking-wider text-[9px] sm:text-[10px] px-2 sm:px-3 py-1 sm:py-1.5 ${selectedType === "All"
                      ? "bg-electric-teal hover:bg-deep-teal text-white"
                      : "border-charcoal/20 hover:border-electric-teal hover:text-electric-teal"
                      }`}
                  >
                    All Areas
                  </Button>
                  {areasList.slice(0, 8).map((area) => (
                    <Button
                      key={area}
                      size="sm"
                      variant={selectedType === area ? "default" : "outline"}
                      onClick={() => {
                        setSelectedType(area);
                        track("AreaFilterChanged", { area });
                      }}
                      className={`rounded-full font-bold uppercase tracking-wider text-[9px] sm:text-[10px] px-2 sm:px-3 py-1 sm:py-1.5 ${selectedType === area
                        ? "bg-electric-teal hover:bg-deep-teal text-white"
                        : "border-charcoal/20 hover:border-electric-teal hover:text-electric-teal"
                        }`}
                    >
                      {area}
                    </Button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Jobs Section */}
        <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6">
          <div className="container mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 sm:mb-12 gap-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight mb-1 sm:mb-2 animate-slide-in-left">
                  {filteredJobs.length} {filteredJobs.length === 1 ? "Position" : "Positions"} Found
                </h2>
                <p className="text-xs sm:text-sm font-bold uppercase tracking-widest text-warm-gray">Updated Daily</p>
              </div>
            </div>

            {viewMode === "grid" ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {filteredJobs.map((job, index) => (
                  <div
                    key={job.id}
                    id={`card-${job.id}`}
                    data-card
                    className={`group flex flex-col h-full transition-all duration-700 animate-scale-in`}
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div onClick={() => handleJobClick(job)} className="flex-1">
                      <div className="relative h-full">
                        <Card className="group h-full border-2 border-charcoal/10 bg-surface hover:bg-white shadow-lg hover:shadow-2xl rounded-2xl sm:rounded-[2rem] overflow-hidden transition-all duration-500 hover:scale-[1.02] hover:border-electric-teal cursor-pointer">
                          <CardContent className="p-4 sm:p-6 md:p-8 flex flex-col h-full">
                            {/* Header */}
                            <div className="flex justify-between items-start mb-4 sm:mb-6 gap-2">
                              <div className="flex-1 min-w-0">
                                <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tight leading-tight mb-1 sm:mb-2 group-hover:text-electric-teal transition-colors truncate">
                                  {job.firmName}
                                </h3>
                                <p className="text-xs sm:text-sm font-bold text-warm-gray uppercase tracking-wider truncate">
                                  {job.jobtitle}
                                </p>
                              </div>
                              <Badge className="bg-soft-teal text-electric-teal border-electric-teal/20 font-black uppercase tracking-widest text-[7px] sm:text-[8px] px-2 sm:px-3 py-0.5 sm:py-1 shrink-0 animate-bounce-gentle">
                                {job.jobType === "Summer Internship" ? "SUMMER" : "PROGRAM"}
                              </Badge>
                            </div>

                            {/* Meta Info */}
                            <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
                              <div className="flex items-center gap-2 text-xs sm:text-sm font-medium text-warm-gray hover:translate-x-1 transition-transform">
                                <MapPin className="w-3 h-3 sm:w-4 sm:h-4 text-electric-teal shrink-0" />
                                <span className="font-bold uppercase tracking-wide text-[10px] sm:text-[11px] truncate">
                                  {job.location}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 text-xs sm:text-sm font-medium text-warm-gray hover:translate-x-1 transition-transform">
                                <Briefcase className="w-3 h-3 sm:w-4 sm:h-4 text-ai-violet shrink-0" />
                                <span className="font-bold uppercase tracking-wide text-[10px] sm:text-[11px] truncate">
                                  {job.salary || "Not Specified"}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 text-xs sm:text-sm font-medium text-warm-gray hover:translate-x-1 transition-transform">
                                <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-warm-pop shrink-0" />
                                <span className="font-bold uppercase tracking-wide text-[10px] sm:text-[11px] truncate">
                                  Due: {job.applicationDeadline || "Not Specified"}
                                </span>
                              </div>
                            </div>

                            {/* Tags */}
                            <div className="flex flex-wrap gap-1 sm:gap-2 mb-4 sm:mb-6">
                              {job?.tags?.length > 0 ? job?.tags.slice(0, 2).map((tag) => (
                                <Badge
                                  key={tag}
                                  variant="outline"
                                  className="border-charcoal/10 text-charcoal font-bold uppercase tracking-widest text-[7px] sm:text-[8px] px-1.5 sm:px-2 py-0.5 sm:py-1 hover:border-electric-teal hover:text-electric-teal transition-colors"
                                >
                                  {tag}
                                </Badge>
                              )) : ""}
                            </div>

                            {/* Description */}
                            <p className="text-xs sm:text-sm leading-relaxed font-medium text-warm-gray mb-4 sm:mb-6 line-clamp-2 sm:line-clamp-3">
                              {job.jobDescription || "Not available"}
                            </p>

                            {/* Footer */}
                            <div className="mt-auto flex items-center justify-end pt-4 sm:pt-6 border-t border-charcoal/5">
                              {/* <div className="flex items-center gap-1 sm:gap-2">
                                <Users className="w-3 h-3 sm:w-4 sm:h-4 text-warm-gray" />
                                <span className="text-[9px] sm:text-xs font-black uppercase tracking-widest text-warm-gray">
                                  {job.jobApplicants || 0}
                                </span>
                              </div> */}
                              <div className="flex items-center gap-1 sm:gap-2 text-electric-teal font-black uppercase tracking-widest text-[9px] sm:text-xs group-hover:gap-3 sm:group-hover:gap-4 transition-all">
                                View
                                <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                        {/* <div onClick={(e) => e.stopPropagation()} className="absolute top-0 left-0 w-full h-full">
                          <JobCardAIButtons job={job} isOverlay={true} />
                        </div> */}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <JobListView navigate={navigate} handleJobClick={handleJobClick} tempResume={tempResume} jobs={filteredJobs} />
            )}

            {filteredJobs.length === 0 && (
              <div className="text-center py-12 sm:py-20 animate-scale-in">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-soft-teal rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 animate-float">
                  <Search className="w-8 h-8 sm:w-10 sm:h-10 text-electric-teal" />
                </div>
                <h3 className="text-2xl sm:text-3xl md:text-7xl font-black uppercase tracking-tight mb-2 sm:mb-4">
                  No Matches Found
                </h3>
                <p className="text-sm sm:text-lg md:text-xl font-bold uppercase tracking-wider text-warm-cream/60 mb-8 md:mb-12">
                  Try adjusting your filters
                </p>
              </div>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 sm:py-20 md:py-24 px-4 sm:px-6 bg-charcoal text-warm-cream rounded-t-3xl sm:rounded-t-[4rem]">
          <div className="container mx-auto text-center">
            <div className="max-w-3xl mx-auto">
              <Sparkles className="w-10 h-10 sm:w-12 sm:h-12 text-electric-teal mx-auto mb-4 sm:mb-6 animate-bounce-gentle" />
              <h2 className="text-3xl sm:text-5xl md:text-7xl font-black uppercase tracking-tighter mb-6 md:mb-8 leading-[0.9] animate-slide-in-up">
                Get The <span className="text-electric-teal animate-pulse-glow inline-block">Competitive Edge</span>
              </h2>
              <p className="text-sm sm:text-lg md:text-xl font-bold uppercase tracking-wider text-warm-cream/60 mb-8 md:mb-12">
                AI-Powered Resume Optimization / Instant Firm Intelligence
              </p>
              <Button className="h-14 sm:h-16 md:h-20 px-8 sm:px-12 md:px-16 rounded-xl sm:rounded-2xl md:rounded-[2rem] bg-electric-teal hover:bg-deep-teal text-white font-black uppercase tracking-widest text-xs sm:text-sm md:text-sm shadow-2xl shadow-electric-teal/30 transition-all hover:scale-105 active:scale-95 animate-bounce-gentle w-full sm:w-auto">
                Unlock Premium Access
                <ArrowRight className="ml-2 sm:ml-3 w-4 h-4 sm:w-5 sm:h-5" />
              </Button>
            </div>
          </div>
        </section>

        <style jsx global>{`
          @keyframes fade-in-up {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          .animate-slide-in-up {
            animation: fade-in-up 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
          }

          @keyframes blob-float {
            0%, 100% {
              transform: translateY(0);
            }
            50% {
              transform: translateY(-20px);
            }
          }

          .animate-blob-float {
            animation: blob-float 5s ease-in-out infinite;
          }

          @keyframes blob-rotate {
            0% {
              transform: rotate(0deg);
            }
            100% {
              transform: rotate(360deg);
            }
          }

          .animate-blob-rotate {
            animation: blob-rotate 10s linear infinite;
          }

          @keyframes scale-in {
            from {
              transform: scale(0.9);
              opacity: 0;
            }
            to {
              transform: scale(1);
              opacity: 1;
            }
          }

          .animate-scale-in {
            animation: scale-in 0.5s ease-in-out;
          }

          @keyframes float {
            0%, 100% {
              transform: translateY(0);
            }
            50% {
              transform: translateY(10px);
            }
          }

          .animate-float {
            animation: float 3s ease-in-out infinite;
          }

          @keyframes bounce-gentle {
            0%, 100% {
              transform: translateY(0);
            }
            50% {
              transform: translateY(-5px);
            }
          }

          .animate-bounce-gentle {
            animation: bounce-gentle 1s ease-in-out infinite;
          }

          @keyframes pulse-glow {
            0%, 100% {
              filter: drop-shadow(0 0 5px rgba(0, 255, 255, 0.5));
            }
            50% {
              filter: drop-shadow(0 0 15px rgba(0, 255, 255, 1));
            }
          }

          .animate-pulse-glow {
            animation: pulse-glow 2s ease-in-out infinite;
          }
        `}</style>
      </div>

      <Footer />
    </>
  );
}

// export default function JobPortal() {
//   return (
//     <Suspense fallback={null}>
//       <JobPortal />
//     </Suspense>
//   );
// }