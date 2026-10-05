import { Router } from 'express';
import { prisma } from '../prisma.js';
import { authenticate, AuthRequest, requireRole } from '../middleware/auth';

const router = Router();

// Get messages
router.get('/', authenticate, async (req: AuthRequest, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    
    const where: any = {};
    
    if (req.user!.role === 'CLIENT') {
      where.OR = [
        { senderId: req.user!.id },
        { recipientId: req.user!.id },
      ];
    }

    const [messages, total, unreadCount] = await Promise.all([
      prisma.message.findMany({
        where,
        include: {
          sender: {
            select: {
              firstName: true,
              lastName: true,
              avatar: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip: (parseInt(page as string) - 1) * parseInt(limit as string),
        take: parseInt(limit as string),
      }),
      prisma.message.count({ where }),
      prisma.message.count({
        where: {
          recipientId: req.user!.id,
          isRead: false,
        },
      }),
    ]);

    res.json({
      messages,
      unreadCount,
      pagination: {
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        total,
        pages: Math.ceil(total / parseInt(limit as string)),
      },
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get messages' });
  }
});

// Get conversation thread
router.get('/thread/:id', authenticate, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;

    const message = await prisma.message.findUnique({
      where: { id },
    });

    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }

    // Get thread
    const thread = await prisma.message.findMany({
      where: {
        OR: [
          { id },
          { parentId: id },
        ],
      },
      include: {
        sender: {
          select: {
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
      },
      orderBy: { createdAt: 'asc' },
    });

    // Mark as read
    if (message.recipientId === req.user!.id && !message.isRead) {
      await prisma.message.update({
        where: { id },
        data: { isRead: true },
      });
    }

    res.json(thread);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get message thread' });
  }
});

// Send message
router.post('/', authenticate, async (req: AuthRequest, res) => {
  try {
    const { recipientId, subject, content, parentId, isUrgent } = req.body;

    const message = await prisma.message.create({
      data: {
        senderId: req.user!.id,
        recipientId,
        subject,
        content,
        parentId,
        isUrgent: isUrgent || false,
      },
      include: {
        sender: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ error: 'Failed to send message' });
  }
});

// Mark message as read
router.put('/:id/read', authenticate, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;

    const message = await prisma.message.update({
      where: { id },
      data: { isRead: true },
    });

    res.json(message);
  } catch (error) {
    res.status(500).json({ error: 'Failed to mark message as read' });
  }
});

export default router;
