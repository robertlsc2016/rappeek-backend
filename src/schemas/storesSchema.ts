import Joi from "joi";

export const bodyProductsOfferSchema = Joi.object({


  parent_store_type: Joi.string().required(),
  store_type: Joi.string().required(),
  store_id: Joi.number().required()


  // limit: 100,
  // offset: 0,
  // state: {
  //   aisle_id: "1926",
  //   parent_id: "1926",
  //   lat: "",
  //   lng: "",
  //   parent_store_type: Joi.string().required(),
  //   store_type: Joi.string().required(),
  // },
  // stores: Joi.array().items(Joi.number().strict()).length(1).required(),
});


export const storeIdSchema = Joi.object({
  store_id: Joi.number().strict().required(),
});

export const globalSearchProductsSchema = Joi.object({
  query: Joi.string().strict().required(),
  lat: Joi.number().strict().required(),
  lng: Joi.number().strict().required(),
})

export const searchLocationsSchema = Joi.object({
  lat: Joi.string().strict().required(),
  lng: Joi.string().strict().required(),
})

export const similarOnAmazonSchema = Joi.object({
  product_name: Joi.string().strict().required(),
})
