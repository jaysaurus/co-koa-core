const ModelFactory = require('../lib/ModelFactory.js');
// require('../lib/helpers/ModelFactoryHelper.js');
// require('../lib/Builder.js');
jest.mock('../lib/Builder.js');
jest.mock('../lib/helpers/ModelFactoryHelper.js');

const conf = {
  i18n: 'en',
  logger: console,
  spy: [] // nefarious spy number 1
}

const modelFactory = ModelFactory(conf);

describe('ModelFactory tests', () => {
  const spy2 = []; // nefarious spy number 2
  beforeEach(() => {
    require('mongoose').setSchemaToClass(spy2);
  });
  const observer = []
  modelFactory.build(observer);
  test('build was called and variables are assigned to a mock config', () => {
    expect(conf.spy.length).toBe(2);
    expect(conf.spy[0]['models/Type']).toBe('buildTypeCallback Called');
    expect(typeof conf.spy[1]['Model']).toBe('function');
  });

  test('buildModelCallback works as expected (method called from 1st spy array)', () => {
    const test = () => {
      return {
        index: {
          foo: 'foo',
          bar: 'bar'
        },
        schema: {
          foy: 'foy',
          bay: 'bay',
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
    }
    conf.spy[1]['Model'](test, 'Test'); //<= this call is really buildModelCallback()
    const mongoose = require('mongoose');

    // my second evil minion has returned from its nefarious expedition.
    expect(spy2[0]).toBe('"instantiating" the Schema object');
    expect(spy2[1]).toBe('bindClientModelToSchema was called');
    expect(spy2[2]).toBe('mongoose.model() was called for the model: "Test"');
  });

  test('buildModelCallback as above with options for completeness', () => {
    const test = () => {
      return {
        index: {
          foo: 'foo',
          bar: 'bar'
        },
        schema: {
          foy: 'foy',
          bay: 'bay',
        },
        methods: {
          foz: 'foz',
          baz: 'baz'
        },
        options: {
          etc: 'etc'
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
    }
    conf.spy[1]['Model'](test, 'Test'); //<= this call is really buildModelCallback()
    const mongoose = require('mongoose');

    // my second evil minion has returned from its nefarious expedition.
    expect(spy2[0]).toBe('"instantiating" the Schema object');
    expect(spy2[1]).toBe('bindClientModelToSchema was called');
    expect(spy2[2]).toBe('mongoose.model() was called for the model: "Test"');
  });

  test('buildModelCallback throws noSchema message if no schema in client model (method called from 1st spy array)', () => {
    expect(() => {
      const emptyModel = function() { return {} }
      conf.spy[1]['Model'](
        emptyModel,
        'MockModel'); //<= this call is really buildModelCallback()
    }).toThrow('noSchema: MockModel');
  });
});
