import { ISearchLocationsReturn } from "../interfaces/returns/ISearchLocations";

export const filterLocations = ({ locations }: { locations: any }) => {
  try {
    const _filterLocations: ISearchLocationsReturn = locations.map(
      ({ main_text, secondary_text, place_id, source }: any) => {
        const data = {
          address: main_text,
          secondary_address: secondary_text,
          place_id: place_id,
        };
        return data;
      }
    );
    return _filterLocations;
  } catch (err: any) {

    throw {
      message: "erro ao filtrar localizações recebidas da api",
      status: 503,
      error: err
    }

  }
};
