import type { Response, NextFunction } from "express";

export const errorHandler = (
    err: any, 
    res: Response, 
    next: NextFunction
) => {
    const statusCode = err.statusCode || 500;
    console.error(`[Error]: ${err.message}`);

    res.status(statusCode).json({
        success: false,
        message: err.message || "Internal Server Error",
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    });
};