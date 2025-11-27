import { useLanguage } from '../context/LanguageContext';
import type { ValidationMessages } from '../utils/validation';
import type { AuthMessages } from '../utils/auth';

interface UseTranslatedMessagesReturn {
  validationMessages: ValidationMessages;
  authMessages: AuthMessages;
}

export function useTranslatedMessages(): UseTranslatedMessagesReturn {
  const { t } = useLanguage();

  const validationMessages: ValidationMessages = {
    emailRequired: t('validation.emailRequired'),
    emailInvalid: t('validation.emailInvalid'),
    passwordRequired: t('validation.passwordRequired'),
    passwordMinLength: t('validation.passwordMinLength'),
    usernameRequired: t('validation.usernameRequired'),
    usernameMinLength: t('validation.usernameMinLength'),
    passwordsNoMatch: t('validation.passwordsNoMatch'),
    fieldRequired: t('validation.fieldRequired'),
    fileSizeExceeded: t('validation.fileSizeExceeded'),
    fileTypeNotAllowed: t('validation.fileTypeNotAllowed'),
  };

  const authMessages: AuthMessages = {
    usernameExists: t('auth.usernameExists'),
    emailExists: t('auth.emailExists'),
    registerSuccess: t('auth.registerSuccess'),
    usernameNotFound: t('auth.usernameNotFound'),
    incorrectPassword: t('auth.incorrectPassword'),
    loginSuccess: t('auth.loginSuccess'),
  };

  return {
    validationMessages,
    authMessages,
  };
}
