module.exports = (env) => {
  if (env) return console.log;
  else throw new Error();
};
