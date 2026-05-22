"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser, useAuth } from '@clerk/nextjs';
import { createClerkSupabaseClient } from '@/lib/supabase';
import { extractUsernameFromUrl, fetchGithubProfile, fetchGithubRepos } from '@/lib/github';
import {
  GitBranch, User, BookOpen, Star, GitFork, ShieldCheck,
  Trophy, Flame, Clock, MapPin, ExternalLink, Calendar
} from 'lucide-react';
import { GitHubCalendar } from 'react-github-calendar';

export default function BuilderDashboard() {
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [githubUser, setGithubUser] = useState<any>(null);
  const [githubRepos, setGithubRepos] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { isLoaded, isSignedIn, user } = useUser();
  const { getToken } = useAuth();

  useEffect(() => {
    if (!isLoaded) return;

    if (!isSignedIn || !user) {
      router.push('/');
      return;
    }

    const loadProfile = async () => {
      try {
        const token = await getToken({ template: 'supabase' });
        if (token) {
          const client = createClerkSupabaseClient(token);
          const { data, error } = await client
            .from('profiles')
            .select('*')
            .eq('clerk_user_id', user.id)
            .maybeSingle();

          if (error) {
            console.error("Supabase error:", JSON.stringify(error, null, 2));
            throw error;
          }

          if (!data) {
            // If we successfully queried but got no data, they need to onboard
            router.push('/onboarding');
            return;
          }

          setProfile({
            fullName: data.full_name,
            username: data.username,
            bio: data.bio,
            college: data.college,
            yearOfStudy: data.year_of_study,
            primaryRole: data.primary_role,
            experience: data.experience,
            skills: data.skills ?? [],
            interests: data.interests ?? [],
            githubUrl: data.github_url,
            linkedinUrl: data.linkedin_url,
            portfolioUrl: data.portfolio_url,
            xp: data.xp ?? 0,
            builderLevel: data.builder_level ?? 'Initiate',
            streakDays: data.streak_days ?? 0,
          });

          // Unblock the UI immediately
          setIsLoading(false);

          // Load GitHub data asynchronously in the background
          const username = extractUsernameFromUrl(data.github_url ?? '');
          if (username) {
            Promise.all([
              fetchGithubProfile(username),
              fetchGithubRepos(username),
            ]).then(([ghUser, repos]) => {
              setGithubUser(ghUser);
              setGithubRepos(repos ?? []);
            }).catch(ghErr => {
              console.error('Failed to load GitHub data:', ghErr);
            });
          }
        } else {
          // Supabase JWT not configured — don't redirect to onboarding, show an error state
          console.error('Supabase JWT template not configured in Clerk.');
          setProfile({
            fullName: user.fullName || 'Builder',
            username: user.username || '',
            bio: 'Please configure your Clerk Supabase JWT template to load your profile.',
            xp: 0,
            builderLevel: 'Error',
            streakDays: 0,
          });
          setIsLoading(false);
        }
      } catch (err) {
        console.error('Failed to load profile from Supabase:', err);
        // Don't redirect, just show the error state
        setProfile({
          fullName: user.fullName || 'Builder',
          username: user.username || '',
          bio: 'Row Level Security (RLS) is blocking the read, or the table does not exist.',
          xp: 0,
          builderLevel: 'Error',
          streakDays: 0,
        });
        setIsLoading(false);
      }
    };

    loadProfile();
  }, [isLoaded, isSignedIn, user, router, getToken]);

  if (isLoading || !profile) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#050505]">
        <div className="w-10 h-10 border-4 border-white/10 border-t-[#C6FF00] rounded-full animate-spin mb-4"></div>
        <p className="text-[#C6FF00] font-mono animate-pulse">Initializing Dashboard...</p>
      </div>
    );
  }

  return (
    <section className="min-h-screen pt-20 sm:pt-24 pb-16 sm:pb-20 bg-[#050505] relative border-b border-white/5">
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-[#C6FF00]/5 to-transparent pointer-events-none z-0"></div>
      
      <div className="mx-auto max-w-7xl px-4 sm:px-6 relative z-10 space-y-6 sm:space-y-8">
        
        {/* WELCOME HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 sm:gap-6 bg-[#0A0A0A]/50 border border-white/10 p-5 sm:p-8 rounded-3xl backdrop-blur-xl animate-[slideIn_0.3s_ease-out]">
          <div>
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white">Welcome back, {profile.fullName.split(' ')[0]}</h1>
              <span className="bg-[#C6FF00]/10 text-[#C6FF00] px-3 py-1 rounded-full text-xs font-bold border border-[#C6FF00]/30 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> Verified Builder
              </span>
            </div>
            <p className="text-gray-400 text-sm sm:text-base">System metrics are optimal. Ready to build.</p>
          </div>
          
          <div className="flex items-center gap-3 sm:gap-4 w-full md:w-auto">
            <div className="bg-[#111] border border-white/10 rounded-2xl p-3 sm:p-4 flex-1 md:flex-none md:min-w-[120px] text-center">
              <div className="text-xl sm:text-2xl font-bold text-white flex justify-center items-center gap-2">
                <Trophy className="w-4 sm:w-5 h-4 sm:h-5 text-yellow-400" /> {profile.xp}
              </div>
              <div className="text-xs text-gray-500 uppercase font-mono mt-1">Total XP</div>
            </div>
            <div className="bg-[#111] border border-white/10 rounded-2xl p-3 sm:p-4 flex-1 md:flex-none md:min-w-[120px] text-center">
              <div className="text-xl sm:text-2xl font-bold text-white flex justify-center items-center gap-2">
                <Flame className="w-4 sm:w-5 h-4 sm:h-5 text-orange-500" /> {profile.streakDays}
              </div>
              <div className="text-xs text-gray-500 uppercase font-mono mt-1">Day Streak</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT COLUMN: Profile & Stats */}
          <div className="lg:col-span-1 space-y-8">
            
            {/* User Profile Card */}
            <div className="bg-[#0A0A0A] border border-white/10 rounded-3xl p-8 shadow-xl relative overflow-hidden animate-[slideIn_0.4s_ease-out]">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#C6FF00]/10 blur-[60px] rounded-full"></div>
              
              <div className="flex flex-col items-center text-center mb-6 relative z-10">
                <img 
                  src={githubUser?.avatar_url || "https://i.pravatar.cc/150"} 
                  alt="Avatar" 
                  className="w-24 h-24 rounded-full border-4 border-[#111] shadow-[0_0_20px_rgba(198,255,0,0.2)] mb-4 object-cover"
                />
                <h2 className="text-2xl font-bold text-white">{profile.fullName}</h2>
                <a href={profile.githubUrl} target="_blank" rel="noreferrer" className="text-[#C6FF00] font-mono text-sm hover:underline flex items-center justify-center gap-1 mt-1">
                  @{githubUser?.login || profile.username} <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              <div className="space-y-4 text-sm relative z-10">
                <p className="text-gray-300 italic">"{githubUser?.bio || profile.bio}"</p>
                <div className="flex items-center gap-2 text-gray-400">
                  <User className="w-4 h-4" /> {profile.primaryRole} • {profile.experience}
                </div>
                <div className="flex items-center gap-2 text-gray-400">
                  <BookOpen className="w-4 h-4" /> {profile.college} ({profile.yearOfStudy})
                </div>
                {githubUser?.location && (
                  <div className="flex items-center gap-2 text-gray-400">
                    <MapPin className="w-4 h-4" /> {githubUser.location}
                  </div>
                )}
              </div>
            </div>

            {/* GitHub Stats Card */}
            <div className="bg-[#0A0A0A] border border-white/10 rounded-3xl p-6 shadow-xl animate-[slideIn_0.5s_ease-out]">
              <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2 border-b border-white/10 pb-4">
                <GitBranch className="w-5 h-5 text-[#C6FF00]" /> Network Stats
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#111] p-4 rounded-xl border border-white/5">
                  <div className="text-2xl font-black text-white">{githubUser?.public_repos || 0}</div>
                  <div className="text-xs text-gray-500 uppercase font-mono mt-1">Repositories</div>
                </div>
                <div className="bg-[#111] p-4 rounded-xl border border-white/5">
                  <div className="text-2xl font-black text-white">{githubUser?.followers || 0}</div>
                  <div className="text-xs text-gray-500 uppercase font-mono mt-1">Followers</div>
                </div>
                <div className="bg-[#111] p-4 rounded-xl border border-white/5">
                  <div className="text-2xl font-black text-white">{githubUser?.following || 0}</div>
                  <div className="text-xs text-gray-500 uppercase font-mono mt-1">Following</div>
                </div>
                <div className="bg-[#111] p-4 rounded-xl border border-white/5 flex flex-col justify-center">
                  <div className="text-xs text-gray-500 uppercase font-mono mb-1">Joined</div>
                  <div className="text-sm font-bold text-white">
                    {githubUser?.created_at ? new Date(githubUser.created_at).getFullYear() : 'N/A'}
                  </div>
                </div>
              </div>
            </div>

            {/* Skills & Interests */}
            <div className="bg-[#0A0A0A] border border-white/10 rounded-3xl p-6 shadow-xl animate-[slideIn_0.6s_ease-out]">
              <h3 className="text-lg font-bold text-white mb-4">Tech Stack</h3>
              <div className="flex flex-wrap gap-2 mb-6">
                {profile.skills?.map((skill: string) => (
                  <span key={skill} className="px-3 py-1 bg-[#111] border border-white/10 rounded-full text-xs text-gray-300 font-mono">
                    {skill}
                  </span>
                ))}
              </div>

              <h3 className="text-lg font-bold text-white mb-4">Interests</h3>
              <div className="flex flex-wrap gap-2">
                {profile.interests?.map((interest: string) => (
                  <span key={interest} className="px-3 py-1 bg-[#C6FF00]/10 border border-[#C6FF00]/20 rounded-lg text-xs text-[#C6FF00] font-medium">
                    {interest}
                  </span>
                ))}
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: Activity & Repositories */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* GitHub Calendar */}
            <div className="bg-[#0A0A0A] border border-white/10 rounded-3xl p-6 shadow-xl animate-[slideIn_0.4s_ease-out]">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-white">Contribution Activity</h3>
                <span className="text-xs text-gray-500 font-mono">GitHub Data</span>
              </div>
              <div className="w-full bg-[#111] rounded-xl border border-white/5 p-4 overflow-x-auto">
                {githubUser?.login ? (
                  <div className="min-w-max">
                    <GitHubCalendar 
                      username={githubUser.login} 
                      colorScheme="dark"
                      theme={{
                        dark: ['#1a1a1a', '#c6ff0040', '#c6ff0070', '#c6ff00a0', '#C6FF00']
                      }}
                      style={{ color: '#9ca3af' }}
                    />
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">Unable to load contribution data.</p>
                )}
              </div>
            </div>

            {/* Repositories */}
            <div className="bg-[#0A0A0A] border border-white/10 rounded-3xl p-6 shadow-xl animate-[slideIn_0.5s_ease-out]">
              <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-[#C6FF00]" /> Recent Repositories
                </h3>
                <a href={profile.githubUrl + "?tab=repositories"} target="_blank" rel="noreferrer" className="text-sm text-gray-400 hover:text-white transition-colors">
                  View All
                </a>
              </div>
              
              {githubRepos.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {githubRepos.map((repo) => (
                    <a 
                      key={repo.id} 
                      href={repo.html_url}
                      target="_blank"
                      rel="noreferrer"
                      className="group bg-[#111] border border-white/5 p-5 rounded-2xl hover:border-white/20 transition-all hover:bg-[#151515]"
                    >
                      <h4 className="text-[#C6FF00] font-bold text-lg mb-2 group-hover:underline truncate">{repo.name}</h4>
                      <p className="text-sm text-gray-400 mb-4 line-clamp-2 h-10">{repo.description || "No description provided."}</p>
                      
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <div className="flex items-center gap-4">
                          {repo.language && (
                            <span className="flex items-center gap-1">
                              <span className="w-2 h-2 rounded-full bg-[#C6FF00]"></span> {repo.language}
                            </span>
                          )}
                          <span className="flex items-center gap-1"><Star className="w-3 h-3"/> {repo.stargazers_count}</span>
                          <span className="flex items-center gap-1"><GitFork className="w-3 h-3"/> {repo.forks_count}</span>
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 text-gray-500">
                  <div className="inline-block p-4 rounded-full bg-[#111] mb-4">
                    <GitBranch className="w-8 h-8 opacity-50" />
                  </div>
                  <p>No public repositories found or unable to fetch.</p>
                </div>
              )}
            </div>

            {/* Activity Timeline Placeholder */}
            <div className="bg-[#0A0A0A] border border-white/10 rounded-3xl p-6 shadow-xl animate-[slideIn_0.6s_ease-out]">
              <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <Clock className="w-5 h-5 text-[#C6FF00]" /> Network Activity
              </h3>
              
              <div className="relative pl-6 border-l border-white/10 space-y-6">
                <div className="relative">
                  <div className="absolute -left-[31px] bg-black p-1 rounded-full border border-white/20 text-[#C6FF00]">
                    <Calendar className="w-3 h-3" />
                  </div>
                  <div className="text-sm text-gray-500 mb-1">Just now</div>
                  <div className="bg-[#111] border border-white/5 p-4 rounded-xl">
                    <span className="text-white font-medium">System Initialization Complete</span>
                    <p className="text-sm text-gray-400 mt-1">Joined the Devlynix network and configured builder profile.</p>
                  </div>
                </div>
                
                <div className="relative">
                  <div className="absolute -left-[31px] bg-black p-1 rounded-full border border-white/20 text-[#C6FF00]">
                    <GitBranch className="w-3 h-3" />
                  </div>
                  <div className="text-sm text-gray-500 mb-1">System Log</div>
                  <div className="bg-[#111] border border-white/5 p-4 rounded-xl">
                    <span className="text-white font-medium">GitHub Synchronization</span>
                    <p className="text-sm text-gray-400 mt-1">Successfully synced {githubUser?.public_repos || 0} repositories and contribution data.</p>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
