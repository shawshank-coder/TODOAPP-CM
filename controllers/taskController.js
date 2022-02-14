const pg = require('pg')
const pool = require('./../db/index');
const catchAsync = require('./../utils/catchAsync')
const AppError = require('./../utils/appError');
const { all } = require('express/lib/application');


exports.getAllGroups = catchAsync(async(req, res, next)=>{
    const data = await pool.query("SELECT DISTINCT group_name FROM tasks WHERE user_id = $1", 
    [req.user.user_id])

    const groups = data.rows

    res.status(200).json({
        message: "success",
        results: groups.length,
        data: {
            data: groups
        }
    })
})
    

exports.createTask = catchAsync(async(req, res, next)=>{
    const {todo, due_date, assigned_to, is_completed} = req.body
    const nTask = await pool.query("INSERT INTO tasks (user_id, task_desc, group_name) VALUES ($1, $2, $3) RETURNING *",
    [req.user.user_id, todo, req.params.group_name])

    const newTask = nTask.rows[0]

    if(due_date)await pool.query("UPDATE tasks SET due_date = $1 WHERE task_id = $2",
    [due_date, newTask.task_id])

    if(is_completed)await pool.query("UPDATE tasks SET is_completed = $1 WHERE task_id = $2",
    [is_completed, newTask.task_id])

    if(assigned_to)await pool.query("UPDATE tasks SET assigned_to = $1 WHERE task_id = $2",
    [assigned_to, newTask.task_id])

    // if(group_name)await pool.query("UPDATE tasks SET group_name = $1 WHERE task_id = $2",
    // [group_name, newTask.task_id])

    const data = await pool.query("SELECT * FROM tasks WHERE task_id = $1", [newTask.task_id])

    const taskC = data.rows[0]

    res.status(201).json({
        message: "success",
        data: {
            task: taskC
        }
    })
})

exports.getAllTasks = catchAsync(async(req, res, next)=>{
    const data = await pool.query("SELECT * FROM tasks WHERE user_id = $1 AND group_name = $2", 
    [req.user.user_id, req.params.group_name])

    const allTasks = data.rows

    res.status(200).json({
        message: "success",
        results: allTasks.length,
        data: {
            data: allTasks
        }
    })
})

exports.getTaskById = catchAsync(async(req, res, next)=>{
    const data = await pool.query("SELECT * FROM tasks WHERE user_id = $1 AND group_name = $2 AND task_id = $3", 
    [req.user.user_id, req.params.group_name, req.params.task_id])

    const task = data.rows[0]

    res.status(200).json({
        message: "success",
        task
    })
})

exports.updateTaskById = catchAsync(async(req, res, next)=>{
    const {due_date} = req.body
    const data = await pool.query("UPDATE tasks SET due_date = $4 WHERE user_id = $1 AND group_name = $2 AND task_id = $3", 
    [req.user.user_id, req.params.group_name, req.params.task_id, due_date])

    const taskU = data.rows[0]

    res.status(202).json({
        message: "success",
        data:{
            task: taskU
        }
    })
})

exports.deleteTaskById = catchAsync(async(req, res, next)=>{
    await pool.query("DELETE * FROM tasks WHERE user_id = $1 AND group_name = $2 AND task_id = $3", 
    [req.user.user_id, req.params.group_name, req.params.task_id])

    res.status(204).json({
        message: "success"
    })
})

exports.completeGroupTasks = catchAsync(async(req, res, next)=>{
    await pool.query("UPDATE tasks SET is_completed = $3 WHERE user_id = $1 AND group_name = $2", 
    [req.user.user_id, req.params.group_name, true])

    res.status(200).json({
        message: "success"
    })
})

exports.deleteGroupTasks = catchAsync(async(req, res, next)=>{
    await pool.query("DELETE * FROM tasks WHERE user_id = $1 AND group_name = $2", 
    [req.user.user_id, req.params.group_name])

    res.status(200).json({
        "message": "Successfully deleted!"
    })
})



