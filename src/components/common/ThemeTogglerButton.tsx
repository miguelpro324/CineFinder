import { useContext } from 'react';
import { ThemeContext } from '../../context/ThemeContext';

import LightModeIconSVGString from "../../assets/icons/light-theme-icon.svg?raw";
import DarkModeIconSVGString from "../../assets/icons/dark-theme-icon.svg?raw";
import DropdownToggleIconSVGString from "../../assets/icons/dropdown-toggle-icon.svg?raw";

function ThemeTogglerButton() {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const isLightTheme = theme === 'light';

  return (
    <div className="dropdown theme-toggler-dropdown">
      <button
        className="btn theme-toggle-btn"
        aria-label="Toggle theme"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        <span
          className="dropdown-toggle-icon"
          dangerouslySetInnerHTML={{ __html: DropdownToggleIconSVGString }}
        />
        {
          !isLightTheme ?
            <span
              className="theme-icon"
              dangerouslySetInnerHTML={{ __html: DarkModeIconSVGString }}
            /> :
            <span
              className="theme-icon"
              dangerouslySetInnerHTML={{ __html: LightModeIconSVGString }}
            />
        }
      </button>
      <ul className="dropdown-menu">
        <li><h6 className="dropdown-header">Select Theme</h6></li>
        <li>
          <button
            className={`dropdown-item ${isLightTheme ? 'active' : ''}`}
            onClick={() => theme !== 'light' && toggleTheme()}
          >
            <span className="theme-icon me-2"
              dangerouslySetInnerHTML={{ __html: LightModeIconSVGString }}
            />
            Light Mode
          </button>
        </li>
        <li>
          <button
            className={`dropdown-item ${!isLightTheme ? 'active' : ''}`}
            onClick={() => theme !== 'dark' && toggleTheme()}
          >
            <span className="theme-icon me-2"
              dangerouslySetInnerHTML={{ __html: DarkModeIconSVGString }}
            />
            Dark Mode
          </button>
        </li>
      </ul>
    </div>
  )
}

export default ThemeTogglerButton;
