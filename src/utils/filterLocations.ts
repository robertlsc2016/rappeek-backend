export const filterLocations = async ({ locations }: { locations: any }) => {
  console.log(locations);

  const _filterLocations = locations.map(
    ({ main_text, secondary_text, place_id, source }: any) => {
      const data = {
        address: main_text,
        secondary_address: secondary_text,
        place_id: place_id,
        source: source,
      };
      return data;
    }
  );
  return _filterLocations;
};
