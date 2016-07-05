'use strict';

const _ = require('highland')
    , AWS = require('aws-sdk')
    , ssh2 = require('ssh2')
    , fs = require('fs')
    , spread = require('./util').spread;

module.exports = (actions, opts, ec2, ssh) => {
  ec2 = ec2 || new AWS.EC2();
  ssh = ssh || _.wrapCallback((i, cmd, done) => {
    const conn = new ssh2.Client();
    conn.on('ready', () => {
      conn.exec(cmd, (err, chn) => {
        if (err) {
          done(err);
        } else {
          const stderr = [];
          chn.on('close', (code, signal, didCoreDump) => {
            if (signal) {
              err = new Error(`caught ${signal} (core dumped: ${didCoreDump})`);
            } else if (code !== null && code !== 0) {
              err = new Error(`exit ${code}: ${Buffer.concat(stderr)}`);
            }

            conn.end();
            done(err, i);
          }).on('data', () => {}).stderr.on('data', (buf) => {
            stderr.push(buf);
          });
        }
      });
    }).on('error', (err) => {
      done(err);
    }).connect({
      username: opts.user,
      privateKey: fs.readFileSync(opts.privateKey),
      host: opts.publicIp ? i.PublicIpAddress : i.PrivateIpAddress
    });
  });

  const describeInstance = _.wrapCallback((i, done) => {
    ec2.describeInstances({
      InstanceIds: [
        i.InstanceId
      ]
    }, (err, data) => {
      if (err) {
        done(err);
      } else {
        done(null, _.extend(data.Reservations[0].Instances[0], { group: i.group }));
      }
    });
  });

  return _.pipeline(
    _.flatMap(describeInstance),
    spread(actions.map((a) => a((cmd) => _.flatMap((i) => ssh(i, cmd)), ec2)))
  );
};
