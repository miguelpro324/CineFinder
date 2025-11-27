import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import ArchiveCard from '../components/specific/ArchiveCard';
import AddFileCard from '../components/specific/AddFileCard';
import FileUploadModal from '../components/specific/FileUploadModal';
import Icon from '../components/common/Icon';
import type { ArchiveItem } from '../types/archive.types';
import { useFileUpload, getSavedArchiveItems } from '../hooks/useFileUpload';
import { useTranslatedMessages } from '../hooks/useTranslatedMessages';
import { archiveApi } from '../services/archiveApi';

import lockIcon from '../assets/icons/lock-icon.svg?raw';
import keyIcon from '../assets/icons/key-icon.svg?raw';
import registerIcon from '../assets/icons/register-icon.svg?raw';

function Home() {
  const navigate = useNavigate();
  const { isAuthenticated, username, userId } = useAuth();
  const { t } = useLanguage();
  const { validationMessages } = useTranslatedMessages();
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [archiveItems, setArchiveItems] = useState<ArchiveItem[]>([]);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showMyFilesOnly, setShowMyFilesOnly] = useState(false);
  const [editingItem, setEditingItem] = useState<ArchiveItem | null>(null);

  const { uploadFile, isUploading } = useFileUpload((newItem) => {
    setArchiveItems(prev => [...prev, newItem]);
    setShowUploadModal(false);
    setShowSuccessAlert(true);
    setTimeout(() => setShowSuccessAlert(false), 3000);
  }, userId, validationMessages);

  useEffect(() => {
    if (isAuthenticated) {
      loadArchiveItems();
    }
  }, [isAuthenticated]);

  const loadArchiveItems = async () => {
    try {
      const items = await getSavedArchiveItems();
      setArchiveItems(items);
    } catch (error) {
      console.error('Error loading archive items:', error);
    }
  };

  const handleExplore = (item: ArchiveItem) => {
    navigate(`/file/${item.id}`, { state: { item } });
  };

  const handleUpload = async (fileData: {
    file: File;
    topic: string;
    subCategory: string;
    description: string;
  }) => {
    if (editingItem) {
      // Update existing item
      try {
        await archiveApi.updateArchiveItem(editingItem.id, {
          topic: fileData.topic,
          subCategory: fileData.subCategory,
        });
        
        // Update local state
        setArchiveItems(prev => 
          prev.map(item => 
            item.id === editingItem.id 
              ? { ...item, topic: fileData.topic, subCategory: fileData.subCategory }
              : item
          )
        );
        
        setShowUploadModal(false);
        setEditingItem(null);
        setShowSuccessAlert(true);
        setTimeout(() => setShowSuccessAlert(false), 3000);
      } catch (error) {
        console.error('Error updating archive item:', error);
      }
    } else {
      // Create new item
      await uploadFile(fileData);
    }
  };

  const handleEdit = (item: ArchiveItem) => {
    setEditingItem(item);
    setShowUploadModal(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await archiveApi.deleteArchiveItem(id);
      const updatedItems = archiveItems.filter(item => item.id !== id);
      setArchiveItems(updatedItems);
    } catch (error) {
      console.error('Error deleting archive item:', error);
    }
  };

  const filteredItems = showMyFilesOnly 
    ? archiveItems.filter(item => item.ownerId === userId)
    : archiveItems;

  return (
    <>
      <div className="container mt-4">
        {showSuccessAlert && (
          <div className="alert alert-success alert-dismissible fade show" role="alert">
            <strong>{t('main.success')}</strong> {t('main.uploadSuccess')}
            <button 
              type="button" 
              className="btn-close" 
              onClick={() => setShowSuccessAlert(false)}
            />
          </div>
        )}
        
        <div className="row mb-4">
          <div className="col-12">
            <h1>{t('main.welcome')}</h1>
            {isAuthenticated && username && (
              <p className="lead">{t('main.greeting', { username })}</p>
            )}
            {!isAuthenticated && (
              <p className="lead">{t('main.explore')}</p>
            )}
          </div>
        </div>

        {/* Contenido cuando NO está autenticado */}
        {!isAuthenticated && (
          <div className="row">
            <div className="col-12">
              <div className="card shadow-lg border-0">
                <div className="card-body text-center py-5">
                  <div className="mb-4">
                    <Icon svg={lockIcon} size="5rem" />
                  </div>
                  <h3 className="mb-3">{t('main.loginRequired')}</h3>
                  <p className="text-muted mb-4">
                    {t('main.loginMessage')}
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
            </div>
          </div>
        )}

        {/* Contenido cuando SÍ está autenticado */}
        {isAuthenticated && (
          <>
            <div className="row mb-3">
              <div className="col-12">
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="myFilesFilter"
                    checked={showMyFilesOnly}
                    onChange={(e) => setShowMyFilesOnly(e.target.checked)}
                  />
                  <label className="form-check-label" htmlFor="myFilesFilter">
                    {t('main.myFilesOnly') || 'Mostrar solo mis archivos'}
                  </label>
                </div>
              </div>
            </div>

            <div className="row g-4">
              <AddFileCard onClick={() => setShowUploadModal(true)} />
              
              {filteredItems.map((item) => (
                <ArchiveCard 
                  key={item.id} 
                  item={item} 
                  onExplore={handleExplore}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>

            {filteredItems.length === 0 && (
              <div className="row mt-4">
                <div className="col-12">
                  <div className="alert alert-info text-center">
                    <h5>{showMyFilesOnly ? (t('main.noMyFiles') || 'No tienes archivos') : t('main.noFiles')}</h5>
                    <p className="mb-0">
                      {showMyFilesOnly 
                        ? (t('main.noMyFilesMessage') || 'Sube tu primer archivo para verlo aquí.')
                        : t('main.noFilesMessage')}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Modal de subida solo disponible si está autenticado */}
      {isAuthenticated && (
        <>
          <FileUploadModal
            show={showUploadModal}
            onClose={() => {
              setShowUploadModal(false);
              setEditingItem(null);
            }}
            onUpload={handleUpload}
            editingItem={editingItem}
          />

          {isUploading && (
            <div 
              className="position-fixed top-50 start-50 translate-middle" 
              style={{ zIndex: 9999 }}
            >
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Cargando...</span>
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
}

export default Home;
