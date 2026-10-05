import { Router } from 'express';
import { prisma } from '../prisma.js';
import { authenticate, requireRole } from '../middleware/auth';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const resources = await prisma.resource.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
    });
    res.json(resources);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get resources' });
  }
});

// Increment download count (public — fires when a visitor downloads a resource)
router.post('/:id/download', async (req, res) => {
  try {
    const { id } = req.params;
    const resource = await prisma.resource.update({
      where: { id },
      data: { downloadCount: { increment: 1 } },
    });
    res.json(resource);
  } catch (error) {
    res.status(500).json({ error: 'Failed to record download' });
  }
});

router.post('/', authenticate, requireRole('ADMIN'), async (req, res) => {
  try {
    const { title, description, fileUrl, category } = req.body;
    const resource = await prisma.resource.create({
      data: { title, description, fileUrl, category },
    });
    res.status(201).json(resource);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create resource' });
  }
});

router.put('/:id', authenticate, requireRole('ADMIN'), async (req, res) => {
  try {
    const { id } = req.params;
    const resource = await prisma.resource.update({ where: { id }, data: req.body });
    res.json(resource);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update resource' });
  }
});

router.delete('/:id', authenticate, requireRole('ADMIN'), async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.resource.delete({ where: { id } });
    res.json({ message: 'Resource deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete resource' });
  }
});

export default router;