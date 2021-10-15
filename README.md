# haraka-plugin-queue-rails
A Haraka plugin for relaying email to a Rails application via Action Mailbox.

## Install

Install with npm
```bash
npm install @mailprotector/haraka-plugin-queue-rails --save
```

## Setup
### Enable Plugin
Add to `plugin` file in the haraka config folder
```text
@mailprotector/haraka-plugin-queue-rails
```

### Config

Config options are set in `queue.rails.json`:

| Parameter               | Description                                   | Type   | Default Value |
| ----------------------- | --------------------------------------------- | ------ | ------------- |
| ACTION_MAILBOX_PASSWORD | action mailbox password                       | string | none          |
| ACTION_MAILBOX_URL      | action mailbox url endpoint                   | string | none          |
| USER_AGENT              | user agent to send action mailbox requests as | string | none          |
| ENVELOPE_HEADER_NAME    | labels to add to all metrics (details below)  | string | none          |

## Details
The following header from your `ENVELOPE_HEADER_NAME` config will be added to the email as a JSON string
```js
{
  "mail_from": transaction.mail_from,
  "rcpt_to": transaction.rcpt_to,
  "remote_ip": remote.ip,
  "remote_host": remote.host,
  "helo": hello.host
}
```

##
![alt text](https://i1.wp.com/mailprotector.com/wp-content/uploads/2020/03/cropped-logo-2x.png)
[About Mailprotector](https://mailprotector.com/about-mailprotector)
