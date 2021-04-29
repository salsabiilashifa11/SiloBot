const TaskService = require('../services/TaskService');
const createHttpError = require('http-errors');

module.exports = {
    async getAllTasks(req, res, next) {
        try {
            const query = await TaskService.findAllTasks();
            res.send(query);
        } catch (err) {
            next(createHttpError(err));
        }
    },

    async getTaskbyId(req, res, next) {
        try {
            const { id } = req.params;
            const query = await TaskService.findTaskbyId(id);
            res.send(query);
        } catch (err) {
            next(createHttpError(err));
        }
    },

    async getTasksbyTime(req, res, next) {
        try {
            const { startDate, endDate } = req.body;
            const query = await TaskService.findTasksbyTime(startDate, endDate);
            res.send(query);
        } catch (err) {
            next(createHttpError(err));
        }
    },

    async getTasksbyJenis(req, res, next) {
        try {
            const { taskType } = req.body;
            let query;
            if (taskType === 'Tugas') query = await TaskService.findTugasbyJenis();
            else query = await TaskService.findTasksbyJenis(taskType);
            res.send(query);
        } catch (err) {
            next(createHttpError(err));
        }
    },

    async getTasksbyKodeMatkul(req, res, next) {
        try {
            const { kodeMatkul } = req.body;
            const query = await TaskService.findTasksbyKodeMatkul(kodeMatkul);
            res.send(query);
        } catch (err) {
            next(createHttpError(err));
        }
    },

    async getTasksbyJenisAndTime(req, res, next) {
        try {
            const { taskType, startDate, endDate } = req.body;
            let query;
            if (taskType === 'Tugas') query = await TaskService.findTugasbyJenisAndTime(startDate, endDate);
            else query = await TaskService.findTasksbyJenisAndTime(taskType, startDate, endDate);
            res.send(query);
        } catch (err) {
            next(createHttpError(err));
        }
    },

    async getTugasbyTime(req, res, next) {
        try {
            const { deadline } = req.body;
            const query = await TaskService.findTugasbyTime(deadline);
            res.send(query);
        } catch (err) {
            next(createHttpError(err));
        }
    },

    async getTasksbyTypeAndKode(req, res, next) {
        try {
            const { taskType, kodeMatkul } = req.body;
            let query;
            if (taskType === 'Tugas') query = await TaskService.findTugasbyTypeAndKode(kodeMatkul);
            else query = await TaskService.findTasksbyTypeAndKode(taskType, kodeMatkul);

            res.send(query);
        } catch (err) {
            next(createHttpError(err));
        }
    },

    async createNewTask(req, res, next) {
        try {
            const query = await TaskService.createTask(req.body);
            res.send(query);
        } catch (err) {
            next(createHttpError(err));
        }
    },

    async updateTaskDate(req, res, next) {
        try {
            const { id } = req.params;
            const { newDeadline } = req.body;
            const query = await TaskService.updateTask(id, { 
                deadline: newDeadline
            });

            if (query[0] == 1) {
                res.json({
                    message: "Updated!"
                });
            } else {
                res.json({
                    message: "Failed!"
                });
            }
        } catch (err) {
            next(createHttpError(err));
        }
    },

    async markTaskAsDone(req, res, next) {
        try {
            const query = await TaskService.deleteTask(req.params.id);

            if (query == 1) {
                res.json({
                    message: "Deleted!"
                });
            } else {
                res.json({
                    message: "Failed!"
                });
            }
        } catch (err) {
            next(createHttpError(err));
        }
    }
}