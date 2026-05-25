import express from 'express'
import cors from 'cors'
import projectsRouter from './routes/projects'
import servicesRouter from './routes/services'

const PORT = 3030

export function startServer(): void {
  const app = express()
  app.use(cors())
  app.use(express.json())
  app.use('/api/projects', projectsRouter)
  app.use('/api/projects', servicesRouter)

  app.listen(PORT, '127.0.0.1', () => {
    console.log(`API server running on http://127.0.0.1:${PORT}`)
  })
}
