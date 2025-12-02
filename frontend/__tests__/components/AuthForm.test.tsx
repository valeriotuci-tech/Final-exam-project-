import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';

// Mock component for testing
const AuthForm = ({ onSubmit, type }: { onSubmit: (data: any) => void; type: 'login' | 'register' }) => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    onSubmit({
      email: formData.get('email'),
      password: formData.get('password'),
      name: formData.get('name'),
    });
  };

  return (
    <form onSubmit={handleSubmit} data-testid="auth-form">
      <input
        type="email"
        name="email"
        placeholder="Email"
        required
        data-testid="email-input"
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        required
        data-testid="password-input"
      />
      {type === 'register' && (
        <input
          type="text"
          name="name"
          placeholder="Name"
          required
          data-testid="name-input"
        />
      )}
      <button type="submit" data-testid="submit-button">
        {type === 'login' ? 'Login' : 'Register'}
      </button>
    </form>
  );
};

describe('AuthForm Component', () => {
  describe('Login Form', () => {
    it('should render login form correctly', () => {
      render(<AuthForm onSubmit={jest.fn()} type="login" />);

      expect(screen.getByTestId('email-input')).toBeInTheDocument();
      expect(screen.getByTestId('password-input')).toBeInTheDocument();
      expect(screen.getByTestId('submit-button')).toHaveTextContent('Login');
      expect(screen.queryByTestId('name-input')).not.toBeInTheDocument();
    });

    it('should submit login form with correct data', async () => {
      const mockSubmit = jest.fn();
      render(<AuthForm onSubmit={mockSubmit} type="login" />);

      const emailInput = screen.getByTestId('email-input');
      const passwordInput = screen.getByTestId('password-input');
      const submitButton = screen.getByTestId('submit-button');

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockSubmit).toHaveBeenCalledWith({
          email: 'test@example.com',
          password: 'password123',
          name: null,
        });
      });
    });

    it('should validate required fields', () => {
      render(<AuthForm onSubmit={jest.fn()} type="login" />);

      const emailInput = screen.getByTestId('email-input') as HTMLInputElement;
      const passwordInput = screen.getByTestId('password-input') as HTMLInputElement;

      expect(emailInput.required).toBe(true);
      expect(passwordInput.required).toBe(true);
    });
  });

  describe('Register Form', () => {
    it('should render register form correctly', () => {
      render(<AuthForm onSubmit={jest.fn()} type="register" />);

      expect(screen.getByTestId('email-input')).toBeInTheDocument();
      expect(screen.getByTestId('password-input')).toBeInTheDocument();
      expect(screen.getByTestId('name-input')).toBeInTheDocument();
      expect(screen.getByTestId('submit-button')).toHaveTextContent('Register');
    });

    it('should submit register form with correct data', async () => {
      const mockSubmit = jest.fn();
      render(<AuthForm onSubmit={mockSubmit} type="register" />);

      const emailInput = screen.getByTestId('email-input');
      const passwordInput = screen.getByTestId('password-input');
      const nameInput = screen.getByTestId('name-input');
      const submitButton = screen.getByTestId('submit-button');

      fireEvent.change(emailInput, { target: { value: 'newuser@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'SecurePass123' } });
      fireEvent.change(nameInput, { target: { value: 'New User' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockSubmit).toHaveBeenCalledWith({
          email: 'newuser@example.com',
          password: 'SecurePass123',
          name: 'New User',
        });
      });
    });
  });
});
