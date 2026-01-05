import { Zap } from "lucide-react"

export function Loader({ fullScreen = false, text = "Loading your opportunities..." }) {
  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-warm-cream">
        <div className="flex flex-col items-center gap-6">
          {/* Animated RIZZ Logo Container */}
          <div className="relative w-32 h-32 flex items-center justify-center">
            {/* Outer rotating ring */}
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-electric-teal border-r-electric-teal animate-spin" />

            {/* Middle pulsing ring */}
            <div className="absolute inset-4 rounded-full border-2 border-ai-violet/30 animate-pulse" />

            {/* Inner glow effect */}
            <div className="absolute inset-8 rounded-full bg-gradient-to-br from-electric-teal/20 to-ai-violet/20 blur-lg animate-pulse" />

            {/* RIZZ Text Container */}
            <div className="relative z-10 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <div className="w-13 h-13 bg-gradient-to-br from-electric-teal to-deep-teal rounded-lg flex items-center justify-center animate-bounce">
                  <Zap className="w-11 h-11 text-warm-cream animate-pulse-glow" />
                </div>
              </div>
              {/* <div className="text-2xl font-black tracking-tighter uppercase text-electric-teal animate-pulse">
                RIZZ
              </div> */}
            </div>
          </div>

          {/* Loading text with dots animation */}
          <div className="flex flex-col items-center gap-3">
            <p className="text-charcoal font-bold uppercase tracking-wider text-sm">{text}</p>
            <div className="flex gap-1.5">
              <div className="w-2 h-2 bg-electric-teal rounded-full animate-bounce" style={{ animationDelay: "0s" }} />
              <div
                className="w-2 h-2 bg-electric-teal rounded-full animate-bounce"
                style={{ animationDelay: "0.2s" }}
              />
              <div
                className="w-2 h-2 bg-electric-teal rounded-full animate-bounce"
                style={{ animationDelay: "0.4s" }}
              />
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center gap-4 py-12">
      {/* Inline loader for component-level loading states */}
      <div className="relative w-20 h-20 flex items-center justify-center">
        {/* Outer rotating ring */}
        <div className="absolute inset-0 rounded-full border-3 border-transparent border-t-electric-teal border-r-electric-teal animate-spin" />

        {/* Middle pulsing ring */}
        <div className="absolute inset-2 rounded-full border-2 border-ai-violet/20 animate-pulse" />

        {/* Inner glow */}
        <div className="absolute inset-4 rounded-full bg-gradient-to-br from-electric-teal/10 to-ai-violet/10 blur-md animate-pulse" />

        {/* RIZZ Icon */}
        <div className="relative z-10">
          <div className="w-6 h-6 bg-gradient-to-br from-electric-teal to-deep-teal rounded flex items-center justify-center animate-bounce">
            <Zap className="w-4 h-4 text-warm-cream" />
          </div>
        </div>
      </div>
      <p className="text-charcoal/60 text-xs font-bold uppercase tracking-widest">{text}</p>
    </div>
  )
}

export default Loader
