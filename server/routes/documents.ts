import { Router } from 'express';
import { prisma } from '../prisma.js';
import { authenticate, AuthRequest, requireRole } from '../middleware/auth';

const router = Router();

// Get documents
router.get('/', authenticate, async (req: AuthRequest, res) => {
  try {
    const { caseId, category, page = 1, limit = 20 } = req.query;
    
    const where: any = {};
    
    // Clients only see their own documents or public templates
    if (req.user!.role === 'CLIENT') {
      where.OR = [
        { uploadedBy: req.user!.id },
        { isPublic: true },
      ];
    }
    
    if (caseId) where.caseId = caseId as string;
    if (category) where.category = category as string;

    const [documents, total] = await Promise.all([
      prisma.document.findMany({
        where,
        include: {
          uploader: {
            select: {
              firstName: true,
              lastName: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip: (parseInt(page as string) - 1) * parseInt(limit as string),
        take: parseInt(limit as string),
      }),
      prisma.document.count({ where }),
    ]);

    res.json({
      documents,
      pagination: {
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        total,
        pages: Math.ceil(total / parseInt(limit as string)),
      },
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get documents' });
  }
});

// Get document templates (public)
router.get('/templates', async (req, res) => {
  try {
    const templates = await prisma.document.findMany({
      where: { isTemplate: true, isPublic: true },
      select: {
        id: true,
        name: true,
        fileUrl: true,
        category: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(templates);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get templates' });
  }
});

// Upload document
router.post('/', authenticate, async (req: AuthRequest, res) => {
  try {
    const { name, fileUrl, fileType, fileSize, category, caseId, isPublic } = req.body;

    const document = await prisma.document.create({
      data: {
        name,
        fileUrl,
        fileType,
        fileSize,
        category,
        uploadedBy: req.user!.id,
        caseId: caseId || null,
        isPublic: isPublic || false,
      },
    });

    // Create notification for new document
    if (req.user!.role === 'CLIENT') {
      // Notify admin
      // Implementation depends on notification system
    }

    res.status(201).json(document);
  } catch (error) {
    res.status(500).json({ error: 'Failed to upload document' });
  }
});

// Delete document
router.delete('/:id', authenticate, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;

    // Check if user owns the document or is admin
    const document = await prisma.document.findUnique({ where: { id } });
    
    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }

    if (document.uploadedBy !== req.user!.id && req.user!.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Not authorized' });
    }

    await prisma.document.delete({ where: { id } });
    res.json({ message: 'Document deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete document' });
  }
});

export default router;
