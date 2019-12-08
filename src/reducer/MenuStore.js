import {SAVE_MENU} from './../assets/type';

const status = {
  primary: 'primary',
  success: 'success',
  warning: 'warning',
  error: 'error',
};

const size = {
  Small: 'S',
  Medium: 'M',
  Large: 'L',
  Free: 'F',
};

function setInitStateForMenuItem(
  priceSmall,
  priceMedium,
  priceLarge,
  freePrice,
) {
  const extraStateMenuItem = {
    _sizeState: 'S',
    _sizeStatus: 'primary',
    _price: '',
    _soLuong: 0,
  };

  if (!!freePrice) {
    extraStateMenuItem._sizeState = size.Free;
    extraStateMenuItem._sizeStatus = status.success;
    extraStateMenuItem._price = freePrice;
  } else {
    if (!!priceSmall) {
      extraStateMenuItem._sizeState = 'S';
      extraStateMenuItem._sizeStatus = status.primary;
      extraStateMenuItem._price = priceSmall;
      console.log('Small');
    } else if (!!priceMedium) {
      extraStateMenuItem._sizeStatus = status.warning;
      extraStateMenuItem._sizeState = 'M';
      extraStateMenuItem._price = priceMedium;
      console.log('Medium');
    } else if (!!priceLarge) {
      console.log('Large');
      extraStateMenuItem._sizeState = 'L';
      extraStateMenuItem._sizeStatus = status.error;
      extraStateMenuItem._price = priceLarge;
    }
  }

  console.log('extraStateMenuItem', extraStateMenuItem);
  return extraStateMenuItem;
}
export default function MenuStore(state = {}, action) {
  const {type} = action;
  if (type === SAVE_MENU) {
    console.log('Save menu', 'action is ', action);

    const {data, Category} = action.dataJS;
    const menuList = data.map((value, index) => {
      const {
        NameProduct: name,
        PriceSmallProduct: priceSmall,
        PriceMediumProduct: priceMedium,
        PriceLargeProduct: priceLarge,
        imgProduct: imageSource,
        PriceProduct: freePrice,
        IdProduct: id,
        ToppingZone: Topping,
      } = value;

      const extraState = setInitStateForMenuItem(
        priceSmall,
        priceMedium,
        priceLarge,
        freePrice,
      );
      return Object.assign({}, value, extraState, {
        idCat: Category.IdCat,
        index: index,
      });
    });
    console.log('MENU LIST ', menuList);
    return menuList;
  }
  return state;
}
