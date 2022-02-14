const express = require('express');
const taskController = require('./../controllers/taskController')
const router = new express.Router()
const authController = require('./../controllers/authController')

//Own Tasks
router.route('/groups')
    .get(authController.protect, taskController.getAllGroups)

router.route('/completealltasks/:group_name')
    .patch(authController.protect, taskController.completeGroupTasks)

router.route('/deletealltasks/:group_name')
    .delete(authController.protect, taskController.deleteGroupTasks)
    // .get(authController.protect, taskController.getAllTasks)


//Grouptasks
router.route('/:group_name')
    .get(authController.protect, taskController.getAllTasks)
    .post(authController.protect, taskController.createTask)
    .delete(authController.protect, taskController.deleteGroupTasks)

router.route('/:group_name/:taskid')
    .patch(authController.protect, taskController.updateTaskById)
    .delete(authController.protect, taskController.deleteTaskById)
    .get(authController.protect, taskController.getTaskById)


module.exports = router