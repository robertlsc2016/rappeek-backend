import Joi from "joi";

export const storeSchema = Joi.object({
  limit: 100,
  offset: 0,
  state: {
    aisle_id: "1926",
    parent_id: "1926",
    lat: "",
    lng: "",
    parent_store_type: Joi.string().required(),
    store_type: Joi.string().required(),
  },
  stores: Joi.array().items(Joi.number().strict()).length(1).required(),
});
