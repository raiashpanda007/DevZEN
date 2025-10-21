import { Response, Request, NextFunction } from "express";

const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) =>
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        return await fn(req, res, next);
      } catch (error: unknown) {
        const status = (error as { status?: number }).status || 500;
        const message = (error as { message?: string }).message || "Internal Server Error";
  
        res.status(status).json({
          success: false,
          message,
        });
      }
    };
  

export default asyncHandler;