import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin } from "lucide-react"
import JobCardAIButtons from "./JobCardAIButtons"

export default function JobListView({
  jobs,
  navigate,
  tempResume,
  handleJobClick,
}) {
  const getDeadlineColor = (deadline) => {
    if (!deadline) return "text-charcoal"
    const daysUntil = Math.ceil(
      (new Date(deadline) - new Date()) / (1000 * 60 * 60 * 24)
    )
    return daysUntil < 7 ? "text-warm-pop" : "text-charcoal"
  }

  const getDeadlineText = (deadline) => {
    if (!deadline) return "Rolling"
    const daysUntil = Math.ceil(
      (new Date(deadline) - new Date()) / (1000 * 60 * 60 * 24)
    )
    return daysUntil < 7 ? `${daysUntil} days` : deadline
  }

  return (
    <div className="space-y-3">
      {jobs.map((job) => (
        <div key={job.id} className="group">
          {/* ✅ Horizontal scroll wrapper for small screens */}
          <div className="overflow-x-auto">
            <div
              onClick={() => handleJobClick(job)}
              className="
                min-w-[960px] 
                h-[88px]
                bg-surface
                rounded-lg
                flex
                items-center
                gap-4
                px-6
                py-4
                border
                border-charcoal/5
                cursor-pointer
                whitespace-nowrap
                transition-all
                hover:shadow-md
                hover:border-electric-teal/20
              "
            >
              {/* ===================== */}
              {/* Column 1: Identity */}
              {/* ===================== */}
              <div className="flex-[2] min-w-[260px] min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-base font-black uppercase tracking-tight text-charcoal truncate group-hover:text-electric-teal transition-colors">
                    {job.firmName}
                  </h3>

                  {/* <Badge className="bg-soft-teal text-electric-teal border-electric-teal/20 font-black uppercase tracking-widest text-[8px] px-2 py-0.5 shrink-0">
                    V10
                  </Badge> */}
                </div>

                <div className="flex items-center gap-2 text-xs font-bold text-warm-gray uppercase tracking-wide truncate">
                  <MapPin className="w-3 h-3 shrink-0" />
                  <span className="truncate">{job.location}</span>
                  <span className="text-charcoal/40">•</span>
                  <span className="truncate">{job.jobTitle}</span>
                </div>
              </div>

              {/* ===================== */}
              {/* Column 2: Status */}
              {/* ===================== */}
              <div className="flex-1 min-w-[160px] flex items-center gap-2">
                {/* <Badge className="bg-electric-teal/10 text-electric-teal border-electric-teal/20 font-black uppercase tracking-widest text-[8px] px-2 py-1">
                  1L Eligible
                </Badge> */}

                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 bg-electric-teal rounded-full" />
                  <span className="text-xs font-bold uppercase tracking-widest text-charcoal">
                    Live
                  </span>
                </div>
              </div>

              {/* ===================== */}
              {/* Column 3: Deadline */}
              {/* ===================== */}
              <div className="flex-1 min-w-[140px]">
                <div className="text-xs font-black uppercase tracking-widest text-warm-gray mb-1">
                  Deadline
                </div>
                <div
                  className={`text-sm font-black uppercase tracking-tight ${getDeadlineColor(
                    job.applicationDeadline
                  )}`}
                >
                  {getDeadlineText(job.applicationDeadline)}
                </div>
              </div>

              {/* ===================== */}
              {/* Column 4: Actions */}
              {/* ===================== */}
              <div className="flex-1 min-w-[220px] flex items-center justify-end gap-2">
                <JobCardAIButtons
                  navigate={navigate}
                  handleJobClick={handleJobClick}
                  tempResume={tempResume}
                  job={job}
                  variant="compact"
                />

                <Button
                  size="sm"
                  variant="outline"
                  onClick={(e) => {
                    e.stopPropagation()
                    window.open(job.jobUrl || job.source, "_blank")
                  }}
                  className="h-8 px-4 rounded-lg font-bold uppercase tracking-widest text-[11px] border-charcoal/20 hover:border-electric-teal hover:text-electric-teal bg-transparent"
                >
                  Apply
                </Button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
