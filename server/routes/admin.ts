import { Router } from 'express';
import { prisma } from '../prisma.js';
import { authenticate, requireRole } from '../middleware/auth';

const router = Router();

// Get dashboard stats
router.get('/dashboard', authenticate, requireRole('ADMIN'), async (req, res) => {
  try {
    const [
      totalClients,
      totalAppointments,
      totalCases,
      totalRevenue,
      recentAppointments,
      upcomingAppointments,
      casesByStatus,
      monthlyRevenue,
    ] = await Promise.all([
      prisma.user.count({ where: { role: 'CLIENT' } }),
      prisma.appointment.count(),
      prisma.case.count(),
      prisma.payment.aggregate({
        where: { status: 'PAID' },
        _sum: { amount: true },
      }),
      prisma.appointment.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          client: {
            select: { firstName: true, lastName: true, email: true },
          },
        },
      }),
      prisma.appointment.findMany({
        where: {
          date: { gte: new Date() },
          status: 'CONFIRMED',
        },
        take: 5,
        orderBy: { date: 'asc' },
        include: {
          client: {
            select: { firstName: true, lastName: true },
          },
        },
      }),
      prisma.case.groupBy({
        by: ['status'],
        _count: { status: true },
      }),
      prisma.payment.groupBy({
        by: ['status'],
        _sum: { amount: true },
        where: {
          createdAt: {
            gte: new Date(new Date().setMonth(new Date().getMonth() - 6)),
          },
        },
      }),
    ]);

    res.json({
      stats: {
        totalClients,
        totalAppointments,
        totalCases,
        totalRevenue: totalRevenue._sum.amount || 0,
      },
      recentAppointments,
      upcomingAppointments,
      casesByStatus,
      monthlyRevenue,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get dashboard stats' });
  }
});

// Get analytics data
router.get('/analytics', authenticate, requireRole('ADMIN'), async (req, res) => {
  try {
    const { range = '30d' } = req.query;
    
    const days = parseInt(range as string) || 30;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const [
      newClients,
      consultations,
      conversionRate,
      revenueByDay,
    ] = await Promise.all([
      prisma.user.count({
        where: {
          role: 'CLIENT',
          createdAt: { gte: startDate },
        },
      }),
      prisma.appointment.count({
        where: { createdAt: { gte: startDate } },
      }),
      // Calculate conversion rate
      prisma.$queryRaw`
        SELECT 
          COUNT(DISTINCT a.client_id) as total_clients,
          COUNT(DISTINCT c.client_id) as converted_clients
        FROM appointments a
        LEFT JOIN cases c ON a.client_id = c.client_id
        WHERE a.created_at >= ${startDate}
      `,
      prisma.payment.groupBy({
        by: ['createdAt'],
        where: {
          status: 'PAID',
          createdAt: { gte: startDate },
        },
        _sum: { amount: true },
      }),
    ]);

    res.json({
      newClients,
      consultations,
      conversionRate,
      revenueByDay,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get analytics' });
  }
});

// Get site settings
router.get('/settings', authenticate, requireRole('ADMIN'), async (req, res) => {
  try {
    const settings = await prisma.siteSettings.findMany();
    
    const settingsMap = settings.reduce((acc, setting) => {
      acc[setting.key] = setting.value;
      return acc;
    }, {} as any);

    res.json(settingsMap);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get settings' });
  }
});

// Update site settings
router.put('/settings', authenticate, requireRole('ADMIN'), async (req, res) => {
  try {
    const updates = req.body;

    await Promise.all(
      Object.entries(updates).map(([key, value]) =>
        prisma.siteSettings.upsert({
          where: { key },
          update: { value: value as any },
          create: { key, value: value as any },
        })
      )
    );

    res.json({ message: 'Settings updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update settings' });
  }
});

export default router;
