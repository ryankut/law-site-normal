import { Router } from 'express';
import { prisma } from '../prisma.js';
import { authenticate, AuthRequest, requireRole } from '../middleware/auth';

const router = Router();

// Get all cases (admin only)
router.get('/', authenticate, requireRole('ADMIN', 'ATTORNEY'), async (req, res) => {
  try {
    const { status, practiceArea, page = 1, limit = 20 } = req.query;
    
    const where: any = {};
    if (status) where.status = status;
    if (practiceArea) where.practiceArea = practiceArea;

    const [cases, total] = await Promise.all([
      prisma.case.findMany({
        where,
        include: {
          documents: {
            select: { id: true, name: true, createdAt: true },
          },
          _count: {
            select: { notes: true, documents: true },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip: (parseInt(page as string) - 1) * parseInt(limit as string),
        take: parseInt(limit as string),
      }),
      prisma.case.count({ where }),
    ]);

    res.json({
      cases,
      pagination: {
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        total,
        pages: Math.ceil(total / parseInt(limit as string)),
      },
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get cases' });
  }
});

// Get featured case results (public)
router.get('/featured', async (req, res) => {
  try {
    const cases = await prisma.case.findMany({
      where: { isFeatured: true, status: { in: ['SETTLED', 'WON'] } },
      select: {
        id: true,
        caseNumber: true,
        title: true,
        practiceArea: true,
        outcome: true,
        value: true,
      },
      orderBy: { createdAt: 'desc' },
      take: 6,
    });

    res.json(cases);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get featured cases' });
  }
});

// Get single case
router.get('/:id', authenticate, requireRole('ADMIN', 'ATTORNEY'), async (req, res) => {
  try {
    const { id } = req.params;

    const case_ = await prisma.case.findUnique({
      where: { id },
      include: {
        documents: true,
        notes: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!case_) {
      return res.status(404).json({ error: 'Case not found' });
    }

    res.json(case_);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get case' });
  }
});

// Create case (admin only)
router.post('/', authenticate, requireRole('ADMIN'), async (req, res) => {
  try {
    const { clientId, title, description, practiceArea, value, caseNumber } = req.body;

    const newCase = await prisma.case.create({
      data: {
        clientId,
        title,
        description,
        practiceArea,
        value: value ? parseFloat(value) : null,
        caseNumber: caseNumber || `CASE-${Date.now()}`,
      },
    });

    res.status(201).json(newCase);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create case' });
  }
});

// Update case
router.put('/:id', authenticate, requireRole('ADMIN'), async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    if (updateData.value) {
      updateData.value = parseFloat(updateData.value);
    }

    const case_ = await prisma.case.update({
      where: { id },
      data: updateData,
    });

    res.json(case_);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update case' });
  }
});

// Add case note
router.post('/:id/notes', authenticate, requireRole('ADMIN', 'ATTORNEY'), async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const { content, isPrivate } = req.body;

    const note = await prisma.caseNote.create({
      data: {
        caseId: id,
        content,
        isPrivate: isPrivate || false,
        createdBy: req.user!.id,
      },
    });

    res.status(201).json(note);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add case note' });
  }
});

// Delete case (admin only)
router.delete('/:id', authenticate, requireRole('ADMIN'), async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.case.delete({ where: { id } });
    res.json({ message: 'Case deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete case' });
  }
});

export default router;
