const routes = [`
  {
  "swagger": "2.0",
  "info": {
    "title": "API Filtro de ofertas do Rappi",
    "description": "Métodos da API que retorna alguns scrapings da rappi.com.br",
    "version": "1.0.0"
  },
  "basePath": "/",
  "schemes": ["http", "https"],
  "paths": {
    "/": {
      "get": {
        "summary": "status da api",
        "description": "verificar status da api",
        "responses": {
          "200": { "description": "OK" }
        }
      }
    },
    
    "/store/getInfoStore": {
      "post": {
        "summary": "buscar informações de uma loja",
        "description": "buscar informações de uma loja",
        "parameters": [
          {
            "name": "body",
            "in": "body",
            "required": true,
            "schema": {
              "type": "object",
              "properties": {
                "store_id": {
                  "type": "number",
                  "example": "900604367",
                  "description": "The unique identifier for the store."
                }
              }
            }
          }
        ],
        "responses": {
          "200": { "description": "OK" },
          "400": { "description": "Bad Request" }
        }
      }
    },
    "/store/products_offer": {
      "post": {
        "summary": "produtos em oferta da loja",
        "description": "coletar a lista de produtos em oferta de uma loja",
        "parameters": [
          {
            "name": "body",
            "in": "body",
            "required": true,
            "schema": {
              "type": "object",
              "properties": {
                "store_id": {
                  "type": "number",
                  "example": "900604367",
                  "description": "id da loja"
                },
                "parent_store_type": {
                  "type": "string",
                  "example": "900604367",
                  "description": "geralmente market"
                },
                "store_type": {
                  "type": "string",
                  "example": "carrefour_hiper_super_market",
                  "description": "nome grande comprido"
                }
              }
            }
          }
        ],
        "responses": {
          "200": { "description": "OK" },
          "400": { "description": "Bad Request" },
          "404": { "description": "Not Found" }
        }
      }
    },
    "/store/globalSearchProducts": {
      "post": {
        "summary": "Busca global de produtos",
        "description": "essa rota é como se fosse buscar na barra de pesquisa do rappi (precisa das cooedenadas[longitude e latitude])",
        "parameters": [
          {
            "name": "body",
            "in": "body",
            "required": true,
            "schema": {
              "type": "object",
              "properties": {
                "query": {
                  "type": "string",
                  "example": "coca cola",
                  "description": "o que será pesquisado"
                },
                "lat": {
                  "type": "number",
                  "example": "-23.57247"
                },
                "lng": {
                  "type": "number",
                  "example": "-46.72526"
                }
              }
            }
          }
        ],
        "responses": {
          "200": { "description": "OK" },
          "400": { "description": "Bad Request" },
          "500": { "description": "Internal Server Error" }
        }
      }
    },
    "/store/searchLocations": {
      "post": {
        "summary": "buscar sugestões de localização",
        "description": "é como se fosse a barra de pesquisa de endereço do rappi e retorna os possíveis endereços",
        "parameters": [
          {
            "name": "body",
            "in": "body",
            "required": true,
            "schema": {
              "type": "object",
              "properties": {
                "query": {
                  "type": "string",
                  "example": "avenida paulista, 1000",
                  "description": "endereço"
                }
              }
            }
          }
        ],
        "responses": {
          "200": { "description": "OK" },
          "500": { "description": "Internal Server Error" }
        }
      }
    },
    "/store/getGeolocation": {
      "post": {
        "summary": "coletar geolocalização por placeID retornado da api do rappi",
        "description": "esse endpoint retorna o endereço e latitude e longitude",
        "parameters": [
          {
            "name": "body",
            "in": "body",
            "required": true,
            "schema": {
              "type": "object",
              "properties": {
                "place_id": {
                  "type": "string",
                  "example": "AQAAAGIAiagpvE8inMMC83Vu7VxBzKX35urJIyML8D8W8xIO7YLD_smOHy9P6NR5KhO1AkaU1IAm0YDngxWl5FA9MqAWyfUfAE28eAimqPbNOC7xbdUVItCXhdskWHuBxEsYSDxTkBMzp4VE3V_MJx-UOcE6IbicKZVLxTrrYGEutlHVehfZvw"                }
              }
            }
          }
        ],
        "responses": {
          "200": { "description": "OK" },
          "400": { "description": "Bad Request" }
        }
      }
    },
    "/store/getStoresByLocation": {
      "post": {
        "summary": "Find stores by location",
        "description": "Finds stores near a given latitude and longitude.",
        "parameters": [
          {
            "name": "body",
            "in": "body",
            "required": true,
            "schema": {
              "type": "object",
              "properties": {
                "lat": {
                  "type": "number",
                  "example": -23.5505,
                  "description": "Latitude of the location."
                },
                "lng": {
                  "type": "number",
                  "example": -46.6333,
                  "description": "Longitude of the location."
                }
              }
            }
          }
        ],
        "responses": {
          "200": { "description": "OK" },
          "500": { "description": "Internal Server Error" }
        }
      }
    },
    "/store/getSimilarOnAmazon": {
      "post": {
        "summary": "Find similar products on Amazon",
        "description": "Searches for similar products on Amazon based on a given product name.",
        "parameters": [
          {
            "name": "body",
            "in": "body",
            "required": true,
            "schema": {
              "type": "object",
              "properties": {
                "product_name": {
                  "type": "string",
                  "example": "iPhone 13",
                  "description": "Name of the product to search on Amazon."
                }
              }
            }
          }
        ],
        "responses": {
          "200": { "description": "OK" },
          "400": { "description": "Bad Request" }
        }
      }
    },
    "/store/clearDataBase": {
      "get": {
        "summary": "Clear database",
        "description": "Clears the database of stored data.",
        "responses": {
          "200": { "description": "OK" },
          "500": { "description": "Internal Server Error" }
        }
      }
    }
  }
}

  
  `]; // Adicione os caminhos corretos
export default routes;
