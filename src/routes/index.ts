import { Router } from 'express';
import { fetchArticles, fetchCategories } from '../controllers';

const router = Router();

// Endpoint to fetch all articles
router.get('/articles', fetchArticles);
router.get('/categories', fetchCategories);

export default router;
