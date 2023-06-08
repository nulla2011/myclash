const { readFileSync } = require('fs');
module.exports.parseHosts = () => {
  const hostsLine = readFileSync('C:/Windows/System32/drivers/etc/hosts', 'utf-8').split(/\r?\n/);
  let hosts = {};
  for (const line of hostsLine) {
    if (!line || line.startsWith('#')) {
      continue;
    }
    const [host, url] = line
      .split('#')[0]
      .trim()
      .replace(/ +|\t+/, ' ')
      .split(' ');
    hosts[url] = host;
  }
  return hosts;
};
