import { handlers } from './handlers';
import { test as base, expect } from '@playwright/test';
import { createWorkerFixture } from 'playwright-msw';

import type { MockServiceWorker } from 'playwright-msw';

const test = base.extend<{
  worker: MockServiceWorker;
}>({
  worker: createWorkerFixture(handlers),
});

export { test, expect };
