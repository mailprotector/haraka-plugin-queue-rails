const { createReadStream, createWriteStream, writeFileSync } = require('fs');
const { queue_rails_test } = require('../index');

global.DENYSOFT = 450;
global.OK = 250;

test('test', testComplete => {
  const readStream = createReadStream('./test/test.txt');
  writeFileSync('./test/test2.txt', '');
  const writeStream = createWriteStream('./test/test2.txt');

  const httpsMock = {
    request: jest.fn((options, cb) => {
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
    console.log(msg);
  };

  const logerror = msg => {
    console.log(msg);
  };

  const hello = { host: 'hello-host' };

  const connection = { transaction, remote, hello, logdebug, logerror };

  const next = statusCode => {
    expect(statusCode).toEqual(OK);
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
