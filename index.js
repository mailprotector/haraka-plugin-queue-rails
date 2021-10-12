(() => {
  const buildPluginFunction = https => {
    return function(next, connection) {
      const startTime = Date.now();

      const logDebug = msg => {
        logdebug(msg + ` ${Date.now() - startTime}/ms`, plugin);
      }

      const plugin = this;

      const { transaction, remote, hello, logdebug, logerror } = connection;

      const addCustomHeaders = customHeader => {
        logDebug('[ADD_CUSTOM_HEADERS]', plugin);
        try {
          transaction.add_header(`X-${plugin.cfg.APP_NAME}`, JSON.stringify(customHeader))
        } catch (err) {
          handleError(`[ADD_CUSTOM_HEADERS] ${err.message}`);
        }
      };

      const done = (status, reason) => {
        logDebug('[DONE]', plugin);
        next(status, reason);
      };

      const handleError = message => {
        logerror(message, plugin);
        done(DENYSOFT);
      };

      const handleApiError = status => {
        let errorMessage = 'Unknown response from server';

        if (status == 401) {
          errorMessage = 'Invalid credentials for ingress';
        }

        if (status == 400) {
          errorMessage = 'Error relaying to ingress';
        }

        handleError(errorMessage);
      };

      const run = () => {
        try {
          logDebug('[RUN][STARTED]', plugin);

          const authString = `${plugin.cfg.ACTION_MAILBOX_USERNAME}:${plugin.cfg.ACTION_MAILBOX_PASSWORD}`;
          const authBase64 = new Buffer.from(authString).toString('base64');

          const options = {
            host: plugin.cfg.ACTION_MAILBOX_HOST,
            port: plugin.cfg.ACTION_MAILBOX_PORT,
            path: plugin.cfg.ACTION_MAILBOX_PATH,
            method: 'POST',
            headers: {
              'Content-Type': 'messsage/rfc822',
              'User-Agent': `Frontline relayer v${plugin.cfg.APP_VERSION}`,
              'Authorization': `Basic ${authBase64}`
            }
          };

          const request = https.request(options, response => {
            if (response.statusCode > 299 || response.statusCode == undefined) {
              handleApiError(response.statusCode);
            } else {
              logDebug('[HTTPS_REQUEST][COMPLETE]', plugin);
              done(OK);
            }
          });

          request.on('error', err => {
            handleError(`[REQUEST][ERROR] ${err.message}`)
          });

          transaction.message_stream.pipe(request);
        } catch (err) {
          handleError(`[RUN][ERROR] ${err.message}`);
        }
      };

      addCustomHeaders({
        mail_from: transaction.mail_from,
        rcpt_to: transaction.rcpt_to,
        remote_ip: remote.ip,
        remote_host: remote.host,
        helo: hello.host
      });

      run();
    };
  };

  exports.queue_rails_test = buildPluginFunction;

  exports.load_config = function() {
    this.cfg = this.config.get('queue.rails.json', this.load_config);
  };

  exports.register = function() {
    this.register_hook('queue', 'queue_rails');
    this.load_config();
  };

  exports.queue_rails = buildPluginFunction(require('https'));

})();
