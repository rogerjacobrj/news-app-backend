import express, { Request, Response } from 'express';

const app = express();
const port = process.env.PORT;

app.use(express.json());

// Basic route
app.get('/', (req: Request, res: Response) => {
  res.send('Hello, World!');
});

// Example API route
app.get('/api', (req: Request, res: Response) => {
  res.json({ message: 'Welcome to the API' });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
