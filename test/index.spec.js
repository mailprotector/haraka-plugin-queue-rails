const { createReadStream } = require('fs');
const { queue_rails_test } = require('../index');

global.DENYSOFT = 450;
global.OK = 250;

test('response OK with a SUCCESS 200 API status code', testComplete => {
  const readStream = createReadStream('./test/test.json');

  const axiosMock = {
    post: jest.fn(() => {
      return new Promise(function(resolve, reject) {
        resolve({ status: 200 });
      });
    })
  };

  const transaction = {
    uuid: '123-abc',
    add_header: jest.fn(() => {}),
    message_stream: readStream,
    mail_from: 'from-addr',
    rcpt_to: 'to-addr',
  };

  const remote = {
    ip: '192.168.0.1',
    host: 'testhost'
  };

  const loginfo = msg => {
    // console.log(msg);
  };

  const logerror = msg => {
    console.log(msg);
  };

  const hello = { host: 'hello-host' };

  const connection = { transaction, remote, hello, loginfo, logerror };

  const next = statusCode => {
    expect(statusCode).toEqual(OK);

    expect(axiosMock.post.mock.calls[0][0]).toEqual('ACTION_MAILBOX_URL');
    expect(typeof axiosMock.post.mock.calls[0][1].on).toEqual('function');
    expect(axiosMock.post.mock.calls[1]).toEqual(undefined);

    testComplete();
  };

  class TestClass  {
    constructor() {
      this.cfg = {
        USER_AGENT: 'USER_AGENT',
        ACTION_MAILBOX_PASSWORD: 'ACTION_MAILBOX_PASSWORD',
        ACTION_MAILBOX_URL: 'ACTION_MAILBOX_URL'
      };
    };
  };

  testFunc = new TestClass();
  testFunc.queue_rails = queue_rails_test(axiosMock);

  testFunc.queue_rails(next, connection);
});

test('response DENYSOFT with a RESOLVE > 299 API status code', testComplete => {
  const readStream = createReadStream('./test/test.json');

  const axiosMock = {
    post: jest.fn(() => {
      return new Promise(function(resolve, reject) {
        resolve({ status: 300 });
      });
    })
  };

  const transaction = {
    uuid: '123-abc',
    add_header: jest.fn(() => {}),
    message_stream: readStream,
    mail_from: 'from-addr',
    rcpt_to: 'to-addr',
  };

  const remote = {
    ip: '192.168.0.1',
    host: 'testhost'
  };

  const loginfo = msg => {
    // console.log(msg);
  };

  const logerror = msg => {
    // console.log(msg);
  };

  const hello = { host: 'hello-host' };

  const connection = { transaction, remote, hello, loginfo, logerror };

  const next = (statusCode, reason) => {
    expect(statusCode).toEqual(DENYSOFT);

    expect(axiosMock.post.mock.calls[0][0]).toEqual('ACTION_MAILBOX_URL');
    expect(typeof axiosMock.post.mock.calls[0][1].on).toEqual('function');
    expect(axiosMock.post.mock.calls[1]).toEqual(undefined);

    testComplete();
  };

  class TestClass  {
    constructor() {
      this.cfg = {
        USER_AGENT: 'USER_AGENT',
        ACTION_MAILBOX_PASSWORD: 'ACTION_MAILBOX_PASSWORD',
        ACTION_MAILBOX_URL: 'ACTION_MAILBOX_URL'
      };
    };
  };

  testFunc = new TestClass();
  testFunc.queue_rails = queue_rails_test(axiosMock);

  testFunc.queue_rails(next, connection);
});

test('response DENYSOFT with a RESOLVE 401 API status code', testComplete => {
  const readStream = createReadStream('./test/test.json');

  const axiosMock = {
    post: jest.fn(() => {
      return new Promise(function(resolve, reject) {
        resolve({ status: 401 });
      });
    })
  };

  const transaction = {
    uuid: '123-abc',
    add_header: jest.fn(() => {}),
    message_stream: readStream,
    mail_from: 'from-addr',
    rcpt_to: 'to-addr',
  };

  const remote = {
    ip: '192.168.0.1',
    host: 'testhost'
  };

  const loginfo = msg => {
    // console.log(msg);
  };

  const logerror = msg => {
    // console.log(msg);
  };

  const hello = { host: 'hello-host' };

  const connection = { transaction, remote, hello, loginfo, logerror };

  const next = (statusCode, reason) => {
    expect(statusCode).toEqual(DENYSOFT);

    expect(axiosMock.post.mock.calls[0][0]).toEqual('ACTION_MAILBOX_URL');
    expect(typeof axiosMock.post.mock.calls[0][1].on).toEqual('function');
    expect(axiosMock.post.mock.calls[1]).toEqual(undefined);

    testComplete();
  };

  class TestClass  {
    constructor() {
      this.cfg = {
        USER_AGENT: 'USER_AGENT',
        ACTION_MAILBOX_PASSWORD: 'ACTION_MAILBOX_PASSWORD',
        ACTION_MAILBOX_URL: 'ACTION_MAILBOX_URL'
      };
    };
  };

  testFunc = new TestClass();
  testFunc.queue_rails = queue_rails_test(axiosMock);

  testFunc.queue_rails(next, connection);
});

test('response DENYSOFT with a RESOLVE 400 API status code', testComplete => {
  const readStream = createReadStream('./test/test.json');

  const axiosMock = {
    post: jest.fn(() => {
      return new Promise(function(resolve, reject) {
        resolve({ status: 400 });
      });
    })
  };

  const transaction = {
    uuid: '123-abc',
    add_header: jest.fn(() => {}),
    message_stream: readStream,
    mail_from: 'from-addr',
    rcpt_to: 'to-addr',
  };

  const remote = {
    ip: '192.168.0.1',
    host: 'testhost'
  };

  const loginfo = msg => {
    // console.log(msg);
  };

  const logerror = msg => {
    // console.log(msg);
  };

  const hello = { host: 'hello-host' };

  const connection = { transaction, remote, hello, loginfo, logerror };

  const next = (statusCode, reason) => {
    expect(statusCode).toEqual(DENYSOFT);

    expect(axiosMock.post.mock.calls[0][0]).toEqual('ACTION_MAILBOX_URL');
    expect(typeof axiosMock.post.mock.calls[0][1].on).toEqual('function');
    expect(axiosMock.post.mock.calls[1]).toEqual(undefined);

    testComplete();
  };

  class TestClass  {
    constructor() {
      this.cfg = {
        USER_AGENT: 'USER_AGENT',
        ACTION_MAILBOX_PASSWORD: 'ACTION_MAILBOX_PASSWORD',
        ACTION_MAILBOX_URL: 'ACTION_MAILBOX_URL'
      };
    };
  };

  testFunc = new TestClass();
  testFunc.queue_rails = queue_rails_test(axiosMock);

  testFunc.queue_rails(next, connection);
});

test('response DENYSOFT with a REJECT > 299 API status code', testComplete => {
  const readStream = createReadStream('./test/test.json');

  const axiosMock = {
    post: jest.fn(() => {
      return new Promise(function(resolve, reject) {
        reject({ response: { status: 300 } });
      });
    })
  };

  const transaction = {
    uuid: '123-abc',
    add_header: jest.fn(() => {}),
    message_stream: readStream,
    mail_from: 'from-addr',
    rcpt_to: 'to-addr',
  };

  const remote = {
    ip: '192.168.0.1',
    host: 'testhost'
  };

  const loginfo = msg => {
    // console.log(msg);
  };

  const logerror = msg => {
    // console.log(msg);
  };

  const hello = { host: 'hello-host' };

  const connection = { transaction, remote, hello, loginfo, logerror };

  const next = (statusCode, reason) => {
    expect(statusCode).toEqual(DENYSOFT);

    expect(axiosMock.post.mock.calls[0][0]).toEqual('ACTION_MAILBOX_URL');
    expect(typeof axiosMock.post.mock.calls[0][1].on).toEqual('function');
    expect(axiosMock.post.mock.calls[1]).toEqual(undefined);

    testComplete();
  };

  class TestClass  {
    constructor() {
      this.cfg = {
        USER_AGENT: 'USER_AGENT',
        ACTION_MAILBOX_PASSWORD: 'ACTION_MAILBOX_PASSWORD',
        ACTION_MAILBOX_URL: 'ACTION_MAILBOX_URL'
      };
    };
  };

  testFunc = new TestClass();
  testFunc.queue_rails = queue_rails_test(axiosMock);

  testFunc.queue_rails(next, connection);
});

test('response DENYSOFT with a REJECT 401 API status code', testComplete => {
  const readStream = createReadStream('./test/test.json');

  const axiosMock = {
    post: jest.fn(() => {
      return new Promise(function(resolve, reject) {
        reject({ response: { status: 401 } });
      });
    })
  };

  const transaction = {
    uuid: '123-abc',
    add_header: jest.fn(() => {}),
    message_stream: readStream,
    mail_from: 'from-addr',
    rcpt_to: 'to-addr',
  };

  const remote = {
    ip: '192.168.0.1',
    host: 'testhost'
  };

  const loginfo = msg => {
    // console.log(msg);
  };

  const logerror = msg => {
    // console.log(msg);
  };

  const hello = { host: 'hello-host' };

  const connection = { transaction, remote, hello, loginfo, logerror };

  const next = (statusCode, reason) => {
    expect(statusCode).toEqual(DENYSOFT);

    expect(axiosMock.post.mock.calls[0][0]).toEqual('ACTION_MAILBOX_URL');
    expect(typeof axiosMock.post.mock.calls[0][1].on).toEqual('function');
    expect(axiosMock.post.mock.calls[1]).toEqual(undefined);

    testComplete();
  };

  class TestClass  {
    constructor() {
      this.cfg = {
        USER_AGENT: 'USER_AGENT',
        ACTION_MAILBOX_PASSWORD: 'ACTION_MAILBOX_PASSWORD',
        ACTION_MAILBOX_URL: 'ACTION_MAILBOX_URL'
      };
    };
  };

  testFunc = new TestClass();
  testFunc.queue_rails = queue_rails_test(axiosMock);

  testFunc.queue_rails(next, connection);
});

test('response DENYSOFT with a REJECT 400 API status code', testComplete => {
  const readStream = createReadStream('./test/test.json');

  const axiosMock = {
    post: jest.fn(() => {
      return new Promise(function(resolve, reject) {
        reject({ response: { status: 400 } });
      });
    })
  };

  const transaction = {
    uuid: '123-abc',
    add_header: jest.fn(() => {}),
    message_stream: readStream,
    mail_from: 'from-addr',
    rcpt_to: 'to-addr',
  };

  const remote = {
    ip: '192.168.0.1',
    host: 'testhost'
  };

  const loginfo = msg => {
    // console.log(msg);
  };

  const logerror = msg => {
    // console.log(msg);
  };

  const hello = { host: 'hello-host' };

  const connection = { transaction, remote, hello, loginfo, logerror };

  const next = (statusCode, reason) => {
    expect(statusCode).toEqual(DENYSOFT);

    expect(axiosMock.post.mock.calls[0][0]).toEqual('ACTION_MAILBOX_URL');
    expect(typeof axiosMock.post.mock.calls[0][1].on).toEqual('function');
    expect(axiosMock.post.mock.calls[1]).toEqual(undefined);

    testComplete();
  };

  class TestClass  {
    constructor() {
      this.cfg = {
        USER_AGENT: 'USER_AGENT',
        ACTION_MAILBOX_PASSWORD: 'ACTION_MAILBOX_PASSWORD',
        ACTION_MAILBOX_URL: 'ACTION_MAILBOX_URL'
      };
    };
  };

  testFunc = new TestClass();
  testFunc.queue_rails = queue_rails_test(axiosMock);

  testFunc.queue_rails(next, connection);
});
