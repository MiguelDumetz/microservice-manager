import express from 'express';
import cors from 'cors';
import projectsRouter from './routes/projects';
import servicesRouter from './routes/services';

const app = express();
const PORT = 3030;

app.use(cors());
app.use(express.json());

app.use('/api/projects', projectsRouter);
app.use('/api/projects', servicesRouter);

app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`);
});
