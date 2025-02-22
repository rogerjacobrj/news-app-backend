import { Router } from 'express';
import { fetchArticles } from '../controllers';

const router = Router();

// Endpoint to fetch all articles
router.get('/articles', fetchArticles);

export default router;
