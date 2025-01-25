import { IConfigs } from "../interfaces/IConfigs";
import { StoreService } from "../services/storeService";
import db from "../createDatabase";

/**
 * Filtra os novos produtos da loja, comparando os produtos atuais com os dados no banco de dados.
 * @param configs - Configurações contendo informações da loja.
 */
export const filterNewProducts = async ({ configs }: { configs: IConfigs }) => {
  const storeId = configs.stores[0];

  const newProductsFromDb = await getNewProducts(storeId);
  console.log(newProductsFromDb);

  const liveProductsStore = await StoreService.getAllStoreProductOffers({
    configs,
    onlyRead: true,
    firstRequestDay: false,
  });

  // Obtém os produtos antigos armazenados no banco
  const oldProducts = await getOldProducts(storeId);

  if (oldProducts.length === 0) {
    await updateNewProducts(storeId, []);
    return createResponse(storeId, []);
  }

  // Produtos únicos: presentes em liveProductsStore.all, mas não em oldProducts
  const uniqueProducts = liveProductsStore.all.filter(
    (product: any) =>
      !oldProducts.some((oldProduct: any) =>
        isProductEqual(oldProduct, product)
      )
  );

  // Combina produtos únicos com aqueles já armazenados no banco, evitando duplicados
  const combinedProducts = uniqueProducts.filter(
    (product: any) =>
      !newProductsFromDb.some((newProduct: any) =>
        isProductEqual(newProduct, product)
      )
  );

  await updateNewProducts(storeId, combinedProducts);

  if (combinedProducts.length === 0) {
    await updateNewProducts(storeId, []);
    return createResponse(storeId, []);
  }

  return createResponse(
    storeId,
    combinedProducts,
    newProductsFromDb.created_at
  );
};

/**
 * Verifica se dois produtos são iguais com base em suas propriedades principais.
 * @param product1 - Primeiro produto para comparar.
 * @param product2 - Segundo produto para comparar.
 * @returns Verdadeiro se os produtos forem iguais.
 */
const isProductEqual = (product1: any, product2: any): boolean => {
  return product1.id === product2.id && product1.price === product2.price;
};

/**
 * Obtém os produtos antigos do banco de dados.
 * @param storeId - ID da loja.
 * @returns Lista de produtos antigos.
 */
const getOldProducts = (storeId: number) => {
  const stmt = db.prepare(`SELECT * FROM storeProducts WHERE store_id = ?`);
  const result: any = stmt.get(storeId);
  return result?.array_products_string
    ? JSON.parse(result.array_products_string)
    : [];
};

/**
 * Obtém os novos produtos do banco de dados.
 * @param storeId - ID da loja.
 * @returns Lista de novos produtos.
 */
const getNewProducts = (storeId: number) => {
  const stmt = db.prepare("SELECT * FROM newProductsStore WHERE store_id = ?");
  const result: any = stmt.get(storeId);
  return result;
};

/**
 * Atualiza os novos produtos no banco de dados.
 * @param storeId - ID da loja.
 * @param products - Lista de produtos para atualizar.
 */
const updateNewProducts = async (storeId: number, products: any[]) => {
  const stmt = db.prepare(
    "INSERT OR REPLACE INTO newProductsStore (store_id, array_products_string) VALUES (?, ?)"
  );
  return stmt.run(storeId, JSON.stringify(products, null, 0));
};

/**
 * Cria a resposta para a função principal.
 * @param storeId - ID da loja.
 * @param products - Lista de produtos.
 * @param createdAt - Data de criação (opcional).
 * @returns Objeto de resposta.
 */
const createResponse = (storeId: number, products: any[], createdAt?: Date) => {
  return {
    store_id: storeId,
    created_at: createdAt || new Date(),
    products,
  };
};
