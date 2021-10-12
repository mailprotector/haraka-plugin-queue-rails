(() => {
  const buildPluginFunction = axios => {
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
          transaction.add_header(`X-${plugin.cfg.USER_AGENT}`, JSON.stringify(customHeader))
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

      const handleApiError = err => {
        if (err.response != undefined && err.response.status != undefined) {
          let errorMessage = 'Unknown response from server';

          if (err.response.status == 401) {
            errorMessage = 'Invalid credentials for ingress';
          }

          if (err.response.status == 400) {
            errorMessage = 'Error relaying to ingress';
          }

          handleError(errorMessage);
        } else {
          handleError(err.message);
        }
      };

      const run = () => {
        try {
          logDebug('[RUN][STARTED]', plugin);

          const authString = `actionmailbox:${plugin.cfg.ACTION_MAILBOX_PASSWORD}`;
          const authBase64 = new Buffer.from(authString).toString('base64');

          const options = {
            headers: {
              'Content-Type': 'messsage/rfc822',
              'User-Agent': `Frontline relayer v${plugin.cfg.USER_AGENT}`,
              'Authorization': `Basic ${authBase64}`
            }
          };

          axios.post(plugin.cfg.ACTION_MAILBOX_URL, transaction.message_stream, options).then(response => {
            if (response.status <= 299) {
              done(OK);
            } else {
              handleApiError({ response });
            }
          }).catch(err => handleApiError(err));
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

  exports.queue_rails = buildPluginFunction(require('axios'));

})();
