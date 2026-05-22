"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser, useAuth } from '@clerk/nextjs';
import { createClerkSupabaseClient } from '@/lib/supabase';
import {
  ChevronRight, ChevronLeft, GitBranch, User, Code, Blocks,
  Link as LinkIcon, CheckCircle2, Zap
} from 'lucide-react';

const SKILLS_LIST = [
  "React", "Next.js", "Node.js", "Python", "MongoDB", "Tailwind",
  "AI/ML", "Firebase", "Express.js", "TypeScript", "Solidity",
  "Rust", "Go", "AWS", "Docker", "Figma"
];
const INTERESTS_LIST = [
  "Hackathons", "Open Source", "Startups", "Freelancing", "Internships", "AI Projects"
];
const ROLES_LIST = [
  "Frontend Developer", "Backend Developer", "Full Stack Developer",
  "AI/ML Engineer", "UI/UX Designer", "Mobile Developer",
  "Blockchain Developer", "Other"
];

export default function OnboardingPage() {
  const router = useRouter();
  const { isLoaded, isSignedIn, user } = useUser();
  const { getToken } = useAuth();

  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [supabaseReady, setSupabaseReady] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    bio: "",
    college: "",
    yearOfStudy: "",
    primaryRole: "",
    experience: "",
    skills: [] as string[],
    interests: [] as string[],
    githubUrl: "",
    linkedinUrl: "",
    portfolioUrl: "",
  });

  useEffect(() => {
    if (!isLoaded) return;

    if (!isSignedIn) {
      router.push('/sign-in');
      return;
    }

    // Pre-fill from Clerk
    setFormData(prev => ({
      ...prev,
      fullName: user?.fullName ?? "",
      username: user?.username ?? "",
    }));

    const checkProfile = async () => {
      try {
        const token = await getToken({ template: 'supabase' });
        if (!token) {
          // JWT template not configured — show onboarding, save will be skipped
          setSupabaseReady(false);
          setIsChecking(false);
          return;
        }

        setSupabaseReady(true);
        const client = createClerkSupabaseClient(token);
        const { data, error } = await client
          .from('profiles')
          .select('id')
          .eq('clerk_user_id', user!.id)
          .maybeSingle();

        if (error) {
          console.error("Supabase error:", JSON.stringify(error, null, 2));
          throw error;
        }

        if (data) {
          router.push('/hub');
          return;
        }

        setIsChecking(false);

      } catch (err) {
        console.error('Failed to check profile in Supabase:', err);
        setSupabaseReady(false);
        setIsChecking(false);
      }
    };

    checkProfile();
  }, [isLoaded, isSignedIn, user, router, getToken]);

  const handleNext = () => setStep(prev => Math.min(prev + 1, 4));
  const handlePrev = () => setStep(prev => Math.max(prev - 1, 1));

  const updateForm = (key: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const toggleArrayItem = (key: 'skills' | 'interests', item: string) => {
    setFormData(prev => {
      const current = prev[key];
      const updated = current.includes(item)
        ? current.filter(i => i !== item)
        : [...current, item];
      return { ...prev, [key]: updated };
    });
  };

  const handleSubmit = async () => {
    if (!user) return;
    setIsSubmitting(true);

    try {
      const token = await getToken({ template: 'supabase' });
      if (token) {
        const client = createClerkSupabaseClient(token);
        const { error } = await client.from('profiles').upsert({
          clerk_user_id: user.id,
          email: user.primaryEmailAddress?.emailAddress ?? null,
          full_name: formData.fullName,
          username: formData.username,
          bio: formData.bio,
          college: formData.college,
          year_of_study: formData.yearOfStudy,
          primary_role: formData.primaryRole,
          experience: formData.experience,
          skills: formData.skills,
          interests: formData.interests,
          github_url: formData.githubUrl,
          linkedin_url: formData.linkedinUrl,
          portfolio_url: formData.portfolioUrl,
          xp: 0,
          builder_level: 'Initiate',
          streak_days: 0,
        });
        if (error) {
          console.error("Supabase error:", JSON.stringify(error, null, 2));
          throw error;
        }
      }
    } catch (err: any) {
      console.error('Failed to save profile to Supabase:', err);
      // Don't block the user — still navigate to hub
    }

    router.push('/hub');
  };

  const renderStepIndicators = () => (
    <div className="flex justify-between items-center mb-8 sm:mb-12 relative">
      <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-white/10 -translate-y-1/2 z-0" />
      <div
        className="absolute top-1/2 left-0 h-0.5 bg-[#C6FF00] -translate-y-1/2 z-0 transition-all duration-500"
        style={{ width: `${((step - 1) / 3) * 100}%` }}
      />
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className={`relative z-10 flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 transition-all duration-300 ${
            step > i
              ? 'bg-[#C6FF00] border-[#C6FF00] text-black'
              : step === i
              ? 'bg-black border-[#C6FF00] text-[#C6FF00] shadow-[0_0_15px_rgba(198,255,0,0.5)]'
              : 'bg-[#0A0A0A] border-white/20 text-gray-500'
          }`}
        >
          {step > i ? <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5" /> : <span className="font-mono font-bold text-sm sm:text-base">{i}</span>}
        </div>
      ))}
    </div>
  );

  if (!isLoaded || isChecking) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#030303]">
        <div className="w-10 h-10 border-4 border-white/10 border-t-[#C6FF00] rounded-full animate-spin mb-4" />
        <p className="text-[#C6FF00] font-mono text-sm animate-pulse">Checking profile status...</p>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#030303] flex flex-col items-center justify-center py-12 px-4 sm:px-6 overflow-hidden">
      <div
        className="pointer-events-none fixed inset-0 opacity-10"
        style={{
          backgroundSize: "60px 60px",
          backgroundImage:
            "linear-gradient(to right, rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.04) 1px, transparent 1px)",
        }}
      />

      <div className="w-full max-w-2xl relative z-10">
        <div className="mb-8 text-center">
          <div className="flex justify-center mb-4">
            <img src="https://i.ibb.co/HDHsqdqL/1000100954.png" alt="Devlynix" className="w-12 h-12 object-contain" />
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-white mb-2">Initialize Profile</h1>
          <p className="text-gray-500 font-mono text-sm">Configure your builder identity to access the network.</p>
          {!supabaseReady && (
            <p className="mt-3 text-xs text-yellow-500/80 font-mono bg-yellow-500/5 border border-yellow-500/20 rounded-lg px-3 py-2 inline-block">
              ⚠ Supabase not configured — profile won't be persisted yet
            </p>
          )}
        </div>

        {renderStepIndicators()}

        <div className="bg-[#0A0A0A]/90 border border-white/10 rounded-3xl p-6 md:p-8 backdrop-blur-2xl shadow-2xl min-h-[400px] flex flex-col">

          {/* STEP 1 */}
          {step === 1 && (
            <div className="flex-1" style={{ animation: 'slideIn 0.3s ease-out' }}>
              <div className="flex items-center gap-3 mb-8">
                <User className="text-[#C6FF00] w-6 h-6" />
                <h2 className="text-2xl font-bold text-white">Basic Information</h2>
              </div>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-mono text-gray-400 mb-2">Full Name</label>
                    <input type="text" value={formData.fullName} onChange={(e) => updateForm('fullName', e.target.value)}
                      className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#C6FF00] transition-colors placeholder:text-gray-600"
                      placeholder="Yash Harfode" />
                  </div>
                  <div>
                    <label className="block text-sm font-mono text-gray-400 mb-2">Username</label>
                    <input type="text" value={formData.username} onChange={(e) => updateForm('username', e.target.value)}
                      className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#C6FF00] transition-colors placeholder:text-gray-600"
                      placeholder="@yashharfode" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-mono text-gray-400 mb-2">Short Bio</label>
                  <textarea value={formData.bio} onChange={(e) => updateForm('bio', e.target.value)}
                    className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#C6FF00] transition-colors h-24 resize-none placeholder:text-gray-600"
                    placeholder="Building the future of the web..." />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-mono text-gray-400 mb-2">College / University</label>
                    <input type="text" value={formData.college} onChange={(e) => updateForm('college', e.target.value)}
                      className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#C6FF00] transition-colors placeholder:text-gray-600"
                      placeholder="Institute of Technology" />
                  </div>
                  <div>
                    <label className="block text-sm font-mono text-gray-400 mb-2">Year of Study</label>
                    <select value={formData.yearOfStudy} onChange={(e) => updateForm('yearOfStudy', e.target.value)}
                      className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#C6FF00] transition-colors appearance-none">
                      <option value="">Select Year</option>
                      <option value="1st Year">1st Year</option>
                      <option value="2nd Year">2nd Year</option>
                      <option value="3rd Year">3rd Year</option>
                      <option value="4th Year">4th Year</option>
                      <option value="Graduated">Graduated</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div className="flex-1" style={{ animation: 'slideIn 0.3s ease-out' }}>
              <div className="flex items-center gap-3 mb-8">
                <Code className="text-[#C6FF00] w-6 h-6" />
                <h2 className="text-2xl font-bold text-white">Professional Identity</h2>
              </div>
              <div className="space-y-8">
                <div>
                  <label className="block text-sm font-mono text-gray-400 mb-4">Primary Role</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {ROLES_LIST.map(role => (
                      <div key={role} onClick={() => updateForm('primaryRole', role)}
                        className={`cursor-pointer border rounded-xl px-4 py-3 transition-all ${
                          formData.primaryRole === role
                            ? 'bg-[#C6FF00]/10 border-[#C6FF00] text-[#C6FF00]'
                            : 'bg-[#111] border-white/5 text-gray-300 hover:border-white/20'
                        }`}>
                        {role}
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-mono text-gray-400 mb-4">Experience Level</label>
                  <div className="flex flex-wrap sm:flex-nowrap gap-3 sm:gap-4">
                    {['Beginner', 'Intermediate', 'Advanced'].map(level => (
                      <div key={level} onClick={() => updateForm('experience', level)}
                        className={`flex-1 text-center cursor-pointer border rounded-xl px-4 py-4 transition-all ${
                          formData.experience === level
                            ? 'bg-[#C6FF00] border-[#C6FF00] text-black font-bold shadow-[0_0_20px_rgba(198,255,0,0.3)]'
                            : 'bg-[#111] border-white/5 text-gray-300 hover:border-white/20'
                        }`}>
                        {level}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <div className="flex-1" style={{ animation: 'slideIn 0.3s ease-out' }}>
              <div className="flex items-center gap-3 mb-8">
                <Blocks className="text-[#C6FF00] w-6 h-6" />
                <h2 className="text-2xl font-bold text-white">Skills & Interests</h2>
              </div>
              <div className="space-y-8">
                <div>
                  <label className="block text-sm font-mono text-gray-400 mb-4">Tech Stack</label>
                  <div className="flex flex-wrap gap-3">
                    {SKILLS_LIST.map(skill => {
                      const isSelected = formData.skills.includes(skill);
                      return (
                        <div key={skill} onClick={() => toggleArrayItem('skills', skill)}
                          className={`cursor-pointer border rounded-full px-5 py-2 text-sm transition-all ${
                            isSelected ? 'bg-[#C6FF00] border-[#C6FF00] text-black font-bold' : 'bg-[#111] border-white/10 text-gray-300 hover:border-white/30'
                          }`}>
                          {skill}
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-mono text-gray-400 mb-4">Core Interests</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {INTERESTS_LIST.map(interest => {
                      const isSelected = formData.interests.includes(interest);
                      return (
                        <div key={interest} onClick={() => toggleArrayItem('interests', interest)}
                          className={`cursor-pointer border flex items-center gap-3 rounded-xl px-4 py-3 transition-all ${
                            isSelected ? 'bg-[#C6FF00]/10 border-[#C6FF00]' : 'bg-[#111] border-white/5 hover:border-white/20'
                          }`}>
                          <div className={`w-5 h-5 rounded border flex items-center justify-center flex-shrink-0 ${
                            isSelected ? 'bg-[#C6FF00] border-[#C6FF00]' : 'border-gray-500'
                          }`}>
                            {isSelected && <CheckCircle2 className="w-3 h-3 text-black" />}
                          </div>
                          <span className={isSelected ? 'text-white font-medium' : 'text-gray-400'}>{interest}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4 */}
          {step === 4 && (
            <div className="flex-1" style={{ animation: 'slideIn 0.3s ease-out' }}>
              <div className="flex items-center gap-3 mb-8">
                <LinkIcon className="text-[#C6FF00] w-6 h-6" />
                <h2 className="text-2xl font-bold text-white">Proof of Work Links</h2>
              </div>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-mono text-[#C6FF00] mb-2 flex items-center gap-2">
                    <GitBranch className="w-4 h-4" /> GitHub Profile URL <span className="text-gray-500">(required)</span>
                  </label>
                  <input type="text" value={formData.githubUrl} onChange={(e) => updateForm('githubUrl', e.target.value)}
                    className="w-full bg-[#111] border border-[#C6FF00]/30 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-[#C6FF00] transition-colors placeholder:text-gray-600"
                    placeholder="https://github.com/username" />
                  <p className="text-xs text-gray-600 mt-2 font-mono">We'll fetch your repos and contribution data.</p>
                </div>
                <div>
                  <label className="block text-sm font-mono text-gray-400 mb-2">LinkedIn URL</label>
                  <input type="text" value={formData.linkedinUrl} onChange={(e) => updateForm('linkedinUrl', e.target.value)}
                    className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#C6FF00] transition-colors placeholder:text-gray-600"
                    placeholder="https://linkedin.com/in/username" />
                </div>
                <div>
                  <label className="block text-sm font-mono text-gray-400 mb-2">Portfolio / Personal Website</label>
                  <input type="text" value={formData.portfolioUrl} onChange={(e) => updateForm('portfolioUrl', e.target.value)}
                    className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#C6FF00] transition-colors placeholder:text-gray-600"
                    placeholder="https://yourwebsite.com" />
                </div>
                <div className="flex items-center gap-3 bg-[#C6FF00]/5 border border-[#C6FF00]/20 rounded-xl px-4 py-3">
                  <Zap className="w-4 h-4 text-[#C6FF00] flex-shrink-0" />
                  <p className="text-xs text-gray-400 font-mono">
                    Completing your profile earns you <span className="text-[#C6FF00] font-bold">+100 XP</span> and unlocks the <span className="text-[#C6FF00] font-bold">Initiate</span> builder level.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Controls */}
          <div className="mt-6 sm:mt-8 pt-5 sm:pt-6 border-t border-white/10 flex items-center justify-between gap-3">
            {step > 1 ? (
              <button onClick={handlePrev} className="flex items-center gap-2 px-6 py-3 rounded-xl border border-white/10 text-white font-medium hover:bg-white/5 transition-colors">
                <ChevronLeft className="w-4 h-4" /> Back
              </button>
            ) : <div />}

            {step < 4 ? (
              <button onClick={handleNext} className="flex items-center gap-2 px-8 py-3 rounded-xl bg-white text-black font-bold hover:bg-[#C6FF00] transition-colors">
                Next <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button onClick={handleSubmit} disabled={isSubmitting || !formData.githubUrl}
                className="flex items-center gap-2 px-8 py-3 rounded-xl bg-[#C6FF00] text-black font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                {isSubmitting ? (
                  <><div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" /> Initializing...</>
                ) : (
                  <>Complete Setup <CheckCircle2 className="w-5 h-5" /></>
                )}
              </button>
            )}
          </div>
        </div>

        <p className="text-center text-xs text-gray-600 font-mono mt-4">
          Step {step} of 4 — {['Basic Info', 'Professional Identity', 'Skills & Interests', 'Proof of Work'][step - 1]}
        </p>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes slideIn { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }
      ` }} />
    </div>
  );
}
