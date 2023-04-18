const axios = require('axios');
const YAML = require('yaml');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const main = async () => {
  const localConfig = YAML.parse(
    fs.readFileSync(path.join(__dirname, '../config/config.yaml'), 'utf-8')
  );
  const onlineConfig = await axios
    .get(process.env.SUB)
    .then((response) => YAML.parse(response.data));
  let config = Object.assign({}, onlineConfig, localConfig);
  fs.writeFileSync(path.join(__dirname, '../config.yaml'), YAML.stringify(config), 'utf-8');
};

main();
