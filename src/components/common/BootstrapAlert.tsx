interface BootstrapAlertProps {
  message: string;
  type?: 'danger' | 'success' | 'warning' | 'info';
  onClose?: () => void;
}

function BootstrapAlert({ message, type = 'danger', onClose }: BootstrapAlertProps) {
  return (
    <div className={`alert alert-${type} alert-dismissible fade show`} role="alert">
      {message}
      {onClose && (
        <button
          type="button"
          className="btn-close"
          aria-label="Close"
          onClick={onClose}
        />
      )}
    </div>
  );
}

export default BootstrapAlert;
