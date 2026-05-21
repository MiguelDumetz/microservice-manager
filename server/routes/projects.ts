import { Router } from 'express';
import prisma from '../db';

const router = Router();

router.get('/', async (_req, res) => {
  const projects = await prisma.project.findMany();
  res.json(projects);
});

router.post('/', async (req, res) => {
  const { name } = req.body as { name?: string };
  if (!name?.trim()) {
    res.status(400).json({ error: 'name is required' });
    return;
  }
  const project = await prisma.project.create({ data: { name: name.trim() } });
  res.status(201).json(project);
});

router.patch('/:id', async (req, res) => {
  const id = Number(req.params.id);
  const { name } = req.body as { name?: string };
  if (!name?.trim()) {
    res.status(400).json({ error: 'name is required' });
    return;
  }
  const project = await prisma.project.update({ where: { id }, data: { name: name.trim() } });
  res.json(project);
});

router.delete('/:id', async (req, res) => {
  const id = Number(req.params.id);
  await prisma.project.delete({ where: { id } });
  res.status(204).send();
});

export default router;
