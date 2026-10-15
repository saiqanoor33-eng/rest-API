
const express = require("express");
const path = require("path");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

let tasks = [
    { id: 1, title: "Learn REST API", completed: false },
    { id: 2, title: "Test API using Postman", completed: true }
];

let nextId = 3;

app.get("/api/tasks", (req, res) => {
    res.status(200).json({
        success: true,
        count: tasks.length,
        data: tasks
    });
});

app.get("/api/tasks/:id", (req, res) => {
    const task = tasks.find(t => t.id === Number(req.params.id));

    if (!task) {
        return res.status(404).json({
            success: false,
            message: "Task not found"
        });
    }

    res.status(200).json({ success: true, data: task });
});

app.post("/api/tasks", (req, res) => {
    const { title } = req.body;

    if (typeof title !== "string" || !title.trim()) {
        return res.status(400).json({
            success: false,
            message: "Task title is required"
        });
    }

    if (title.trim().length > 100) {
        return res.status(400).json({
            success: false,
            message: "Title must not exceed 100 characters"
        });
    }

    const task = {
        id: nextId++,
        title: title.trim(),
        completed: false
    };

    tasks.push(task);

    res.status(201).json({
        success: true,
        message: "Task created successfully",
        data: task
    });
});

app.put("/api/tasks/:id", (req, res) => {
    const task = tasks.find(t => t.id === Number(req.params.id));

    if (!task) {
        return res.status(404).json({
            success: false,
            message: "Task not found"
        });
    }

    const { title, completed } = req.body;

    if (
        typeof title !== "string" ||
        !title.trim() ||
        title.trim().length > 100 ||
        typeof completed !== "boolean"
    ) {
        return res.status(400).json({
            success: false,
            message: "Valid title and completed boolean are required"
        });
    }

    task.title = title.trim();
    task.completed = completed;

    res.status(200).json({
        success: true,
        message: "Task updated successfully",
        data: task
    });
});

app.patch("/api/tasks/:id", (req, res) => {
    const task = tasks.find(t => t.id === Number(req.params.id));

    if (!task) {
        return res.status(404).json({
            success: false,
            message: "Task not found"
        });
    }

    const { title, completed } = req.body;

    if (Object.keys(req.body).length === 0) {
        return res.status(400).json({
            success: false,
            message: "Provide a field to update"
        });
    }

    if (
        title !== undefined &&
        (typeof title !== "string" ||
            !title.trim() ||
            title.trim().length > 100)
    ) {
        return res.status(400).json({
            success: false,
            message: "Invalid title"
        });
    }

    if (completed !== undefined && typeof completed !== "boolean") {
        return res.status(400).json({
            success: false,
            message: "Completed must be true or false"
        });
    }

    if (title !== undefined) task.title = title.trim();
    if (completed !== undefined) task.completed = completed;

    res.status(200).json({
        success: true,
        message: "Task updated successfully",
        data: task
    });
});

app.delete("/api/tasks/:id", (req, res) => {
    const index = tasks.findIndex(
        t => t.id === Number(req.params.id)
    );

    if (index === -1) {
        return res.status(404).json({
            success: false,
            message: "Task not found"
        });
    }

    const deletedTask = tasks.splice(index, 1)[0];

    res.status(200).json({
        success: true,
        message: "Task deleted successfully",
        data: deletedTask
    });
});

app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found"
    });
});

app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
        return res.status(400).json({
            success: false,
            message: "Invalid JSON request body"
        });
    }

    console.error(err);
    res.status(500).json({
        success: false,
        message: "Internal server error"
    });
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
