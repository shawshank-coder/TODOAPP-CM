const pg = require('pg')
const pool = require('./../db');
const catchAsync = require('./../utils/catchAsync')
const AppError = require('./../utils/appError');


exports.getAllUsers = async(req, res)=>{
    res.status(401).json({
        "message": "NOT Allowed"
    })
}

exports.createUser = async(req, res)=>{
    res.status(500).json({
        status: 'fail',
        message: 'Failure at createUser. Please use /users/signup insted!'
    })
}

exports.deleteme = catchAsync(async(req, res, next)=>{
    const userid = req.user.user_id;
    await pool.query("DELETE * FROM tasks WHERE user_id = $1", [userid]);
    await pool.query("DELETE * FROM users WHERE user_id = $1", [userid]);

    res.status(204).json({
        msg: 'User Data Successfully Deleted'
    })
})