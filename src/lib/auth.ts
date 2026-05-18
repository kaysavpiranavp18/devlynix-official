// localStorage auth helpers removed.
// Profile data is stored in Supabase only.
// This file is kept as a placeholder to avoid breaking imports during migration.
export const mockAuth = {
  clearAll: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('devlynix_session');
      localStorage.removeItem('devlynix_profile');
    }
  },
};
