import RegisterForm from '../components/specific/RegisterForm';
import SettingsControls from '../components/specific/SettingsControls';

function Register() {
  return (
    <div className="container">
      {/* Controles de configuración en la esquina superior derecha */}
      <div className="position-fixed top-0 end-0 p-3" style={{ zIndex: 1000 }}>
        <SettingsControls />
      </div>

      <div className="row justify-content-center align-items-center min-vh-100">
        <div className="col-md-6 col-lg-5">
          <RegisterForm />
        </div>
      </div>
    </div>
  );
}

export default Register;
