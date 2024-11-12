import jwt from 'jsonwebtoken';

const authMiddleware = (req: any, res: any, next: any) =>{
    const token = req.headers.authentication?.split(" ")[1];
    if(!token) return res.status(403).send("Token is required");

    try{
        const decoded = jwt.verify(token, process.env.ACCESS_SECRET_KEY as string);
        req.user = decoded;

        next();
    }catch(error){
        res.status(401).send("Invalid Token");
    }
};

const authorizeRole = (role: string) => (req: any, res: any,  next: any)=>{
    if(req.user?.role !== role){
        res.status(403).send("Access denied: insufficient permission");
    }
    next();
};

export { authMiddleware, authorizeRole};