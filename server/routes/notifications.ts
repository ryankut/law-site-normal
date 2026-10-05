import { Router } from 'express';
import { prisma } from '../prisma.js';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();

// Get notifications
router.get('/', authenticate, async (req: AuthRequest, res) => {
  try {
    const { page = 1, limit = 20, unreadOnly } = req.query;
    
    const where: any = { userId: req.user!.id };
    if (unreadOnly === 'true') where.isRead = false;

    const [notifications, unreadCount] = await Promise.all([
      prisma.notification.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (parseInt(page as string) - 1) * parseInt(limit as string),
        take: parseInt(limit as string),
      }),
      prisma.notification.count({
        where: { userId: req.user!.id, isRead: false },
      }),
    ]);

    res.json({ notifications, unreadCount });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get notifications' });
  }
});

// Mark notification as read
router.put('/:id/read', authenticate, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;

    const notification = await prisma.notification.update({
      where: { id, userId: req.user!.id },
      data: { isRead: true },
    });

    res.json(notification);
  } catch (error) {
    res.status(500).json({ error: 'Failed to mark notification as read' });
  }
});

// Mark all as read
router.put('/read-all', authenticate, async (req: AuthRequest, res) => {
  try {
    await prisma.notification.updateMany({
      where: { userId: req.user!.id, isRead: false },
      data: { isRead: true },
    });

    res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to mark notifications as read' });
  }
});

// Create notification (internal use)
export const createNotification = async (
  userId: string,
  title: string,
  message: string,
  type: string,
  link?: string
) => {
  return await prisma.notification.create({
    data: {
      userId,
      title,
      message,
      type,
      link,
    },
  });
};

export default router;
