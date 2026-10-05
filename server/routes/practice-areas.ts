import { Router } from 'express';
import { prisma } from '../prisma.js';
import { authenticate, requireRole } from '../middleware/auth';

const router = Router();

// Get all top-level practice areas, with children (public)
router.get('/', async (req, res) => {
  try {
    const practiceAreas = await prisma.practiceArea.findMany({
      where: { isActive: true, parentId: null },
      orderBy: { sortOrder: 'asc' },
      include: {
        children: {
          where: { isActive: true },
          orderBy: { sortOrder: 'asc' },
        },
      },
    });

    res.json(practiceAreas);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get practice areas' });
  }
});

// Get single practice area by slug, with children, parent, faqs, team members
router.get('/:slug', async (req, res) => {
  try {
    const { slug } = req.params;

    const practiceArea = await prisma.practiceArea.findUnique({
      where: { slug },
      include: {
        parent: true,
        children: {
          where: { isActive: true },
          orderBy: { sortOrder: 'asc' },
        },
        faqs: {
          where: { isActive: true },
          orderBy: { sortOrder: 'asc' },
        },
        teamMembers: {
          include: { teamMember: true },
        },
      },
    });

    if (!practiceArea || !practiceArea.isActive) {
      return res.status(404).json({ error: 'Practice area not found' });
    }

    res.json(practiceArea);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get practice area' });
  }
});

// Create practice area (admin only)
router.post('/', authenticate, requireRole('ADMIN'), async (req, res) => {
  try {
    const {
      parentId,
      name,
      slug,
      iconUrl,
      imageUrl,
      shortDesc,
      body,
      metaTitle,
      metaDesc,
      sortOrder,
    } = req.body;

    const practiceArea = await prisma.practiceArea.create({
      data: {
        parentId: parentId || null,
        name,
        slug,
        iconUrl,
        imageUrl,
        shortDesc,
        body,
        metaTitle,
        metaDesc,
        sortOrder: sortOrder || 0,
      },
    });

    res.status(201).json(practiceArea);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create practice area' });
  }
});

// Update practice area (admin only)
router.put('/:id', authenticate, requireRole('ADMIN'), async (req, res) => {
  try {
    const { id } = req.params;
    const practiceArea = await prisma.practiceArea.update({
      where: { id },
      data: req.body,
    });

    res.json(practiceArea);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update practice area' });
  }
});

// Delete practice area (admin only)
router.delete('/:id', authenticate, requireRole('ADMIN'), async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.practiceArea.delete({ where: { id } });
    res.json({ message: 'Practice area deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete practice area' });
  }
});

export default router;