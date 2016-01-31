Example Multi-Agent Based control flow
======================================

Instance configuration:

```javascript
eve.system.init({
  transports: [
    {
      type: 'amqp',
      host: 'localhost'
    }
    // alternatives below
    {
      type: 'amqp',
      url: 'dev.rabbitmq.com',
      default: true //defualt transport
    }
  ]
});
```
