import { prisma } from "../config/prisma.js";

export const userServices = {

    getName: async (id: string) => {
        return prisma.user.findUnique({
            where: {
                id,
            },
            select: {
                name: true,
            }
        });
    },
    update: async (id: string, userName: string) => {
        await prisma.user.update({
            where: {
                id,
            },
            data: {
                name: userName,
            }
        });
    },
    delete: async (id: string) => {
        await prisma.user.delete({
            where: {
                id
            }
        });
    },
}