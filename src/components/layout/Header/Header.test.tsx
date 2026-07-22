import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Header } from './Header';
import { useAuthStore } from '@/store/useAuthStore';

// Mock the auth store
jest.mock('@/store/useAuthStore', () => ({
  useAuthStore: jest.fn(),
}));

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
  })),
}));

const mockUseAuthStore = useAuthStore as jest.MockedFunction<typeof useAuthStore>;

describe('Header', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the logo and brand name', () => {
    mockUseAuthStore.mockReturnValue({
      user: null,
      setAuthModalOpen: jest.fn(),
      logout: jest.fn(),
    } as any);

    render(<Header />);
    expect(screen.getByText('FormFlow')).toBeInTheDocument();
  });

  it('shows sign in and get started buttons when not logged in', () => {
    mockUseAuthStore.mockReturnValue({
      user: null,
      setAuthModalOpen: jest.fn(),
      logout: jest.fn(),
    } as any);

    render(<Header />);
    expect(screen.getByText('Sign In')).toBeInTheDocument();
    expect(screen.getByText('Get Started')).toBeInTheDocument();
  });

  it('calls setAuthModalOpen with signin when Sign In is clicked', () => {
    const setAuthModalOpen = jest.fn();
    mockUseAuthStore.mockReturnValue({
      user: null,
      setAuthModalOpen,
      logout: jest.fn(),
    } as any);

    render(<Header />);
    fireEvent.click(screen.getByText('Sign In'));
    expect(setAuthModalOpen).toHaveBeenCalledWith(true, 'signin');
  });

  it('calls setAuthModalOpen with signup when Get Started is clicked', () => {
    const setAuthModalOpen = jest.fn();
    mockUseAuthStore.mockReturnValue({
      user: null,
      setAuthModalOpen,
      logout: jest.fn(),
    } as any);

    render(<Header />);
    fireEvent.click(screen.getByText('Get Started'));
    expect(setAuthModalOpen).toHaveBeenCalledWith(true, 'signup');
  });
});