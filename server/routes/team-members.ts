import { Router } from 'express';
import { prisma } from '../prisma.js';
import { authenticate, requireRole } from '../middleware/auth';

const router = Router();

// Get all active team members, with their practice areas (public)
router.get('/', async (req, res) => {
  try {
    const teamMembers = await prisma.teamMember.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
      include: {
        practiceAreas: {
          include: { practiceArea: true },
        },
      },
    });

    res.json(teamMembers);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get team members' });
  }
});

// Get single team member, with practice areas and their news articles (public)
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const teamMember = await prisma.teamMember.findUnique({
      where: { id },
      include: {
        practiceAreas: {
          include: { practiceArea: true },
        },
        newsArticles: {
          where: { status: 'PUBLISHED' },
          orderBy: { publishedAt: 'desc' },
        },
      },
    });

    if (!teamMember || !teamMember.isActive) {
      return res.status(404).json({ error: 'Team member not found' });
    }

    res.json(teamMember);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get team member' });
  }
});

// Create team member (admin only)
router.post('/', authenticate, requireRole('ADMIN'), async (req, res) => {
  try {
    const { fullName, roleTitle, photoUrl, bio, email, linkedinUrl, sortOrder } = req.body;

    const teamMember = await prisma.teamMember.create({
      data: {
        fullName,
        roleTitle,
        photoUrl,
        bio,
        email,
        linkedinUrl,
        sortOrder: sortOrder || 0,
      },
    });

    res.status(201).json(teamMember);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create team member' });
  }
});

// Update team member (admin only)
router.put('/:id', authenticate, requireRole('ADMIN'), async (req, res) => {
  try {
    const { id } = req.params;
    const teamMember = await prisma.teamMember.update({
      where: { id },
      data: req.body,
    });

    res.json(teamMember);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update team member' });
  }
});

// Delete team member (admin only)
router.delete('/:id', authenticate, requireRole('ADMIN'), async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.teamMember.delete({ where: { id } });
    res.json({ message: 'Team member deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete team member' });
  }
});

// Attach a practice area to a team member (admin only)
router.post('/:id/practice-areas', authenticate, requireRole('ADMIN'), async (req, res) => {
  try {
    const { id } = req.params;
    const { practiceAreaId } = req.body;

    const link = await prisma.teamPracticeArea.create({
      data: {
        teamMemberId: id,
        practiceAreaId,
      },
    });

    res.status(201).json(link);
  } catch (error) {
    res.status(500).json({ error: 'Failed to attach practice area' });
  }
});

// Detach a practice area from a team member (admin only)
router.delete('/:id/practice-areas/:practiceAreaId', authenticate, requireRole('ADMIN'), async (req, res) => {
  try {
    const { id, practiceAreaId } = req.params;

    await prisma.teamPracticeArea.delete({
      where: {
        teamMemberId_practiceAreaId: {
          teamMemberId: id,
          practiceAreaId,
        },
      },
    });

    res.json({ message: 'Practice area detached successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to detach practice area' });
  }
});

export default router;