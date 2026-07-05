import { prisma } from "../config/prisma.js";

export const userServices = {
    
    update: async (id: string, userName: string) => {
        prisma.user.update({
            where: {
                id,
            },
            data: {
                name: userName,
            }
        });
    },

    delete: async (id: string) => {
        prisma.user.delete({
            where: {
                id
            }
        });
    },
}