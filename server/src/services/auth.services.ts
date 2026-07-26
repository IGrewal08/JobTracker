import { prisma } from '../config/prisma.js';

export const getUser = async (email: string) => {
  return await prisma.user.findUnique({
    where: { email },
  });
};
