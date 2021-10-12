const express = require("express");
const { readFile, writeFile } = require("fs").promises;
const tasksRouter = express.Router();

const FILE_NAME = "data/tasks.json";

let tasks;

tasksRouter
  .get("/", async (req, res) => {
    try {
      tasks = JSON.parse(await readFile(FILE_NAME, "utf-8"));
    } catch (err) {
      if (err === "ENOENT") {
        tasks = [];
      }
      console.log(err);
    }

    res.send(tasks);
  })

  .post("/", async (req, res) => {
    const newTask = req.body;

    if (tasks.some((task) => task.name === newTask.name)) {
      res.send("Same task already added!");
      return;
    }
    tasks.push(newTask);
    try {
      await writeFile(FILE_NAME, JSON.stringify(tasks), "utf-8");
    } catch (err) {
      console.log(err);
    }
    res.send("Task has been added!");
  })

  .delete("/:index", async (req, res) => {
    const taskIndex = Number(req.params.index);
    tasks.splice(taskIndex, 1);

    try {
      await writeFile(FILE_NAME, JSON.stringify(tasks), "utf-8");
    } catch (err) {
      console.log(err);
    }
    res.send("Task has been deleted!");
  })

  .patch("/:index", async (req, res) => {
    const taskIndex = Number(req.params.index);
    const taskDone = req.body.completed;
    tasks[taskIndex].completed = taskDone;
    try {
      await writeFile(FILE_NAME, JSON.stringify(tasks), "utf-8");
    } catch (err) {
      console.log(err);
    }
    res.send("Task has been updated!");
  });

module.exports = {
  tasksRouter,
};
