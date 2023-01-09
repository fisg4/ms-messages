import * as deepl from 'deepl-node';

const Message = require('../models/Message');
const DEEPL_KEY = process.env.DEEPL_KEY || 'Lorem';
const translator = new deepl.Translator(DEEPL_KEY);

const translateMessage = async (message) => {
    try {
        
        var translated = await translator.translateText(message.text, null, 'es');
        
        try {

            await Message.findByIdAndUpdate(message._id, {
                translatedMessage: translated.text
            });
            
            return {
                status: 200,
                message: translated.text
            };
        } catch (err) {
            return false;
        }

    } catch (err) {
        res.status(500)
            .json({
                success: false,
                message: `Error when translating message'`,
                content: {}
            });
    }
};

module.exports = { translateMessage };
