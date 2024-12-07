export const setToStorage = (key: string, value: any) => {
    const stringValue = JSON.stringify(value);
    localStorage.setItem(key, stringValue);
    sessionStorage.setItem(key, stringValue);
  };
  
 export const removeFromStorage = (key: string) => {
    localStorage.removeItem(key);
    sessionStorage.removeItem(key);
  };
  
 export const getFromStorage = (key: string) => {
    const localItem = localStorage.getItem(key);
    sessionStorage.setItem(key, localItem || '');
    return localItem ? JSON.parse(localItem) : null;
  };