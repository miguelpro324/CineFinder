import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { useForm } from '../../hooks/useForm';
import { useToggle } from '../../hooks/useToggle';
import { useTranslatedMessages } from '../../hooks/useTranslatedMessages';
import { registerUser } from '../../utils/auth';
import { validateEmail, validatePassword, validatePasswordMatch, validateUsername } from '../../utils/validation';
import BootstrapAlert from '../common/BootstrapAlert';
import Icon from '../common/Icon';
import eyeIcon from '../../assets/icons/eye-icon.svg?raw';
import eyeOffIcon from '../../assets/icons/eye-off-icon.svg?raw';

interface RegisterFormValues {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  [key: string]: string;
}

function RegisterForm() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [success, setSuccess] = useState('');
  const [registerError, setRegisterError] = useState('');
  const { value: showPassword, toggle: togglePassword } = useToggle(false);
  const { value: showConfirmPassword, toggle: toggleConfirmPassword } = useToggle(false);
  const { validationMessages, authMessages } = useTranslatedMessages();

  const { values, handleChange, handleSubmit, errors } = useForm<RegisterFormValues>({
    initialValues: { username: '', email: '', password: '', confirmPassword: '' },
    validate: (values) => {
      const errors: Partial<Record<keyof RegisterFormValues, string>> = {};
      
      const usernameValidation = validateUsername(values.username, validationMessages);
      if (!usernameValidation.isValid) {
        errors.username = usernameValidation.message;
      }
      
      const emailValidation = validateEmail(values.email, validationMessages);
      if (!emailValidation.isValid) {
        errors.email = emailValidation.message;
      }
      
      const passwordValidation = validatePassword(values.password, validationMessages);
      if (!passwordValidation.isValid) {
        errors.password = passwordValidation.message;
      }
      
      const passwordMatchValidation = validatePasswordMatch(values.password, values.confirmPassword, validationMessages);
      if (!passwordMatchValidation.isValid) {
        errors.confirmPassword = passwordMatchValidation.message;
      }
      
      return errors;
    },
    onSubmit: async (values) => {
      const result = await registerUser(values.username, values.email, values.password, authMessages);
      
      if (result.success) {
        setRegisterError('');
        setSuccess(result.message);
        setTimeout(() => {
          navigate('/login');
        }, 1000);
      } else {
        setRegisterError(result.message);
      }
    }
  });

  const generalError = Object.values(errors)[0];

  return (
    <div className="card shadow">
      <div className="card-body p-4">
        <h2 className="card-title text-center mb-4">{t('nav.title')}</h2>
        <p className="text-center text-muted mb-4">{t('auth.register')}</p>
        
        {registerError && (
          <BootstrapAlert 
            message={registerError} 
            type="danger" 
            onClose={() => setRegisterError('')}
          />
        )}
        
        {generalError && (
          <div className="alert alert-danger" role="alert">
            {generalError}
          </div>
        )}
        
        {success && (
          <BootstrapAlert 
            message={success} 
            type="success"
          />
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="username" className="form-label">
              {t('auth.username')}
            </label>
            <input
              type="text"
              className="form-control"
              id="username"
              name="username"
              value={values.username}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              {t('auth.email')}
            </label>
            <input
              type="email"
              className="form-control"
              id="email"
              name="email"
              value={values.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              {t('auth.password')}
            </label>
            <div className="input-group">
              <input
                type={showPassword ? "text" : "password"}
                className="form-control"
                id="password"
                name="password"
                value={values.password}
                onChange={handleChange}
                required
              />
              <button
                className="btn btn-outline-secondary"
                type="button"
                onClick={togglePassword}
              >
                <Icon svg={showPassword ? eyeOffIcon : eyeIcon} size="1.2rem" />
              </button>
            </div>
          </div>

          <div className="mb-3">
            <label htmlFor="confirmPassword" className="form-label">
              {t('auth.confirmPassword')}
            </label>
            <div className="input-group">
              <input
                type={showConfirmPassword ? "text" : "password"}
                className="form-control"
                id="confirmPassword"
                name="confirmPassword"
                value={values.confirmPassword}
                onChange={handleChange}
                required
              />
              <button
                className="btn btn-outline-secondary"
                type="button"
                onClick={toggleConfirmPassword}
              >
                <Icon svg={showConfirmPassword ? eyeOffIcon : eyeIcon} size="1.2rem" />
              </button>
            </div>
          </div>

          <button type="submit" className="btn btn-primary w-100 mb-3">
            {t('auth.register')}
          </button>

          <div className="text-center">
            <span className="text-muted">{t('auth.alreadyHaveAccount')} </span>
            <button
              type="button"
              className="btn btn-link p-0"
              onClick={() => navigate('/login')}
            >
              {t('auth.login')} {t('auth.here')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RegisterForm;
