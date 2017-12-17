const stampit = require('stampit');

const TreeAlgorithm = stampit({
  init (_tree) {
    const tree = Object.assign({}, _tree);
    let keyTree = [];
    function processNextItem (action, keys, member, stack) {
      let nextItem = member[keys[keys.length - 1]];
      switch (typeof nextItem) {                  // test last member of member object ...
        case 'object':                               // ... if it's an object ...
          let nextKeys = Object.keys(nextItem);
          if (nextKeys.length) {
            keyTree.push(keys[keys.length - 1]);
            stack.push(nextItem); // ... EITHER add it to the stack for the next iteration
          } else {
            keyTree = [];
            delete member[(keys[keys.length - 1])]; // ... OR delete it from member and remove it from stack because it's empty
            if (!member || Object.keys(member).length < 1) stack.pop();
          }
          break;
        default:                                    // ... if isn't an object, perform logic, then delete from member
          action(keyTree, keys[keys.length - 1], nextItem, _tree);
          delete member[(keys[keys.length - 1])];
          break;
      }
    }

    Object.assign(this, {
      process (action) {
        Object.keys(tree).reduce((stack, key) => {
          stack.push(tree[key]);
          keyTree.push(key);
          if (typeof stack === 'object') {
            while (stack.length > 0) {                       // until the main stack is empty
              let member = stack[stack.length - 1];          // get the last member of main stack
              if (typeof member === 'object') {              // if the last member of main stack is an object...
                let keys = Object.keys(member);              // fetch object's keys
                if (keys.length > 0) {                       // if object isn't empty ...
                  processNextItem(action, keys, member, stack);       // ... append a child object to the stack / perform an action / delete the object and pop from stack because it's been consumed
                } else stack.pop();                          // ... pop from stack because it's been consumed
              } else {
                if (typeof member === 'string') action(member, stack.length); // process top level object
                stack.pop(); // empty stack
              }
            }
          }
          return stack;
        }, []);
      }
    });
  }
});

module.exports = tree => TreeAlgorithm(tree);
