import Axios from "../axios/axiosInstance";

export const getGeolocation = async ({ place_id }: { place_id: string }) => {
  try {
    const { data: location } = await Axios.get(
      `https://services.rappi.com.br/api/ms/address/place-details?placeid=${place_id}&source=locationservices&raw=false&strictbounds=true`
    );

    const filterLocation = {
      address: location.original_text,
      geolocation: {
        lat: location.location[0],
        lng: location.location[1],
      },
    };

    return filterLocation;
  } catch (err) {
    throw new Error(
      `[message: erro ao coletar a geolocation na api do rappi], [error: ${err}]`
    );
  }
};
