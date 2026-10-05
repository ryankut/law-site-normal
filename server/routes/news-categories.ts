import { Router } from 'express';
import { prisma } from '../prisma.js';
import { authenticate, requireRole } from '../middleware/auth';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const categories = await prisma.newsCategory.findMany({ orderBy: { name: 'asc' } });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get news categories' });
  }
});

router.post('/', authenticate, requireRole('ADMIN'), async (req, res) => {
  try {
    const { name, slug } = req.body;
    const category = await prisma.newsCategory.create({ data: { name, slug } });
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create news category' });
  }
});

router.put('/:id', authenticate, requireRole('ADMIN'), async (req, res) => {
  try {
    const { id } = req.params;
    const category = await prisma.newsCategory.update({ where: { id }, data: req.body });
    res.json(category);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update news category' });
  }
});

router.delete('/:id', authenticate, requireRole('ADMIN'), async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.newsCategory.delete({ where: { id } });
    res.json({ message: 'News category deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete news category' });
  }
});

export default router;