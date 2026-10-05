import { Router } from 'express';
import { prisma } from '../prisma.js';
import { authenticate, requireRole } from '../middleware/auth';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const logos = await prisma.clientLogo.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
    });
    res.json(logos);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get client logos' });
  }
});

router.post('/', authenticate, requireRole('ADMIN'), async (req, res) => {
  try {
    const { companyName, logoUrl, websiteUrl, sortOrder } = req.body;
    const logo = await prisma.clientLogo.create({
      data: { companyName, logoUrl, websiteUrl, sortOrder: sortOrder || 0 },
    });
    res.status(201).json(logo);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create client logo' });
  }
});

router.put('/:id', authenticate, requireRole('ADMIN'), async (req, res) => {
  try {
    const { id } = req.params;
    const logo = await prisma.clientLogo.update({ where: { id }, data: req.body });
    res.json(logo);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update client logo' });
  }
});

router.delete('/:id', authenticate, requireRole('ADMIN'), async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.clientLogo.delete({ where: { id } });
    res.json({ message: 'Client logo deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete client logo' });
  }
});

export default router;