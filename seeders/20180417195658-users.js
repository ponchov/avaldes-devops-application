

module.exports = {
  up: async (queryInterface) => {
    const user1 = {
      username: 'Fake User 1',
      email: 'foo@email.com',
    };

    const user2 = {
      username: 'Fake User 2',
      email: 'foo2@email.com',
    };


    /** *************************************************** */

    await queryInterface.bulkInsert('users', [
      user1,
      user2,
    ], {});

  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('users', null, {});
  },

};
