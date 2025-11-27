import { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import type { ArchiveItem } from '../../types/archive.types';
import Icon from '../common/Icon';
import fileIcon from '../../assets/icons/file-icon.svg?raw';
import folderIcon from '../../assets/icons/folder-icon.svg?raw';

interface FileUploadModalProps {
  show: boolean;
  onClose: () => void;
  onUpload: (fileData: {
    file: File;
    topic: string;
    subCategory: string;
    description: string;
  }) => void;
  editingItem?: ArchiveItem | null;
}

function FileUploadModal({ show, onClose, onUpload, editingItem }: FileUploadModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [topic, setTopic] = useState('');
  const [subCategory, setSubCategory] = useState('');
  const [description, setDescription] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { t } = useLanguage();

  useEffect(() => {
    if (editingItem) {
      setTopic(editingItem.topic);
      setSubCategory(editingItem.subCategory);
      setDescription('');
    }
  }, [editingItem]);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
      setError('');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setError('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!selectedFile && !editingItem) {
      setError(t('upload.errorFile'));
      return;
    }

    if (!topic || !subCategory) {
      setError(t('upload.errorRequired'));
      return;
    }

    // For editing, we can submit without a file (metadata-only update)
    // For new uploads, we need a file
    if (editingItem) {
      // If editing, use a dummy file if no file selected
      const fileToUse = selectedFile || new File([], editingItem.featuredFile);
      onUpload({
        file: fileToUse,
        topic,
        subCategory,
        description
      });
    } else if (selectedFile) {
      onUpload({
        file: selectedFile,
        topic,
        subCategory,
        description
      });
    }

    handleReset();
  };

  const handleReset = () => {
    setSelectedFile(null);
    setTopic('');
    setSubCategory('');
    setDescription('');
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

  if (!show) return null;

  return (
    <>
      <div
        className="modal-backdrop fade show"
        style={{ zIndex: 1040 }}
        onClick={handleClose}
      />
      <div
        className="modal fade show"
        style={{ display: 'block', zIndex: 1050 }}
        tabIndex={-1}
      >
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">
                {editingItem ? t('upload.editTitle') || 'Editar Archivo' : t('upload.title')}
              </h5>
              <button
                type="button"
                className="btn-close"
                onClick={handleClose}
              />
            </div>
            <div className="modal-body">
              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                {!editingItem && (
                  <div className="mb-4">
                    <label className="form-label">{t('upload.file')} *</label>
                    <div
                      className={`border rounded p-4 text-center ${dragActive ? 'border-primary bg-light' : 'border-secondary'
                        }`}
                      style={{
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        borderStyle: 'dashed'
                      }}
                      onDragEnter={handleDrag}
                      onDragLeave={handleDrag}
                      onDragOver={handleDrag}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <input
                        ref={fileInputRef}
                        type="file"
                        className="d-none"
                        onChange={handleFileChange}
                        accept="image/*,video/*,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/msword,text/plain,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                      />
                      {selectedFile ? (
                        <div>
                          <p className="mb-2">
                            <strong>{t('upload.selectedFile')}</strong>
                          </p>
                          <p className="text-primary mb-0 d-flex align-items-center justify-content-center">
                            <Icon svg={fileIcon} size="1.2rem" className="me-2" />
                            {selectedFile.name}
                          </p>
                          <p className="text-muted small mb-0">
                            {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      ) : (
                        <div>
                          <p className="mb-2">
                            <Icon svg={folderIcon} size="3rem" />
                          </p>
                          <p className="mb-0">
                            {t('upload.dragDrop')}
                          </p>
                          <p className="text-muted small mb-0">
                            PDF, DOC, DOCX, TXT, PPT, PPTX, XLS, XLSX, PNG, MP4
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div className="mb-3">
                  <label htmlFor="topic" className="form-label">
                    {t('upload.topic')} *
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="topic"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder={t('upload.topicPlaceholder')}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="subCategory" className="form-label">
                    {t('upload.category')} *
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="subCategory"
                    value={subCategory}
                    onChange={(e) => setSubCategory(e.target.value)}
                    placeholder={t('upload.categoryPlaceholder')}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="description" className="form-label">
                    {t('upload.description')}
                  </label>
                  <textarea
                    className="form-control"
                    id="description"
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder={t('upload.descriptionPlaceholder')}
                  />
                </div>

                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={handleClose}
                  >
                    {t('upload.cancel')}
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                  >
                    {editingItem ? t('upload.updateButton') || 'Actualizar' : t('upload.uploadButton')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default FileUploadModal;
