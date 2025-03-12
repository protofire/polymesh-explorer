import { useState, useCallback } from 'react';

export const useToggle = () => {
  const [state, setState] = useState(false);

  const toggle = useCallback(() => {
    setState((prevState) => !prevState);
  }, []);

  return { state, toggle };
};
