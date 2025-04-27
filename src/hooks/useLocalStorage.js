import { useState, useEffect } from 'react';

function useLocalStorage(key, initialValue) {
  // State to store our value
  const [storedValue, setStoredValue] = useState(() => {
    try {
      // Get from local storage by key
      const item = window.localStorage.getItem(key);
      // Parse stored json or if none return initialValue
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Return a wrapped version of useState's setter function that
  // persists the new value to localStorage
  const setValue = (value) => {
    try {
      // Allow value to be a function so we have the same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      
      // Save state
      setStoredValue(valueToStore);
      
      // Save to local storage
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  // Update stored value if the key changes (but not when initialValue changes)
  useEffect(() => {
    try {
      const item = window.localStorage.getItem(key);
      const parsedItem = item ? JSON.parse(item) : initialValue;
      
      // Only set state if the value in localStorage differs from current state
      if (JSON.stringify(parsedItem) !== JSON.stringify(storedValue)) {
        setStoredValue(parsedItem);
      }
    } catch (error) {
      console.error(`Error updating localStorage key "${key}":`, error);
      setStoredValue(initialValue);
    }
  }, [key]); // Only depend on key, not initialValue

  return [storedValue, setValue];
}

export default useLocalStorage; 