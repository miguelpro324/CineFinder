import { useLanguage } from '../../context/LanguageContext';
import type { ArchiveItem } from '../../types/archive.types';
import FileContentViewer from './FileContentViewer';
import Icon from '../common/Icon';
import fileIcon from '../../assets/icons/file-icon.svg?raw';

interface FileViewerProps {
  item: ArchiveItem;
  fileId: string;
  onBack: () => void;
}

function FileViewer({ item, fileId, onBack }: FileViewerProps) {
  const { t } = useLanguage();

  return (
    <div className="container mt-4">
      <div className="row mb-4">
        <div className="col-12">
          <button className="btn btn-outline-secondary mb-3" onClick={onBack}>
            ← {t('viewer.backHome')}
          </button>
          <div className="card">
            <div className="card-header bg-primary text-white">
              <h2 className="mb-0">{item.topic} - {item.subCategory}</h2>
            </div>
            <div className="card-body">
              <h4 className="mb-4 d-flex align-items-center">
                <Icon svg={fileIcon} size="1.5rem" className="me-2" />
                {item.featuredFile}
              </h4>
              
              <FileContentViewer
                fileName={item.featuredFile}
                fileUrl={item.fileUrl}
                fileType={item.fileType}
                fileContent={item.fileContent}
              />
              
              <div className="mt-4">
                <h5>{t('search.fileName')}</h5>
                <ul className="list-group">
                  <li className="list-group-item">
                    <strong>{t('search.topic')}:</strong> {item.topic}
                  </li>
                  <li className="list-group-item">
                    <strong>{t('search.category')}:</strong> {item.subCategory}
                  </li>
                  <li className="list-group-item">
                    <strong>{t('search.fileName')}:</strong> {item.featuredFile}
                  </li>
                  <li className="list-group-item">
                    <strong>ID:</strong> {fileId}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FileViewer;
