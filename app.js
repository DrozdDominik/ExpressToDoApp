const express = require("express");
const { tasksRouter } = require("./routes/tasks");

const app = express();

app.use(express.static("public"));
app.use(express.json());
app.use("/tasks", tasksRouter);

app.listen(3000, "localhost");
