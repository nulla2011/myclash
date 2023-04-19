const axios = require('axios');
const YAML = require('yaml');
const fs = require('fs');
const path = require('path');
require('dotenv').config();
const { parse } = require('./preProcess');

const main = async () => {
  const localConfig = YAML.parse(
    fs.readFileSync(path.join(__dirname, '../resources/config.yaml'), 'utf-8')
  );
  const myrule = YAML.parse(
    fs.readFileSync(path.join(__dirname, '../resources/rule-providers.yaml'), 'utf-8')
  );
  const onlineConfig = await axios
    .get(process.env.SUB)
    .catch((e) => console.error(e))
    .then((response) => YAML.parse(response.data));
  let config = Object.assign({}, onlineConfig, localConfig);
  Object.assign(config['rule-providers'], myrule['mix-rule-providers']);
  config = parse({ content: config }, {});
  fs.writeFileSync(path.join(__dirname, '../out/config.yaml'), YAML.stringify(config), 'utf-8');
};

main();
