import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Search,
  MapPin,
  Clock,
  ArrowRight,
  Filter,
  Sparkles,
  TrendingUp,
  LayoutGrid,
  List,
} from "lucide-react";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ResumeEditor from "@/components/resume/ResumeEditor";
import JobListView from "./JobListView";

import { useDispatch, useSelector } from "react-redux";
import {
  getScrappedJobs,
  getFavoriteJobs,
  setSelectedJob,
} from "@/redux/slices/userApiSlice";

import { Toaster } from "sonner";
import { track } from "@/lib/analytics";
import { usePostHog } from "posthog-js/react";

function JobPortalFunc() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const posthog = usePostHog();

  const { scrappedJobs, favoriteJobs, tempResume } = useSelector(
    (state) => state.userApi
  );

  const [scrollY, setScrollY] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [selectedFirm, setSelectedFirm] = useState("All");
  const [selectedLocation, setSelectedLocation] = useState("All");
  const [selectedType, setSelectedType] = useState("All");
  const [viewMode, setViewMode] = useState("grid");
  const [showResumeUpload, setShowResumeUpload] = useState(false);
  const [isSearchBarSticky, setIsSearchBarSticky] = useState(false);

  // Refs for scroll behavior
  const resultsRef = useRef(null);
  const searchBarRef = useRef(null);
  const searchBarStickyOffset = useRef(0);
  const searchDebounceTimer = useRef(null);

  // ------------------------------------------------------------
  // FETCH
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

  // Scroll animation helper
  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.scrollY;
      setScrollY(currentScroll);
      
      // Detect if search bar should be sticky
      if (searchBarRef.current) {
        const offset = searchBarStickyOffset.current;
        setIsSearchBarSticky(currentScroll > offset);
      }
    };
    
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ------------------------------------------------------------
  // FILTER HELPERS
  // ------------------------------------------------------------
  const extractState = (location = "") => {
    if (!location) return null;
    const loc = location.toLowerCase();

    const map = {
      atlanta: "Georgia",
      "new york": "New York",
      boston: "Massachusetts",
      chicago: "Illinois",
      washington: "District of Columbia",
      "san francisco": "California",
      "los angeles": "California",
    };

    for (const city in map) {
      if (loc.includes(city)) return map[city];
    }

    const abbr = location.match(/,\s*([A-Z]{2})$/);
    const abbrMap = {
      GA: "Georgia",
      NY: "New York",
      CA: "California",
      DC: "District of Columbia",
      MA: "Massachusetts",
      IL: "Illinois",
    };

    return abbr ? abbrMap[abbr[1]] : null;
  };

  const isBadJob = (job) =>
    !job?.firmName ||
    !job?.jobTitle ||
    job.jobTitle.toLowerCase().includes("no 1l");

  const jobsSource = window.location.href.includes("favoritejobs")
    ? favoriteJobs
    : scrappedJobs;

  const cleanJobs = (jobsSource || []).filter((j) => !isBadJob(j));

  useEffect(() => {
    if (cleanJobs.length && selectedLocation === "All") {
      setSelectedLocation("Georgia");
    }
  }, [cleanJobs.length]); // keep your behavior

  const statesList = [
    ...new Set(cleanJobs.map((j) => extractState(j.location)).filter(Boolean)),
  ];
  const firmsList = [...new Set(cleanJobs.map((j) => j.firmName).filter(Boolean))];
  const areasList = [
    ...new Set(
      cleanJobs.flatMap((j) =>
        j.areaOfLaw ? j.areaOfLaw.split(/,|\//).map((a) => a.trim()) : []
      )
    ),
  ];

  const filteredJobs = cleanJobs.filter((job) => {
    const q = searchTerm.toLowerCase();
    return (
      (!q ||
        job.jobTitle?.toLowerCase().includes(q) ||
        job.firmName?.toLowerCase().includes(q)) &&
      (selectedFirm === "All" || job.firmName === selectedFirm) &&
      (selectedLocation === "All" ||
        extractState(job.location) === selectedLocation) &&
      (selectedType === "All" ||
        job.areaOfLaw?.toLowerCase().includes(selectedType.toLowerCase()))
    );
  });

  // ------------------------------------------------------------
  // ROUTING
  // ------------------------------------------------------------
  const location = useLocation();

  // Open or close the resume editor based on ?resume=true
  useEffect(() => {
    try {
      const params = new URLSearchParams(location.search);
      setShowResumeUpload(params.get("resume") === "true");
    } catch (err) {
      // noop
    }
  }, [location.search]);
  const handleJobClick = (job) => {
    dispatch(setSelectedJob(job));
    navigate(`/jobs/${job.id}`);
  };

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
      <Toaster richColors position="top-center" />
      <Header />

      <div className="min-h-screen bg-warm-cream text-charcoal">
        {/* ---------------- HERO ---------------- */}
        <section
          className="pt-24 sm:pt-32 pb-12 sm:pb-20 px-4 sm:px-6"
          style={{ opacity: Math.max(0, 1 - scrollY / 400) }}
        >
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-6 bg-ai-violet/10 text-ai-violet text-xs sm:text-sm">
              <TrendingUp className="w-4 h-4 mr-1" />
              {filteredJobs.length} Live Opportunities
            </Badge>

            <h1 className="text-4xl sm:text-6xl md:text-8xl font-black leading-tight">
              Land Your
              <br />
              <span className="text-electric-teal">BigLaw Offer</span>
            </h1>

            <p className="mt-6 text-sm sm:text-lg text-warm-gray">
              Vault 10 Firms. Real Positions.
            </p>

            <div className="relative mt-8 max-w-xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-warm-gray" />
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search firms or roles"
                className="pl-12 h-12 sm:h-14 text-base rounded-xl"
              />
            </div>
          </div>
        </section>

        {/* ---------------- FILTER BAR ---------------- */}
        <section className="sticky top-16 sm:top-20 z-40 bg-warm-cream/95 backdrop-blur-xl border-y border-charcoal/5 py-4 sm:py-6 px-4 sm:px-6 overflow-x-auto">
          <div className="container mx-auto">
            {/* Header + View Toggles */}
            <div className="flex items-center justify-between gap-4 mb-4">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-warm-gray" />
                <span className="text-xs font-black uppercase tracking-widest text-warm-gray">
                  Filters
                </span>
              </div>

              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant={viewMode === "grid" ? "default" : "outline"}
                  onClick={() => setViewMode("grid")}
                >
                  <LayoutGrid className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant={viewMode === "list" ? "default" : "outline"}
                  onClick={() => setViewMode("list")}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* FILTER ROWS */}
            <div className="flex flex-col gap-3">
              {/* -------- FIRM FILTER (RESTORED) -------- */}
              <div className="flex gap-2 overflow-x-auto pb-2">
                <Button
                  size="sm"
                  variant={selectedFirm === "All" ? "default" : "outline"}
                  onClick={() => setSelectedFirm("All")}
                >
                  All Firms
                </Button>

                {firmsList.slice(0, 10).map((firm) => (
                  <Button
                    key={firm}
                    size="sm"
                    variant={selectedFirm === firm ? "default" : "outline"}
                    onClick={() => setSelectedFirm(firm)}
                    className="whitespace-nowrap"
                  >
                    {firm}
                  </Button>
                ))}
              </div>

              {/* -------- LOCATION FILTER -------- */}
              <div className="flex gap-2 overflow-x-auto pb-2">
                <Button
                  size="sm"
                  variant={selectedLocation === "All" ? "default" : "outline"}
                  onClick={() => setSelectedLocation("All")}
                >
                  All Locations
                </Button>

                {statesList.map((state) => (
                  <Button
                    key={state}
                    size="sm"
                    variant={selectedLocation === state ? "default" : "outline"}
                    onClick={() => setSelectedLocation(state)}
                    className="whitespace-nowrap"
                  >
                    {state}
                  </Button>
                ))}
              </div>

              {/* -------- AREA OF LAW FILTER -------- */}
              {areasList.length > 0 && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                  <Button
                    size="sm"
                    variant={selectedType === "All" ? "default" : "outline"}
                    onClick={() => setSelectedType("All")}
                  >
                    All Areas
                  </Button>

                  {areasList.slice(0, 8).map((area) => (
                    <Button
                      key={area}
                      size="sm"
                      variant={selectedType === area ? "default" : "outline"}
                      onClick={() => setSelectedType(area)}
                      className="whitespace-nowrap"
                    >
                      {area}
                    </Button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ---------------- JOBS ---------------- */}
        <section className="py-12 px-4 sm:px-6">
          {viewMode === "grid" ? (
            <div
              className="
                grid
                gap-4
                [grid-template-columns:repeat(auto-fit,minmax(260px,1fr))] 
                sm:[grid-template-columns:repeat(auto-fit,minmax(280px,1fr))]
              "
            >
              {filteredJobs.map((job) => (
                <Card
                  key={job.id}
                  onClick={() => handleJobClick(job)}
                  className="cursor-pointer hover:shadow-xl transition overflow-hidden"
                >
                  <CardContent className="p-4 sm:p-5">
                    <h3 className="font-black text-base sm:text-lg truncate">
                      {job.firmName}
                    </h3>

                    <p className="mt-1 text-sm text-warm-gray line-clamp-2 sm:truncate">
                      {job.jobTitle}
                    </p>

                    <div className="mt-3 space-y-2 text-xs text-warm-gray">
                      <div className="flex items-start gap-2 min-w-0">
                        <MapPin className="w-3.5 h-3.5 shrink-0 mt-[2px]" />
                        <span className="min-w-0 break-words">
                          {job.location}
                        </span>
                      </div>

                      <div className="flex items-start gap-2 min-w-0">
                        <Clock className="w-3.5 h-3.5 shrink-0 mt-[2px]" />
                        <span className="min-w-0 break-words">
                          {job.applicationDeadline || "Rolling"}
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase tracking-widest text-electric-teal/80">
                        Tap to open
                      </span>

                      <div className="flex items-center text-electric-teal text-xs font-black uppercase tracking-widest">
                        View <ArrowRight className="w-3 h-3 ml-1" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <JobListView
              jobs={filteredJobs}
              navigate={navigate}
              handleJobClick={handleJobClick}
              tempResume={tempResume}
            />
          )}
        </section>

        {/* ---------------- CTA ---------------- */}
        <section className="bg-charcoal text-warm-cream py-16 px-4 sm:px-6 text-center">
          <Sparkles className="w-10 h-10 mx-auto text-electric-teal mb-4" />
          <h2 className="text-3xl sm:text-5xl font-black mb-6">
            Get the Competitive Edge
          </h2>
          <Button className="bg-electric-teal text-white px-10 h-14 rounded-xl">
            Unlock Premium
          </Button>
        </section>
      </div>
      {loading && <Loader fullScreen={true} text="Loading opportunities..." />}
      <Footer />
    </>
  );
}
