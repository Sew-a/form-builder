import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { SignInForm } from './SignInForm';
import { useAuthStore } from '@/store/useAuthStore';

jest.mock('@/store/useAuthStore', () => ({
  useAuthStore: jest.fn(),
}));

const mockUseAuthStore = useAuthStore as jest.MockedFunction<typeof useAuthStore>;

describe('SignInForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseAuthStore.mockReturnValue({
      login: jest.fn(),
      loading: false,
      error: null,
      clearError: jest.fn(),
    } as any);
  });

  it('renders email and password inputs', () => {
    render(<SignInForm />);
    expect(screen.getByPlaceholderText('name@example.com')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('••••••••')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  it('shows validation errors for empty fields', async () => {
    render(<SignInForm />);
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(screen.getByText(/invalid email/i)).toBeInTheDocument();
    });
  });

  it('calls login with valid credentials', async () => {
    const login = jest.fn().mockResolvedValue(undefined);
    mockUseAuthStore.mockReturnValue({
      login,
      loading: false,
      error: null,
      clearError: jest.fn(),
    } as any);

    render(<SignInForm />);
    fireEvent.change(screen.getByPlaceholderText('name@example.com'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('••••••••'), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(login).toHaveBeenCalledWith({ email: 'test@example.com', password: 'password123' });
    });
  });

  it('displays API error message', async () => {
    mockUseAuthStore.mockReturnValue({
      login: jest.fn(),
      loading: false,
      error: 'Invalid credentials',
      clearError: jest.fn(),
    } as any);

    render(<SignInForm />);
    expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
  });
});