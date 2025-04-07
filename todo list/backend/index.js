const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());


mongoose.connect("mongodb://localhost:27017/todoDB").then(() => {
  console.log("Connected to MongoDB");
}).catch((err) => {
  console.error("MongoDB connection error:", err);
});

const TaskSchema = new mongoose.Schema({
  text: String,
  completed: Boolean,
});
const Task = mongoose.model("Task", TaskSchema);


app.get("/tasks", async (req, res) => {
  const tasks = await Task.find();
  res.json(tasks);
});

app.post("/tasks", async (req, res) => {
  const { text } = req.body;
  const newTask = new Task({ text, completed: false });
  await newTask.save();
  res.json(newTask);
});

app.put("/tasks/:id", async (req, res) => {
  const { id } = req.params;
  const task = await Task.findById(id);
  task.completed = !task.completed;
  await task.save();
  res.json(task);
});

app.delete("/tasks/:id", async (req, res) => {
  const { id } = req.params;
  await Task.findByIdAndDelete(id);
  res.json({ message: "Task deleted" });
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
