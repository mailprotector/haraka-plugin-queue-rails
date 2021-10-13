# haraka-plugin-queue-rails
A Haraka plugin for relaying email to a Rails application via Action Mailbox.

## Installation

Install with npm
```bash
npm install @mailprotector/haraka-plugin-queue-rails --save
```

To use make sure to add a queue.rails.json config file in the config folder with the following settings:
```json
{
  "ACTION_MAILBOX_PASSWORD": "my_password",
  "ACTION_MAILBOX_URL": "https://my_host.com:8080/email",
  "USER_AGENT": "awesome-app"
}
```

Add to config file in config folder
```text
queue.rails
```


##
![alt text](https://i1.wp.com/mailprotector.com/wp-content/uploads/2020/03/cropped-logo-2x.png)
[About Mailprotector](https://mailprotector.com/about-mailprotector)
