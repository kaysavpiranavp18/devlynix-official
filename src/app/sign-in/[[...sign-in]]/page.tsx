import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="relative min-h-screen bg-[#030303] flex items-center justify-center px-4 overflow-hidden">

      {/* Clerk overrides */}
      <style>{`
        .cl-rootBox { width: 100%; }
        .cl-card {
          background: #111111 !important;
          border: 1px solid rgba(255,255,255,0.12) !important;
          border-radius: 20px !important;
          box-shadow: 0 0 0 1px rgba(255,255,255,0.04), 0 32px 64px rgba(0,0,0,0.6) !important;
        }
        .cl-headerTitle { color: #ffffff !important; }
        .cl-headerSubtitle { color: #9ca3af !important; }
        .cl-socialButtonsBlockButton {
          background: #1a1a1a !important;
          border: 1px solid rgba(255,255,255,0.1) !important;
          color: #ffffff !important;
          border-radius: 10px !important;
        }
        .cl-socialButtonsBlockButton:hover {
          background: #222 !important;
          border-color: rgba(255,255,255,0.2) !important;
        }
        .cl-socialButtonsBlockButtonText { color: #ffffff !important; }
        .cl-dividerLine { background: rgba(255,255,255,0.08) !important; }
        .cl-dividerText { color: #4b5563 !important; }
        .cl-formFieldLabel { color: #9ca3af !important; font-size: 0.8rem !important; }
        .cl-formFieldInput {
          background: #1a1a1a !important;
          border: 1px solid rgba(255,255,255,0.1) !important;
          border-radius: 10px !important;
          color: #ffffff !important;
          caret-color: #C6FF00 !important;
        }
        .cl-formFieldInput:focus {
          border-color: #C6FF00 !important;
          box-shadow: 0 0 0 2px rgba(198,255,0,0.12) !important;
          outline: none !important;
        }
        .cl-formButtonPrimary {
          background: #C6FF00 !important;
          color: #000000 !important;
          font-weight: 700 !important;
          border-radius: 10px !important;
          border: none !important;
        }
        .cl-formButtonPrimary:hover { background: #d4ff33 !important; }
        .cl-footerActionLink { color: #C6FF00 !important; }
        .cl-footerActionLink:hover { color: #d4ff33 !important; }
        .cl-footerActionText { color: #6b7280 !important; }
        .cl-identityPreviewText { color: #ffffff !important; }
        .cl-identityPreviewEditButton { color: #C6FF00 !important; }
        .cl-formFieldSuccessText { color: #C6FF00 !important; }
        .cl-formFieldErrorText { color: #f87171 !important; }
        .cl-alertText { color: #f87171 !important; }
        .cl-otpCodeFieldInput {
          background: #1a1a1a !important;
          border: 1px solid rgba(255,255,255,0.1) !important;
          color: #ffffff !important;
          border-radius: 10px !important;
        }
        .cl-otpCodeFieldInput:focus { border-color: #C6FF00 !important; }
        .cl-logoBox { display: none !important; }
        .cl-footer { background: transparent !important; }
        .cl-main { background: transparent !important; }
      `}</style>

      {/* Subtle grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundSize: "60px 60px",
          backgroundImage:
            "linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)",
        }}
      />

      <div className="relative z-10 w-full max-w-md flex flex-col items-center gap-8">

        {/* Logo + heading */}
        <div className="flex flex-col items-center gap-3 text-center">
          <img
            src="https://i.ibb.co/HDHsqdqL/1000100954.png"
            alt="Devlynix"
            className="w-12 h-12 object-contain"
          />
          <div>
            <h1 className="text-3xl font-black text-white tracking-tight">
              Welcome back, Builder.
            </h1>
            <p className="text-gray-500 font-mono text-sm mt-1">
              Sign in to access your hub.
            </p>
          </div>
        </div>

        {/* Clerk SignIn */}
        <SignIn
          forceRedirectUrl="/onboarding"
          appearance={{
            variables: {
              colorPrimary: "#C6FF00",
              colorBackground: "#111111",
              colorInputBackground: "#1a1a1a",
              colorInputText: "#ffffff",
              colorText: "#ffffff",
              colorTextSecondary: "#9ca3af",
              colorDanger: "#ef4444",
              borderRadius: "0.625rem",
            },
          }}
        />

        <p className="text-xs text-gray-700 font-mono flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#C6FF00] animate-pulse inline-block" />
          Secured for Engineers · Devlynix {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
}
