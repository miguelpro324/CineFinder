import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import Icon from '../components/common/Icon';
import type { ArchiveItem } from '../types/archive.types';
import { useSearch } from '../hooks/useSearch';

import lockIcon from '../assets/icons/lock-icon.svg?raw';
import keyIcon from '../assets/icons/key-icon.svg?raw';
import registerIcon from '../assets/icons/register-icon.svg?raw';
import searchIcon from '../assets/icons/search-icon.svg?raw';
import folderIcon from '../assets/icons/folder-icon.svg?raw';
import sadIcon from '../assets/icons/sad-icon.svg?raw';
import fileIcon from '../assets/icons/file-icon.svg?raw';
import eyeIcon from '../assets/icons/eye-icon.svg?raw';

function Search() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { t } = useLanguage();
  const {
    searchQuery,
    startDate,
    endDate,
    searchResults,
    hasSearched,
    setSearchQuery,
    setStartDate,
    setEndDate,
    handleSearch,
    handleClear
  } = useSearch();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch();
  };

  const handleViewFile = (item: ArchiveItem) => {
    navigate(`/file/${item.id}`, { state: { item } });
  };

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-12">
          <h1 className="mb-4 d-flex align-items-center gap-2">
            <Icon svg={searchIcon} size="2rem" />
            {t('search.title')}
          </h1>
          
          {/* Mensaje cuando NO está autenticado */}
          {!isAuthenticated && (
            <div className="card shadow-lg border-0">
              <div className="card-body text-center py-5">
                  <div className="mb-4">
                    <Icon svg={lockIcon} size="5rem" />
                  </div>
                  <h3 className="mb-3">{t('search.loginRequired')}</h3>
                  <p className="text-muted mb-4">
                    {t('search.loginMessage')}
                  </p>
                  <div className="d-flex gap-3 justify-content-center">
                    <button 
                      className="btn btn-primary btn-lg d-flex align-items-center gap-2"
                      onClick={() => navigate('/login')}
                    >
                      <Icon svg={keyIcon} size="1.2rem" />
                      {t('main.loginButton')}
                    </button>
                    <button 
                      className="btn btn-outline-primary btn-lg d-flex align-items-center gap-2"
                      onClick={() => navigate('/register')}
                    >
                      <Icon svg={registerIcon} size="1.2rem" />
                      {t('main.registerButton')}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Formulario de búsqueda cuando SÍ está autenticado */}
            {isAuthenticated && (
              <>
                <div className="card shadow-sm mb-4">
                  <div className="card-body">
                    <form onSubmit={handleSubmit}>
                    <div className="row">
                      <div className="col-md-12 mb-3">
                        <label htmlFor="searchQuery" className="form-label">
                          <strong>{t('search.searchBy')}</strong>
                        </label>
                        <div className="input-group">
                          <span className="input-group-text">
                            <Icon svg={searchIcon} size="1.2rem" />
                          </span>
                          <input
                            type="text"
                            className="form-control"
                            id="searchQuery"
                            placeholder="Ej: Linear Equations, Mathematics, Algebra..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label htmlFor="startDate" className="form-label">
                          <strong>{t('search.dateFrom')}</strong>
                        </label>
                        <input
                          type="date"
                          className="form-control"
                          id="startDate"
                          value={startDate}
                          onChange={(e) => setStartDate(e.target.value)}
                        />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label htmlFor="endDate" className="form-label">
                          <strong>{t('search.dateTo')}</strong>
                        </label>
                        <input
                          type="date"
                          className="form-control"
                          id="endDate"
                          value={endDate}
                          onChange={(e) => setEndDate(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="d-flex gap-2">
                      <button type="submit" className="btn btn-primary d-flex align-items-center gap-2">
                        <Icon svg={searchIcon} size="1.2rem" />
                        {t('search.searchButton')}
                      </button>
                      <button 
                        type="button" 
                        className="btn btn-outline-secondary"
                        onClick={handleClear}
                      >
                        {t('search.clearButton')}
                      </button>
                    </div>
                  </form>
                </div>
              </div>

              {/* Resultados de búsqueda */}
              <div className="card shadow-sm">
                <div className="card-header bg-light">
                  <h5 className="mb-0">{t('search.results')}</h5>
                </div>
                <div className="card-body">
                {!hasSearched ? (
                  <div className="text-center py-5">
                    <div className="mb-3">
                      <Icon svg={folderIcon} size="4rem" />
                    </div>
                    <h4 className="mt-3 text-muted">{t('search.searchPrompt')}</h4>
                    <p className="text-muted">
                      {t('search.searchPromptMessage')}
                    </p>
                  </div>
                ) : searchResults.length === 0 ? (
                  <div className="text-center py-5">
                    <div className="mb-3">
                      <Icon svg={sadIcon} size="4rem" />
                    </div>
                    <h4 className="mt-3 text-muted">{t('search.noResults')}</h4>
                    <p className="text-muted">
                      {t('search.noResultsMessage')}
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="alert alert-info mb-3">
                      <strong>{searchResults.length}</strong> {t('search.resultsFound')}
                    </div>
                    <div className="table-responsive">
                      <table className="table table-hover">
                        <thead>
                          <tr>
                            <th>{t('search.fileName')}</th>
                            <th>{t('search.topic')}</th>
                            <th>{t('search.category')}</th>
                            <th>{t('search.date')}</th>
                            <th>{t('search.actions')}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {searchResults.map((item) => (
                            <tr key={item.id}>
                              <td className="d-flex align-items-center gap-2">
                                <Icon svg={fileIcon} size="1.2rem" />
                                {item.featuredFile}
                              </td>
                              <td>
                                <span className="badge bg-primary">
                                  {item.topic}
                                </span>
                              </td>
                              <td>
                                <span className="badge bg-secondary">
                                  {item.subCategory}
                                </span>
                              </td>
                              <td>
                                {new Date(item.id).toLocaleDateString('es-ES')}
                              </td>
                              <td>
                                <button
                                  className="btn btn-sm btn-outline-primary d-flex align-items-center gap-2"
                                  onClick={() => handleViewFile(item)}
                                >
                                  <Icon svg={eyeIcon} size="1.2rem" />
                                  {t('search.viewButton')}
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </>
                )}
              </div>
            </div>
              </>
            )}
          </div>
        </div>
      </div>
  );
}

export default Search;
