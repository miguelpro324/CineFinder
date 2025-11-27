export interface ValidationResult {
  isValid: boolean;
  message?: string;
}

export interface ValidationMessages {
  emailRequired?: string;
  emailInvalid?: string;
  passwordRequired?: string;
  passwordMinLength?: string;
  usernameRequired?: string;
  usernameMinLength?: string;
  passwordsNoMatch?: string;
  fieldRequired?: string;
  fileSizeExceeded?: string;
  fileTypeNotAllowed?: string;
}

export const validateEmail = (email: string, messages?: ValidationMessages): ValidationResult => {
  if (!email) {
    return { isValid: false, message: messages?.emailRequired || 'Email is required' };
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { isValid: false, message: messages?.emailInvalid || 'Please enter a valid email address' };
  }
  
  return { isValid: true };
};

export const validatePassword = (password: string, messages?: ValidationMessages): ValidationResult => {
  if (!password) {
    return { isValid: false, message: messages?.passwordRequired || 'Password is required' };
  }
  
  if (password.length < 6) {
    return { isValid: false, message: messages?.passwordMinLength || 'Password must be at least 6 characters long' };
  }
  
  return { isValid: true };
};

export const validateUsername = (username: string, messages?: ValidationMessages): ValidationResult => {
  if (!username) {
    return { isValid: false, message: messages?.usernameRequired || 'Username is required' };
  }
  
  if (username.length < 3) {
    return { isValid: false, message: messages?.usernameMinLength || 'Username must be at least 3 characters long' };
  }
  
  return { isValid: true };
};

export const validatePasswordMatch = (password: string, confirmPassword: string, messages?: ValidationMessages): ValidationResult => {
  if (password !== confirmPassword) {
    return { isValid: false, message: messages?.passwordsNoMatch || 'Passwords do not match' };
  }
  
  return { isValid: true };
};

export const validateRequired = (value: string, fieldName: string = 'Field', messages?: ValidationMessages): ValidationResult => {
  if (!value || value.trim() === '') {
    const message = messages?.fieldRequired 
      ? messages.fieldRequired.replace('{field}', fieldName)
      : `${fieldName} is required`;
    return { isValid: false, message };
  }
  
  return { isValid: true };
};

export const validateFileSize = (size: number, maxSizeMB: number = 10, messages?: ValidationMessages): ValidationResult => {
  const maxBytes = maxSizeMB * 1024 * 1024;
  
  if (size > maxBytes) {
    const message = messages?.fileSizeExceeded
      ? messages.fileSizeExceeded.replace('{maxSize}', maxSizeMB.toString())
      : `File size must be less than ${maxSizeMB}MB`;
    return { isValid: false, message };
  }
  
  return { isValid: true };
};

// Hypothetical update to validateFileType
export function validateFileType(fileType: string, allowedTypes: string[]): ValidationResult {
  // Check if the specific fileType is directly included, OR if a wildcard matches
  const isValid = allowedTypes.some(allowedType => {
    if (allowedType.endsWith('/*')) {
      // Check for wildcard matching (e.g., 'image/png' starts with 'image/')
      const prefix = allowedType.slice(0, -1); // e.g., 'image/'
      return fileType.startsWith(prefix);
    }
    // Check for exact match
    return allowedType === fileType;
  });

  return { isValid, message: isValid ? '' : 'Tipo de archivo no permitido.' };
}
