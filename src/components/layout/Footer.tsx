import { useLanguage } from '../../context/LanguageContext';
import Icon from '../../components/common/Icon';
import bankLogoIcon from '../../assets/icons/bank-logo-icon.svg?raw';

function Footer() {
  const { t } = useLanguage();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-body-tertiary mt-5 border-top">
      <div className="container py-4">
        <div className="row g-4">
          {/* Logo and Description */}
          <div className="col-lg-4 col-md-6">
            <div className="d-flex align-items-center gap-2 mb-3">
              <div className="footer-logo">
                <Icon svg={bankLogoIcon} size="2.5rem" />
              </div>
              <h5 className="mb-0">{t('nav.title')}</h5>
            </div>
            <p className="text-muted">
              {t('footer.description') || 'Un repositorio digital para compartir y acceder a recursos académicos de la Universidad Católica de Santa María.'}
            </p>
          </div>

          {/* Quick Links */}
          <div className="col-lg-2 col-md-6">
            <h6 className="fw-bold mb-3">{t('footer.quickLinks') || 'Enlaces Rápidos'}</h6>
            <ul className="list-unstyled">
              <li className="mb-2">
                <a href="/main" className="text-decoration-none text-muted hover-primary">
                  {t('nav.home')}
                </a>
              </li>
              <li className="mb-2">
                <a href="/search" className="text-decoration-none text-muted hover-primary">
                  {t('nav.search')}
                </a>
              </li>
            </ul>
          </div>

          {/* Account */}
          <div className="col-lg-3 col-md-6">
            <h6 className="fw-bold mb-3">{t('footer.account') || 'Cuenta'}</h6>
            <ul className="list-unstyled">
              <li className="mb-2">
                <a href="/login" className="text-decoration-none text-muted hover-primary">
                  {t('main.loginButton')}
                </a>
              </li>
              <li className="mb-2">
                <a href="/register" className="text-decoration-none text-muted hover-primary">
                  {t('main.registerButton')}
                </a>
              </li>
            </ul>
          </div>

          {/* Contact/Info */}
          <div className="col-lg-3 col-md-6">
            <h6 className="fw-bold mb-3">{t('footer.info') || 'Información'}</h6>
            <p className="text-muted small mb-1">
              <strong>UCSM</strong>
            </p>
            <p className="text-muted small mb-1">
              Universidad Católica de Santa María
            </p>
            <p className="text-muted small">
              Arequipa, Perú
            </p>
          </div>
        </div>

        <hr className="my-4" />

        {/* Copyright */}
        <div className="row">
          <div className="col-12 text-center">
            <p className="text-muted small mb-0">
              © {currentYear} UCSM Archive. {t('footer.rights') || 'Todos los derechos reservados.'}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
