import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import { localStorageService, STORAGE_KEYS } from '../services/localStorage.service';

export type Language = 'en' | 'es';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, params?: Record<string, string>) => string;
}

const translations = {
  en: {
    // Navbar
    'nav.title': 'UCSM Archive',
    'nav.home': 'Home',
    'nav.search': 'Search',
    'nav.language': 'Language',
    'nav.darkMode': 'Dark Mode',
    'nav.lightMode': 'Light Mode',
    'nav.guest': 'Guest',
    'nav.logout': 'Logout',

    // MainScreen
    'main.welcome': 'Welcome to UCSM Archive',
    'main.greeting': 'Hello, {username}! Explore our collection of educational materials',
    'main.explore': 'Explore our collection of educational materials',
    'main.loginRequired': 'You need to login to view available files',
    'main.loginMessage': 'Access your account to explore, upload and manage educational files.',
    'main.loginButton': 'Login',
    'main.registerButton': 'Register',
    'main.noFiles': 'No files available',
    'main.noFilesMessage': 'Click on "Add file" to upload your first document.',
    'main.addFile': 'Add file',
    'main.success': 'Success!',
    'main.uploadSuccess': 'The file has been uploaded successfully.',
    'main.myFilesOnly': 'Show only my files',
    'main.noMyFiles': 'You have no files',
    'main.noMyFilesMessage': 'Upload your first file to see it here.',

    // SearchScreen
    'search.title': 'File Search',
    'search.loginRequired': 'You need to login to search files',
    'search.loginMessage': 'Access your account to use the search function.',
    'search.searchBy': 'Search by filename, topic or category',
    'search.dateFrom': 'Date from',
    'search.dateTo': 'Date to',
    'search.searchButton': 'Search',
    'search.clearButton': 'Clear',
    'search.results': 'Search Results',
    'search.searchPrompt': 'Search for a file...',
    'search.searchPromptMessage': 'Use the search filters to find the files you need',
    'search.noResults': 'No results found',
    'search.noResultsMessage': 'Try adjusting your search criteria',
    'search.resultsFound': 'results found',
    'search.fileName': 'File Name',
    'search.topic': 'Topic',
    'search.category': 'Category',
    'search.date': 'Date',
    'search.actions': 'Actions',
    'search.viewButton': 'View',

    // FileViewer
    'viewer.loginRequired': 'You need to login to view files',
    'viewer.loginMessage': 'Access your account to view file contents.',
    'viewer.backHome': 'Back to Home',
    'viewer.fileNotFound': 'File not found',
    'viewer.fileNotFoundMessage': 'The requested file could not be loaded.',
    'viewer.backButton': 'Back to Home',

    // Login/Register
    'auth.login': 'Login',
    'auth.register': 'Register',
    'auth.username': 'Username',
    'auth.password': 'Password',
    'auth.confirmPassword': 'Confirm Password',
    'auth.email': 'Email',
    'auth.dontHaveAccount': "Don't have an account?",
    'auth.alreadyHaveAccount': 'Already have an account?',
    'auth.here': 'here',

    // File Upload
    'upload.title': 'Upload File',
    'upload.file': 'File',
    'upload.topic': 'Subject / Topic',
    'upload.topicPlaceholder': 'Ex: Mathematics, Physics, Computer Science',
    'upload.category': 'Sub-category',
    'upload.categoryPlaceholder': 'Ex: Algebra, Mechanics, Algorithms',
    'upload.description': 'Description',
    'upload.descriptionPlaceholder': 'Additional file description (optional)',
    'upload.dragDrop': 'Drag and drop a file here, or click to select',
    'upload.selectedFile': 'Selected file:',
    'upload.cancel': 'Cancel',
    'upload.uploadButton': 'Upload File',
    'upload.errorRequired': 'Please complete all required fields',
    'upload.errorFile': 'Please select a file',
    'upload.editTitle': 'Edit File',
    'upload.updateButton': 'Update',

    // Archive Card
    'card.featured': 'Featured:',
    'card.explore': 'Explore',
    'card.edit': 'Edit',
    'card.delete': 'Delete',
    'card.confirmDelete': 'Are you sure you want to delete this file?',

    // Validation Messages
    'validation.emailRequired': 'Email is required',
    'validation.emailInvalid': 'Please enter a valid email address',
    'validation.passwordRequired': 'Password is required',
    'validation.passwordMinLength': 'Password must be at least 6 characters long',
    'validation.usernameRequired': 'Username is required',
    'validation.usernameMinLength': 'Username must be at least 3 characters long',
    'validation.passwordsNoMatch': 'Passwords do not match',
    'validation.fieldRequired': '{field} is required',
    'validation.fileSizeExceeded': 'File size must be less than {maxSize}MB',
    'validation.fileTypeNotAllowed': 'File type not allowed',

    // Auth Messages
    'auth.usernameExists': 'Username already exists',
    'auth.emailExists': 'Email already exists',
    'auth.registerSuccess': 'User registered successfully',
    'auth.usernameNotFound': 'Username not found',
    'auth.incorrectPassword': 'Incorrect password',
    'auth.loginSuccess': 'Login successful',

    // Footer
    'footer.description': 'A digital repository for sharing and accessing academic resources from Universidad Católica de Santa María.',
    'footer.quickLinks': 'Quick Links',
    'footer.account': 'Account',
    'footer.info': 'Information',
    'footer.rights': 'All rights reserved.',
  },
  es: {
    // Navbar
    'nav.title': 'UCSM Archive',
    'nav.home': 'Inicio',
    'nav.search': 'Búsqueda',
    'nav.language': 'Idioma',
    'nav.darkMode': 'Modo Oscuro',
    'nav.lightMode': 'Modo Claro',
    'nav.guest': 'Invitado',
    'nav.logout': 'Cerrar Sesión',

    // MainScreen
    'main.welcome': 'Bienvenido a UCSM Archive',
    'main.greeting': '¡Hola, {username}! Explora nuestra colección de materiales educativos',
    'main.explore': 'Explora nuestra colección de materiales educativos',
    'main.loginRequired': 'Necesitas iniciar sesión para ver los archivos disponibles',
    'main.loginMessage': 'Accede a tu cuenta para explorar, subir y gestionar archivos educativos.',
    'main.loginButton': 'Iniciar Sesión',
    'main.registerButton': 'Registrarse',
    'main.noFiles': 'No hay archivos disponibles',
    'main.noFilesMessage': 'Haz clic en "Añadir archivo" para subir tu primer documento.',
    'main.addFile': 'Añadir archivo',
    'main.success': '¡Éxito!',
    'main.uploadSuccess': 'El archivo se ha subido correctamente.',
    'main.myFilesOnly': 'Mostrar solo mis archivos',
    'main.noMyFiles': 'No tienes archivos',
    'main.noMyFilesMessage': 'Sube tu primer archivo para verlo aquí.',

    // SearchScreen
    'search.title': 'Búsqueda de Archivos',
    'search.loginRequired': 'Necesitas iniciar sesión para buscar archivos',
    'search.loginMessage': 'Accede a tu cuenta para utilizar la función de búsqueda.',
    'search.searchBy': 'Buscar por nombre de archivo, tema o categoría',
    'search.dateFrom': 'Fecha desde',
    'search.dateTo': 'Fecha hasta',
    'search.searchButton': 'Buscar',
    'search.clearButton': 'Limpiar',
    'search.results': 'Resultados de Búsqueda',
    'search.searchPrompt': 'Busca un archivo...',
    'search.searchPromptMessage': 'Utiliza los filtros de búsqueda para encontrar los archivos que necesitas',
    'search.noResults': 'No se encontraron resultados',
    'search.noResultsMessage': 'Intenta ajustar tus criterios de búsqueda',
    'search.resultsFound': 'resultados encontrados',
    'search.fileName': 'Nombre del Archivo',
    'search.topic': 'Tema',
    'search.category': 'Categoría',
    'search.date': 'Fecha',
    'search.actions': 'Acciones',
    'search.viewButton': 'Ver',

    // FileViewer
    'viewer.loginRequired': 'Necesitas iniciar sesión para ver archivos',
    'viewer.loginMessage': 'Accede a tu cuenta para visualizar el contenido de los archivos.',
    'viewer.backHome': 'Volver al Inicio',
    'viewer.fileNotFound': 'Archivo no encontrado',
    'viewer.fileNotFoundMessage': 'El archivo solicitado no pudo ser cargado.',
    'viewer.backButton': 'Volver al Inicio',

    // Login/Register
    'auth.login': 'Iniciar Sesión',
    'auth.register': 'Registrarse',
    'auth.username': 'Usuario',
    'auth.password': 'Contraseña',
    'auth.confirmPassword': 'Confirmar Contraseña',
    'auth.email': 'Correo Electrónico',
    'auth.dontHaveAccount': '¿No tienes una cuenta?',
    'auth.alreadyHaveAccount': '¿Ya tienes una cuenta?',
    'auth.here': 'aquí',

    // File Upload
    'upload.title': 'Subir Archivo',
    'upload.file': 'Archivo',
    'upload.topic': 'Tema / Materia',
    'upload.topicPlaceholder': 'Ej: Matemáticas, Física, Ciencias de la Computación',
    'upload.category': 'Sub-categoría',
    'upload.categoryPlaceholder': 'Ej: Álgebra, Mecánica, Algoritmos',
    'upload.description': 'Descripción',
    'upload.descriptionPlaceholder': 'Descripción adicional del archivo (opcional)',
    'upload.dragDrop': 'Arrastra y suelta un archivo aquí, o haz clic para seleccionar',
    'upload.selectedFile': 'Archivo seleccionado:',
    'upload.cancel': 'Cancelar',
    'upload.uploadButton': 'Subir Archivo',
    'upload.errorRequired': 'Por favor completa todos los campos requeridos',
    'upload.errorFile': 'Por favor selecciona un archivo',
    'upload.editTitle': 'Editar Archivo',
    'upload.updateButton': 'Actualizar',

    // Archive Card
    'card.featured': 'Destacado:',
    'card.explore': 'Explorar',
    'card.edit': 'Editar',
    'card.delete': 'Eliminar',
    'card.confirmDelete': '¿Estás seguro de que quieres eliminar este archivo?',

    // Validation Messages
    'validation.emailRequired': 'El correo electrónico es requerido',
    'validation.emailInvalid': 'Por favor ingresa una dirección de correo válida',
    'validation.passwordRequired': 'La contraseña es requerida',
    'validation.passwordMinLength': 'La contraseña debe tener al menos 6 caracteres',
    'validation.usernameRequired': 'El nombre de usuario es requerido',
    'validation.usernameMinLength': 'El nombre de usuario debe tener al menos 3 caracteres',
    'validation.passwordsNoMatch': 'Las contraseñas no coinciden',
    'validation.fieldRequired': '{field} es requerido',
    'validation.fileSizeExceeded': 'El tamaño del archivo debe ser menor a {maxSize}MB',
    'validation.fileTypeNotAllowed': 'Tipo de archivo no permitido',

    // Auth Messages
    'auth.usernameExists': 'El nombre de usuario ya existe',
    'auth.emailExists': 'El correo electrónico ya existe',
    'auth.registerSuccess': 'Usuario registrado exitosamente',
    'auth.usernameNotFound': 'Nombre de usuario no encontrado',
    'auth.incorrectPassword': 'Contraseña incorrecta',
    'auth.loginSuccess': 'Inicio de sesión exitoso',

    // Footer
    'footer.description': 'Un repositorio digital para compartir y acceder a recursos académicos de la Universidad Católica de Santa María.',
    'footer.quickLinks': 'Enlaces Rápidos',
    'footer.account': 'Cuenta',
    'footer.info': 'Información',
    'footer.rights': 'Todos los derechos reservados.',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => {
    return (localStorageService.getString(STORAGE_KEYS.LANGUAGE) as Language) || 'en';
  });

  const t = (key: string, params?: Record<string, string>): string => {
    let text = translations[language][key as keyof typeof translations['en']] || key;

    if (params) {
      Object.entries(params).forEach(([paramKey, value]) => {
        text = text.replace(`{${paramKey}}`, value);
      });
    }

    return text;
  };

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorageService.setString(STORAGE_KEYS.LANGUAGE, lang);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
}
