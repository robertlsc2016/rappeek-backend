import Axios from "../axios/axiosInstance";

export const searchLocations = async ({ query }: { query: string }) => {
  try {
    const { data: locations } = await Axios.get(
      `https://services.rappi.com.br/api/ms/address/autocomplete?lat=0&lng=0&text=${query}&source=locationservices`
    );

    return locations;
  } catch (err) {
    throw new Error("erro ao buscar localizacoes: ${err}");
  }
};
