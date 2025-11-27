import { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import FileViewer from '../components/specific/FileViewer';
import Icon from '../components/common/Icon';
import type { ArchiveItem } from '../types/archive.types';
import { archiveApi } from '../services/archiveApi';

import lockIcon from '../assets/icons/lock-icon.svg?raw';
import keyIcon from '../assets/icons/key-icon.svg?raw';
import homeIcon from '../assets/icons/home-icon.svg?raw';

function FileView() {
  const navigate = useNavigate();
  const location = useLocation();
  const { fileId } = useParams();
  const { isAuthenticated } = useAuth();
  const { t } = useLanguage();
  
  const [item, setItem] = useState<ArchiveItem | null>(location.state?.item as ArchiveItem || null);
  const [loading, setLoading] = useState(!location.state?.item);
  const [error, setError] = useState(false);

  useEffect(() => {
    // Si ya tenemos el item del state, no necesitamos cargarlo
    if (location.state?.item) {
      return;
    }

    // Si no tenemos el item, lo cargamos desde la API
    const loadItem = async () => {
      if (!fileId) {
        setError(true);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const fetchedItem = await archiveApi.getArchiveItemById(Number(fileId));
        if (fetchedItem) {
          setItem(fetchedItem);
          setError(false);
        } else {
          setError(true);
        }
      } catch (err) {
        console.error('Error loading file:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      loadItem();
    }
  }, [fileId, location.state?.item, isAuthenticated]);

  const handleBack = () => {
    navigate('/main');
  };

  if (!isAuthenticated) {
    return (
      <div className="container mt-5">
        <div className="card shadow-lg border-0">
          <div className="card-body text-center py-5">
            <div className="mb-4">
              <Icon svg={lockIcon} size="5rem" />
            </div>
            <h3 className="mb-3">{t('viewer.loginRequired')}</h3>
            <p className="text-muted mb-4">
              {t('viewer.loginMessage')}
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
                className="btn btn-outline-secondary btn-lg d-flex align-items-center gap-2"
                onClick={handleBack}
              >
                <Icon svg={homeIcon} size="1.2rem" />
                {t('viewer.backHome')}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mt-5">
        <div className="text-center p-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p className="mt-3 text-muted">Cargando archivo...</p>
        </div>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="container mt-5">
        <div className="alert alert-warning">
          <h4>{t('viewer.fileNotFound')}</h4>
          <p>{t('viewer.fileNotFoundMessage')}</p>
          <button className="btn btn-primary" onClick={handleBack}>
            {t('viewer.backButton')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <FileViewer item={item} fileId={fileId || ''} onBack={handleBack} />
  );
}

export default FileView;
