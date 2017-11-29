const stampit = require('stampit');

/*
* A library of built-in async tools
*/
const AsyncLibrary = stampit({
  init () {},
  methods: {
    async each (items, fn) {
      if (items && items.length) {
        await Promise.all(
          items.map(async (item) => {
            await fn(item);
          }));
      }
    },
    async reduce (items, fn, initialValue) {
      await this.each(
        items, async (item) => {
          initialValue = await fn(initialValue, item);
        });
      return initialValue;
    }
  }
});

module.exports = () => AsyncLibrary();
