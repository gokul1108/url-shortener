import type { NextFunction,Request,Response } from "express";
import jwt from "jsonwebtoken";

export const userMiddleware = (req: Request, res: Response, next: NextFunction) => {

    const header= req.headers["authorization"];
    if (!header) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    const decoded = jwt.verify(header as string, "jwtsecretkey");
    if(!decoded){
        return res.status(401).json({ message: "Invalid token" });
    }
    
    req.userId = (decoded as jwt.JwtPayload).id;
    next();
    
};