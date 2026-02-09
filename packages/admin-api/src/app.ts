import express from 'express';
import { createAdminRouter } from './routes/admin.routes';

export function createApp() {
  const app = express();

  app.use(express.json());

  // Create and use the admin router
  const adminRouter = createAdminRouter();
  app.use('/admin', adminRouter);

  return app;
}
