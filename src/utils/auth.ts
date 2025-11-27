import { authService } from '../services/authService';

export interface AuthMessages {
  usernameExists?: string;
  emailExists?: string;
  registerSuccess?: string;
  usernameNotFound?: string;
  incorrectPassword?: string;
  loginSuccess?: string;
}

export const registerUser = async (
  username: string, 
  email: string, 
  password: string,
  messages?: AuthMessages
): Promise<{ success: boolean; message: string }> => {
  try {
    const result = await authService.register({ username, email, password });
    
    if (!result.success) {
      // Map error messages
      if (result.message.includes('Username')) {
        return { 
          success: false, 
          message: messages?.usernameExists || result.message 
        };
      }
      if (result.message.includes('Email')) {
        return { 
          success: false, 
          message: messages?.emailExists || result.message 
        };
      }
      return { success: false, message: result.message };
    }
    
    return { 
      success: true, 
      message: messages?.registerSuccess || result.message 
    };
  } catch (error) {
    console.error('Registration error:', error);
    return { 
      success: false, 
      message: 'An error occurred during registration' 
    };
  }
};

export const validateLogin = async (
  username: string, 
  password: string,
  messages?: AuthMessages
): Promise<{ success: boolean; message: string; user?: unknown }> => {
  try {
    const result = await authService.login({ username, password });
    
    if (!result.success) {
      // Map error messages
      if (result.message.includes('not found')) {
        return { 
          success: false, 
          message: messages?.usernameNotFound || result.message 
        };
      }
      if (result.message.includes('password')) {
        return { 
          success: false, 
          message: messages?.incorrectPassword || result.message 
        };
      }
      return { success: false, message: result.message };
    }
    
    return { 
      success: true, 
      message: messages?.loginSuccess || result.message,
      user: result.user
    };
  } catch (error) {
    console.error('Login error:', error);
    return { 
      success: false, 
      message: 'An error occurred during login' 
    };
  }
};
