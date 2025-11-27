import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage, type Language } from '../../context/LanguageContext';
import { useNavigate, useLocation } from 'react-router-dom';
import Icon from '../../components/common/Icon';

import homeIcon from '../../assets/icons/home-icon.svg?raw';
import searchIcon from '../../assets/icons/search-icon.svg?raw';
import lightThemeIcon from '../../assets/icons/light-theme-icon.svg?raw';
import darkThemeIcon from '../../assets/icons/dark-theme-icon.svg?raw';
import languageIcon from '../../assets/icons/language-icon.svg?raw';
import userIcon from '../../assets/icons/user-icon.svg?raw';
import bankLogoIcon from '../../assets/icons/bank-logo-icon.svg?raw';

function NavBar() {
  const { username, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const displayName = username || t('nav.guest');

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary">
      <div className="container-fluid">
        {/* Botón de toggle (hamburguesa) - Primera posición en móvil */}
        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarSupportedContent" 
          aria-controls="navbarSupportedContent" 
          aria-expanded="false" 
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Logo/Título - Segunda posición */}
        <a className="navbar-brand d-flex align-items-center gap-2" href="/main">
          <Icon svg={bankLogoIcon} size="2rem" />
          {t('nav.title')}
        </a>

        {/* Spacer para móvil - empuja los controles a la derecha */}
        <div className="d-lg-none flex-grow-1"></div>

        {/* Controles en móvil - Siempre visibles a la derecha */}
        <div className="d-lg-none d-flex align-items-center gap-2">
          {/* Theme Toggle - Solo icono en móvil */}
          <button
            className="btn btn-sm btn-outline-secondary"
            onClick={toggleTheme}
            title={theme === 'dark' ? t('nav.lightMode') : t('nav.darkMode')}
            style={{ padding: '0.25rem 0.5rem' }}
          >
            <Icon svg={theme === 'dark' ? lightThemeIcon : darkThemeIcon} size="1.2rem" />
          </button>

          {/* Language Selector - Solo icono en móvil */}
          <div className="dropdown">
            <button
              className="btn btn-sm btn-outline-secondary dropdown-toggle"
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
              title={t('nav.language')}
              style={{ padding: '0.25rem 0.5rem' }}
            >
              <Icon svg={languageIcon} size="1.2rem" />
            </button>
            <ul className="dropdown-menu dropdown-menu-end">
              <li>
                <a 
                  className={`dropdown-item ${language === 'en' ? 'active' : ''}`}
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handleLanguageChange('en');
                  }}
                >
                  English
                </a>
              </li>
              <li>
                <a 
                  className={`dropdown-item ${language === 'es' ? 'active' : ''}`}
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handleLanguageChange('es');
                  }}
                >
                  Español
                </a>
              </li>
            </ul>
          </div>

          {/* User Icon - Solo icono en móvil */}
          <div className="dropdown">
            <a 
              className="nav-link dropdown-toggle d-flex align-items-center" 
              href="#" 
              role="button" 
              data-bs-toggle="dropdown" 
              aria-expanded="false"
              style={{ padding: '0.5rem' }}
            >
              <Icon svg={userIcon} size="1.5rem" />
            </a>
            <ul className="dropdown-menu dropdown-menu-end">
              <li>
                <span className="dropdown-item-text">
                  <strong>{displayName}</strong>
                </span>
              </li>
              {username && (
                <>
                  <li><hr className="dropdown-divider" /></li>
                  <li>
                    <a 
                      className="dropdown-item" 
                      href="#" 
                      onClick={(e) => { 
                        e.preventDefault(); 
                        handleLogout(); 
                      }}
                    >
                      {t('nav.logout')}
                    </a>
                  </li>
                </>
              )}
              {!username && (
                <>
                  <li><hr className="dropdown-divider" /></li>
                  <li>
                    <a 
                      className="dropdown-item" 
                      href="/login" 
                      onClick={(e) => { 
                        e.preventDefault(); 
                        navigate('/login'); 
                      }}
                    >
                      {t('main.loginButton')}
                    </a>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>

        {/* Menú colapsable */}
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <a 
                className={`nav-link d-flex align-items-center gap-2 ${isActive('/main') ? 'active' : ''}`}
                aria-current={isActive('/main') ? 'page' : undefined}
                href="/main"
              >
                <Icon svg={homeIcon} size="1.2rem" />
                {t('nav.home')}
              </a>
            </li>
            <li className="nav-item">
              <a 
                className={`nav-link d-flex align-items-center gap-2 ${isActive('/search') ? 'active' : ''}`}
                aria-current={isActive('/search') ? 'page' : undefined}
                href="/search"
              >
                <Icon svg={searchIcon} size="1.2rem" />
                {t('nav.search')}
              </a>
            </li>
          </ul>

          {/* Controles en desktop - Visible en pantallas grandes */}
          <ul className="navbar-nav ms-auto d-none d-lg-flex align-items-center gap-2">
            {/* Theme Toggle - Con texto en desktop */}
            <li className="nav-item">
              <button
                className="btn btn-outline-secondary d-flex align-items-center gap-2"
                onClick={toggleTheme}
              >
                <Icon svg={theme === 'dark' ? lightThemeIcon : darkThemeIcon} size="1.2rem" />
                <span>{theme === 'dark' ? t('nav.lightMode') : t('nav.darkMode')}</span>
              </button>
            </li>

            {/* Language Selector - Con texto en desktop */}
            <li className="nav-item dropdown">
              <button
                className="btn btn-outline-secondary dropdown-toggle d-flex align-items-center gap-2"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <Icon svg={languageIcon} size="1.2rem" />
                <span>{t('nav.language')}</span>
              </button>
              <ul className="dropdown-menu dropdown-menu-end">
                <li>
                  <a 
                    className={`dropdown-item ${language === 'en' ? 'active' : ''}`}
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      handleLanguageChange('en');
                    }}
                  >
                    English
                  </a>
                </li>
                <li>
                  <a 
                    className={`dropdown-item ${language === 'es' ? 'active' : ''}`}
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      handleLanguageChange('es');
                    }}
                  >
                    Español
                  </a>
                </li>
              </ul>
            </li>

            {/* User Dropdown - Con texto en desktop */}
            <li className="nav-item dropdown">
              <a 
                className="nav-link dropdown-toggle d-flex align-items-center gap-2" 
                href="#" 
                role="button" 
                data-bs-toggle="dropdown" 
                aria-expanded="false"
              >
                <Icon svg={userIcon} size="1.5rem" />
                <span>{displayName}</span>
              </a>
              <ul className="dropdown-menu dropdown-menu-end">
                {username && (
                  <li>
                    <a 
                      className="dropdown-item" 
                      href="#" 
                      onClick={(e) => { 
                        e.preventDefault(); 
                        handleLogout(); 
                      }}
                    >
                      {t('nav.logout')}
                    </a>
                  </li>
                )}
                {!username && (
                  <li>
                    <a 
                      className="dropdown-item" 
                      href="/login" 
                      onClick={(e) => { 
                        e.preventDefault(); 
                        navigate('/login'); 
                      }}
                    >
                      {t('main.loginButton')}
                    </a>
                  </li>
                )}
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
