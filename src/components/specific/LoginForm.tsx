import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useForm } from '../../hooks/useForm';
import { useToggle } from '../../hooks/useToggle';
import { useTranslatedMessages } from '../../hooks/useTranslatedMessages';
import { validateLogin } from '../../utils/auth';
import BootstrapAlert from '../common/BootstrapAlert';
import Icon from '../common/Icon';
import eyeIcon from '../../assets/icons/eye-icon.svg?raw';
import eyeOffIcon from '../../assets/icons/eye-off-icon.svg?raw';

interface LoginFormValues {
  username: string;
  password: string;
  [key: string]: string;
}

function LoginForm() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { t } = useLanguage();
  const { value: showPassword, toggle: togglePassword } = useToggle(false);
  const { authMessages } = useTranslatedMessages();
  const [loginError, setLoginError] = useState('');

  const { values, handleChange, handleSubmit, errors } = useForm<LoginFormValues>({
    initialValues: { username: '', password: '' },
    validate: (values) => {
      const errors: Partial<Record<keyof LoginFormValues, string>> = {};
      
      if (!values.username) {
        errors.username = t('validation.usernameRequired');
      }
      
      if (!values.password) {
        errors.password = t('validation.passwordRequired');
      }
      
      return errors;
    },
    onSubmit: async (values) => {
      const result = await validateLogin(values.username, values.password, authMessages);
      
      if (result.success) {
        setLoginError('');
        login(values.username);
        navigate('/main');
      } else {
        setLoginError(result.message);
      }
    }
  });

  const generalError = Object.values(errors)[0];

  return (
    <div className="card shadow">
      <div className="card-body p-4">
        <h2 className="card-title text-center mb-4">{t('nav.title')}</h2>
        <p className="text-center text-muted mb-4">{t('main.loginMessage')}</p>
        
        {loginError && (
          <BootstrapAlert 
            message={loginError} 
            type="danger" 
            onClose={() => setLoginError('')}
          />
        )}
        
        {generalError && (
          <div className="alert alert-danger" role="alert">
            {generalError}
          </div>
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
          <button type="submit" className="btn btn-primary w-100 mb-3">
            {t('auth.login')}
          </button>
          <div className="text-center">
            <span className="text-muted">{t('auth.dontHaveAccount')} </span>
            <button
              type="button"
              className="btn btn-link p-0"
              onClick={() => navigate('/register')}
            >
              {t('auth.register')} {t('auth.here')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginForm;
