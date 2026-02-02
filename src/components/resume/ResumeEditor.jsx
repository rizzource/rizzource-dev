"use client"

import { useState, useCallback, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { track } from "@/lib/analytics"
import { usePostHog } from "posthog-js/react"
import {
  ArrowLeft,
  Upload,
  FileText,
  Wand2,
  Plus,
  Check,
  RefreshCw,
  Loader2,
  GripVertical,
  Trash2,
  ChevronDown,
  ChevronUp,
  Briefcase,
  GraduationCap,
  User,
  Award,
  X,
  Mail,
  Phone,
  MapPin,
  Linkedin,
  Download,
  Sparkles,
  Shield,
  Zap,
  FileCheck,
  FileUp,
  Edit3,
  Save,
} from "lucide-react"
import { toast, Toaster } from "sonner"
import { exportPdfThunk, fileUpload, generateNewBulletThunk, improveBulletThunk } from "../../redux/slices/userApiSlice"
import { useDispatch } from "react-redux"
import { buildResumeHtml } from "../../lib/utils"
import FeedbackModal from "../FeedbackModal"

// ---------- shared styling helpers (purely visual) ----------
const cardShell =
  "border-none bg-white shadow-2xl rounded-[3rem] overflow-hidden"
const cardHeaderShell =
  "p-8 bg-gradient-to-br from-electric-teal/10 to-transparent"
const cardTitleShell =
  "text-2xl font-black uppercase tracking-tight flex items-center gap-3 text-charcoal"
const sectionIcon = "h-6 w-6 text-electric-teal"

const inputShell =
  "h-14 rounded-2xl border-2 border-border bg-white text-base font-medium text-charcoal focus-visible:ring-electric-teal focus-visible:border-electric-teal"
const textareaShell =
  "rounded-2xl border-2 border-border bg-white text-base font-medium leading-relaxed text-charcoal focus-visible:ring-electric-teal focus-visible:border-electric-teal"

const secondaryBtn =
  "h-12 px-6 rounded-2xl border-2 border-charcoal/20 font-bold uppercase tracking-wider text-xs text-charcoal hover:bg-soft-teal hover:border-electric-teal transition-all"
const primaryBtn =
  "h-12 px-6 rounded-2xl bg-charcoal hover:bg-deep-teal text-white font-black uppercase tracking-widest text-xs shadow-2xl shadow-charcoal/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
const aiBtn =
  "h-12 px-6 rounded-2xl bg-gradient-to-r from-ai-violet to-electric-teal text-white font-black uppercase tracking-widest text-xs shadow-2xl shadow-ai-violet/30 hover:scale-[1.02] active:scale-[0.98] transition-all group relative overflow-hidden"

const badgeSoft =
  "px-4 py-2 text-[10px] font-black uppercase tracking-wider rounded-full bg-soft-teal text-deep-teal border-none"
const badgeBeta =
  "px-3 py-1 text-[8px] font-black bg-electric-teal/10 text-electric-teal border border-electric-teal/20 rounded-full"
const badgeDark =
  "px-4 py-2 rounded-full bg-charcoal text-white font-black uppercase tracking-widest text-[10px]"

const hoverCard =
  "group relative bg-white border-2 border-charcoal/10 rounded-3xl hover:border-electric-teal/50 hover:shadow-2xl transition-all duration-300 overflow-hidden"
const hoverOverlay =
  "absolute inset-0 bg-gradient-to-r from-electric-teal/5 to-ai-violet/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity"

// Live Preview Component
const ResumePreview = ({ resumeData, isEditing, onEdit }) => {
  if (!resumeData) return null

  if (isEditing) {
    return (
      <div className="bg-white text-black p-8 min-h-full font-serif text-sm leading-relaxed">
        {/* Editable Header */}
        <div className="text-center border-b border-gray-300 pb-4 mb-4">
          <Input
            value={resumeData.personalInfo.name || "Your Name"}
            onChange={(e) =>
              onEdit({
                ...resumeData,
                personalInfo: { ...resumeData.personalInfo, name: e.target.value },
              })
            }
            className="text-2xl font-bold tracking-wide uppercase mb-2 text-center border-none bg-transparent focus-visible:ring-1"
          />
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs text-gray-600">
            {resumeData.personalInfo.email && (
              <Input
                value={resumeData.personalInfo.email}
                onChange={(e) =>
                  onEdit({
                    ...resumeData,
                    personalInfo: { ...resumeData.personalInfo, email: e.target.value },
                  })
                }
                className="w-auto border-none bg-transparent text-xs p-0 h-auto focus-visible:ring-1"
              />
            )}
            {resumeData.personalInfo.phone && (
              <Input
                value={resumeData.personalInfo.phone}
                onChange={(e) =>
                  onEdit({
                    ...resumeData,
                    personalInfo: { ...resumeData.personalInfo, phone: e.target.value },
                  })
                }
                className="w-auto border-none bg-transparent text-xs p-0 h-auto focus-visible:ring-1"
              />
            )}
          </div>
        </div>

        {/* Editable Summary */}
        {resumeData.summary && (
          <div className="mb-4">
            <h2 className="text-xs font-bold uppercase tracking-widest border-b border-gray-300 pb-1 mb-2">
              Professional Summary
            </h2>
            <Textarea
              value={resumeData.summary}
              onChange={(e) => onEdit({ ...resumeData, summary: e.target.value })}
              className="text-xs text-gray-700 leading-relaxed border-none bg-transparent p-0 resize-none focus-visible:ring-1 min-h-[60px]"
            />
          </div>
        )}

        {/* Editable Experience */}
        {resumeData.experience.length > 0 && (
          <div className="mb-4">
            <h2 className="text-xs font-bold uppercase tracking-widest border-b border-gray-300 pb-1 mb-2">
              Work Experience
            </h2>
            <div className="space-y-3">
              {resumeData.experience.map((exp) => (
                <div key={exp.id}>
                  <div className="flex justify-between items-baseline">
                    <Input
                      value={exp.title || "Job Title"}
                      onChange={(e) =>
                        onEdit({
                          ...resumeData,
                          experience: resumeData.experience.map((ex) =>
                            ex.id === exp.id ? { ...ex, title: e.target.value } : ex,
                          ),
                        })
                      }
                      className="font-bold text-xs border-none bg-transparent p-0 h-auto focus-visible:ring-1 w-auto"
                    />
                    <span className="text-xs text-gray-500">
                      {exp.startDate} - {exp.endDate}
                    </span>
                  </div>
                  <div className="flex justify-between items-baseline text-xs text-gray-600 mb-1">
                    <span>{exp.company || "Company Name"}</span>
                    <span>{exp.location}</span>
                  </div>
                  <ul className="list-disc list-outside ml-4 space-y-0.5">
                    {exp.bullets.map((bullet) => (
                      <li key={bullet.id} className="text-xs text-gray-700">
                        <Textarea
                          value={bullet.text || "Bullet point..."}
                          onChange={(e) =>
                            onEdit({
                              ...resumeData,
                              experience: resumeData.experience.map((ex) =>
                                ex.id === exp.id
                                  ? {
                                    ...ex,
                                    bullets: ex.bullets.map((b) =>
                                      b.id === bullet.id ? { ...b, text: e.target.value } : b,
                                    ),
                                  }
                                  : ex,
                              ),
                            })
                          }
                          className="text-xs border-none bg-transparent p-0 resize-none focus-visible:ring-1 min-h-[40px] w-full"
                        />
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Non-editable Education and Skills in edit mode */}
        {resumeData.education.length > 0 && (
          <div className="mb-4">
            <h2 className="text-xs font-bold uppercase tracking-widest border-b border-gray-300 pb-1 mb-2">
              Education
            </h2>
            <div className="space-y-2">
              {resumeData.education.map((edu) => (
                <div key={edu.id}>
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-bold text-xs">{edu.degree || "Degree"}</h3>
                    <span className="text-xs text-gray-500">
                      {edu.startDate} - {edu.endDate}
                    </span>
                  </div>
                  <div className="flex justify-between items-baseline text-xs text-gray-600">
                    <span>{edu.school || "School Name"}</span>
                    <span>{edu.location}</span>
                  </div>
                  {edu.description && <p className="text-xs text-gray-500 mt-0.5">{edu.description}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        {resumeData.skills.length > 0 && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-widest border-b border-gray-300 pb-1 mb-2">
              Skills
            </h2>
            <p className="text-xs text-gray-700">{resumeData.skills.join(" • ")}</p>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="bg-white text-black p-8 min-h-full font-serif text-sm leading-relaxed">
      {/* Header */}
      <div className="text-center border-b border-gray-300 pb-4 mb-4">
        <h1 className="text-2xl font-bold tracking-wide uppercase mb-2">
          {resumeData.personalInfo.name || "Your Name"}
        </h1>
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs text-gray-600">
          {resumeData.personalInfo.email && (
            <span className="flex items-center gap-1">
              <Mail className="h-3 w-3" />
              {resumeData.personalInfo.email}
            </span>
          )}
          {resumeData.personalInfo.phone && (
            <span className="flex items-center gap-1">
              <Phone className="h-3 w-3" />
              {resumeData.personalInfo.phone}
            </span>
          )}
          {resumeData.personalInfo.location && (
            <span className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {resumeData.personalInfo.location}
            </span>
          )}
          {resumeData.personalInfo.linkedin && (
            <span className="flex items-center gap-1">
              <Linkedin className="h-3 w-3" />
              {resumeData.personalInfo.linkedin}
            </span>
          )}
        </div>
      </div>

      {/* Summary */}
      {resumeData.summary && (
        <div className="mb-4">
          <h2 className="text-xs font-bold uppercase tracking-widest border-b border-gray-300 pb-1 mb-2">
            Professional Summary
          </h2>
          <p className="text-xs text-gray-700 leading-relaxed">{resumeData.summary}</p>
        </div>
      )}

      {/* Experience */}
      {resumeData.experience.length > 0 && (
        <div className="mb-4">
          <h2 className="text-xs font-bold uppercase tracking-widest border-b border-gray-300 pb-1 mb-2">
            Work Experience
          </h2>
          <div className="space-y-3">
            {resumeData.experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-baseline">
                  <h3 className="font-bold text-xs">{exp.title || "Job Title"}</h3>
                  <span className="text-xs text-gray-500">
                    {exp.startDate} - {exp.endDate}
                  </span>
                </div>
                <div className="flex justify-between items-baseline text-xs text-gray-600 mb-1">
                  <span>{exp.company || "Company Name"}</span>
                  <span>{exp.location}</span>
                </div>
                <ul className="list-disc list-outside ml-4 space-y-0.5">
                  {exp.bullets.map((bullet) => (
                    <li key={bullet.id} className="text-xs text-gray-700">
                      {bullet.text || "Bullet point..."}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {resumeData.education.length > 0 && (
        <div className="mb-4">
          <h2 className="text-xs font-bold uppercase tracking-widest border-b border-gray-300 pb-1 mb-2">
            Education
          </h2>
          <div className="space-y-2">
            {resumeData.education.map((edu) => (
              <div key={edu.id}>
                <div className="flex justify-between items-baseline">
                  <h3 className="font-bold text-xs">{edu.degree || "Degree"}</h3>
                  <span className="text-xs text-gray-500">
                    {edu.startDate} - {edu.endDate}
                  </span>
                </div>
                <div className="flex justify-between items-baseline text-xs text-gray-600">
                  <span>{edu.school || "School Name"}</span>
                  <span>{edu.location}</span>
                </div>
                {edu.description && <p className="text-xs text-gray-500 mt-0.5">{edu.description}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills */}
      {resumeData.skills.length > 0 && (
        <div>
          <h2 className="text-xs font-bold uppercase tracking-widest border-b border-gray-300 pb-1 mb-2">
            Skills
          </h2>
          <p className="text-xs text-gray-700">{resumeData.skills.join(" • ")}</p>
        </div>
      )}
    </div>
  )
}

const ResumeEditor = ({ onBack, initialFile = null, initialExtractedText = "" }) => {
  const posthog = usePostHog()
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false)
  // Upload state
  const [uploadedFile, setUploadedFile] = useState(initialFile)
  const [isParsing, setIsParsing] = useState(false)
  // Mobile responsive mode toggle
  const [mobileView, setMobileView] = useState("editor") // 'editor' | 'preview'

  const fileInputRef = useRef(null)
  // Skill Modal State
  const [isSkillModalOpen, setIsSkillModalOpen] = useState(false)
  const [newSkill, setNewSkill] = useState("")

  // Resume data state
  const [resumeData, setResumeData] = useState(null)
  const [originalFileUrl, setOriginalFileUrl] = useState("")

  // Preview editing state
  const [isPreviewEditing, setIsPreviewEditing] = useState(false)

  // AI enhancement state (enhance existing bullet)
  const [activeEnhanceBulletId, setActiveEnhanceBulletId] = useState(null)
  const [enhanceAiSuggestions, setEnhanceAiSuggestions] = useState([])
  const [isGeneratingEnhance, setIsGeneratingEnhance] = useState(false)

  // AI add-bullet state (generate new bullets)
  const [showNewBulletAIExpId, setShowNewBulletAIExpId] = useState(null)
  const [addAiSuggestions, setAddAiSuggestions] = useState([])
  const [isGeneratingAdd, setIsGeneratingAdd] = useState(false)

  // Section collapse state
  const [collapsedSections, setCollapsedSections] = useState({})
  const [showFeedbackModal, setShowFeedbackModal] = useState(false)
  const dispatch = useDispatch()
  const [typingIndex, setTypingIndex] = useState(0)

  useEffect(() => {
    if (resumeData) {
      posthog?.capture("resume_editor_opened", {
        has_file: !!uploadedFile,
        source_job_id: location.state?.source_job_id || null,
        source_job_title: location.state?.source_job_title || null,
      })
    }
  }, [resumeData, posthog])

  useEffect(() => {
    if (!isParsing) return

    let i = 0
    const interval = setInterval(() => {
      i++
      if (i >= 5) {
        clearInterval(interval)
        return
      }
      setTypingIndex(i)
    }, 4000)

    return () => clearInterval(interval)
  }, [isParsing])

  const handlePreviewEdit = (updatedData) => {
    setResumeData(updatedData)
  }

  const handlePreviewEditToggle = () => {
    if (isPreviewEditing) {
      toast.success("Preview changes saved!")
      track("PreviewEditingSaved")
    } else {
      track("PreviewEditingStarted")
    }
    setIsPreviewEditing(!isPreviewEditing)
  }

  const generateAIBullets = async (bulletText, jobTitle) => {
    // ✅ UPDATED: Changed bulletText → bullet_text, jobTitle → job_title (snake_case)
    const result = await dispatch(
      improveBulletThunk({
        bullet_text: bulletText,
        job_title: jobTitle,
      }),
    )

    if (result.meta.requestStatus === "fulfilled") {
      // ✅ UPDATED: Handle both response formats
      return result.payload.improved_bullet ? [result.payload.improved_bullet] : result.payload.improvements || []
    } else {
      toast.error("Failed to improve bullet")
      return []
    }
  }

  const generateNewBullet = async (jobTitle, company) => {
    // ✅ UPDATED: Changed jobTitle → job_title (snake_case)
    const result = await dispatch(
      generateNewBulletThunk({
        job_title: jobTitle,
        company: company,
      }),
    )

    if (result.meta.requestStatus === "fulfilled") {
      // ✅ UPDATED: Handle both response formats
      return result.payload.bullet ? [result.payload.bullet] : result.payload.newBullets || []
    } else {
      toast.error("Could not generate bullet")
      return []
    }
  }

  const BASE_URL =
    "https://rizzource-c2amh0adhpcbgjgx.canadacentral-01.azurewebsites.net/api"

  // Handle file upload
  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    const validTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ]
    if (!validTypes.includes(file.type)) {
      toast.error("Please upload a PDF or DOCX file")
      return
    }

    track("ResumeUpload", {
      fileName: file.name,
      fileType: file.type,
      fileSize: file.size,
    })
    posthog?.capture("resume_uploaded", {
      file_type: file.type,
      file_size_kb: Math.round(file.size / 1024),
      method: "file-input",
    })

    setUploadedFile(file)
    setIsParsing(true)

    dispatch(fileUpload({ file }))
      .unwrap()
      .then((data) => {
        setResumeData(data.resume)
        setOriginalFileUrl(data.fileUrl)
        setIsParsing(false)
        track("ResumeParsed", {
          success: true,
          resumeSections: Object.keys(data.resume || {}),
        })
        toast.success("Resume parsed successfully!")
      })
      .catch((err) => {
        setIsParsing(false)
        track("ResumeParsed", { success: false })
        toast.error(err || "Failed to parse resume")
      })
  }

  const onDownloadPdf = async () => {
    if (isDownloadingPdf) return

    setIsDownloadingPdf(true)

    try {
      const html = buildResumeHtml(
        resumeData,
        resumeData?.personalInfo?.name || "Resume"
      )

      const fileName =
        `${resumeData?.personalInfo?.name
          ?.toLowerCase()
          .replace(/\s+/g, "_")}_Resume` || "resume"

      const result = await dispatch(
        exportPdfThunk({
          html,
          fileName,
        })
      )

      if (!exportPdfThunk.fulfilled.match(result)) {
        throw new Error(result.payload || "PDF export failed")
      }

      const blob = result.payload

      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `${fileName}.pdf`
      document.body.appendChild(a)
      a.click()

      a.remove()
      window.URL.revokeObjectURL(url)

      toast.success("PDF downloaded successfully!")

      setTimeout(() => {
        setShowFeedbackModal(true)
      }, 1000)

      track("ResumeDownloaded", {
        sectionCount: Object.keys(resumeData || {}).length,
        method: "backend_pdf",
      })
    } catch (err) {
      console.error(err)
      toast.error("Failed to export PDF")
      track("ResumeDownloadFailed")
    } finally {
      setIsDownloadingPdf(false)
    }
  }



  const handleDrop = useCallback(async (e) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (!file) return

    const validTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ]
    if (!validTypes.includes(file.type)) {
      toast.error("Please upload a PDF or DOCX file")
      return
    }

    track("ResumeUpload", {
      method: "drag-drop",
      fileName: file.name,
      fileType: file.type,
      fileSize: file.size,
    })
    posthog?.capture("resume_uploaded", {
      file_type: file.type,
      file_size_kb: Math.round(file.size / 1024),
      method: "drag-drop",
    })

    setUploadedFile(file)
    setIsParsing(true)

    dispatch(fileUpload({ file }))
      .unwrap()
      .then((data) => {
        setResumeData(data.resume)
        setOriginalFileUrl(data.fileUrl)
        setIsParsing(false)
        toast.success("Resume parsed successfully!")
        track("ResumeParsed", {
          success: true,
          parsedFrom: "drag-drop",
        })
      })
      .catch((err) => {
        setIsParsing(false)
        toast.error(err || "Failed to parse resume")
        track("ResumeParsed", { success: false })
      })
  }, [])

  // AI Bullet Enhancement
  const handleEnhanceBullet = async (expId, bulletId, bulletText) => {
    const exp = resumeData?.experience.find((e) => e.id === expId)
    if (!exp) return

    setActiveEnhanceBulletId(bulletId)
    setIsGeneratingEnhance(true)
    setEnhanceAiSuggestions([])
    track("AIBulletImproveStarted", {
      bulletId,
      expId,
      bulletLength: bulletText.length,
    })
    posthog?.capture("ai_resume_enhance_bullet", {
      exp_id: expId,
      bullet_id: bulletId,
      bullet_length: bulletText.length,
    })

    try {
      const suggestions = await generateAIBullets(bulletText, exp.title)
      setEnhanceAiSuggestions(
        suggestions
          .filter((text) => /^\d+\.\s*".*"$/.test(text))
          .map((text, i) => ({
            id: `sug-${i}`,
            text: text
              .replace(/^\d+\.\s*/, "")
              .replace(/^"|"$|^"+|"+$/g, ""),
          })),
      )
      track("AIBulletImproveCompleted", {
        count: suggestions.length,
      })
      posthog?.capture("ai_resume_enhance_completed", {
        suggestion_count: suggestions.length,
      })
    } catch (error) {
      toast.error("Failed to generate suggestions")
      track("AIBulletImproveFailed")
      posthog?.capture("ai_resume_enhance_failed")
    } finally {
      setIsGeneratingEnhance(false)
    }
  }

  const handleRegenerateSuggestions = async () => {
    if (!activeEnhanceBulletId || !resumeData) return

    const exp = resumeData.experience.find((e) =>
      e.bullets.some((b) => b.id === activeEnhanceBulletId),
    )
    const bullet = exp?.bullets.find((b) => b.id === activeEnhanceBulletId)
    if (!exp || !bullet) return

    track("AIRegenerateSuggestions", { bulletId: activeEnhanceBulletId })
    posthog?.capture("ai_resume_regenerate_suggestions", {
      bullet_id: activeEnhanceBulletId,
    })

    setIsGeneratingEnhance(true)
    try {
      const suggestions = await generateAIBullets(bullet.text, exp.title)
      setEnhanceAiSuggestions(
        suggestions
          .filter((text) => /^\d+\.\s*".*"$/.test(text))
          .map((text, i) => ({
            id: `sug-${i}`,
            text: text
              .replace(/^\d+\.\s*/, "")
              .replace(/^"|"$|^"+|"+$/g, ""),
          })),
      )
    } catch (error) {
      toast.error("Failed to regenerate suggestions")
    } finally {
      setIsGeneratingEnhance(false)
    }
  }

  const handleUseSuggestion = (expId, bulletId, newText) => {
    if (!resumeData) return
    track("AIBulletSuggestionUsed", { expId, bulletId })
    posthog?.capture("ai_bullet_suggestion_used", {
      exp_id: expId,
      bullet_id: bulletId,
    })

    setResumeData({
      ...resumeData,
      experience: resumeData.experience.map((exp) =>
        exp.id === expId
          ? {
            ...exp,
            bullets: exp.bullets.map((b) => (b.id === bulletId ? { ...b, text: newText } : b)),
          }
          : exp,
      ),
    })
    setActiveEnhanceBulletId(null)
    setEnhanceAiSuggestions([])
    toast.success("Bullet updated!")
  }

  // Add new bullet with AI
  const handleAddBulletWithAI = async (expId) => {
    const exp = resumeData?.experience.find((e) => e.id === expId)
    if (exp?.length == 0) return

    setShowNewBulletAIExpId(expId)
    setIsGeneratingAdd(true)
    setAddAiSuggestions([])
    track("AIAddBulletStarted", { expId })
    posthog?.capture("ai_resume_add_bullet", {
      exp_id: expId,
      job_title: exp.title,
    })

    try {
      const suggestions = await generateNewBullet(exp.title, exp.company)
      const filteredSuggestions = suggestions.map((text, i) => ({
        id: `sug-${i}`,
        text: text.replace(/^-+\s*/, ""),
      }))
      setAddAiSuggestions(filteredSuggestions)
      track("AIAddBulletCompleted", { count: suggestions.length })
      posthog?.capture("ai_resume_add_completed", {
        suggestion_count: suggestions.length,
      })
    } catch (error) {
      toast.error("Failed to generate bullet suggestions")
      track("AIAddBulletFailed")
      posthog?.capture("ai_resume_add_failed")
    } finally {
      setIsGeneratingAdd(false)
    }
  }

  const handleAddGeneratedBullet = (expId, text) => {
    if (!resumeData) return

    const newBullet = { id: `b-${Date.now()}`, text }
    track("AIBulletAdded", { expId, length: text.length })
    posthog?.capture("resume_edited_manually", {
      field_type: "bullet",
      section_type: "experience",
      action: "add",
      exp_id: expId,
    })

    setResumeData({
      ...resumeData,
      experience: resumeData.experience.map((exp) =>
        exp.id === expId ? { ...exp, bullets: [...exp.bullets, newBullet] } : exp,
      ),
    })

    setShowNewBulletAIExpId(null)
    setAddAiSuggestions([])
    toast.success("Bullet added!")
  }

  // Manual bullet operations
  const handleAddManualBullet = (expId) => {
    if (!resumeData) return
    track("ManualBulletAdded", { expId })

    const newBullet = { id: `b-${Date.now()}`, text: "" }
    setResumeData({
      ...resumeData,
      experience: resumeData.experience.map((exp) =>
        exp.id === expId ? { ...exp, bullets: [...exp.bullets, newBullet] } : exp,
      ),
    })
  }

  const handleUpdateBullet = (expId, bulletId, text) => {
    if (!resumeData) return
    track("ManualBulletEdited", { expId, bulletId, newLength: text.length })
    posthog?.capture("resume_edited_manually", {
      field_type: "bullet",
      section_type: "experience",
      action: "edit",
      exp_id: expId,
      bullet_id: bulletId,
      new_length: text.length,
    })

    setResumeData({
      ...resumeData,
      experience: resumeData.experience.map((exp) =>
        exp.id === expId
          ? { ...exp, bullets: exp.bullets.map((b) => (b.id === bulletId ? { ...b, text } : b)) }
          : exp,
      ),
    })
  }

  const handleDeleteBullet = (expId, bulletId) => {
    if (!resumeData) return
    track("ManualBulletDeleted", { expId, bulletId })
    posthog?.capture("resume_edited_manually", {
      field_type: "bullet",
      section_type: "experience",
      action: "delete",
      exp_id: expId,
      bullet_id: bulletId,
    })

    setResumeData({
      ...resumeData,
      experience: resumeData.experience.map((exp) =>
        exp.id === expId ? { ...exp, bullets: exp.bullets.filter((b) => b.id !== bulletId) } : exp,
      ),
    })
    toast.success("Bullet removed")
  }

  // Section toggle
  const toggleSection = (sectionId) => {
    setCollapsedSections((prev) => ({ ...prev, [sectionId]: !prev[sectionId] }))
    track("ResumeSectionToggled", {
      section: sectionId,
      collapsed: !collapsedSections[sectionId],
    })
  }

  // Upload Screen
  if (!resumeData) {
    return (
      <div className="min-h-screen bg-warm-cream">
        <Toaster richColors closeButton position="top-center" />
        <div className="container mx-auto px-4 py-12 max-w-3xl">
          <Button
            variant="ghost"
            onClick={() => onBack()}
            className="mb-10 text-warm-gray hover:text-electric-teal"
          >
            <ArrowLeft className="h-4 w-4 mr-2" /> Back
          </Button>

          <Card className={cardShell}>
            <CardHeader className={`${cardHeaderShell} text-center`}>
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 rounded-[2rem] bg-gradient-to-br from-electric-teal/20 to-transparent flex items-center justify-center">
                  <FileText className="h-8 w-8 text-electric-teal" />
                </div>
              </div>

              <div className="flex items-center justify-center gap-2 mb-4">
                <span className={badgeSoft}>
                  <Sparkles className="h-3 w-3 animate-pulse" />
                  AI-Powered Tool
                </span>
                <span className={badgeBeta}>BETA</span>
              </div>

              <CardTitle className="text-4xl md:text-5xl font-black leading-[0.95] tracking-tighter text-charcoal uppercase">
                Upload Your <span className="text-electric-teal">Resume</span>
              </CardTitle>

              <p className="text-warm-gray font-bold uppercase tracking-wider mt-4 max-w-xl mx-auto">
                Upload a PDF or DOCX — we’ll parse, structure, and enhance with AI.
              </p>
            </CardHeader>

            <CardContent className="p-8 md:p-10 space-y-8">
              <div
                className={`
                  border-2 border-dashed rounded-3xl p-12 text-center
                  transition-all duration-300 cursor-pointer
                  ${isParsing ? "border-electric-teal bg-soft-teal/40" : "border-electric-teal/30 hover:border-electric-teal hover:bg-soft-teal/50 hover:shadow-2xl"}
                `}
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.docx"
                  onChange={handleFileSelect}
                  className="hidden"
                />

                {isParsing ? (
                  <div className="flex flex-col items-center gap-8 py-10">
                    <div className="relative">
                      <div className="w-24 h-24 rounded-full bg-electric-teal/10 flex items-center justify-center animate-pulse">
                        <Loader2 className="h-10 w-10 text-electric-teal animate-spin" />
                      </div>
                    </div>

                    <div className="flex flex-col items-center gap-2">
                      <p className="text-lg font-black uppercase tracking-wider text-deep-teal">
                        AI is analyzing your resume
                      </p>

                      <p
                        key={typingIndex}
                        className="text-base font-bold text-center text-charcoal overflow-hidden whitespace-nowrap border-r-4 border-electric-teal pr-2 animate-typing"
                      >
                        {[
                          "Reading your resume...",
                          "Detecting Experience...",
                          "Extracting Skills...",
                          "Fixing inconsistencies...",
                          "Preparing structured data...",
                        ][typingIndex]}
                      </p>
                    </div>

                    <p className="text-warm-gray font-bold uppercase tracking-wider text-xs">
                      Hang tight — this usually takes ~20 seconds.
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-6">
                    <div className="relative">
                      <div className="w-20 h-20 rounded-full bg-soft-teal flex items-center justify-center transition-transform group-hover:scale-110">
                        <FileUp className="h-10 w-10 text-electric-teal" />
                      </div>
                      <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-electric-teal flex items-center justify-center">
                        <Upload className="h-4 w-4 text-white" />
                      </div>
                    </div>

                    <div>
                      <p className="font-black uppercase tracking-widest text-sm text-charcoal">
                        Drop your resume here or click to browse
                      </p>
                      <p className="text-warm-gray font-bold uppercase tracking-wider text-xs mt-2">
                        We’ll parse and structure your content automatically
                      </p>
                    </div>

                    <div className="flex gap-3 justify-center">
                      <span className={badgeSoft}>
                        <FileCheck className="h-3.5 w-3.5 text-coral" />
                        PDF
                      </span>
                      <span className={badgeSoft}>
                        <FileCheck className="h-3.5 w-3.5 text-electric-teal" />
                        DOCX
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                <div className={hoverCard}>
                  <div className={hoverOverlay} />
                  <div className="relative p-6 flex flex-col items-center text-center gap-2">
                    <div className="w-11 h-11 rounded-full bg-electric-teal/10 flex items-center justify-center">
                      <Sparkles className="h-5 w-5 text-electric-teal" />
                    </div>
                    <p className="text-sm font-black uppercase tracking-wider text-charcoal">AI-Powered</p>
                    <p className="text-xs text-warm-gray font-bold uppercase tracking-wider">
                      Enhance bullets with AI
                    </p>
                  </div>
                </div>

                <div className={hoverCard}>
                  <div className={hoverOverlay} />
                  <div className="relative p-6 flex flex-col items-center text-center gap-2">
                    <div className="w-11 h-11 rounded-full bg-soft-teal flex items-center justify-center">
                      <Shield className="h-5 w-5 text-deep-teal" />
                    </div>
                    <p className="text-sm font-black uppercase tracking-wider text-charcoal">Secure</p>
                    <p className="text-xs text-warm-gray font-bold uppercase tracking-wider">
                      Your data stays private
                    </p>
                  </div>
                </div>

                <div className={hoverCard}>
                  <div className={hoverOverlay} />
                  <div className="relative p-6 flex flex-col items-center text-center gap-2">
                    <div className="w-11 h-11 rounded-full bg-ai-violet/10 flex items-center justify-center">
                      <Zap className="h-5 w-5 text-ai-violet" />
                    </div>
                    <p className="text-sm font-black uppercase tracking-wider text-charcoal">Instant</p>
                    <p className="text-xs text-warm-gray font-bold uppercase tracking-wider">
                      Results in seconds
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Main Editor with Side-by-Side Preview
  return (
    <div className="min-h-screen bg-warm-cream" style={{ marginTop: 70 }}>
      <FeedbackModal
        isOpen={showFeedbackModal}
        onClose={() => setShowFeedbackModal(false)}
        feedbackType="resume"
        title="How was your experience?"
        description="Your feedback helps us create better resumes for everyone"
      />
      <Toaster richColors closeButton position="top-center" />

      {/* Mobile Toggle Bar */}
      <div className="md:hidden sticky top-[73px] z-20 bg-warm-cream border-b border-charcoal/10">
        <div className="p-2">
          <div className="flex gap-2 p-2 bg-warm-cream rounded-2xl border border-charcoal/10">
            <Button
              variant={mobileView === "editor" ? "default" : "ghost"}
              className={`flex-1 rounded-xl font-bold uppercase tracking-wider text-xs ${mobileView === "editor" ? "bg-charcoal text-white" : "text-warm-gray hover:text-electric-teal"
                }`}
              onClick={() => setMobileView("editor")}
            >
              Editor
            </Button>
            <Button
              variant={mobileView === "preview" ? "default" : "ghost"}
              className={`flex-1 rounded-xl font-bold uppercase tracking-wider text-xs ${mobileView === "preview" ? "bg-charcoal text-white" : "text-warm-gray hover:text-electric-teal"
                }`}
              onClick={() => setMobileView("preview")}
            >
              Preview
            </Button>
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-73px)] md:flex-row flex-col">
        {/* Left Panel - Editor */}
        <div
          className={`
            border-r border-charcoal/10 overflow-hidden
            ${mobileView === "editor" ? "block" : "hidden"}
            md:block md:w-1/2
          `}
        >
          <ScrollArea className="h-full">
            <div className="p-6 space-y-8 md:space-y-6">
              <Button
                variant="ghost"
                onClick={() => setResumeData(false)}
                size="sm"
                className="text-warm-gray hover:text-electric-teal"
              >
                <ArrowLeft className="h-4 w-4 mr-2" /> Back
              </Button>

              {/* Personal Info Section */}
              <Card className={cardShell}>
                <CardHeader className={`${cardHeaderShell} cursor-pointer`} onClick={() => toggleSection("personal")}>
                  <div className="flex items-center justify-between">
                    <CardTitle className={cardTitleShell}>
                      <User className={sectionIcon} />
                      Personal Information
                    </CardTitle>
                    {collapsedSections["personal"] ? (
                      <ChevronDown className="h-5 w-5 text-warm-gray" />
                    ) : (
                      <ChevronUp className="h-5 w-5 text-warm-gray" />
                    )}
                  </div>
                </CardHeader>

                {!collapsedSections["personal"] && (
                  <CardContent className="p-8 pt-0 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-4">
                      <div>
                        <label className="text-xs font-bold uppercase tracking-wider text-warm-gray">
                          Full Name
                        </label>
                        <Input
                          value={resumeData.personalInfo.name}
                          onChange={(e) =>
                            setResumeData({
                              ...resumeData,
                              personalInfo: { ...resumeData.personalInfo, name: e.target.value },
                            })
                          }
                          className={`mt-2 ${inputShell}`}
                        />
                      </div>

                      <div>
                        <label className="text-xs font-bold uppercase tracking-wider text-warm-gray">
                          Email
                        </label>
                        <Input
                          value={resumeData.personalInfo.email}
                          onChange={(e) =>
                            setResumeData({
                              ...resumeData,
                              personalInfo: { ...resumeData.personalInfo, email: e.target.value },
                            })
                          }
                          className={`mt-2 ${inputShell}`}
                        />
                      </div>

                      <div>
                        <label className="text-xs font-bold uppercase tracking-wider text-warm-gray">
                          Phone
                        </label>
                        <Input
                          value={resumeData.personalInfo.phone}
                          onChange={(e) =>
                            setResumeData({
                              ...resumeData,
                              personalInfo: { ...resumeData.personalInfo, phone: e.target.value },
                            })
                          }
                          className={`mt-2 ${inputShell}`}
                        />
                      </div>

                      <div>
                        <label className="text-xs font-bold uppercase tracking-wider text-warm-gray">
                          Location
                        </label>
                        <Input
                          value={resumeData.personalInfo.location}
                          onChange={(e) =>
                            setResumeData({
                              ...resumeData,
                              personalInfo: { ...resumeData.personalInfo, location: e.target.value },
                            })
                          }
                          className={`mt-2 ${inputShell}`}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-bold uppercase tracking-wider text-warm-gray">
                        LinkedIn
                      </label>
                      <Input
                        value={resumeData.personalInfo.linkedin}
                        onChange={(e) =>
                          setResumeData({
                            ...resumeData,
                            personalInfo: { ...resumeData.personalInfo, linkedin: e.target.value },
                          })
                        }
                        className={`mt-2 ${inputShell}`}
                      />
                    </div>
                  </CardContent>
                )}
              </Card>

              {/* Summary Section */}
              <Card className={cardShell}>
                <CardHeader className={`${cardHeaderShell} cursor-pointer`} onClick={() => toggleSection("summary")}>
                  <div className="flex items-center justify-between">
                    <CardTitle className={cardTitleShell}>
                      <Award className={sectionIcon} />
                      Professional Summary
                    </CardTitle>
                    {collapsedSections["summary"] ? (
                      <ChevronDown className="h-5 w-5 text-warm-gray" />
                    ) : (
                      <ChevronUp className="h-5 w-5 text-warm-gray" />
                    )}
                  </div>
                </CardHeader>

                {!collapsedSections["summary"] && (
                  <CardContent className="p-8 pt-0">
                    <Textarea
                      value={resumeData.summary}
                      onChange={(e) => setResumeData({ ...resumeData, summary: e.target.value })}
                      rows={3}
                      className={`resize-none min-h-[140px] ${textareaShell}`}
                    />
                  </CardContent>
                )}
              </Card>

              {/* Work Experience Section */}
              <Card className={cardShell}>
                <CardHeader className={cardHeaderShell}>
                  <CardTitle className={cardTitleShell}>
                    <Briefcase className={sectionIcon} />
                    Work Experience
                  </CardTitle>
                </CardHeader>

                <CardContent className="p-8 pt-0 space-y-6">
                  {resumeData.experience.map((exp) => (
                    <div key={exp.id} className={hoverCard}>
                      <div className={hoverOverlay} />
                      <div className="relative p-6 space-y-4">
                        {/* Experience Header */}
                        <div className="space-y-3">
                          <Input
                            value={exp.title}
                            onChange={(e) =>
                              setResumeData({
                                ...resumeData,
                                experience: resumeData.experience.map((ex) =>
                                  ex.id === exp.id ? { ...ex, title: e.target.value } : ex,
                                ),
                              })
                            }
                            className="text-xl font-black uppercase tracking-tight border-none bg-transparent p-0 h-auto focus-visible:ring-0 text-charcoal"
                            placeholder="Job Title"
                          />

                          <div className="flex items-center gap-2 text-warm-gray text-sm font-bold uppercase tracking-wider">
                            <Input
                              value={exp.company}
                              onChange={(e) =>
                                setResumeData({
                                  ...resumeData,
                                  experience: resumeData.experience.map((ex) =>
                                    ex.id === exp.id ? { ...ex, company: e.target.value } : ex,
                                  ),
                                })
                              }
                              className="border-none bg-transparent p-0 h-auto focus-visible:ring-0 w-auto text-sm font-bold uppercase tracking-wider text-warm-gray"
                              placeholder="Company"
                            />
                            <span className="opacity-60">•</span>
                            <span className="text-xs font-black uppercase tracking-widest">
                              {exp.startDate} - {exp.endDate}
                            </span>
                          </div>
                        </div>

                        {/* Bullets */}
                        <div className="space-y-4">
                          {exp.bullets.map((bullet) => (
                            <div key={bullet.id} className="group relative">
                              <div className="flex items-start gap-2">
                                <GripVertical className="h-4 w-4 mt-4 text-warm-gray/40 cursor-grab opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />

                                <div className="flex-1 relative">
                                  <Textarea
                                    value={bullet.text}
                                    onChange={(e) => handleUpdateBullet(exp.id, bullet.id, e.target.value)}
                                    className={`min-h-[70px] pr-24 ${textareaShell}`}
                                    rows={2}
                                  />

                                  {/* Action buttons on hover */}
                                  <div className="absolute right-3 top-3 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Button
                                      className={`${aiBtn} h-8 px-3`}
                                      onClick={() => handleEnhanceBullet(exp.id, bullet.id, bullet.text)}
                                      title="Improve with AI"
                                    >
                                      <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                                      <Wand2 className="h-4 w-4 mr-2" />
                                      Improve
                                    </Button>

                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-8 w-8 p-0 rounded-xl text-coral hover:text-coral/80 hover:bg-coral/10"
                                      onClick={() => handleDeleteBullet(exp.id, bullet.id)}
                                      title="Delete bullet"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </div>
                              </div>

                              {/* AI Suggestions Panel (enhance existing bullet) */}
                              {activeEnhanceBulletId === bullet.id && (
                                <div className="mt-3 ml-6 p-5 border-2 border-charcoal/10 rounded-3xl bg-warm-cream space-y-3">
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                      <Sparkles className="h-4 w-4 text-electric-teal animate-pulse" />
                                      <span className="font-black uppercase tracking-wider text-xs text-charcoal">
                                        AI Suggestions
                                      </span>
                                      <span className={badgeBeta}>AI</span>
                                    </div>

                                    <div className="flex items-center gap-2">
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={handleRegenerateSuggestions}
                                        disabled={isGeneratingEnhance}
                                        className={secondaryBtn}
                                      >
                                        {isGeneratingEnhance ? (
                                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                        ) : (
                                          <RefreshCw className="h-4 w-4 mr-2" />
                                        )}
                                        Regenerate
                                      </Button>

                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => {
                                          setActiveEnhanceBulletId(null)
                                          setEnhanceAiSuggestions([])
                                        }}
                                        className="h-10 w-10 rounded-2xl text-warm-gray hover:text-electric-teal hover:bg-soft-teal"
                                      >
                                        <X className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  </div>

                                  {isGeneratingEnhance ? (
                                    <div className="text-center py-8">
                                      <div className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-soft-teal">
                                        <div className="h-4 w-4 rounded-full bg-electric-teal animate-pulse" />
                                        <span className="font-black uppercase tracking-widest text-xs text-deep-teal">
                                          Generating...
                                        </span>
                                      </div>
                                    </div>
                                  ) : (
                                    <div className="space-y-2">
                                      {enhanceAiSuggestions.map((suggestion) => (
                                        <div
                                          key={suggestion.id}
                                          className="flex items-start gap-3 p-3 rounded-2xl border-2 border-charcoal/10 hover:bg-soft-teal/40 transition-colors group/suggestion"
                                        >
                                          <p className="flex-1 text-sm text-charcoal font-medium">
                                            {suggestion.text}
                                          </p>

                                          <Button
                                            variant="outline"
                                            size="sm"
                                            className={`${secondaryBtn} h-10 opacity-0 group-hover/suggestion:opacity-100 transition-opacity bg-transparent shrink-0`}
                                            onClick={() => handleUseSuggestion(exp.id, bullet.id, suggestion.text)}
                                          >
                                            <Check className="h-4 w-4 mr-2" />
                                            Use
                                          </Button>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>

                        {/* Add Bullet Actions */}
                        <div className="pt-2 pl-6 flex items-center gap-3">
                          <Button
                            className={aiBtn}
                            onClick={() => handleAddBulletWithAI(exp.id)}
                          >
                            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                            <Sparkles className="h-4 w-4 mr-2 animate-pulse" />
                            Write with AI
                          </Button>

                          <Button
                            variant="outline"
                            className={secondaryBtn}
                            onClick={() => handleAddManualBullet(exp.id)}
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Add Bullet
                          </Button>
                        </div>

                        {/* New Bullet AI Panel (add new bullets) */}
                        {showNewBulletAIExpId === exp.id && (
                          <div className="mt-4 p-5 border-2 border-charcoal/10 rounded-3xl bg-warm-cream space-y-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Sparkles className="h-4 w-4 text-electric-teal animate-pulse" />
                                <span className="font-black uppercase tracking-wider text-xs text-charcoal">
                                  AI Generated Bullets
                                </span>
                                <span className={badgeBeta}>AI</span>
                              </div>

                              <div className="flex items-center gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleAddBulletWithAI(exp.id)}
                                  disabled={isGeneratingAdd}
                                  className={secondaryBtn}
                                >
                                  {isGeneratingAdd ? (
                                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                  ) : (
                                    <RefreshCw className="h-4 w-4 mr-2" />
                                  )}
                                  Regenerate
                                </Button>

                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    setShowNewBulletAIExpId(null)
                                    setAddAiSuggestions([])
                                  }}
                                  className="h-10 w-10 rounded-2xl text-warm-gray hover:text-electric-teal hover:bg-soft-teal"
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>

                            {isGeneratingAdd ? (
                              <div className="text-center py-8">
                                <div className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-soft-teal">
                                  <div className="h-4 w-4 rounded-full bg-electric-teal animate-pulse" />
                                  <span className="font-black uppercase tracking-widest text-xs text-deep-teal">
                                    Generating...
                                  </span>
                                </div>
                              </div>
                            ) : (
                              <div className="space-y-2">
                                {addAiSuggestions.map((suggestion) => (
                                  <div
                                    key={suggestion.id}
                                    className="flex items-start gap-3 p-3 rounded-2xl border-2 border-charcoal/10 hover:bg-soft-teal/40 transition-colors group/suggestion"
                                  >
                                    <p className="flex-1 text-sm text-charcoal font-medium">
                                      {suggestion.text}
                                    </p>

                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className={`${secondaryBtn} h-10 opacity-0 group-hover/suggestion:opacity-100 transition-opacity bg-transparent shrink-0`}
                                      onClick={() => handleAddGeneratedBullet(exp.id, suggestion.text)}
                                    >
                                      <Check className="h-4 w-4 mr-2" />
                                      Use
                                    </Button>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Education Section */}
              <Card className={cardShell}>
                <CardHeader className={`${cardHeaderShell} cursor-pointer`} onClick={() => toggleSection("education")}>
                  <div className="flex items-center justify-between">
                    <CardTitle className={cardTitleShell}>
                      <GraduationCap className={sectionIcon} />
                      Education
                    </CardTitle>
                    {collapsedSections["education"] ? (
                      <ChevronDown className="h-5 w-5 text-warm-gray" />
                    ) : (
                      <ChevronUp className="h-5 w-5 text-warm-gray" />
                    )}
                  </div>
                </CardHeader>

                {!collapsedSections["education"] && (
                  <CardContent className="p-8 pt-0 space-y-4">
                    {resumeData.education.map((edu) => (
                      <div key={edu.id} className={hoverCard}>
                        <div className={hoverOverlay} />
                        <div className="relative p-6 space-y-3">
                          <Input
                            value={edu.degree}
                            onChange={(e) =>
                              setResumeData({
                                ...resumeData,
                                education: resumeData.education.map((ed) =>
                                  ed.id === edu.id ? { ...ed, degree: e.target.value } : ed,
                                ),
                              })
                            }
                            className="text-lg font-black uppercase tracking-tight border-none bg-transparent p-0 h-auto focus-visible:ring-0 text-charcoal"
                            placeholder="Degree"
                          />

                          <div className="flex items-center gap-2 text-warm-gray text-xs font-bold uppercase tracking-wider">
                            <span>{edu.school}</span>
                            <span className="opacity-60">•</span>
                            <span className="font-black uppercase tracking-widest">
                              {edu.startDate} - {edu.endDate}
                            </span>
                          </div>

                          <Input
                            value={edu.description}
                            onChange={(e) =>
                              setResumeData({
                                ...resumeData,
                                education: resumeData.education.map((ed) =>
                                  ed.id === edu.id ? { ...ed, description: e.target.value } : ed,
                                ),
                              })
                            }
                            className="border-none bg-transparent p-0 h-auto focus-visible:ring-0 text-sm text-warm-gray font-medium"
                            placeholder="Additional details..."
                          />
                        </div>
                      </div>
                    ))}
                  </CardContent>
                )}
              </Card>

              {/* Skills Section */}
              <Card className={cardShell}>
                <CardHeader className={`${cardHeaderShell} cursor-pointer`} onClick={() => toggleSection("skills")}>
                  <div className="flex items-center justify-between">
                    <CardTitle className={cardTitleShell}>
                      <Award className={sectionIcon} />
                      Skills
                    </CardTitle>
                    {collapsedSections["skills"] ? (
                      <ChevronDown className="h-5 w-5 text-warm-gray" />
                    ) : (
                      <ChevronUp className="h-5 w-5 text-warm-gray" />
                    )}
                  </div>
                </CardHeader>

                {!collapsedSections["skills"] && (
                  <CardContent className="p-8 pt-0">
                    <div className="flex flex-wrap gap-2">
                      {resumeData.skills.map((skill, index) => (
                        <Badge
                          key={index}
                          className="px-4 py-2 text-[10px] font-black uppercase tracking-wider rounded-full bg-soft-teal text-deep-teal border-none"
                        >
                          {skill}
                          <button
                            className="ml-2 text-deep-teal/70 hover:text-coral transition-colors"
                            onClick={() =>
                              setResumeData({
                                ...resumeData,
                                skills: resumeData.skills.filter((_, i) => i !== index),
                              })
                            }
                            type="button"
                            aria-label="Remove skill"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </Badge>
                      ))}

                      <Button
                        variant="outline"
                        size="sm"
                        className={secondaryBtn}
                        onClick={() => setIsSkillModalOpen(true)}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add
                      </Button>
                    </div>
                  </CardContent>
                )}
              </Card>
            </div>
          </ScrollArea>
        </div>

        {/* Right Panel - Live Preview */}
        <div
          className={`
            bg-warm-cream overflow-hidden
            ${mobileView === "preview" ? "block" : "hidden"}
            md:block md:w-1/2
          `}
        >
          <div className="h-full flex flex-col">
            <div className="p-4 border-b border-charcoal/10 bg-white flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className={badgeSoft}>
                  <Sparkles className="h-3 w-3 animate-pulse" />
                  Live Preview
                </span>
                {!isPreviewEditing && <span className={badgeBeta}>AUTO</span>}
              </div>

              <div className="flex items-center gap-2 flex-wrap justify-end">
                <Badge className={badgeDark}>
                  <FileText className="h-3.5 w-3.5 mr-2" />
                  {uploadedFile?.name}
                </Badge>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePreviewEditToggle}
                  className={isPreviewEditing ? primaryBtn : secondaryBtn}
                >
                  {isPreviewEditing ? (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </>
                  ) : (
                    <>
                      <Edit3 className="h-4 w-4 mr-2" />
                      Edit Preview
                    </>
                  )}
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={onDownloadPdf}
                  disabled={isDownloadingPdf}
                  className={`${secondaryBtn} ${isDownloadingPdf ? "opacity-70 cursor-not-allowed" : ""}`}
                >
                  {isDownloadingPdf ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Exporting…
                    </>
                  ) : (
                    <>
                      <Download className="h-4 w-4 mr-2" />
                      Export PDF
                    </>
                  )}
                </Button>

              </div>
            </div>

            <ScrollArea className="flex-1">
              <div className="p-6">
                <div
                  className="bg-white shadow-2xl rounded-[3rem] overflow-hidden mx-auto"
                  style={{ maxWidth: "8.5in", aspectRatio: "8.5/11" }}
                >
                  <ResumePreview
                    resumeData={resumeData}
                    isEditing={isPreviewEditing}
                    onEdit={handlePreviewEdit}
                  />
                </div>
              </div>
            </ScrollArea>
          </div>

          {/* Add Skill Modal */}
          {isSkillModalOpen && (
            <div className="fixed inset-0 bg-charcoal/60 backdrop-blur-sm flex items-center justify-center z-50">
              <div className="bg-white rounded-[3rem] shadow-2xl p-10 max-w-lg w-[92%] mx-4 space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-black uppercase tracking-tight text-charcoal">Add a Skill</h2>
                  <Button
                    variant="ghost"
                    className="h-10 w-10 rounded-2xl text-warm-gray hover:text-electric-teal hover:bg-soft-teal"
                    onClick={() => setIsSkillModalOpen(false)}
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>

                <Input
                  placeholder="Enter skill..."
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  className={inputShell}
                />

                <div className="flex justify-end gap-3">
                  <Button variant="outline" onClick={() => setIsSkillModalOpen(false)} className={secondaryBtn}>
                    Cancel
                  </Button>

                  <Button
                    className={primaryBtn}
                    onClick={() => {
                      if (newSkill.trim()) {
                        setResumeData({
                          ...resumeData,
                          skills: [...resumeData.skills, newSkill.trim()],
                        })
                        setNewSkill("")
                        setIsSkillModalOpen(false)
                      }
                    }}
                  >
                    Add
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ResumeEditor