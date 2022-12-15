const Joi = require("joi");

exports.validatePlant = (_reqBody) => {
    let joiSchema = Joi.object({
        name: Joi.string().min(2).max(99).required(),
        img_url: Joi.string().min(2).max(200).required(),
        location: Joi.string().min(2).max(99).required(),
        mapLocation:Joi.object().required()
    })
    return joiSchema.validate(_reqBody);
}