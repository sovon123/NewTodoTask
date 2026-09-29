import { db } from "./db.js";
import express from "express";
import cors from "cors";

const app = express();

app.use(express.json());

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

app.get("/get-todos", (req, res) => {
    const q = "select * from todos";
    db.query(q, (err, data) => {
        if(err) return res.status(500).json({ error: err.message});
        return res.status(200).json(data);
    })
})

app.post("/add-todo", (req, res) => {
    const { todo } = req.body;
    if (!todo) {
        return res.status(400).json({ error: "Task cannot be empty" });
    }

    const currentDate = new Date().toISOString().slice(0, 10);
    const q = "insert into todos (task, created, status) values(?, ?, ?)"
    db.query(q, [todo, currentDate, "Active"], (err, data) => {
        if(err) {
            console.error("SQL INSERT ERROR:", err);
            return res.status(500).json({ error: err.message });
        }
        return res.status(200).json({ success: true, message: "Todo added successfully!" });
    })
});

app.put("/update-todo/:editId", (req, res) => {
    const todoId = req.params.editId;
    const { todo } = req.body;

    if(!todo) {
        return res.status(400).json({ error: "Task cannot be empty"});
    }

    const q = "update todos set task = ? where id = ?";
    db.query(q, [todo, todoId], (err, data) => {
        if(err) return res.status(500).json(
            {
                success: false,
                error: err.message
            }
        )
        if(data.affectedRows === 0) return res.status(404).json({ success: false, message: "Todo not found" });
        return res.status(200).json({
            success: true,
            message: "Todo updated successfully."
        })
    })
})

app.delete("/delete-todo/:id", (req, res) => {
    const id = req.params.id;
    if(!id) {
        return res.status(400).json({ error: "Something went wrong."});
    }
    const q = "delete from todos where id = ?";
    db.query(q, [id], (err, data) => {
        if(err) return res.status(500).json({ success: false, message: "Not able to delete." });
        if (data.affectedRows === 0) {
            return res.status(404).json({ success: false, message: "Todo not found." });
        }
        return res.status(200).json({success: true, message: "Todo deleted successfully." })
    })
})

app.put("/complete-todo/:id", (req, res) => {
    const id = req.params.id;
    if(!id) {
        return res.status(400).json({ error: "Something went wrong."});
    }
    const q = "update todos set status = ? where id = ?";
    db.query(q, ["Compleated", id], (err, data) => {
        if(err) return res.status(500).json({ success: false, message: "Not able update status." });
        if(data.affectedRows === 0) return res.status(404).json({ success: false, message: "Todo not found" });
        return res.status(200).json(
            {
                success: true,
                message: "Todo compleated successfully."
            }
        )
    })
})

app.listen(8800, () => {
    console.log("Server running on http://localhost:8800");
});

