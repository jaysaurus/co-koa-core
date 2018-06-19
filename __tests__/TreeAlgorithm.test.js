const TreeAlgorithm = require('../lib/helpers/resources/TreeAlgorithm.js');

const tree = {
  a: {
    a1: 'a1',
    a2: 'a2',
    a3: {
      a3_1: {
        a3_1_1: {
          a3_1_1_1: 'a3_1_1_1'
        }
      }
    }
  },
  b: {
    b1: {
      b1_1: 'b1_1',
      b1_2: 'b1_2',
      b1_3: {
        b1_3_1: 'b1_3_1',
        b1_3_2: {
          b_deep: { deeper: { deepest: 'Deep!' } }
        }
      },
      b1_4: 'b1_4'
    },
  },
  c: 'String',
  d: [{ andMe: 'too?' }]
};

describe('TreeAlgorithm test', () => {
  test('tree nodes are explored fully', () => {
    const keyObserver = [];
    let outObserver = null;
    TreeAlgorithm(tree).process((it) => {
      keyObserver.push(it._keyTree.reduce((list, i) => {
        list.push(i);
        return list;
      }, []));
      if (!outObserver) outObserver = it._out
    });
    expect(keyObserver[0]).toEqual([ 'a' ]);
    expect(keyObserver[1]).toEqual([ 'a' ]);
    expect(keyObserver[2]).toEqual([ 'a', 'a3', 'a3_1', 'a3_1_1' ]);
    expect(keyObserver[3]).toEqual([ 'b', 'b1' ]);
    expect(keyObserver[4]).toEqual([ 'b', 'b1' ]);
    expect(keyObserver[5]).toEqual([ 'b', 'b1', 'b1_3' ]);
    expect(keyObserver[6]).toEqual([ 'b', 'b1', 'b1_3', 'b1_3_2', 'b_deep', 'deeper' ]);
    expect(keyObserver[7]).toEqual([ 'b', 'b1' ]);
    expect(keyObserver[8]).toEqual([]);
    expect(keyObserver[9]).toEqual([ 'd', '0' ]);
    expect(outObserver).toBe(tree);
  });
});
