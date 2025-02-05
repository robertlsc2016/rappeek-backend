const getInfoStore = {
  "/store/getInfoStore": {
    post: {
      summary: "buscar informações de uma loja",
      description: "buscar informações de uma loja",
      parameters: [
        {
          name: "body",
          in: "body",
          required: true,
          schema: {
            type: "object",
            properties: {
              store_id: {
                type: "number",
                example: 900604367,
                description: "The unique identifier for the store.",
              },
            },
          },
        },
      ],
      responses: {
        200: { description: "OK" },
        400: { description: "Bad Request" },
      },
    },
  },
};


export default getInfoStore