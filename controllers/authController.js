const pg = require('pg')
const pool = require('./../db');
const {promisify} = require('util')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const catchAsync = require('./../utils/catchAsync')
const AppError = require('./../utils/appError');
// const dotenv = require('dotenv');
// dotenv.config({ path: '../config.env' });

// console.log(process.env.NODE_ENV);

const signToken = id=>{
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
}

const createSendToken = (user, statusCode, res)=>{
    const token = signToken(user.user_id);
    
    const cookieOptions = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN*24*60*60*1000),
        httpOnly: true
    };

    if(process.env.NODE_ENV === 'production'){
        cookieOptions.secure = true;
    }

    res.cookie('jwt', token, cookieOptions);

    user.user_password = undefined; 

    res.status(statusCode).json({
        status: 'success',
        token,
        data: {
            user
        }
    })
}


exports.signup = async(req, res, next)=>{
    const {name, email, password} = req.body;
    const user = await pool.query("SELECT * FROM users WHERE user_email = $1", [email]);
    if (user.rows.length > 0) {
      return res.status(401).json("User already exist!");
    }

    const salt = await bcrypt.genSalt(10);
    const bcryptPassword = await bcrypt.hash(password, salt);
    
    let newUser = await pool.query(
      "INSERT INTO users (user_name, user_email, user_password) VALUES ($1, $2, $3) RETURNING *",
        [name, email, bcryptPassword]
    );
    
        createSendToken(newUser.rows[0], 201, res);
}

exports.login = catchAsync(async(req, res, next)=>{
    const {email, password} = req.body;

    //1))Email and password exist
    if(!email || !password)return next(new AppError('Please provide email and password!'));

    // 2))Check if email and password is correct
    const user = await pool.query("SELECT * FROM users WHERE user_email = $1", [
        email
      ]);
  
      if (user.rows.length === 0) {
        return res.status(401).json("Invalid Credential");
      }
  
      const validPassword = await bcrypt.compare(
        password,
        user.rows[0].user_password
      );
  
      if (!validPassword) {
        return res.status(401).json("Invalid Credential");
      }

    createSendToken(user.rows[0], 201, res);
});

exports.protect = catchAsync(async(req, res, next) => {
    // 1. Getting Token and check its there
    let token;
    // console.log(req.headers);
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        token = req.headers.authorization.split(' ')[1];
    }
    //console.log(token);
    if(!token){
        return next(new AppError('You are not logged in! Please log in to access.', 401));
    }
    // 2. Verification token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    // 3. Check if user still exists
    // console.log(decoded);
    const currentUser = await pool.query("SELECT * FROM users WHERE user_id = $1", [decoded.id]);
    if(!currentUser)return next(new AppError('The user belonging to this token no longer exist.', 401))
    // console.log(currentUser);
    //GRANT ACCESS TO PROTECTED ROUTE
    req.user = currentUser.rows[0]
    next();
})
