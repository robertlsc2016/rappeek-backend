export const filterStores = async ({ stores }: { stores: any }) => {
  const filteredStores = stores.map(
    ({
      store_id,
      name,
      store_type,
      image,
      sub_group,
      parent_store_type,
    }: any) => ({
      store_id,
      store_name: name,
      store_type: store_type,
      store_img: image,
      sub_group: sub_group,
      parent_store_type: parent_store_type,
    })
  );

  const groupMapping = {
    turbo: "turbo",
    mercados: "super",
    farmacias: "farmacia",
    presentes: "regalos",
    especializadas: "especializada",
    shopping: "hogar",
    bebidas: "licores",
    flores: "floristeria",
    express: "express",
  };

  const stores_by_group = Object.fromEntries(
    Object.entries(groupMapping).map(([key, value]) => [
      key,
      filteredStores.filter(
        (store: any) => store.sub_group.toLowerCase() === value
      ),
    ])
  );

  return stores_by_group;
};
