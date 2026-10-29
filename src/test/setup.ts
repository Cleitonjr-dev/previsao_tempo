import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

afterEach(() => {
  cleanup();
  if (typeof document !== 'undefined') document.body.removeAttribute('data-condition');
});
