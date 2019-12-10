const server = 'http://coffee.gear.host/api';
export const API = {
  getAllProductByCategoryId(idCat) {
    return server + '/getCatProToppingByIdCat?idCat=' + idCat;
  },
  sendBill() {
    return server + '/addProductToBill';
  },
  getToppingByIdProduct(idProduct) {
    return server + './getProductToppingByIdPro?idProduct=' + idProduct;
  },
};
