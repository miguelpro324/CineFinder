import { useTheme } from '../../context/ThemeContext';
import { useLanguage, type Language } from '../../context/LanguageContext';
import Icon from '../common/Icon';
import lightThemeIcon from '../../assets/icons/light-theme-icon.svg?raw';
import darkThemeIcon from '../../assets/icons/dark-theme-icon.svg?raw';
import languageIcon from '../../assets/icons/language-icon.svg?raw';

function SettingsControls() {
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
  };

  return (
    <div className="d-flex align-items-center gap-2">
      {/* Theme Toggle */}
      <button
        className="btn btn-outline-secondary d-flex align-items-center gap-2"
        onClick={toggleTheme}
        title={theme === 'dark' ? t('nav.lightMode') : t('nav.darkMode')}
      >
        <Icon svg={theme === 'dark' ? lightThemeIcon : darkThemeIcon} size="1.2rem" />
        <span className="d-none d-md-inline">
          {theme === 'dark' ? t('nav.lightMode') : t('nav.darkMode')}
        </span>
      </button>

      {/* Language Selector */}
      <div className="dropdown">
        <button
          className="btn btn-outline-secondary dropdown-toggle d-flex align-items-center gap-2"
          type="button"
          data-bs-toggle="dropdown"
          aria-expanded="false"
          title={t('nav.language')}
        >
          <Icon svg={languageIcon} size="1.2rem" />
          <span className="d-none d-md-inline">
            {t('nav.language')}
          </span>
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
    </div>
  );
}

export default SettingsControls;
