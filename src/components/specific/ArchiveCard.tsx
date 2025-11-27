import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import type { ArchiveItem } from '../../types/archive.types';
import Icon from '../common/Icon';
import moreVerticalIcon from '../../assets/icons/more-vertical-icon.svg?raw';
import editIcon from '../../assets/icons/edit-icon.svg?raw';
import deleteIcon from '../../assets/icons/delete-icon.svg?raw';

interface ArchiveCardProps {
  item: ArchiveItem;
  onExplore: (item: ArchiveItem) => void;
  onEdit?: (item: ArchiveItem) => void;
  onDelete?: (id: number) => void;
}

function ArchiveCard({ item, onExplore, onEdit, onDelete }: ArchiveCardProps) {
  const { t } = useLanguage();
  const { userId } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  
  const isOwner = userId === item.ownerId;

  const handleEdit = () => {
    setShowDropdown(false);
    onEdit?.(item);
  };

  const handleDelete = () => {
    setShowDropdown(false);
    if (window.confirm(t('card.confirmDelete') || '¿Eliminar este archivo?')) {
      onDelete?.(item.id);
    }
  };

  return (
    <div className="col-md-6 col-lg-4">
      <div className="card archive-card h-100 shadow-sm position-relative">
        {isOwner && (
          <div className="position-absolute top-0 end-0 m-2" style={{ zIndex: 1000 }}>
            <div className="dropdown">
              <button
                className="btn btn-sm btn-outline-secondary"
                type="button"
                onClick={() => setShowDropdown(!showDropdown)}
                onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
                aria-label="Opciones"
              >
                <Icon svg={moreVerticalIcon} size="1.2rem" />
              </button>
              {showDropdown && (
                <div className="dropdown-menu dropdown-menu-end show" style={{ minWidth: '140px', zIndex: 1001 }}>
                  <button className="dropdown-item d-flex align-items-center" onClick={handleEdit}>
                    <Icon svg={editIcon} size="1.2rem" className="me-2" />
                    {t('card.edit') || 'Editar'}
                  </button>
                  <button className="dropdown-item text-danger d-flex align-items-center" onClick={handleDelete}>
                    <Icon svg={deleteIcon} size="1.2rem" className="me-2" />
                    {t('card.delete') || 'Eliminar'}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
        <div className="card-body d-flex flex-column">
          <h5 className="card-title">{item.topic}</h5>
          <h6 className="card-subtitle mb-2 text-muted">{item.subCategory}</h6>
          <p className="card-text">
            <strong>{t('card.featured')}</strong> {item.featuredFile}
          </p>
          <button 
            className="btn btn-primary mt-auto"
            onClick={() => onExplore(item)}
          >
            {t('card.explore')}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ArchiveCard;
