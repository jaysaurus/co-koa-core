module.exports = {
  models: {
    mock: 'I am a mock model'
  },
  Schema: {
    Types: {
    }
  },
  SchemaType: {
    call (obj, a, b, c) {
      // assumes that method is called with this set to array
      obj.push(a);
      obj.push(b);
      obj.push(c);
    },
    prototype: {}
  }
};
