

![alt text](https://en.gravatar.com/userimage/466950/319008f37c749fae53ef6a7b071afa83.png)

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
	"APP_NAME": "APP_NAME",
	"ACTION_MAILBOX_USERNAME": "my_user_name",
    "ACTION_MAILBOX_PASSWORD": "my_password",
    "ACTION_MAILBOX_HOST": "my_host.com",
    "ACTION_MAILBOX_PATH": "/email",
    "ACTION_MAILBOX_PORT": 25,
    "APP_VERSION": 1337
}
```


##

[About Mailprotector](https://mailprotector.com/about-mailprotector)
