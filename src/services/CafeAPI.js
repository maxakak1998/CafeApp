const getTableDetail = () => {
  const tables = [
    [
      {soBan: 1, tinhTrang: 'Trống'},
      {soBan: 2, tinhTrang: 'Đang sử dụng'},
      {soBan: 3, tinhTrang: 'Trống'},
      {soBan: 4, tinhTrang: 'Trống'},
      {soBan: 5, tinhTrang: 'Đã đặt', GhiChu: '17h50'},
      {soBan: 6, tinhTrang: 'Trống'},
      {soBan: 7, tinhTrang: 'Đang sử dụng'},
      {soBan: 8, tinhTrang: 'Trống'},
      {soBan: 9, tinhTrang: 'Trống'},
      {soBan: 10, tinhTrang: 'Đang sử dụng'},
    ],
    [
      {soBan: 11, tinhTrang: 'Đã đặt'},
      {soBan: 12, tinhTrang: 'Trống'},
      {soBan: 13, tinhTrang: 'Đã đặt', GhiChu: '7h20'},
      {soBan: 14, tinhTrang: 'Đã đặt'},
      {soBan: 15, tinhTrang: 'Trống'},
      {soBan: 16, tinhTrang: 'Đang sử dụng'},
      {soBan: 17, tinhTrang: 'Đang sử dụng'},
      {soBan: 18, tinhTrang: 'Đã đặt', GhiChu: '19h45'},
      {soBan: 19, tinhTrang: 'Đã đặt', GhiChu: '13h'},
    ],
  ];
  return tables;
};

const getCafeInfo = () => {
  const cafeInfo = {ten: '', diaChi: '', soLuongLau: 2};
  return cafeInfo;
};
const CafeAPI = {
  getTableDetail: getTableDetail,
  getCafeInfo: getCafeInfo,
};

export default CafeAPI;
