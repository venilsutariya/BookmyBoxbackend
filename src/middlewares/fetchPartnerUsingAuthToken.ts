import jwt from 'jsonwebtoken'
import {Response , NextFunction} from 'express';

export const tokenBlacklist = new Set();

export const fetchPartnerUsingAuthToken = (req:any, res: Response , next: NextFunction) => {
    try {
        const authToken: string = req.headers.authorization?.split(" ")[1];
        if(!authToken){
            return res.status(401).json({isSuccess : false , message : 'Auth token not found.'});
        }
        if(tokenBlacklist.has(authToken)){
            return res.status(401).json({ isSuccess: false, message: 'Token has been revoked' });
        }
        const SECRET_KEY: string = process.env.SECRET_KEY || '';
        const data: any = jwt.verify(authToken , SECRET_KEY);
        req.partner = data.partner;
        next();

    } catch (error) {
        console.log(error);
        res.status(401).json({isSuccess : false , error : 'Auth token is Invlid' });
    }
}