import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin } from "lucide-react"
import { Link } from "react-router-dom"
import JobCardAIButtons from "./JobCardAIButtons"

export default function JobListView({ jobs, navigate, tempResume, handleJobClick }) {
    const getDeadlineColor = (deadline) => {
        const daysUntil = Math.ceil((new Date(deadline) - new Date()) / (1000 * 60 * 60 * 24))
        return daysUntil < 7 ? "text-warm-pop" : "text-charcoal"
    }

    const getDeadlineText = (deadline) => {
        const daysUntil = Math.ceil((new Date(deadline) - new Date()) / (1000 * 60 * 60 * 24))
        return daysUntil < 7 ? `${daysUntil} days` : deadline
    }

    return (
        <div className="space-y-3">
            {jobs.map((job) => (
                <div key={job.id} className="group cursor-pointer">
                    <div onClick={() => handleJobClick(job)}>
                        <div className="h-[88px] bg-surface rounded-lg hover:shadow-md transition-shadow duration-300 flex flex-row items-center px-6 py-4 gap-4 border border-charcoal/5 hover:border-electric-teal/20">
                            {/* Col 1: Identity (Flex-2, 1/3 width) */}
                            <div className="flex-[2] min-w-0">
                                <div className="flex items-center gap-3 mb-2">
                                    <h3 className="text-base font-black uppercase tracking-tight text-charcoal truncate group-hover:text-electric-teal transition-colors">
                                        {job.firmName}
                                    </h3>
                                    <Badge className="bg-soft-teal text-electric-teal border-electric-teal/20 font-black uppercase tracking-widest text-[8px] px-2 py-0.5 shrink-0">
                                        V10
                                    </Badge>
                                </div>
                                <div className="flex items-center gap-2 text-xs font-bold text-warm-gray uppercase tracking-wide truncate">
                                    <MapPin className="w-3 h-3 shrink-0" />
                                    <span className="truncate">{job.location}</span>
                                    <span className="text-charcoal/40">•</span>
                                    <span className="truncate">{job.jobTitle}</span>
                                </div>
                            </div>

                            {/* Col 2: Trust/Status (Flex-1) */}
                            <div className="flex-1 flex items-center gap-2">
                                <Badge className="bg-electric-teal/10 text-electric-teal border-electric-teal/20 font-black uppercase tracking-widest text-[8px] px-2 py-1">
                                    1L Eligible
                                </Badge>
                                <div className="flex items-center gap-1.5">
                                    <div className="w-2 h-2 bg-electric-teal rounded-full" />
                                    <span className="text-xs font-bold uppercase tracking-widest text-charcoal">Live</span>
                                </div>
                            </div>

                            {/* Col 3: Urgency (Flex-1) */}
                            <div className="flex-1">
                                <div className="text-xs font-black uppercase tracking-widest text-warm-gray mb-1">Deadline</div>
                                <div className={`text-sm font-black uppercase tracking-tight ${getDeadlineColor(job.applicationDeadline)}`}>
                                    {getDeadlineText(job.applicationDeadline) || "Rolling"}
                                </div>
                            </div>

                            {/* Col 4: Action (Flex-1, Right Align) */}
                            <div className="flex-1 flex items-center justify-end gap-2">
                                <JobCardAIButtons navigate={navigate} handleJobClick={handleJobClick} tempResume={tempResume} job={job} variant="compact" />

                                <Button
                                    size="sm"
                                    onClick={() => { window.open(job.jobUrl || job.source, "_blank"); }}
                                    variant="outline"
                                    className="h-8 px-4 rounded-lg font-bold uppercase tracking-widest text-[11px] border-charcoal/20 hover:border-electric-teal hover:text-electric-teal bg-transparent"
                                >
                                    Apply
                                </Button>
                            </div>
                        </div>
                    </div>

                    <div className="mt-2 flex justify-end gap-2 px-6">
                    </div>
                </div>
            ))}
        </div>
    )
}
