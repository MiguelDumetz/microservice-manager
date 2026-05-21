import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const project = await prisma.project.create({
    data: {
      name: 'E-Commerce Platform',
      services: {
        create: [
          { name: 'API Gateway',            url: 'http://localhost:4000' },
          { name: 'Auth Service',           url: 'http://localhost:4001' },
          { name: 'User Service',           url: 'http://localhost:4002' },
          { name: 'Product Service',        url: 'http://localhost:4003' },
          { name: 'Inventory Service',      url: 'http://localhost:4004' },
          { name: 'Cart Service',           url: 'http://localhost:4005' },
          { name: 'Order Service',          url: 'http://localhost:4006' },
          { name: 'Payment Service',        url: 'http://localhost:4007' },
          { name: 'Shipping Service',       url: 'http://localhost:4008' },
          { name: 'Notification Service',   url: 'http://localhost:4009' },
          { name: 'Email Service',          url: 'http://localhost:4010' },
          { name: 'SMS Service',            url: 'http://localhost:4011' },
          { name: 'Search Service',         url: 'http://localhost:4012' },
          { name: 'Recommendation Engine', url: 'http://localhost:4013' },
          { name: 'Review Service',         url: 'http://localhost:4014' },
          { name: 'Analytics Service',      url: 'http://localhost:4015' },
          { name: 'Reporting Service',      url: 'http://localhost:4016' },
          { name: 'Media Service',          url: 'http://localhost:4017' },
          { name: 'Config Service',         url: 'http://localhost:4018' },
          { name: 'Admin Service',          url: 'http://localhost:4019' },
        ],
      },
    },
  });

  console.log(`Created project "${project.name}" with 20 services.`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
