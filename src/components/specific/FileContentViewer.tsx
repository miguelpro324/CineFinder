import { useState, useEffect } from 'react';
import Icon from '../common/Icon';
import fileIcon from '../../assets/icons/file-icon.svg?raw';
import downloadIcon from '../../assets/icons/download-icon.svg?raw';
import linkIcon from '../../assets/icons/link-icon.svg?raw';
import warningIcon from '../../assets/icons/warning-icon.svg?raw';
import documentIcon from '../../assets/icons/document-icon.svg?raw';
import packageIcon from '../../assets/icons/package-icon.svg?raw';

interface FileContentViewerProps {
  fileName: string;
  fileUrl?: string;
  fileType?: string;
  fileContent?: string;
}

function FileContentViewer({ fileName, fileUrl, fileType, fileContent }: FileContentViewerProps) {
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getFileExtension = (name: string): string => {
    const parts = name.split('.');
    return parts.length > 1 ? parts[parts.length - 1].toLowerCase() : '';
  };

  const getMimeType = (extension: string): string => {
    const mimeTypes: { [key: string]: string } = {
      'pdf': 'application/pdf',
      'txt': 'text/plain',
      'jpg': 'image/jpeg',
      'jpeg': 'image/jpeg',
      'png': 'image/png',
      'gif': 'image/gif',
      'svg': 'image/svg+xml',
      'webp': 'image/webp',
      'bmp': 'image/bmp',
      'doc': 'application/msword',
      'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'xls': 'application/vnd.ms-excel',
      'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'ppt': 'application/vnd.ms-powerpoint',
      'pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'mp4': 'video/mp4',
      'webm': 'video/webm',
      'ogg': 'video/ogg',
      'ogv': 'video/ogg',
      'avi': 'video/x-msvideo',
      'mov': 'video/quicktime',
      'wmv': 'video/x-ms-wmv',
      'flv': 'video/x-flv',
      'mkv': 'video/x-matroska',
    };
    return mimeTypes[extension] || 'application/octet-stream';
  };

  const extension = getFileExtension(fileName);
  const mimeType = fileType || getMimeType(extension);

  useEffect(() => {
    const loadContent = async () => {
      setLoading(true);
      setError(null);

      try {
        if (fileContent) {
          setContent(fileContent);
        } else if (fileUrl) {
          const response = await fetch(fileUrl);
          if (!response.ok) throw new Error('Error al cargar el archivo');
          
          if (mimeType.startsWith('text/')) {
            const text = await response.text();
            setContent(text);
          } else if (mimeType.startsWith('image/') || mimeType.startsWith('video/')) {
            setContent(fileUrl);
          }
        } else {
          setError('No hay contenido disponible para mostrar');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    };

    loadContent();
  }, [fileName, fileUrl, fileContent, mimeType]);

  const renderImageViewer = () => {
    const imageUrl = fileUrl || (fileContent && `data:${mimeType};base64,${fileContent}`);
    
    return (
      <div className="text-center p-4">
        <img 
          src={imageUrl} 
          alt={fileName}
          className="img-fluid rounded shadow"
          style={{ maxHeight: '600px', objectFit: 'contain' }}
          onError={() => setError('Error al cargar la imagen')}
        />
        <div className="mt-3">
          <a 
            href={imageUrl} 
            download={fileName}
            className="btn btn-primary d-inline-flex align-items-center"
          >
            <Icon svg={downloadIcon} size="1.2rem" className="me-2" />
            Descargar Imagen
          </a>
        </div>
      </div>
    );
  };

  const renderTextViewer = () => {
    return (
      <div className="card">
        <div className="card-header d-flex justify-content-between align-items-center">
          <span className="d-flex align-items-center">
            <Icon svg={fileIcon} size="1.2rem" className="me-2" />
            Contenido del archivo de texto
          </span>
          {fileUrl && (
            <a 
              href={fileUrl} 
              download={fileName}
              className="btn btn-sm btn-primary d-inline-flex align-items-center"
            >
              <Icon svg={downloadIcon} size="1rem" className="me-1" />
              Descargar
            </a>
          )}
        </div>
        <div className="card-body">
          <pre 
            className="bg-light p-3 rounded" 
            style={{ 
              maxHeight: '500px', 
              overflow: 'auto',
              fontSize: '14px',
              lineHeight: '1.5',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word'
            }}
          >
            {content || 'El archivo está vacío'}
          </pre>
        </div>
      </div>
    );
  };

  const renderPdfViewer = () => {
    const pdfUrl = fileUrl || (fileContent && `data:application/pdf;base64,${fileContent}`);
    
    return (
      <div>
        <div className="alert alert-info mb-3">
          <strong className="d-flex align-items-center">
            <Icon svg={fileIcon} size="1.2rem" className="me-2" />
            Documento PDF
          </strong>
          <p className="mb-2">Visualiza el PDF directamente en el navegador o descárgalo.</p>
          <a 
            href={pdfUrl} 
            download={fileName}
            className="btn btn-sm btn-primary me-2 d-inline-flex align-items-center"
          >
            <Icon svg={downloadIcon} size="1rem" className="me-1" />
            Descargar PDF
          </a>
          <a 
            href={pdfUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="btn btn-sm btn-secondary d-inline-flex align-items-center"
          >
            <Icon svg={linkIcon} size="1rem" className="me-1" />
            Abrir en nueva pestaña
          </a>
        </div>
        <div className="border rounded" style={{ height: '600px' }}>
          <iframe
            src={pdfUrl}
            title={fileName}
            width="100%"
            height="100%"
            style={{ border: 'none' }}
          />
        </div>
      </div>
    );
  };

  const renderDocumentViewer = () => {
    const docUrl = fileUrl || (fileContent && `data:${mimeType};base64,${fileContent}`);
    const docType = extension.toUpperCase();
    
    return (
      <div className="card">
        <div className="card-body text-center p-5">
          <div className="mb-4">
            <Icon svg={documentIcon} size="80px" />
          </div>
          <h4 className="mb-3">Documento {docType}</h4>
          <p className="text-muted mb-4">
            Los archivos {docType} requieren software específico para visualizarse.
            Descarga el archivo para abrirlo con la aplicación apropiada.
          </p>
          <div className="d-flex gap-2 justify-content-center flex-wrap">
            <a 
              href={docUrl} 
              download={fileName}
              className="btn btn-primary d-inline-flex align-items-center"
            >
              <Icon svg={downloadIcon} size="1.2rem" className="me-2" />
              Descargar {docType}
            </a>
            {fileUrl && (
              <a 
                href={`https://docs.google.com/viewer?url=${encodeURIComponent(fileUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary d-inline-flex align-items-center"
              >
                <Icon svg={linkIcon} size="1.2rem" className="me-2" />
                Ver con Google Docs
              </a>
            )}
          </div>
          <div className="mt-4">
            <small className="text-muted">
              <strong>Aplicaciones recomendadas:</strong><br />
              {extension === 'doc' || extension === 'docx' ? 'Microsoft Word, LibreOffice Writer, Google Docs' : ''}
              {extension === 'xls' || extension === 'xlsx' ? 'Microsoft Excel, LibreOffice Calc, Google Sheets' : ''}
              {extension === 'ppt' || extension === 'pptx' ? 'Microsoft PowerPoint, LibreOffice Impress, Google Slides' : ''}
            </small>
          </div>
        </div>
      </div>
    );
  };

  const renderVideoViewer = () => {
    const videoUrl = fileUrl || (fileContent && `data:${mimeType};base64,${fileContent}`);
    
    return (
      <div className="card">
        <div className="card-header d-flex justify-content-between align-items-center">
          <span className="d-flex align-items-center">
            <Icon svg={fileIcon} size="1.2rem" className="me-2" />
            Reproductor de video
          </span>
          <a 
            href={videoUrl} 
            download={fileName}
            className="btn btn-sm btn-primary d-inline-flex align-items-center"
          >
            <Icon svg={downloadIcon} size="1rem" className="me-1" />
            Descargar
          </a>
        </div>
        <div className="card-body">
          <div className="text-center">
            <video 
              controls 
              style={{ 
                width: '100%', 
                maxHeight: '600px',
                backgroundColor: '#000'
              }}
              onError={() => setError('Error al cargar el video')}
            >
              <source src={videoUrl} type={mimeType} />
              Tu navegador no soporta la reproducción de video HTML5.
            </video>
            <div className="mt-3">
              <small className="text-muted">
                Tipo: {mimeType} | Extensión: .{extension}
              </small>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderDefaultViewer = () => {
    const downloadUrl = fileUrl || (fileContent && `data:${mimeType};base64,${fileContent}`);
    
    return (
      <div className="card">
        <div className="card-body text-center p-5">
          <div className="mb-4">
            <Icon svg={packageIcon} size="80px" />
          </div>
          <h4 className="mb-3">Archivo: {fileName}</h4>
          <p className="text-muted mb-4">
            Este tipo de archivo no puede ser visualizado directamente en el navegador.
            Descárgalo para abrirlo con la aplicación apropiada.
          </p>
          <a 
            href={downloadUrl} 
            download={fileName}
            className="btn btn-primary btn-lg d-inline-flex align-items-center"
          >
            <Icon svg={downloadIcon} size="1.5rem" className="me-2" />
            Descargar Archivo
          </a>
          <div className="mt-4">
            <small className="text-muted">
              Tipo: {mimeType}<br />
              Extensión: .{extension || 'desconocida'}
            </small>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="text-center p-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
        <p className="mt-3 text-muted">Cargando contenido del archivo...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-warning">
        <h5 className="d-flex align-items-center">
          <Icon svg={warningIcon} size="1.5rem" className="me-2" />
          No se pudo cargar el contenido
        </h5>
        <p className="mb-3">{error}</p>
        {fileUrl && (
          <a 
            href={fileUrl} 
            download={fileName}
            className="btn btn-sm btn-warning d-inline-flex align-items-center"
          >
            <Icon svg={downloadIcon} size="1rem" className="me-1" />
            Intentar Descargar
          </a>
        )}
      </div>
    );
  }

  // Renderizar según el tipo de archivo
  if (mimeType.startsWith('image/')) {
    return renderImageViewer();
  } else if (mimeType.startsWith('video/')) {
    return renderVideoViewer();
  } else if (mimeType === 'text/plain' || extension === 'txt') {
    return renderTextViewer();
  } else if (mimeType === 'application/pdf' || extension === 'pdf') {
    return renderPdfViewer();
  } else if (['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx'].includes(extension)) {
    return renderDocumentViewer();
  } else {
    return renderDefaultViewer();
  }
}

export default FileContentViewer;
