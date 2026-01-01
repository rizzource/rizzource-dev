import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Search, Briefcase } from "lucide-react";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ResumeEditor from "@/components/resume/ResumeEditor";

import { useDispatch, useSelector } from "react-redux";
import {
  getScrappedJobs,
  getFavoriteJobs,
  setSelectedJob,
} from "@/redux/slices/userApiSlice";

import { useNavigate } from "react-router-dom";
import { toast, Toaster } from "sonner";
import { track } from "@/lib/analytics";
import { usePostHog } from "posthog-js/react";

const JobPortal = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const posthog = usePostHog();

  const { scrappedJobs, loading, favoriteJobs, tempResume } = useSelector(
    (state) => state.userApi
  );

  const [searchQuery, setSearchQuery] = useState("");
  const [stateFilter, setStateFilter] = useState("");
  const [areaOfLawFilter, setAreaOfLawFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showResumeUpload, setShowResumeUpload] = useState(false);

  const jobsPerPage = 9;

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

  // Auto-apply Georgia
  useEffect(() => {
    if ((scrappedJobs?.length || favoriteJobs?.length) && !stateFilter) {
      setStateFilter("Georgia");
      track("AutoStateFilterApplied", { state: "Georgia" });
    }
  }, [scrappedJobs, favoriteJobs, stateFilter]);

  // Reset page on filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, stateFilter, areaOfLawFilter]);

  // ------------------------------------------------------------
  // FILTER HELPERS (FROM JOBPORTAL #2)
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

  // Dropdown data
  const statesList = Array.from(
    new Set(cleanJobs.map((j) => extractState(j.location)).filter(Boolean))
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
      !searchQuery ||
      job.jobTitle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.firmName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.jobDescription?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesState =
      !stateFilter || extractState(job.location) === stateFilter;

    const matchesArea =
      !areaOfLawFilter ||
      job.areaOfLaw?.toLowerCase().includes(areaOfLawFilter.toLowerCase());

    return matchesSearch && matchesState && matchesArea;
  });

  const indexOfLastJob = currentPage * jobsPerPage;
  const currentJobs = filteredJobs.slice(
    indexOfLastJob - jobsPerPage,
    indexOfLastJob
  );
  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);

  // ------------------------------------------------------------
  // DEADLINE HELPERS (ORIGINAL)
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

      <div className="min-h-screen bg-background pt-16">
        <div className="container mx-auto px-4 py-8">

          {/* HEADER */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">
              Every 1L Law-Firm Role. One Smart Search.
            </h1>
            <p className="text-muted-foreground">
              Scan faster. Apply smarter. AI-powered.
            </p>
          </div>

          {/* SEARCH + FILTERS */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search firm or role…"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  track("JobSearchPerformed", { query: e.target.value });
                }}
                className="pl-10"
              />
            </div>

            <Select value={stateFilter} onValueChange={setStateFilter}>
              <SelectTrigger className="md:w-48">
                <SelectValue placeholder="State" />
              </SelectTrigger>
              <SelectContent>
                {statesList.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {areasList.length > 0 && (
              <Select value={areaOfLawFilter} onValueChange={setAreaOfLawFilter}>
                <SelectTrigger className="md:w-56">
                  <SelectValue placeholder="Area of Law" />
                </SelectTrigger>
                <SelectContent className="max-h-64 overflow-y-auto">
                  {areasList.map((a) => (
                    <SelectItem key={a} value={a}>
                      {a}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          {/* JOB LIST — ORIGINAL ROW LAYOUT */}
          {loading ? (
            <div className="text-center py-12 text-muted-foreground">
              Loading jobs…
            </div>
          ) : filteredJobs.length === 0 ? (
            <div className="text-center py-12">
              <Briefcase className="mx-auto mb-4 text-muted-foreground" />
              No jobs found.
            </div>
          ) : (
            <>
              <div className="space-y-3">
                {currentJobs.map((job) => (
                  <div
                    key={job.id}
                    className="flex items-center gap-4 p-4 bg-white border border-gray-100 rounded-lg hover:shadow-md transition-all cursor-pointer h-[88px]"
                    onClick={() => {
                      dispatch(setSelectedJob(job));
                      track("JobViewed", { jobId: job.id });
                      posthog?.capture("job_row_clicked", {
                        job_id: job.id,
                        firm: job.firmName,
                      });
                      navigate(`/jobs/${job.id}`);
                    }}
                  >
                    {/* COL 1 — IDENTITY */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-[16px] truncate">
                          {job.firmName}
                        </span>

                        {job.vaultRank && (
                          <span className="px-2 py-0.5 text-xs rounded-full bg-black text-white">
                            {job.vaultRank}
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground truncate">
                        {job.location || "Location"} · {job.areaOfLaw || "General"}
                      </div>
                    </div>

                    {/* COL 2 — TRUST */}
                    <div className="flex-shrink-0 w-44 flex flex-col gap-1 text-xs">
                      <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-700 w-fit">
                        1L Eligible
                      </span>
                      <span className="flex items-center gap-1 text-muted-foreground">
                        <span className="h-2 w-2 rounded-full bg-green-500" />
                        Live
                      </span>
                    </div>

                    {/* COL 3 — DEADLINE */}
                    <div className="flex-shrink-0 w-28 text-xs">
                      <div className="uppercase tracking-wide text-muted-foreground">
                        Deadline
                      </div>
                      <div
                        className={
                          isDeadlineUrgent(job.applicationDeadline)
                            ? "text-red-600 font-medium"
                            : ""
                        }
                      >
                        {formatDeadline(job.applicationDeadline)}
                      </div>
                    </div>

                    {/* COL 4 — ACTIONS */}
                    <div
                      className="flex-shrink-0 w-72 flex justify-end gap-2"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => navigate(`/jobs/${job.id}`)}
                      >
                        Apply
                      </Button>

                      <Button
                        size="sm"
                        className="bg-gradient-to-r from-accent to-gold text-white"
                        onClick={() => {
                          dispatch(setSelectedJob(null));
                          track("AICoverLetterOpened", { jobId: job.id });
                          posthog?.capture("ai_cover_letter_opened", {
                            job_id: job.id,
                          });
                          navigate("/cover-letter/generator", {
                            state: {
                              jobId: job.id,
                              title: job.jobTitle,
                              jobCompany: job.firmName,
                              description: job.jobDescription,
                            },
                          });
                        }}
                      >
                        AI Cover Letter ⚡
                      </Button>

                      <Button
                        size="sm"
                        className="bg-black text-white hover:bg-black/90"
                        onClick={() => {
                          if (!tempResume?.text) {
                            toast.error("Please upload your resume first");
                            setShowResumeUpload(true);
                            return;
                          }
                          navigate("/resume/editor", {
                            state: {
                              extractedText: tempResume.text,
                              jobId: job.id,
                            },
                          });
                        }}
                      >
                        ⚡ AI Draft
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              {/* PAGINATION */}
              <div className="flex justify-center gap-2 mt-8">
                <Button
                  variant="outline"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => p - 1)}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => p + 1)}
                >
                  Next
                </Button>
              </div>
            </>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
};

export default JobPortal;
