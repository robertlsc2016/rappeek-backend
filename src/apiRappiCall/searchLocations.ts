import Axios from "../axios/axiosInstance";

export const searchLocations = async ({ query }: { query: string }) => {
  try {
    const { data: locations } = await Axios.get(
      `https://services.rappi.com.br/api/ms/address/autocomplete?lat=0&lng=0&text=${query}&source=locationservices`
    );

    return locations;
  } catch (err: any) {
    throw new Error(
      `[message: erro ao se comunicar com a api de rappi para busca de localizações] [erro: ${err}]`
    );
  }
};
