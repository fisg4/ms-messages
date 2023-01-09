const { Translator } = require('deepl-node');

const DEEPL_KEY = process.env.DEEPL_KEY || 'Lorem';
const translator = new Translator(DEEPL_KEY);

const translate = async (text) => {
  const translated = await translator.translateText(text, null, 'es');
  return translated.text;
};

module.exports = { translate };
