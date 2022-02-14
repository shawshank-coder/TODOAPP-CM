const dotenv = require('dotenv').config()
const express = require('express');
const app = express();
app.use(express.json());
const taskRoutes = require('./routes/taskRouter');
const userRoutes = require('./routes/userRouter');
// dotenv.config({ path: './config.env' });
const port = process.env.PORT
const pool = require('./db/index');
// console.log(process.env.DBPASS);

app.use('/api/tasks', taskRoutes);
app.use('/api/users', userRoutes);

app.listen(port, ()=>{
    console.log(`Server is running on port ${port}`);
})