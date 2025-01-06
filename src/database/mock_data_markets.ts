const storesMock = [
  {
    name: "Turbo",
    route: "turbo",
    id_store: 900604367,
    preferred_order: 1,
    parent_store_type: "avocado_home",
    store_type: "turbo",
    type: "market",
    banner_url:
      "https://startse-uploader.s3.us-east-2.amazonaws.com/large_rappi_passo_atras_avancos_varejo_d3472fbd04.jpeg",
  },
  {
    name: "Carrefour",
    route: "carrefour",
    id_store: 900542505,
    preferred_order: 2,
    parent_store_type: "market",
    store_type: "carrefour_hiper_super_market",
    type: "market",
    banner_url:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS_2ABhb8jXr8Ad2CF0Qr6jkxWWZ6s9P6VVSw&s",
  },
  {
    name: "Barbosa",
    route: "barbosa",
    id_store: 900156624,
    preferred_order: 3,
    parent_store_type: "market",
    store_type: "barbosa_super",
    type: "market",
    banner_url:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR3cFnZ_W4G3PLXzddGHxCQY4bzM0lZ50G8fA&s",
  },
  {
    name: "Mercado Rappi",
    route: "mercado-rappi",
    parent_store_type: "market",
    store_type: "turbo_market_nc",
    preferred_order: 4,
    id_store: 900685612,
    type: "market",
    banner_url:
      "https://images.rappi.com.br/marketplace/store_type_1711981761076.jpg",
  },
  {
    name: "Pão de Açúcar",
    route: "pao-de-acucar",
    id_store: 900536162,
    parent_store_type: "market",
    store_type: "pao_de_azucar",
    type: "market",
    banner_url:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTcTl6OrE1EUtntSDrM_xGQ_i79qJdq5dBq9g&s",
  },
  {
    name: "Mambo",
    route: "mambo",
    id_store: 900020818,
    parent_store_type: "market",
    type: "market",
    store_type: "mambo",
    banner_url:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS0qgnY485Unq1_y7JpeIhcWfXiLhcOosAeeQ&s",
  },

  {
    name: "Extra",
    route: "extra",
    id_store: 900631973,
    parent_store_type: "market",
    store_type: "extra",
    type: "market",
    banner_url:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS0l1NnKquYKPuRzkEpz0Xv_JpVNgw6GiOjbw&s",
  },
  {
    name: "Violeta",
    route: "violeta",
    parent_store_type: "market",
    store_type: "violeta",
    type: "market",
    id_store: 900161175,
    banner_url: "https://www.violetaexpress.com.br/assets/img/header-logo.png",
  },

  {
    name: "Carrefour Market",
    route: "carrefour-market",
    parent_store_type: "market",
    store_type: "carrefour_bairro_super_market",
    id_store: 900306752,
    type: "market",
    banner_url:
      "https://static-cms.carrefour.fr/sites/default/files/2024-06/market_0.png?itok=SC5Z72U4",
  },
  {
    name: "Big By Carrefour",
    route: "big-carrefour",
    parent_store_type: "market",
    store_type: "carrefour_big_hiper_nc",
    id_store: 900631031,
    type: "market",
    banner_url:
      "https://static.ifood-static.com.br/image/upload/t_high/logosgde/e6094554-efb1-408a-bf50-876153c5dff3/202303271208_m04c_i.jpg",
  },

  {
    name: "Pão de Açúcar Fresh",
    route: "pao-de-acucar-fresh",
    parent_store_type: "market",
    store_type: "pao_de_azucar_superfresh_nc",
    type: "market",
    id_store: 900652960,
    banner_url:
      "https://images.rappi.com.br/marketplace/store_type_1725550091733.png",
  },
  {
    name: "Droga Raia",
    route: "droga raia",
    parent_store_type: "market",
    store_type: "raia_market_cash_nc",
    id_store: 900665408,
    type: "drugstore",
    banner_url:
      "https://iguatemi.com.br/saopaulo/sites/saopaulo/files/2019-10/DrogaRaia.png",
  },
  {
    name: "Pague Menos",
    route: "pague-menos",
    parent_store_type: "market",
    store_type: "pague_menos",
    type: "drugstore",
    id_store: 900655314,
    banner_url:
      "https://upload.wikimedia.org/wikipedia/commons/5/5a/Logo_Farm%C3%A1cias_Pague_Menos.png",
  },
  {
    name: "Drogaria São Paulo",
    route: "drogaria-sao-paulo",
    parent_store_type: "market",
    store_type: "sao_paulo_market",
    type: "drugstore",
    id_store: 900655895,
    banner_url:
      "https://www.cidademarketing.com.br/marketing/wp-content/uploads/2023/01/drogaria_saopaulo.jpg",
  },
  {
    name: "Panvel",
    route: "panvel",
    parent_store_type: "farmacia",
    store_type: "panvel",
    type: "drugstore",
    id_store: 900023920,
    banner_url:
      "https://cdn1.staticpanvel.com.br/cdn_service/svg/logo-panvel.png",
  },
  {
    name: "Promofarma",
    route: "promofarma",
    parent_store_type: "market",
    store_type: "sao_paulo_market",
    type: "drugstore",
    id_store: 900127380,
    banner_url:
      "https://images.rappi.com.br/marketplace/store_type_1726250032111.jpg",
  },
  {
    name: "MuiltiCoisas",
    route: "multicoisas",
    parent_store_type: "rappimall_parent",
    store_type: "multicoisas",
    type: "shopping",
    id_store: 900062430,
    banner_url:
      "https://www.multicoisas.com.br/on/demandware.static/-/Library-Sites-RefArchSharedLibrary/default/dw2786a66d/2009.jpg",
  },
  {
    name: "Lojas Mel",
    route: "lojas-mel",
    parent_store_type: "rappimall_parent",
    store_type: "lojasmel_ecomm_enc",
    type: "shopping",
    id_store: 900702315,
    banner_url:
      "https://mms.img.susercontent.com/fca877bc017049b2da4a26e6bae53d9f",
  },
  {
    name: "Kalunga",
    route: "kalunga",
    parent_store_type: "rappimall_parent",
    store_type: "kalunga_tecnologia_enc",
    type: "shopping",
    id_store: 900674942,
    banner_url:
      "https://iguatemi.com.br/brasilia/sites/brasilia/files/2020-01/Kalunga_logo.png",
  },
];

export default storesMock;
