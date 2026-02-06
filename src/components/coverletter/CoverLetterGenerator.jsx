import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import Footer from "@/components/Footer"
import FeedbackModal from "@/components/FeedbackModal"
import { usePostHog } from "posthog-js/react"
import {
  ArrowLeft,
  FileText,
  Sparkles,
  Download,
  RefreshCw,
  Copy,
  Check,
  Briefcase,
  User,
  Building2,
  Loader2,
  Wand2,
  ChevronDown,
  ChevronRight,
  X,
  FileUp,
  FileCheck,
  Edit3,
  Save,
  MessageCircle,
} from "lucide-react"
import { toast, Toaster } from "sonner"
import {
  generateCoverLetterThunk,
  reGenerateCoverLetterThunk,
  fileUpload,
  exportPdfThunk,
} from "../../redux/slices/userApiSlice"
import { useDispatch } from "react-redux"
import { useLocation, useNavigate } from "react-router-dom"
import { track } from "@/lib/analytics"
import { buildCoverletterHtml } from "../../lib/utils"

/* ---------- shared styling (same as ResumeEditor) ---------- */
const cardShell = "border-none bg-white shadow-2xl rounded-[3rem] overflow-hidden"
const cardHeaderShell =
  "p-8 bg-gradient-to-br from-electric-teal/10 to-transparent cursor-pointer"
const cardTitleShell =
  "text-xl font-black uppercase tracking-tight flex items-center gap-3 text-charcoal"

const inputShell =
  "h-14 rounded-2xl border-2 border-border bg-white text-base font-medium text-charcoal focus-visible:ring-electric-teal focus-visible:border-electric-teal"
const textareaShell =
  "rounded-2xl border-2 border-border bg-white text-base font-medium leading-relaxed text-charcoal focus-visible:ring-electric-teal focus-visible:border-electric-teal"

const primaryBtn =
  "h-14 px-6 rounded-2xl bg-charcoal hover:bg-deep-teal text-white font-black uppercase tracking-widest text-xs shadow-2xl transition-all hover:scale-[1.02]"
const secondaryBtn =
  "h-14 px-6 rounded-2xl border-2 border-charcoal/20 font-bold uppercase tracking-wider text-xs text-charcoal hover:bg-soft-teal hover:border-electric-teal transition-all"
const aiBtn =
  "h-14 px-6 rounded-2xl bg-gradient-to-r from-ai-violet to-electric-teal text-white font-black uppercase tracking-widest text-xs shadow-2xl transition-all hover:scale-[1.02]"

const badgeSoft =
  "px-4 py-2 text-[10px] font-black uppercase tracking-wider rounded-full bg-soft-teal text-deep-teal border-none"
const badgeBeta =
  "px-3 py-1 text-[8px] font-black bg-electric-teal/10 text-electric-teal border border-electric-teal/20 rounded-full"

/* ========== CUSTOM PROMPT MODAL COMPONENT ========== */
const CustomPromptModal = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
  jobTitle = "",
  company = "",
}) => {
  const [prompt, setPrompt] = useState("")

  useEffect(() => {
    if (isOpen) {
      setPrompt("")
    }
  }, [isOpen])

  if (!isOpen) return null

  const handleSubmit = () => {
    if (!prompt.trim()) {
      toast.error("Please enter a prompt")
      return
    }
    onSubmit(prompt)
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && e.ctrlKey) {
      handleSubmit()
    }
  }

  return (
    <div className="fixed inset-0 bg-charcoal/60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-[3rem] shadow-2xl p-8 max-w-2xl w-[92%] mx-4 space-y-6 border-2 border-electric-teal/30">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-ai-violet/20 to-electric-teal/20 flex items-center justify-center">
              <MessageCircle className="h-6 w-6 text-ai-violet" />
            </div>
            <div>
              <h2 className="text-2xl font-black uppercase tracking-tight text-charcoal">
                Generate with Custom Prompt
              </h2>
              <p className="text-xs font-bold uppercase tracking-wider text-warm-gray mt-1">
                {`Job: ${jobTitle || "Unknown"} • Company: ${company || "Unknown"}`}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            className="h-10 w-10 rounded-2xl text-warm-gray hover:text-electric-teal hover:bg-soft-teal"
            onClick={onClose}
            disabled={isLoading}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Textarea for Prompt */}
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-warm-gray block mb-3">
            Your Custom Prompt
          </label>
          <Textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="e.g., 'Write in a more enthusiastic tone' or 'Emphasize leadership and innovation'"
            disabled={isLoading}
            className={`${textareaShell} min-h-[120px] resize-none`}
          />
          <p className="text-[10px] font-bold uppercase tracking-wider text-warm-gray/70 mt-2">
            💡 Tip: Be specific about tone, style, or what you want to emphasize
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            className={secondaryBtn}
            disabled={isLoading}
          >
            Cancel
          </Button>

          <Button
            className={aiBtn}
            onClick={handleSubmit}
            disabled={isLoading || !prompt.trim()}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Generate with AI
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}

/* ---------- flatten resume helper (unchanged) ---------- */
const flattenResumeToText = (resume) => {
  if (!resume) return ""
  let out = ""
  if (resume.personalInfo) {
    const p = resume.personalInfo
    out += `${p.name || ""}\n${p.email || ""}\n${p.phone || ""}\n${p.location || ""}\n${p.linkedin || ""}\n\n`
  }
  if (resume.summary) out += `SUMMARY\n${resume.summary}\n\n`
  if (resume.experience?.length) {
    out += `EXPERIENCE\n`
    resume.experience.forEach((exp) => {
      out += `${exp.title || ""} — ${exp.company || ""}\n`
      exp.bullets?.forEach((b) => (out += `• ${b.text}\n`))
      out += "\n"
    })
  }
  if (resume.education?.length) {
    out += `EDUCATION\n`
    resume.education.forEach((edu) => {
      out += `${edu.degree || ""} — ${edu.school || ""}\n${edu.description || ""}\n\n`
    })
  }
  if (resume.skills?.length) out += `SKILLS\n${resume.skills.join(", ")}`
  return out.trim()
}

const CoverLetterGenerator = () => {
  const posthog = usePostHog()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const { jobId, title, jobCompany, description } = location.state || {}
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false)

  const [resumeText, setResumeText] = useState("")
  const [resumeFile, setResumeFile] = useState(null)
  const [parsing, setParsing] = useState(false)

  const [jobTitle, setJobTitle] = useState(title || "")
  const [company, setCompany] = useState(jobCompany || "")
  const [jobDescription, setJobDescription] = useState(description || "")

  const [coverLetter, setCoverLetter] = useState("")
  const [generating, setGenerating] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [copied, setCopied] = useState(false)

  const [mobileView, setMobileView] = useState("editor")
  const [sectionsOpen, setSectionsOpen] = useState({ resume: true, job: true, tone: false })
  const [selectedTone, setSelectedTone] = useState("professional")

  // ========== CUSTOM PROMPT STATE ==========
  const [promptModalState, setPromptModalState] = useState({
    isOpen: false,
    isLoading: false,
  })

  const fileInputRef = useRef(null)
  const previewRef = useRef(null)

  const tones = [
    { id: "professional", label: "Professional" },
    { id: "confident", label: "Confident" },
    { id: "enthusiastic", label: "Enthusiastic" },
    { id: "friendly", label: "Friendly" },
  ]

  const toggleSection = (k) =>
    setSectionsOpen((p) => ({ ...p, [k]: !p[k] }))


  const onDownloadCoverLetterPdf = async () => {
    if (!coverLetter || isDownloadingPdf) return

    setIsDownloadingPdf(true)

    try {
      const fileNameBase =
        `${jobTitle || "cover_letter"}_${company || ""}`
          .toLowerCase()
          .replace(/\s+/g, "_")
          .replace(/[^a-z0-9_]/g, "") || "cover_letter"

      const html = buildCoverletterHtml(
        `${jobTitle || "Cover Letter"} – ${company || ""}`,
        coverLetter
      )

      const result = await dispatch(
        exportPdfThunk({
          html,
          fileName: fileNameBase,
        })
      )

      if (!exportPdfThunk.fulfilled.match(result)) {
        throw new Error(result.payload || "PDF export failed")
      }

      const blob = result.payload

      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `${fileNameBase}.pdf`
      document.body.appendChild(a)
      a.click()

      a.remove()
      window.URL.revokeObjectURL(url)

      toast.success("Cover letter downloaded successfully!")

      track("CoverLetterDownloaded", {
        jobTitle,
        company,
        tone: selectedTone,
        method: "backend_pdf",
      })
    } catch (err) {
      console.error(err)
      toast.error("Failed to export cover letter PDF")
      track("CoverLetterDownloadFailed")
    } finally {
      setIsDownloadingPdf(false)
    }
  }

  /* ---------- upload (unchanged logic) ---------- */
  const handleFileSelect = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setResumeFile(file)
    setParsing(true)

    dispatch(fileUpload({ file }))
      .unwrap()
      .then((data) => {
        setResumeText(data.resume ? flattenResumeToText(data.resume) : data.resumeText || "")
        setParsing(false)
        toast.success("Resume parsed successfully")
      })
      .catch(() => {
        setParsing(false)
        toast.error("Failed to parse resume")
      })
  }

  /* ---------- generation ---------- */
  // ✅ Standard generation (unchanged)
  const generateCoverLetter = async () => {
    if (!resumeText || !jobDescription) {
      toast.error("Resume and job description required")
      return
    }
    setGenerating(true)
    const res = await dispatch(
      generateCoverLetterThunk({
        resume_text: resumeText,
        job_description: jobDescription,
        job_title: jobTitle,
        company: company,
        tone: selectedTone
      })
    )
    setGenerating(false)
    if (res.meta.requestStatus === "fulfilled") {
      setCoverLetter(res.payload.cover_letter || res.payload.coverLetter || "")
      setIsEditing(false)
      setMobileView("preview")
    }
  }

  const regenerateCoverLetter = async () => {
    setGenerating(true)
    const res = await dispatch(
      reGenerateCoverLetterThunk({
        resume_text: resumeText,
        job_description: jobDescription,
        job_title: jobTitle,
        company: company,
        tone: selectedTone
      })
    )
    setGenerating(false)
    if (res.meta.requestStatus === "fulfilled") {
      setCoverLetter(res.payload.cover_letter || res.payload.coverLetter || "")
      setIsEditing(false)
      setMobileView("preview")
    }
  }

  // ========== CUSTOM PROMPT HANDLERS ==========
  const handleOpenPromptModal = () => {
    if (!resumeText || !jobDescription) {
      toast.error("Resume and job description required")
      return
    }
    setPromptModalState({
      isOpen: true,
      isLoading: false,
    })
    track("AIPromptModalOpened", { source: "cover_letter" })
    posthog?.capture("ai_prompt_modal_opened", {
      source: "cover_letter",
    })
  }

  const handleClosePromptModal = () => {
    setPromptModalState((prev) => ({ ...prev, isOpen: false }))
  }

  const handleSubmitCustomPrompt = async (customPrompt) => {
    await generateCoverLetterWithPrompt(customPrompt)
  }

  const generateCoverLetterWithPrompt = async (customPrompt) => {
    if (!resumeText || !jobDescription) {
      toast.error("Resume and job description required")
      return
    }

    setPromptModalState((prev) => ({ ...prev, isLoading: true }))
    setGenerating(true)

    track("AICoverLetterWithPromptStarted", {
      hasCustomPrompt: !!customPrompt,
    })
    posthog?.capture("ai_cover_letter_with_prompt", {
      has_custom_prompt: !!customPrompt,
    })

    try {
      // TODO: Replace this with your actual backend endpoint for custom prompts
      // const result = await dispatch(
      //   generateCoverLetterWithPromptThunk({
      //     resume_text: resumeText,
      //     job_description: jobDescription,
      //     job_title: jobTitle,
      //     company: company,
      //     tone: selectedTone,
      //     custom_prompt: customPrompt,
      //   }),
      // )

      // For now, falling back to the regular generate function
      const result = await dispatch(
        generateCoverLetterThunk({
          resume_text: resumeText,
          job_description: jobDescription,
          job_title: jobTitle,
          company: company,
          tone: selectedTone,
        })
      )

      if (result.meta.requestStatus === "fulfilled") {
        setCoverLetter(result.payload.cover_letter || result.payload.coverLetter || "")
        setIsEditing(false)
        setMobileView("preview")
        toast.success("Cover letter generated successfully!")
        track("AICoverLetterWithPromptCompleted")
        posthog?.capture("ai_cover_letter_with_prompt_completed")
      } else {
        throw new Error("Failed to generate cover letter")
      }
    } catch (error) {
      toast.error("Failed to generate cover letter")
      track("AICoverLetterWithPromptFailed")
      posthog?.capture("ai_cover_letter_with_prompt_failed")
    } finally {
      setGenerating(false)
      setPromptModalState((prev) => ({ ...prev, isLoading: false, isOpen: false }))
    }
  }

  const handleCopy = async () => {
    await navigator.clipboard.writeText(coverLetter)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-warm-cream flex flex-col" style={{ marginTop: 60 }}>
      <Toaster richColors closeButton position="top-center" />

      {/* Custom Prompt Modal */}
      <CustomPromptModal
        isOpen={promptModalState.isOpen}
        onClose={handleClosePromptModal}
        onSubmit={handleSubmitCustomPrompt}
        isLoading={promptModalState.isLoading}
        jobTitle={jobTitle}
        company={company}
      />

      {/* Mobile toggle */}
      <div className="md:hidden sticky top-[60px] z-20 bg-warm-cream border-b border-charcoal/10">
        <div className="p-2 flex gap-2">
          <Button
            className={mobileView === "editor" ? primaryBtn : secondaryBtn}
            onClick={() => setMobileView("editor")}
          >
            Editor
          </Button>
          <Button
            className={mobileView === "preview" ? primaryBtn : secondaryBtn}
            onClick={() => setMobileView("preview")}
          >
            Preview
          </Button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden md:flex-row flex-col">
        {/* LEFT */}
        <div className={`${mobileView === "editor" ? "block" : "hidden"} md:block md:w-1/2 border-r border-charcoal/10`}>
          <div className="p-6 space-y-6 overflow-y-auto">

            {/* Resume */}
            <Card className={cardShell}>
              <CardHeader className={cardHeaderShell} onClick={() => toggleSection("resume")}>
                <CardTitle className={cardTitleShell}>
                  <User className="h-5 w-5 text-electric-teal" />
                  Your Resume
                </CardTitle>
              </CardHeader>

              {sectionsOpen.resume && (
                <CardContent className="p-8">
                  {!resumeText ? (
                    <div
                      className="border-2 border-dashed rounded-3xl p-12 text-center cursor-pointer hover:bg-soft-teal/40"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept=".pdf,.docx"
                        onChange={handleFileSelect}
                        className="hidden"
                      />
                      {parsing ? (
                        <Loader2 className="h-10 w-10 animate-spin text-electric-teal mx-auto" />
                      ) : (
                        <>
                          <FileUp className="h-12 w-12 text-electric-teal mx-auto mb-4" />
                          <p className="font-black uppercase tracking-widest text-sm text-charcoal">
                            Upload Resume
                          </p>
                        </>
                      )}
                    </div>
                  ) : (
                    <Textarea
                      value={resumeText}
                      onChange={(e) => setResumeText(e.target.value)}
                      className={`min-h-[160px] ${textareaShell}`}
                    />
                  )}
                </CardContent>
              )}
            </Card>

            {/* Job */}
            <Card className={cardShell}>
              <CardHeader className={cardHeaderShell} onClick={() => toggleSection("job")}>
                <CardTitle className={cardTitleShell}>
                  <Briefcase className="h-5 w-5 text-electric-teal" />
                  Job Details
                </CardTitle>
              </CardHeader>

              {sectionsOpen.job && (
                <CardContent className="p-8 space-y-4">
                  <Input
                    placeholder="Job Title"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    className={inputShell}
                  />
                  <Input
                    placeholder="Company"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className={inputShell}
                  />
                  <Textarea
                    placeholder="Job description"
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    className={`min-h-[180px] ${textareaShell}`}
                  />
                </CardContent>
              )}
            </Card>

            {/* Tone */}
            <Card className={cardShell}>
              <CardHeader className={cardHeaderShell} onClick={() => toggleSection("tone")}>
                <CardTitle className={cardTitleShell}>
                  <Wand2 className="h-5 w-5 text-electric-teal" />
                  Writing Tone
                </CardTitle>
              </CardHeader>

              {sectionsOpen.tone && (
                <CardContent className="p-8 flex flex-wrap gap-2">
                  {tones.map((t) => (
                    <Button
                      key={t.id}
                      className={selectedTone === t.id ? primaryBtn : secondaryBtn}
                      onClick={() => setSelectedTone(t.id)}
                    >
                      {t.label}
                    </Button>
                  ))}
                </CardContent>
              )}
            </Card>

            {/* Generate Buttons */}
            <div className="flex gap-3">
              <Button
                className={`flex-1 ${aiBtn}`}
                onClick={coverLetter ? regenerateCoverLetter : generateCoverLetter}
                disabled={generating}
              >
                {generating ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    Generating…
                  </>
                ) : (
                  <>
                    <Sparkles className="h-5 w-5 mr-2 animate-pulse" />
                    {coverLetter ? "Regenerate" : "Generate"}
                  </>
                )}
              </Button>

              <Button
                className={`flex-1 ${secondaryBtn}`}
                onClick={handleOpenPromptModal}
                disabled={generating}
              >
                <MessageCircle className="h-5 w-5 mr-2" />
                Custom Prompt
              </Button>
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className={`${mobileView === "preview" ? "block" : "hidden"} md:block md:w-1/2 bg-warm-cream`}>
          <div className="p-6 overflow-y-auto">
            {!coverLetter ? (
              <div className="bg-white rounded-[3rem] p-16 text-center shadow-xl">
                <FileText className="h-16 w-16 mx-auto text-warm-gray/40 mb-4" />
                <p className="font-black uppercase tracking-wider text-warm-gray">
                  Your cover letter will appear here
                </p>
              </div>
            ) : (
              <div ref={previewRef} className="bg-white rounded-[3rem] p-10 shadow-xl min-h-[600px]">
                {isEditing ? (
                  <Textarea
                    value={coverLetter}
                    onChange={(e) => setCoverLetter(e.target.value)}
                    className="w-full min-h-[520px] border-none resize-none"
                  />
                ) : (
                  <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
                    {coverLetter}
                  </pre>
                )}
              </div>
            )}

            {coverLetter && (
              <div className="mt-6 flex justify-center gap-3">
                <Button className={secondaryBtn} onClick={() => setIsEditing(!isEditing)}>
                  {isEditing ? <Save className="h-4 w-4 mr-2" /> : <Edit3 className="h-4 w-4 mr-2" />}
                  {isEditing ? "Save" : "Edit"}
                </Button>
                <Button className={secondaryBtn} onClick={handleCopy}>
                  {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                  Copy
                </Button>
                <Button
                  className={`${secondaryBtn} ${isDownloadingPdf ? "opacity-70 cursor-not-allowed" : ""}`}
                  onClick={onDownloadCoverLetterPdf}
                  disabled={isDownloadingPdf || isEditing}
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
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default CoverLetterGenerator