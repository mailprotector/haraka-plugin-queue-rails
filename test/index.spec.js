const { createReadStream } = require('fs');
const { queue_rails_test, load_config, register } = require('../index');

global.DENYSOFT = 450;
global.OK = 250;

describe('register', () => {
  test('registers plugin and loads config', () => {
    const registerHookMock = jest.fn(() => {});
    const loadConfigMock = jest.fn(() => {});

    class TestClass  {
      constructor() {
        this.register_hook = registerHookMock;
        this.load_config = loadConfigMock;
      }
    };

    testFunc = new TestClass();
    testFunc.register = register;
    testFunc.register();

    expect(registerHookMock.mock.calls[0][0]).toEqual('queue');
    expect(registerHookMock.mock.calls[0][1]).toEqual('queue_rails');
    expect(registerHookMock.mock.calls[0][3]).toEqual(undefined);
    expect(registerHookMock.mock.calls[1]).toEqual(undefined);

    expect(loadConfigMock.mock.calls[0]).toEqual([]);
  });
});

describe('load_config', () => {
  test('success with all config values', () => {
    const getConfigMock = jest.fn(() => ({
      USER_AGENT: 'USER_AGENT',
      ACTION_MAILBOX_PASSWORD: 'ACTION_MAILBOX_PASSWORD',
      ACTION_MAILBOX_URL: 'ACTION_MAILBOX_URL'
    }));

    const logWarningMock = jest.fn(() => {});

    class TestClass  {
      constructor() {
        this.config = { get: getConfigMock };
        this.logwarning = logWarningMock;
      }
    };

    testFunc = new TestClass();
    testFunc.load_config = load_config;
    testFunc.load_config();

    expect(getConfigMock.mock.calls[0][0]).toEqual('queue.rails.json');
    expect(logWarningMock.mock.calls[0]).toEqual(undefined);
  });

  test('warning with missing config values', () => {
    const getConfigMock = jest.fn(() => ({}));

    const logWarningMock = jest.fn(() => {});

    class TestClass  {
      constructor() {
        this.config = { get: getConfigMock };
        this.logwarning = logWarningMock;
      }
    };

    testFunc = new TestClass();
    testFunc.load_config = load_config;
    testFunc.load_config();

    expect(getConfigMock.mock.calls[0][0]).toEqual('queue.rails.json');

    expect(logWarningMock.mock.calls[0][0]).toEqual('[CONFIG][MISSING][USER_AGENT]');
    expect(logWarningMock.mock.calls[1][0]).toEqual('[CONFIG][MISSING][ACTION_MAILBOX_PASSWORD]');
    expect(logWarningMock.mock.calls[2][0]).toEqual('[CONFIG][MISSING][ACTION_MAILBOX_URL]');
    expect(logWarningMock.mock.calls[3]).toEqual(undefined);
  });
});

describe('queue_rails', () => {
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
      expect(axiosMock.post.mock.calls[0][2]).toEqual({
        "headers": {
          "Authorization": "Basic YWN0aW9ubWFpbGJveDpBQ1RJT05fTUFJTEJPWF9QQVNTV09SRA==",
          "Content-Type": "messsage/rfc822",
          "User-Agent": "Frontline relayer vUSER_AGENT"
        }
      });
      expect(axiosMock.post.mock.calls[1]).toEqual(undefined);

      expect(transaction.add_header.mock.calls[0][1]).toEqual(
        JSON.stringify({
          mail_from: transaction.mail_from,
          rcpt_to: transaction.rcpt_to,
          remote_ip: remote.ip,
          remote_host: remote.host,
          helo: hello.host
        })
      );

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
      expect(axiosMock.post.mock.calls[0][2]).toEqual({
        "headers": {
          "Authorization": "Basic YWN0aW9ubWFpbGJveDpBQ1RJT05fTUFJTEJPWF9QQVNTV09SRA==",
          "Content-Type": "messsage/rfc822",
          "User-Agent": "Frontline relayer vUSER_AGENT"
        }
      });
      expect(axiosMock.post.mock.calls[1]).toEqual(undefined);

      expect(transaction.add_header.mock.calls[0][1]).toEqual(
        JSON.stringify({
          mail_from: transaction.mail_from,
          rcpt_to: transaction.rcpt_to,
          remote_ip: remote.ip,
          remote_host: remote.host,
          helo: hello.host
        })
      );

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
      expect(axiosMock.post.mock.calls[0][2]).toEqual({
        "headers": {
          "Authorization": "Basic YWN0aW9ubWFpbGJveDpBQ1RJT05fTUFJTEJPWF9QQVNTV09SRA==",
          "Content-Type": "messsage/rfc822",
          "User-Agent": "Frontline relayer vUSER_AGENT"
        }
      });
      expect(axiosMock.post.mock.calls[1]).toEqual(undefined);

      expect(transaction.add_header.mock.calls[0][1]).toEqual(
        JSON.stringify({
          mail_from: transaction.mail_from,
          rcpt_to: transaction.rcpt_to,
          remote_ip: remote.ip,
          remote_host: remote.host,
          helo: hello.host
        })
      );

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
      expect(axiosMock.post.mock.calls[0][2]).toEqual({
        "headers": {
          "Authorization": "Basic YWN0aW9ubWFpbGJveDpBQ1RJT05fTUFJTEJPWF9QQVNTV09SRA==",
          "Content-Type": "messsage/rfc822",
          "User-Agent": "Frontline relayer vUSER_AGENT"
        }
      });
      expect(axiosMock.post.mock.calls[1]).toEqual(undefined);

      expect(transaction.add_header.mock.calls[0][1]).toEqual(
        JSON.stringify({
          mail_from: transaction.mail_from,
          rcpt_to: transaction.rcpt_to,
          remote_ip: remote.ip,
          remote_host: remote.host,
          helo: hello.host
        })
      );

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
      expect(axiosMock.post.mock.calls[0][2]).toEqual({
        "headers": {
          "Authorization": "Basic YWN0aW9ubWFpbGJveDpBQ1RJT05fTUFJTEJPWF9QQVNTV09SRA==",
          "Content-Type": "messsage/rfc822",
          "User-Agent": "Frontline relayer vUSER_AGENT"
        }
      });
      expect(axiosMock.post.mock.calls[1]).toEqual(undefined);

      expect(transaction.add_header.mock.calls[0][1]).toEqual(
        JSON.stringify({
          mail_from: transaction.mail_from,
          rcpt_to: transaction.rcpt_to,
          remote_ip: remote.ip,
          remote_host: remote.host,
          helo: hello.host
        })
      );

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
      expect(axiosMock.post.mock.calls[0][2]).toEqual({
        "headers": {
          "Authorization": "Basic YWN0aW9ubWFpbGJveDpBQ1RJT05fTUFJTEJPWF9QQVNTV09SRA==",
          "Content-Type": "messsage/rfc822",
          "User-Agent": "Frontline relayer vUSER_AGENT"
        }
      });
      expect(axiosMock.post.mock.calls[1]).toEqual(undefined);

      expect(transaction.add_header.mock.calls[0][1]).toEqual(
        JSON.stringify({
          mail_from: transaction.mail_from,
          rcpt_to: transaction.rcpt_to,
          remote_ip: remote.ip,
          remote_host: remote.host,
          helo: hello.host
        })
      );

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
      expect(axiosMock.post.mock.calls[0][2]).toEqual({
        "headers": {
          "Authorization": "Basic YWN0aW9ubWFpbGJveDpBQ1RJT05fTUFJTEJPWF9QQVNTV09SRA==",
          "Content-Type": "messsage/rfc822",
          "User-Agent": "Frontline relayer vUSER_AGENT"
        }
      });
      expect(axiosMock.post.mock.calls[1]).toEqual(undefined);

      expect(transaction.add_header.mock.calls[0][1]).toEqual(
        JSON.stringify({
          mail_from: transaction.mail_from,
          rcpt_to: transaction.rcpt_to,
          remote_ip: remote.ip,
          remote_host: remote.host,
          helo: hello.host
        })
      );

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
});
