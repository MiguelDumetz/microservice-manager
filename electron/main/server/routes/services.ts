import { Router } from 'express';
import prisma from '../db';

const router = Router();

router.get('/:projectId/services', async (req, res) => {
  const projectId = Number(req.params.projectId);
  const services = await prisma.service.findMany({ where: { projectId } });
  res.json(services);
});

router.post('/:projectId/services', async (req, res) => {
  const projectId = Number(req.params.projectId);
  const { name, url } = req.body as { name?: string; url?: string };
  if (!name?.trim() || !url?.trim()) {
    res.status(400).json({ error: 'name and url are required' });
    return;
  }
  const service = await prisma.service.create({
    data: { name: name.trim(), url: url.trim(), projectId },
  });
  res.status(201).json(service);
});

router.patch('/:projectId/services/:serviceId', async (req, res) => {
  const id = Number(req.params.serviceId);
  const { name, url } = req.body as { name?: string; url?: string };
  if (!name?.trim() || !url?.trim()) {
    res.status(400).json({ error: 'name and url are required' });
    return;
  }
  const service = await prisma.service.update({
    where: { id },
    data: { name: name.trim(), url: url.trim() },
  });
  res.json(service);
});

router.delete('/:projectId/services/:serviceId', async (req, res) => {
  const id = Number(req.params.serviceId);
  await prisma.service.delete({ where: { id } });
  res.status(204).send();
});

export default router;
