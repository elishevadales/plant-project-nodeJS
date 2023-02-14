const Joi = require("joi");

exports.validatePlant = (_reqBody) => {
    let joiSchema = Joi.object({
        name: Joi.string().min(2).max(99).required(),
        img_url: Joi.string().min(2).max(1000),
        img_url_preview:Joi.string().min(0).max(1000).allow(),
        description:Joi.string().min(0).max(1000).allow(),
        location: Joi.string().min(2).max(99).required(),

        // location: Joi.string().min(2).max(99),
        mapLocation:Joi.object().required()
    })
    return joiSchema.validate(_reqBody);
}