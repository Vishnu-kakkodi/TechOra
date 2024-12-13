
const jwt = require("jsonwebtoken");

interface HelperFunction {
    accesstoken: (userId: string, role: string) => string;
    refreshtoken: (userId: string, role: string) => string;
}

export interface DecodedToken {
    _id: string;
    role: string;
    iat?: number;
    exp?: number;
}

const helperFunction: HelperFunction = {
    accesstoken: (userId: string, role: string): string => {
        return jwt.sign(
            { _id: userId, role: role }, 
            process.env.ACCESS_SECRET_KEY as string,
            { expiresIn: "50m" }
        );
    },

    refreshtoken: (userId: string, role: string): string => {
        return jwt.sign(
            { _id: userId, role: role },  
            process.env.REFRESH_SECRET_KEY as string,
            { expiresIn: "7d" } 
        );
    },
};

const decodedToken = (token: string, requiredRole: string):string =>{
    try{
        console.log(token)
        const decoded = jwt.verify(token, process.env.ACCESS_SECRET_KEY as string) as DecodedToken;
        if(decoded.role !== requiredRole){
            console.error(`Invalid role. Expected ${requiredRole}, found ${decoded.role}`);
            return "null";
        }
        console.log(decoded._id)
        return decoded._id;
    } catch (error) {
        console.error("Token decoding failed:", error);
        return "null";
    }
}

export { helperFunction, decodedToken };
