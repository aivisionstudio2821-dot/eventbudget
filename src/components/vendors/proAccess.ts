export const PRO_SESSION_KEY = 'eventbudget_pro_session_v1';

export const getProSessionValue = (): boolean => {
  if (typeof window === 'undefined') {
    return false;
  }

  return window.sessionStorage.getItem(PRO_SESSION_KEY) === 'true';
};

export const setProSessionValue = (isActive: boolean): void => {
  if (typeof window === 'undefined') {
    return;
  }

  if (isActive) {
    window.sessionStorage.setItem(PRO_SESSION_KEY, 'true');
    return;
  }

  window.sessionStorage.removeItem(PRO_SESSION_KEY);
};
