import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import {
  Search,
  Briefcase
} from "lucide-react";

import Header from "@/components/Header";
import Footer from "@/components/Footer";

import { useDispatch, useSelector } from "react-redux";
import {
  getScrappedJobs,
  getFavoriteJobs,
  RemoveFavoriteJob,
  saveFavoriteJob,
  setSelectedJob
} from "@/redux/slices/userApiSlice";

import { useNavigate } from "react-router-dom";
import { toast, Toaster } from "sonner";
import { track } from "@/lib/analytics";

const JobPortal = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { scrappedJobs, loading, favoriteJobs, user } = useSelector(
    (state) => state.userApi
  );

  const [searchQuery, setSearchQuery] = useState("");
  const [stateFilter, setStateFilter] = useState("");
  const [areaOfLawFilter, setAreaOfLawFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const jobsPerPage = 9;

  // ------------------------------------------------------------
  // FETCH JOBS
  // ------------------------------------------------------------
  useEffect(() => {
    if (window.location.href.includes("favoritejobs")) {
      dispatch(getFavoriteJobs());
      track("FavoritesViewed");
    } else {
      dispatch(getScrappedJobs());
      track("JobPortalViewed");
    }
  }, []);

  useEffect(() => {
    if ((scrappedJobs?.length || favoriteJobs?.length) && !stateFilter) {
      setStateFilter("Georgia");
      track("AutoStateFilterApplied", { state: "Georgia" });
    }
  }, [scrappedJobs, favoriteJobs]);

  // ------------------------------------------------------------
  // HELPERS
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

    const abbrMatch = location.match(/,\s*([A-Z]{2})$/);
    if (abbrMatch) {
      const map = { GA: "Georgia", NY: "New York", CA: "California" };
      return map[abbrMatch[1]] || null;
    }

    return null;
  };

  const isBadJob = (job) => {
    if (!job) return true;
    if (!job.firmName || !job.jobTitle) return true;
    if (job.jobTitle.toLowerCase().includes("no 1l")) return true;
    return false;
  };

  const allJobsCombined = window.location.href.includes("favoritejobs")
    ? favoriteJobs?.filter((j) => !isBadJob(j))
    : scrappedJobs?.filter((j) => !isBadJob(j));

  // ------------------------------------------------------------
  // FILTERS
  // ------------------------------------------------------------
  const filteredJobs = (allJobsCombined || []).filter((job) => {
    const matchesSearch =
      job.jobTitle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.firmName?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesState =
      !stateFilter ||
      stateFilter === "All States" ||
      extractState(job.location) === stateFilter;

    const matchesArea =
      !areaOfLawFilter ||
      areaOfLawFilter === "All Areas of Law" ||
      job.areaOfLaw?.toLowerCase().includes(areaOfLawFilter.toLowerCase());

    return matchesSearch && matchesState && matchesArea;
  });

  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);
  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    track("PaginationChanged", { page });
  };

  // ------------------------------------------------------------
  // UI
  // ------------------------------------------------------------
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

          {/* SEARCH */}
          <div className="flex gap-4 mb-8">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search firm or role…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* JOB LIST */}
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

                    {/* COL 4 — ACTION */}
                    <div
                      className="flex-shrink-0 w-56 flex justify-end gap-2"
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
                        className="bg-black text-white hover:bg-black/90"
                        onClick={() => {
                          track("AIDraftClicked", { jobId: job.id });
                          navigate(`/jobs/${job.id}?ai=draft`);
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
                  onClick={() => handlePageChange(currentPage - 1)}
                >
                  Previous
                </Button>

                <Button
                  variant="outline"
                  disabled={currentPage === totalPages}
                  onClick={() => handlePageChange(currentPage + 1)}
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
