const express = require('express');
const app = express();
const path = require('path');
const port = process.env.PORT || 3000;
const db = require('./database/models/index.js');
const controller = require('./api/controllers/TaskController');

const bodyParser = require('body-parser');
app.use(express.json());
app.use(express.urlencoded({ limit: '10mb', extended: false }));

// Add headers to disable CORS
app.use((req, res, next) => {
    const origin = req.get('origin');
  
    res.setHeader('Access-Control-Allow-Origin', origin || '*');
  
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, content-type, Authorization');
  
    res.setHeader('Access-Control-Expose-Headers', 'Access-Token, Uid');
  
    res.setHeader('Access-Control-Allow-Credentials', true);
  
    next();
  });

app.get('/', function(req, res) {
    res.send("<h1>Welcome to SiloBot API</h1>");
});

app.get('/tasks', controller.getAllTasks);
app.post('/tasks/time', controller.getTasksbyTime);
app.post('/tasks/type', controller.getTasksbyJenis);
app.post('/tasks/typetime', controller.getTasksbyJenisAndTime);
app.post('/tasks/time/tugas', controller.getTugasbyTime);
app.post('/tasks/kodematkul', controller.getTasksbyKodeMatkul);
app.post('/tasks/new', controller.createNewTask);
app.post('/tasks/typekodematkul', controller.getTasksbyTypeAndKode);
app.get('/tasks/id/:id', controller.getTaskbyId);
app.patch('/tasks/id/:id', controller.updateTaskDate);
app.patch('/tasks/id/:id/done', controller.markTaskAsDone);


app.listen(port, () =>
    console.log(`silobot-backend listening on port ${port}`));
