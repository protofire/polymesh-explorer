import { useContext } from 'react';
import { PolymeshSdkContext } from '.';

export function usePolymeshSdkService() {
  const context = useContext(PolymeshSdkContext);
  if (context === undefined) {
    throw new Error(
      'usePolymeshSdkService must be used within a PolymeshSdkProvider',
    );
  }
  return context;
}
