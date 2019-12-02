const server = 'http://coffee.gear.host/api';
export const API = {
  getAllProductByCategoryId(idCat) {
    return server + '/getCatProByIdCat?idCat=' + idCat;
  },
};
