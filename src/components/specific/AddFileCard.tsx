import { useLanguage } from '../../context/LanguageContext';

interface AddFileCardProps {
  onClick: () => void;
}

function AddFileCard({ onClick }: AddFileCardProps) {
  const { t } = useLanguage();

  return (
    <div className="col-md-6 col-lg-4">
      <div 
        className="card add-file-card h-100 shadow-sm" 
        role="button"
        onClick={onClick}
      >
        <div className="card-body d-flex flex-column align-items-center justify-content-center py-5">
          <div 
            className="text-primary add-icon"
            style={{ 
              fontSize: '4rem', 
              fontWeight: 'bold',
              lineHeight: 1
            }}
          >
            +
          </div>
          <h5 className="card-title text-center text-primary mt-3 mb-0">{t('main.addFile')}</h5>
        </div>
      </div>
    </div>
  );
}

export default AddFileCard;
