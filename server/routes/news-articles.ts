import { Router } from 'express';
import { prisma } from '../prisma.js';
import { authenticate, requireRole } from '../middleware/auth';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const { categoryId } = req.query;
    const articles = await prisma.newsArticle.findMany({
      where: {
        status: 'PUBLISHED',
        ...(categoryId ? { categoryId: String(categoryId) } : {}),
      },
      orderBy: { publishedAt: 'desc' },
      include: { category: true, author: true },
    });
    res.json(articles);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get news articles' });
  }
});

// Admin: get all articles regardless of status (draft, published, archived)
router.get('/admin/all', authenticate, requireRole('ADMIN'), async (req, res) => {
  try {
    const articles = await prisma.newsArticle.findMany({
      orderBy: { createdAt: 'desc' },
      include: { category: true, author: true },
    });
    res.json(articles);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get news articles' });
  }
});

router.get('/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    const article = await prisma.newsArticle.findUnique({
      where: { slug },
      include: { category: true, author: true },
    });
    if (!article || article.status !== 'PUBLISHED') {
      return res.status(404).json({ error: 'Article not found' });
    }
    res.json(article);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get news article' });
  }
});

router.post('/', authenticate, requireRole('ADMIN'), async (req, res) => {
  try {
    const {
      categoryId, authorId, title, slug, featuredImage, excerpt, body,
      status, publishedAt, metaTitle, metaDesc,
    } = req.body;

    const article = await prisma.newsArticle.create({
      data: {
        categoryId: categoryId || null,
        authorId: authorId || null,
        title, slug, featuredImage, excerpt, body,
        status: status || 'DRAFT',
        publishedAt: publishedAt ? new Date(publishedAt) : null,
        metaTitle, metaDesc,
      },
    });
    res.status(201).json(article);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create news article' });
  }
});

router.put('/:id', authenticate, requireRole('ADMIN'), async (req, res) => {
  try {
    const { id } = req.params;
    const article = await prisma.newsArticle.update({ where: { id }, data: req.body });
    res.json(article);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update news article' });
  }
});

router.delete('/:id', authenticate, requireRole('ADMIN'), async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.newsArticle.delete({ where: { id } });
    res.json({ message: 'News article deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete news article' });
  }
});

export default router;