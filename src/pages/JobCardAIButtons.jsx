import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sparkles, FileText, Zap } from "lucide-react"


export default function JobCardAIButtons({ job, variant = "default", isOverlay = false, navigate, tempResume }) {
    const [showCoverLetterModal, setShowCoverLetterModal] = useState(false)
    const [showResumeModal, setShowResumeModal] = useState(false)

    if (variant === "compact") {
        return (
            <>
                <Button
                    size="sm"
                    variant="outline"
                    className="h-7 px-2 text-[10px] bg-transparent border-charcoal/20 hover:border-electric-teal hover:text-electric-teal hover:bg-electric-teal/5"
                    onClick={() => navigate("/resume/editor", {
                        state: {
                            extractedText: tempResume.text,
                            jobId: job.id,
                        },
                    })}
                >
                    <FileText className="h-3 w-3 mr-1" />
                    Resume
                </Button>
                <Button
                    size="sm"
                    className="h-7 px-3 text-[10px] bg-gradient-to-r from-ai-violet to-electric-teal text-white hover:shadow-md transition-shadow"
                    onClick={() => navigate("/cover-letter/generator", {
                            state: {
                              jobId: job.id,
                              title: job.jobTitle,
                              jobCompany: job.firmName,
                              description: job.jobDescription,
                            },
                          })}
                >
                    <Zap className="h-3 w-3 mr-1" />
                    Cover Letter
                </Button>

            </>
        )
    }

    if (isOverlay) {
        return (
            <>
                <div className="absolute top-3 sm:top-4 right-3 sm:right-4 flex items-center gap-1.5 sm:gap-2 z-20">
                    <Button
                        size="sm"
                        variant="outline"
                        className="h-7 sm:h-8 px-2 sm:px-2.5 text-[9px] sm:text-[10px] bg-white/90 backdrop-blur-md border-electric-teal/30 hover:border-electric-teal hover:text-electric-teal hover:bg-electric-teal/5 shadow-md hover:shadow-lg transition-all"
                        onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            navigate("/resume/editor", {
                                state: {
                                    extractedText: tempResume.text,
                                    jobId: job.id,
                                },
                            });
                        }}
                    >
                        <FileText className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                        <span className="hidden sm:inline ml-1">Optimize</span>
                    </Button>
                    <Button
                        size="sm"
                        className="h-7 sm:h-8 px-2 sm:px-3 text-[9px] sm:text-[10px] bg-gradient-to-r from-ai-violet to-electric-teal text-white hover:shadow-lg transition-all hover:scale-105 flex items-center gap-1"
                        onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
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
                        <Zap className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                        <span className="hidden sm:inline">Cover Letter</span>
                    </Button>
                </div>

            </>
        )
    }

    return (
        <>
            {/* AI Tool Buttons */}
            <div className="flex items-center gap-2 mt-4 pt-4 border-t border-charcoal/5">
                <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 text-xs h-8 bg-transparent border-charcoal/20 hover:border-electric-teal hover:text-electric-teal hover:bg-electric-teal/5"
                    onClick={() => navigate("/resume/editor", {
                        state: {
                            extractedText: tempResume.text,
                            jobId: job.id,
                        },
                    })}
                >
                    <FileText className="h-3.5 w-3.5 mr-1.5" />
                    Optimize Resume
                </Button>
                <Button
                    size="sm"
                    className="flex-1 text-xs h-8 bg-gradient-to-r from-ai-violet to-electric-teal text-white hover:shadow-lg transition-all hover:scale-105"
                    onClick={() => navigate("/cover-letter/generator", {
                            state: {
                              jobId: job.id,
                              title: job.jobTitle,
                              jobCompany: job.firmName,
                              description: job.jobDescription,
                            },
                          })}
                >
                    <Sparkles className="h-3.5 w-3.5 mr-1.5" />
                    Cover Letter
                </Button>
            </div>


        </>
    )
}
