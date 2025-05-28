// This is a mock authentication hook
// In a real application, this would integrate with your authentication system
export function useAuthentication() {
  // For demo purposes, we'll assume the user is authenticated
  // In a real app, you would check the actual authentication state
  return {
    isAuthenticated: false,
    user: {
      id: 1,
      avatar: '',
      name: 'Demo User',
      email: 'demo@example.com',
    },
  };
}
