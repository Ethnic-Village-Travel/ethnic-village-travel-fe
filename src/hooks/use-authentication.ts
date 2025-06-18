import { User } from '@/types/user.type';

// This is a mock authentication hook
// In a real application, this would integrate with your authentication system
export function useAuthentication() {
  // For demo purposes, we'll assume the user is authenticated
  // In a real app, you would check the actual authentication state
  return {
    isAuthenticated: false,
    user: {
      id: 1,
      email: 'demo@example.com',
      avatar: '',
      personal: {
        firstName: 'Demo',
        lastName: 'User',
        avatar: '',
      },
    } as User,
  };
}
