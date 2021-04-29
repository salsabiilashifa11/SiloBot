const TABLE_NAME = 'tasks';

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.bulkInsert(TABLE_NAME, [{
      deadline: new Date("2021, 4, 30"),
      kodeMatkul: "IF2210",
      taskType: "Tubes",
      taskTopic: "Engimon",
      createdAt: new Date(),
      updatedAt: new Date(),
    }, {
      deadline: new Date("2021, 5, 1"),
      kodeMatkul: "IF2230",
      taskType: "Praktikum",
      taskTopic: "System Call",
      createdAt: new Date(),
      updatedAt: new Date(),
    }, {
      deadline: new Date("2021, 4, 28"),
      kodeMatkul: "IF2211",
      taskType: "Tucil",
      taskTopic: "Algoritma A Star",
      createdAt: new Date(),
      updatedAt: new Date(),
    }, {
      deadline: new Date("2021, 5, 3"),
      kodeMatkul: "IF2240",
      taskType: "Kuis",
      taskTopic: "SQL",
      createdAt: new Date(),
      updatedAt: new Date(),
    }], {});
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete(TABLE_NAME, null, {});
  },
};
