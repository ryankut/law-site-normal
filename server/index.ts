import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import { prisma } from './prisma.js';
import authRoutes from './routes/auth';
import appointmentRoutes from './routes/appointments';
import clientRoutes from './routes/clients';
import caseRoutes from './routes/cases';
import paymentRoutes from './routes/payments';
import documentRoutes from './routes/documents';
import messageRoutes from './routes/messages';
import practiceAreaRoutes from './routes/practice-areas';
import matterTypeRoutes from './routes/matter-types';
import teamMemberRoutes from './routes/team-members';
import faqRoutes from './routes/faqs';
import newsCategoryRoutes from './routes/news-categories';
import newsArticleRoutes from './routes/news-articles';
import clientLogoRoutes from './routes/client-logos';
import resourceRoutes from './routes/resources';
import newsletterRoutes from './routes/newsletter';
import contactRoutes from './routes/contact';
import settingsRoutes from './routes/settings';
import adminRoutes from './routes/admin';
import notificationRoutes from './routes/notifications';
import uploadRoutes from './routes/upload';

dotenv.config();

const app = express();

const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use('/uploads', express.static('uploads'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/cases', caseRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/practice-areas', practiceAreaRoutes);
app.use('/api/matter-types', matterTypeRoutes);
app.use('/api/team-members', teamMemberRoutes);
app.use('/api/faqs', faqRoutes);
app.use('/api/news-categories', newsCategoryRoutes);
app.use('/api/news-articles', newsArticleRoutes);
app.use('/api/client-logos', clientLogoRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/newsletter', newsletterRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/upload', uploadRoutes);
// Stripe webhook route
app.use('/api/stripe', paymentRoutes);

// Error handling
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

export default app;
