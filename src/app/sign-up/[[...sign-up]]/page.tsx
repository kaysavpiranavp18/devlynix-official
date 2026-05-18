import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden bg-[#050505]">
      <div className="absolute inset-0 z-0 opacity-40 bg-[radial-gradient(circle_at_50%_120%,_#C6FF0030,_transparent_40%)]" />

      {/* Background grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-20"
        style={{
          backgroundSize: "60px 60px",
          backgroundImage:
            "linear-gradient(to right, rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.04) 1px, transparent 1px)",
          maskImage: "radial-gradient(circle at center, black 10%, transparent 80%)",
        }}
      />

      {/* Glow blob */}
      <div className="pointer-events-none absolute top-1/2 left-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#C6FF00]/10 blur-[140px]" />

      <div className="relative z-10 flex w-full max-w-md flex-col items-center gap-8">

        {/* Logo + heading */}
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="relative">
            <div className="absolute inset-0 bg-[#C6FF00] blur-2xl opacity-50 rounded-full" />
            <img
              src="https://i.ibb.co/HDHsqdqL/1000100954.png"
              alt="Devlynix"
              className="relative z-10 w-14 h-14 object-contain"
            />
          </div>
          <div>
            <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl">
              Initialize your account.
            </h1>
            <p className="mt-1 font-mono text-sm text-gray-400">
              Join 15,000+ builders shipping daily.
            </p>
          </div>
        </div>

        <div className="w-full max-w-md">
            {/* Clerk SignUp — fully themed */}
            <SignUp
              forceRedirectUrl="/onboarding"
              appearance={{
                layout: {
                  logoPlacement: "none",
                  showOptionalFields: false,
                },
                variables: {
                  colorPrimary: "#C6FF00",
                  colorBackground: "#ebebeb",
                  colorInputBackground: "#FFFFFF",
                  colorInputText: "#fcfcfc",
                  colorText: "#FFFFFF",
                  colorTextSecondary: "#f3f4f6",
                  colorDanger: "#ef4444",
                  colorSuccess: "#C6FF00",
                  borderRadius: "0.75rem",
                  fontFamily: "var(--font-geist-sans), Arial, sans-serif",
                  fontFamilyButtons: "var(--font-geist-sans), Arial, sans-serif",
                  fontSize: "0.9rem",
                },
                elements: {
                  rootBox: "w-full",
                  card: "bg-[#111111] border border-white/10 rounded-2xl shadow-2xl p-6",
                  cardBox: "w-full",
                  headerTitle: "text-white",
                  headerSubtitle: "text-gray-100",
                  socialButtonsBlockButton:
                    "bg-[#1a1a1a] border border-white/10 text-white hover:bg-white/5",
                  dividerLine: "bg-white/15",
                  dividerText: "text-gray-100",
                  formFieldLabel: "text-gray-100",
                  formFieldInput:
                    "bg-white text-black rounded-lg px-4 py-3 focus:border-[#C6FF00] focus:ring-2 focus:ring-[#C6FF00]/50",
                  formButtonPrimary:
                    "bg-[#C6FF00] text-black font-bold rounded-lg hover:bg-[#d4ff33] shadow-[0_0_20px_rgba(198,255,0,0.3)] py-3",
                  footerActionLink: "text-[#C6FF00] hover:text-[#d4ff33] font-medium",
                  footerActionText: "text-gray-100",
                },
              }}
            />
        </div>

        {/* Footer note */}
        <p className="flex items-center gap-2 font-mono text-xs text-gray-300">
          <span className="w-1.5 h-1.5 rounded-full bg-[#C6FF00] animate-pulse inline-block" />
          Secured for Engineers · Devlynix {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
}
