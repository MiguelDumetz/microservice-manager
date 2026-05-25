import { PrismaClient } from '@prisma/client'
import { join } from 'path'

function getDbPath(): string {
  return join(process.cwd(), 'prisma', 'dev.db')
}

const prisma = new PrismaClient({
  datasources: { db: { url: `file:${getDbPath()}` } },
})


export default prisma
