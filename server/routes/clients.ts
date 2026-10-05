import { Router } from 'express';
import { prisma } from '../prisma.js';
import { authenticate, AuthRequest, requireRole } from '../middleware/auth';

const router = Router();

// Get all clients (admin only)
router.get('/', authenticate, requireRole('ADMIN', 'ATTORNEY'), async (req, res) => {
  try {
    const { search, page = 1, limit = 20 } = req.query;
    
    const where: any = { role: 'CLIENT' };
    
    if (search) {
      where.OR = [
        { firstName: { contains: search as string, mode: 'insensitive' } },
        { lastName: { contains: search as string, mode: 'insensitive' } },
        { email: { contains: search as string, mode: 'insensitive' } },
        { phone: { contains: search as string, mode: 'insensitive' } },
      ];
    }

    const [clients, total] = await Promise.all([
      prisma.user.findMany({
        where,
        include: {
          clientProfile: true,
          _count: {
            select: {
              appointments: true,
              cases: true,
              documents: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip: (parseInt(page as string) - 1) * parseInt(limit as string),
        take: parseInt(limit as string),
      }),
      prisma.user.count({ where }),
    ]);

    res.json({
      clients,
      pagination: {
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        total,
        pages: Math.ceil(total / parseInt(limit as string)),
      },
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get clients' });
  }
});

// Get single client
router.get('/:id', authenticate, requireRole('ADMIN', 'ATTORNEY'), async (req, res) => {
  try {
    const { id } = req.params;

    const client = await prisma.user.findFirst({
      where: { id, role: 'CLIENT' },
      include: {
        clientProfile: true,
        appointments: {
          orderBy: { date: 'desc' },
        },
        payments: {
          orderBy: { createdAt: 'desc' },
        },
        documents: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    });

    if (!client) {
      return res.status(404).json({ error: 'Client not found' });
    }

    res.json(client);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get client' });
  }
});

// Update client
router.put('/:id', authenticate, requireRole('ADMIN'), async (req, res) => {
  try {
    const { id } = req.params;
    const { firstName, lastName, phone, address, city, state, zipCode, notes } = req.body;

    const client = await prisma.user.update({
      where: { id },
      data: {
        firstName,
        lastName,
        phone,
        clientProfile: {
          update: {
            address,
            city,
            state,
            zipCode,
            notes,
          },
        },
      },
      include: { clientProfile: true },
    });

    res.json(client);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update client' });
  }
});

export default router;
