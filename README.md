# Gunslinger
A cloud resiliency tool, inspired by [Chaos Monkey](https://github.com/Netflix/SimianArmy) and written in Node.js for AWS Lambda.

[![Build Status](https://travis-ci.org/wowgroup/gunslinger.svg?branch=master)](https://travis-ci.org/wowgroup/gunslinger)

**Caveat Emptor:** This is still alpha software, and some actions may incur additional AWS charges.

## Usage

```bash
$ npm install --save gunslinger
````

Function code:
```js
exports.run = require('gunslinger')(require('./config'));
```

Configuration:
```json
{
  "armed": false,
  "store": ["simple_db", "GunslingerEvents"],
  "notifier": ["sns", "arn:aws:sns:eu-west-1:123456789012:Gunslinger"],
  "grouper": "asg",
  "filters": [
    ["tag", "gunslinger"],
    ["redundancy", 2],
    ["probability", 0.15],
    ["action_limit", 1]
  ],
  "actions": [
    "burn_cpu",
    "fill_disk",
    "terminate"
  ],
  "ssh": {
    "user": "ec2-user",
    "privateKey": "/path/to/key.pem",
    "publicIp": true
  }
}
```
Create SimpleDB and SNS resources:
```bash
$ aws configure set preview.sdb true
$ aws sdb create-domain --domain-name GunslingerEvents
$ aws sns create-topic --name Gunslinger
```

Create a function:
```bash
$ aws lambda create-function --function-name Gunslinger --zip-file fileb:///path/to/code.zip --role GunslingerExecution --handler index.run --runtime nodejs4.3
```

The `GunslingerExection` role should have `sns:Publish`, `sdb:PutAttributes`, `sdb:Select`, `autoscaling:DescribeAutoScalingGroups`, `ec2:DescribeInstances` and `ec2:TerminateInstances` permissions.

Create a [schedule](http://docs.aws.amazon.com/AmazonCloudWatch/latest/DeveloperGuide/ScheduledEvents.html) and apply it to your function:

```bash
$ aws events put-rule --schedule-expression 'cron(0 9-16 ? * MON-FRI *)' --name GunslingerPerHourOfficeHours
$ aws lambda add-permission --function-name Gunslinger --statement-id 1 --action lambda:InvokeFunction --principal events.amazonaws.com --source-arn arn:aws:events:us-east-1:123456789012:rule/GunslingerPerHourOfficeHours
$ aws events put-targets --rule GunslingerPerHourOfficeHours --targets '{"Id" : "1", "Arn": "arn:aws:lambda:us-east-1:123456789012:function:Gunslinger"}'
```

## Configuration


### armed (default = false)
The default mode of Gunslinger is "unarmed". In this mode, no destructive action is taken. Before you switch to the "armed" mode, verify your filter configuration. **Without any filters, Gunslinger will target every auto scaling group within your AWS account on each invocation!**

### store (required)
Gunslinger will persist events (such as instance termination) to maintain a record for future invocations. Currently, only SimpleDB is supported. 


### notifier (default = none)
Optionally, Gunslinger can push events to a notification service. Currently, only SNS is supported.

### grouper (default = asg)
Gunslinger targets logical groups of EC2 instances. Currently, only auto scaling groups are supported.

### filters (default = [])
The set of target groups can be reduced by applying one or more of the following filters:

* **action_limit(N)**: allow at most N actions on any given group within a 24-hour window.
* **probability(N)**: only take action on any given group with a probability of 0 <= N <= 1.0.
* **redundancy(N)**: only take action on groups with N or more healthy instances.
* **tag(K)**: only take action on groups tagged with key K.

### actions (default = [])
When a group is targeted, a target action is randomly selected out of this configured set. Please consult the source for available actions.

## VPC usage
Unless `publicIp` is explicitly set to `true`, Gunslinger will attempt to SSH to the private IP addresses of instances. To use this mode, you must add a [VPC configuration](http://docs.aws.amazon.com/lambda/latest/dg/vpc.html) to your Lambda function.
