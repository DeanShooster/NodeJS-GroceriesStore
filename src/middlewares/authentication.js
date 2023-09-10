const { noAuth, generalError } = require("../constants/general");
const { GroceryError } = require("./errorHandler");

const adminAuth = async (req,res,next) => {
    try{
        const { adminPassword } = req.body;
        if(!adminPassword) return next(new GroceryError(generalError,404));
        if(adminPassword !== process.env.ADMIN_PASSWORD) return next(new GroceryError(noAuth,403));
        next();
    }
    catch(e){next(e);}
}

module.exports = {adminAuth};