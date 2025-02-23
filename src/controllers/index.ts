import { Request, Response } from 'express';
import { getArticles, getCategoriesBySource } from '../services';

// Handle request to fetch all articles
export const fetchArticles = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await getArticles(req.query);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json(error);
  }
};

// Handle request to fetch categories based on source
export const fetchCategories = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await getCategoriesBySource(req.query);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json(error);
  }
};
