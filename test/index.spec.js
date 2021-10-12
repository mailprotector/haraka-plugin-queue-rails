const { createReadStream, createWriteStream, writeFileSync } = require('fs');
const { queue_rails_test } = require('../index');

global.DENYSOFT = 450;
global.OK = 250;

test('response OK with a 200 API status code', testComplete => {
  const readStream = createReadStream('./test/test.json');
  writeFileSync('./test/test2.json', '');
  const writeStream = createWriteStream('./test/test2.json');

  const httpsMock = {
    request: jest.fn((options, cb) => {
      writeStream.statusCode = 200;
      cb(writeStream);
      return writeStream;
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

  const logdebug = msg => {
    // console.log(msg);
  };

  const logerror = msg => {
    // console.log(msg);
  };

  const hello = { host: 'hello-host' };

  const connection = { transaction, remote, hello, logdebug, logerror };

  const next = statusCode => {
    expect(statusCode).toEqual(OK);

    expect(httpsMock.request.mock.calls[0][0]).toEqual({
      "headers": {
        "Authorization": "Basic QUNUSU9OX01BSUxCT1hfVVNFUk5BTUU6QUNUSU9OX01BSUxCT1hfUEFTU1dPUkQ=",
        "Content-Type": "messsage/rfc822",
        "User-Agent": "Frontline relayer vAPP_VERSION"
      },
      "host": "ACTION_MAILBOX_HOST",
      "method": "POST",
      "path": "ACTION_MAILBOX_PATH",
      "port": "ACTION_MAILBOX_PORT"
    });
    expect(httpsMock.request.mock.calls[1]).toEqual(undefined);

    testComplete();
  };

  class TestClass  {
    constructor() {
      this.cfg = {
        APP_NAME: 'APP_NAME',
        ACTION_MAILBOX_USERNAME: 'ACTION_MAILBOX_USERNAME',
        ACTION_MAILBOX_PASSWORD: 'ACTION_MAILBOX_PASSWORD',
        ACTION_MAILBOX_HOST: 'ACTION_MAILBOX_HOST',
        ACTION_MAILBOX_PORT: 'ACTION_MAILBOX_PORT',
        ACTION_MAILBOX_PATH: 'ACTION_MAILBOX_PATH',
        APP_VERSION: 'APP_VERSION'
      };
    };
  };

  testFunc = new TestClass();
  testFunc.queue_rails = queue_rails_test(httpsMock);

  testFunc.queue_rails(next, connection);
});

test('response DENYSOFT-unknown with a greater than 299 API status code', testComplete => {
  const readStream = createReadStream('./test/test.json');
  writeFileSync('./test/test2.json', '');
  const writeStream = createWriteStream('./test/test2.json');

  const httpsMock = {
    request: jest.fn((options, cb) => {
      writeStream.statusCode = 300;
      cb(writeStream);
      return writeStream;
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

  const logdebug = msg => {
    // console.log(msg);
  };

  const logerror = msg => {
    // console.log(msg);
  };

  const hello = { host: 'hello-host' };

  const connection = { transaction, remote, hello, logdebug, logerror };

  const next = statusCode => {
    expect(statusCode).toEqual(DENYSOFT);

    expect(httpsMock.request.mock.calls[0][0]).toEqual({
      "headers": {
        "Authorization": "Basic QUNUSU9OX01BSUxCT1hfVVNFUk5BTUU6QUNUSU9OX01BSUxCT1hfUEFTU1dPUkQ=",
        "Content-Type": "messsage/rfc822",
        "User-Agent": "Frontline relayer vAPP_VERSION"
      },
      "host": "ACTION_MAILBOX_HOST",
      "method": "POST",
      "path": "ACTION_MAILBOX_PATH",
      "port": "ACTION_MAILBOX_PORT"
    });
    expect(httpsMock.request.mock.calls[1]).toEqual(undefined);

    testComplete();
  };

  class TestClass  {
    constructor() {
      this.cfg = {
        APP_NAME: 'APP_NAME',
        ACTION_MAILBOX_USERNAME: 'ACTION_MAILBOX_USERNAME',
        ACTION_MAILBOX_PASSWORD: 'ACTION_MAILBOX_PASSWORD',
        ACTION_MAILBOX_HOST: 'ACTION_MAILBOX_HOST',
        ACTION_MAILBOX_PORT: 'ACTION_MAILBOX_PORT',
        ACTION_MAILBOX_PATH: 'ACTION_MAILBOX_PATH',
        APP_VERSION: 'APP_VERSION'
      };
    };
  };

  testFunc = new TestClass();
  testFunc.queue_rails = queue_rails_test(httpsMock);

  testFunc.queue_rails(next, connection);
});

test('response DENYSOFT-invalid-creds with a 401 API status code', testComplete => {
  const readStream = createReadStream('./test/test.json');
  writeFileSync('./test/test2.json', '');
  const writeStream = createWriteStream('./test/test2.json');

  const httpsMock = {
    request: jest.fn((options, cb) => {
      writeStream.statusCode = 401;
      cb(writeStream);
      return writeStream;
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

  const logdebug = msg => {
    // console.log(msg);
  };

  const logerror = msg => {
    // console.log(msg);
  };

  const hello = { host: 'hello-host' };

  const connection = { transaction, remote, hello, logdebug, logerror };

  const next = statusCode => {
    expect(statusCode).toEqual(DENYSOFT);

    expect(httpsMock.request.mock.calls[0][0]).toEqual({
      "headers": {
        "Authorization": "Basic QUNUSU9OX01BSUxCT1hfVVNFUk5BTUU6QUNUSU9OX01BSUxCT1hfUEFTU1dPUkQ=",
        "Content-Type": "messsage/rfc822",
        "User-Agent": "Frontline relayer vAPP_VERSION"
      },
      "host": "ACTION_MAILBOX_HOST",
      "method": "POST",
      "path": "ACTION_MAILBOX_PATH",
      "port": "ACTION_MAILBOX_PORT"
    });
    expect(httpsMock.request.mock.calls[1]).toEqual(undefined);

    testComplete();
  };

  class TestClass  {
    constructor() {
      this.cfg = {
        APP_NAME: 'APP_NAME',
        ACTION_MAILBOX_USERNAME: 'ACTION_MAILBOX_USERNAME',
        ACTION_MAILBOX_PASSWORD: 'ACTION_MAILBOX_PASSWORD',
        ACTION_MAILBOX_HOST: 'ACTION_MAILBOX_HOST',
        ACTION_MAILBOX_PORT: 'ACTION_MAILBOX_PORT',
        ACTION_MAILBOX_PATH: 'ACTION_MAILBOX_PATH',
        APP_VERSION: 'APP_VERSION'
      };
    };
  };

  testFunc = new TestClass();
  testFunc.queue_rails = queue_rails_test(httpsMock);

  testFunc.queue_rails(next, connection);
});

test('response DENYSOFT-error-relaying with a 400 API status code', testComplete => {
  const readStream = createReadStream('./test/test.json');
  writeFileSync('./test/test2.json', '');
  const writeStream = createWriteStream('./test/test2.json');

  const httpsMock = {
    request: jest.fn((options, cb) => {
      writeStream.statusCode = 400;
      cb(writeStream);
      return writeStream;
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

  const logdebug = msg => {
    // console.log(msg);
  };

  const logerror = msg => {
    // console.log(msg);
  };

  const hello = { host: 'hello-host' };

  const connection = { transaction, remote, hello, logdebug, logerror };

  const next = statusCode => {
    expect(statusCode).toEqual(DENYSOFT);

    expect(httpsMock.request.mock.calls[0][0]).toEqual({
      "headers": {
        "Authorization": "Basic QUNUSU9OX01BSUxCT1hfVVNFUk5BTUU6QUNUSU9OX01BSUxCT1hfUEFTU1dPUkQ=",
        "Content-Type": "messsage/rfc822",
        "User-Agent": "Frontline relayer vAPP_VERSION"
      },
      "host": "ACTION_MAILBOX_HOST",
      "method": "POST",
      "path": "ACTION_MAILBOX_PATH",
      "port": "ACTION_MAILBOX_PORT"
    });
    expect(httpsMock.request.mock.calls[1]).toEqual(undefined);

    testComplete();
  };

  class TestClass  {
    constructor() {
      this.cfg = {
        APP_NAME: 'APP_NAME',
        ACTION_MAILBOX_USERNAME: 'ACTION_MAILBOX_USERNAME',
        ACTION_MAILBOX_PASSWORD: 'ACTION_MAILBOX_PASSWORD',
        ACTION_MAILBOX_HOST: 'ACTION_MAILBOX_HOST',
        ACTION_MAILBOX_PORT: 'ACTION_MAILBOX_PORT',
        ACTION_MAILBOX_PATH: 'ACTION_MAILBOX_PATH',
        APP_VERSION: 'APP_VERSION'
      };
    };
  };

  testFunc = new TestClass();
  testFunc.queue_rails = queue_rails_test(httpsMock);

  testFunc.queue_rails(next, connection);
});
