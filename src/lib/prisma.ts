import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../../generated/prisma/client.js';
import { config } from '../config/index.js';

const connectionString = config.database.url;

if (!connectionString) {
  throw new Error('Database URL is not configured');
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

export { prisma };
