const ModelFactoryHelper = require('../lib/helpers/ModelFactoryHelper.js');
const mongoose = require('mongoose');
jest.mock('mongoose');

describe('ModelFactoryHelper tests', () => {
  //@DEPRECATED
  // test('assignVirtuals injects virtual from client model into mongoose model', () => {
  //   const helper = ModelFactoryHelper();
  //   const observer = [];
  //   const schema = {
  //     virtual (arg) {
  //       return {
  //         get (a) {
  //           observer.push(a);
  //         },
  //         set (a) {
  //           observer.push(a);
  //         }
  //       }
  //     }
  //   }
  //   const virtuals = {
  //     foo: {
  //       get: 1,
  //       ignore: 123, // proof invalid props are ignored
  //       set: 2
  //     }
  //   }
  //   helper.assignVirtuals(schema, virtuals);
  //   expect(observer.length).toBe(2);
  //   expect(observer[0]).toBe(1);
  //   expect(observer[1]).toBe(2);
  //
  //   // proof that method elegantly safeguards if get/set is absent from client obj
  //   delete virtuals.foo.set
  //   helper.assignVirtuals(schema, virtuals);
  //   expect(observer.length).toBe(3);
  //   expect(observer[2]).toBe(1);
  // });

  test('bindClientModelToSchema binds client\'s model to a mongoose schema', ()=> {
    const observer = [];
    const model = {
      index: {
        foo: 'foo',
        bar: 'bar'
      },
      methods: {
        foz: 'foz',
        baz: 'baz'
      },
      virtuals: {
        mockVirtual: {
          get: 1,
          ignore: 123, // proof invalid props are ignored
          set: 2
        }
      },
      statics: {
        mockStatic: 1
      }
    }
    const schema = {
      index: {},
      methods: {},
      statics: {},
      virtual (arg) {
        return {
          get (a) {
            observer.push(a);
          },
          set (a) {
            observer.push(a);
          }
        }
      }
    }

    const helper = ModelFactoryHelper();
    const statics = helper.bindClientModelToSchema(model, schema);
    // virtual tests
    expect(observer.length).toBe(2);
    expect(observer[0]).toBe(1);
    expect(observer[1]).toBe(2);

    // model tests
    expect(statics.length).toBe(1);
    expect(statics[0]).toBe('mockStatic');
    expect(schema.methods).toEqual(model.methods);
    expect(schema.index).toEqual(model.index);

    // get/set missing, exit gracefully
    delete model.virtuals.mockVirtual.set
    helper.bindClientModelToSchema(model, schema);
    expect(observer.length).toBe(3);
    expect(observer[2]).toBe(1);
  });

  test('buildTypeCallback assigns new type to mongoose', () => {
    const callback = ModelFactoryHelper().buildTypeCallback();
    const mockgoose = callback({}, 'MockName');
    expect(typeof mockgoose.Schema.Types['MockName']).toBe('function')
    const spy = []
    const spyCall = { push (i) { spy.push(i) } };
    const result = mockgoose.Schema.Types['MockName'].call(spy, 'mockKey', 'mockOption');
    expect(spy.length).toBe(3);
    expect(spy[0]).toBe('mockKey');
    expect(spy[1]).toBe('mockOption');
    expect(spy[2]).toBe('MockName');
  });
  test('buildTypeCallback is supplied an invalid filename', () => {
    const spy = [];
    const callback =
      ModelFactoryHelper()
        .buildTypeCallback({
          throw (a,b) { spy.push(a); spy.push(b) } });
    const mockgoose = callback({}, 'mockName');
    expect(spy.length).toBe(2);
    expect(spy[0]).toBe('invalidTypeName');
    expect(spy[1]).toBe('mockName');
  });
});
