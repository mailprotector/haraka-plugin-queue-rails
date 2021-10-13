(() => {
  const buildPluginFunction = axios => {
    return function(next, connection) {
      const plugin = this;

      const { transaction, remote, hello, logdebug, logerror } = connection;

      const addCustomHeaders = customHeader => {
        logdebug('[ADD_CUSTOM_HEADERS]', plugin);
        try {
          transaction.add_header(plugin.cfg.ENVELOPE_HEADER_NAME, JSON.stringify(customHeader))
        } catch (err) {
          handleError(`[ADD_CUSTOM_HEADERS] ${err.message}`);
        }
      };

      const done = (status, reason) => {
        logdebug('[DONE]', plugin);
        next(status, reason);
      };

      const handleError = (message, errorMessage) => {
        logerror(message, plugin);
        done(DENYSOFT, errorMessage);
      };

      const handleApiError = err => {
        if (err.code == 'ECONNREFUSED') {
          handleError(err.message, 'Connection refused');
          return;
        }

        if (err.code == 'ENOTFOUND') {
          handleError(err.message, 'Connection not found');
          return;
        }

        if (err.response != undefined && err.response.status != undefined) {
          let errorMessage = `HTTP ${err.response.status}`;

          if (err.response.status == 401) {
            errorMessage = 'Invalid credentials for ingress';
          }

          if (err.response.status == 403) {
            errorMessage = 'Forbidden to access ingress';
          }

          handleError(errorMessage, errorMessage);
        } else {
          handleError(err.message);
        }
      };

      const run = () => {
        try {
          logdebug('[RUN][STARTED]', plugin);

          const authString = `actionmailbox:${plugin.cfg.ACTION_MAILBOX_PASSWORD}`;
          const authBase64 = new Buffer.from(authString).toString('base64');

          const options = {
            headers: {
              'Content-Type': 'messsage/rfc822',
              'User-Agent': plugin.cfg.USER_AGENT,
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

    if (this.cfg.USER_AGENT == undefined) {
      this.logwarning('Missing USER_AGENT in /config/queue.rails.json configuration file');
    }

    if (this.cfg.ACTION_MAILBOX_PASSWORD == undefined) {
      this.logwarning('Missing ACTION_MAILBOX_PASSWORD in /config/queue.rails.json configuration file');
    }

    if (this.cfg.ACTION_MAILBOX_URL == undefined) {
      this.logwarning('Missing ACTION_MAILBOX_URL in /config/queue.rails.json configuration file');
    }

    if (this.cfg.ENVELOPE_HEADER_NAME == undefined) {
      this.logwarning('Missing ENVELOPE_HEADER_NAME in /config/queue.rails.json configuration file');
    }
  };

  exports.register = function() {
    this.register_hook('queue', 'queue_rails');
    this.load_config();
  };

  exports.queue_rails = buildPluginFunction(require('axios'));

})();
