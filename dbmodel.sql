-- CREATE DATABASE todoapp
CREATE DATABASE todoapp

-- CREATE USER TABLE
CREATE TABLE users(
    user_id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_name VARCHAR(255) NOT NULL,
    user_email VARCHAR(255) NOT NULL UNIQUE,
    user_password VARCHAR(255) NOT NULL
);

--CREATE Task Table
CREATE TABLE tasks(
    task_id SERIAL PRIMARY KEY,
    user_id UUID,
    task_desc VARCHAR(255) NOT NULL,
    is_completed BOOLEAN DEFAULT FALSE,
    due_date DATE,
    assigned_to VARCHAR(255) DEFAULT 'self',
    group_name VARCHAR(255) DEFAULT 'own tasks',
    FOREIGN KEY(user_id) REFERENCES users(user_id)
);
