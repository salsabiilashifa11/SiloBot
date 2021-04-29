const models = require('../../database/models');
const Task = models.Task;

const { Op } = require('sequelize');

module.exports = {
    async findTaskbyId(id) {
        try {
            return Task.findOne({
                where: {
                    id
                }
            });
        } catch (err) {
            throw new Error(err);
        }
    },

    async findAllTasks() {
        try {
            return Task.findAll({
                order: [
                    ['deadline', 'ASC']
                ]
            });
        } catch (err) {
            throw new Error(err);
        }
    },

    async findTasksbyTime(startTime, endTime) {
        try {
            return Task.findAll({
                where: {
                    deadline: {
                        [Op.between]: [startTime, endTime],
                    }
                },
                order: [
                    ['deadline', 'ASC']
                ]
            });
        } catch (err) {
            throw new Error(err);
        }
    },

    async findTasksbyJenis(taskType) {
        try {
            return Task.findAll({
                where: {
                    taskType,
                },
                order: [
                    ['deadline', 'ASC']
                ]
            });
        } catch (err) {
            throw new Error(err);
        }
    },

    async findTugasbyJenis() {
        try {
            return Task.findAll({
                where: {
                    taskType: {
                        [Op.or]: ['Tubes', 'Tucil']
                    },
                },
                order: [
                    ['deadline', 'ASC']
                ]
            });
        } catch (err) {
            throw new Error(err);
        }
    },

    async findTasksbyKodeMatkul(kodeMatkul) {
        try {
            return Task.findAll({
                where: {
                    kodeMatkul,
                },
                order: [
                    ['deadline', 'ASC']
                ]
            });
        } catch (err) {
            throw new Error(err);
        }
    },

    async findTasksbyJenisAndTime(taskType, startTime, endTime) {
        try {
            return Task.findAll({
                where: {
                    taskType,
                    deadline: {
                        [Op.between]: [startTime, endTime],
                    }
                },
                order: [
                    ['deadline', 'ASC']
                ]
            });
        } catch (err) {
            throw new Error(err);
        }
    },

    async findTugasbyJenisAndTime(startTime, endTime) {
        try {
            return Task.findAll({
                where: {
                    taskType: {
                        [Op.or]: ['Tubes', 'Tucil']
                    },
                    deadline: {
                        [Op.between]: [startTime, endTime],
                    }
                },
                order: [
                    ['deadline', 'ASC']
                ]
            });
        } catch (err) {
            throw new Error(err);
        }
    },

    async findTasksbyTypeAndKode(taskType, kodeMatkul) {
        try {
            return Task.findAll({
                where: {
                    taskType,
                    kodeMatkul
                },
                order: [
                    ['deadline', 'ASC']
                ]
            });
        } catch (err) {
            throw new Error(err);
        }
    },

    async findTugasbyTypeAndKode(kodeMatkul) {
        try {
            return Task.findAll({
                where: {
                    taskType: {
                        [Op.or]: ['Tubes', 'Tucil']
                    },
                    kodeMatkul
                },
                order: [
                    ['deadline', 'ASC']
                ]
            });
        } catch (err) {
            throw new Error(err);
        }
    },

    async findTugasbyTime(deadline) {
        try {
            return Task.findAll({
                where: {
                    taskType: {
                        [Op.or]: ['Tubes', 'Tucil']
                    }, 
                    deadline
                },
                order: [
                    ['deadline', 'ASC']
                ]
            });
        } catch (err) {
            throw new Error(err);
        }
    },

    async createTask(obj) {
        try {
            return Task.create({
                ...obj,
            });
        } catch (err) {
            throw new Error(err);
        }
    },

    async updateTask(id, obj) {
        try {
            return Task.update({
                ...obj,
            }, {
                where: {
                    id
                },
                returning: true
            });
        } catch (err) {
            throw new Error(err);
        }
    },

    async deleteTask(id) {
        try {
            return Task.destroy({
                where: {
                    id
                }
            });
        } catch (err) {
            throw new Error(err);
        }
    }
}