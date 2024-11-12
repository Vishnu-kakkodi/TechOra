const jwt = require("jsonwebtoken");

interface HelperFunction {
    accesstoken: (userId: string, role: string) => string;
    refreshtoken: (userId: string, role: string) => string;
}

const helperFunction: HelperFunction = {
    accesstoken: (userId: string, role: string): string => {
        return jwt.sign(
            { _id: userId, role: role }, 
            process.env.ACCESS_SECRET_KEY as string,
            { expiresIn: "2m" }
        );
    },

    refreshtoken: (userId: string, role: string): string => {
        return jwt.sign(
            { _id: userId, role: role },  
            process.env.REFRESH_SECRET_KEY as string,
            { expiresIn: "1d" }
        );
    },
};

export default helperFunction;
