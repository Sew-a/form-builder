import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { SignUpForm } from './SignUpForm';
import { useAuthStore } from '@/store/useAuthStore';

jest.mock('@/store/useAuthStore', () => ({
  useAuthStore: jest.fn(),
}));

const mockUseAuthStore = useAuthStore as jest.MockedFunction<typeof useAuthStore>;

describe('SignUpForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseAuthStore.mockReturnValue({
      register: jest.fn(),
      loading: false,
      error: null,
      clearError: jest.fn(),
    } as any);
  });

  it('renders name, email and password inputs', () => {
    render(<SignUpForm />);
    expect(screen.getByPlaceholderText('John Doe')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('name@example.com')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Minimum 8 characters')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument();
  });

  it('shows validation errors for empty fields', async () => {
    render(<SignUpForm />);
    fireEvent.click(screen.getByRole('button', { name: /create account/i }));

    await waitFor(() => {
      expect(screen.getByText(/invalid email/i)).toBeInTheDocument();
    });
  });

  it('calls register with valid data', async () => {
    const register = jest.fn().mockResolvedValue(undefined);
    mockUseAuthStore.mockReturnValue({
      register,
      loading: false,
      error: null,
      clearError: jest.fn(),
    } as any);

    render(<SignUpForm />);
    fireEvent.change(screen.getByPlaceholderText('John Doe'), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByPlaceholderText('name@example.com'), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Minimum 8 characters'), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /create account/i }));

    await waitFor(() => {
      expect(register).toHaveBeenCalledWith({ name: 'John Doe', email: 'john@example.com', password: 'password123' });
    });
  });

  it('displays API error message', async () => {
    mockUseAuthStore.mockReturnValue({
      register: jest.fn(),
      loading: false,
      error: 'Email already exists',
      clearError: jest.fn(),
    } as any);

    render(<SignUpForm />);
    expect(screen.getByText('Email already exists')).toBeInTheDocument();
  });
});