var db = require('../../utils/Database');
module.exports = {
  all: () => {
    return db.load('select * from thanhvien where PhanHe = 1 and Xoa = 0');
  },
  allWriter: () => {
    return db.load('select * from thanhvien where PhanHe = 2 and Xoa = 0');
  },
  allEditor: () => {
    return db.load('select * from thanhvien where PhanHe = 3 and Xoa = 0');
  },

  add: entity => {
    return db.add('thanhvien', entity);
  },
  addWriter: entity => {
    return db.add('thanhvien', entity);
  },
  update: entity => {
    return db.update('thanhvien', 'idThanhVien', entity);
  },

  GetTKbyID: id => {
    return db.load(`select * from thanhvien where idThanhVien = '${id}' and Xoa = 0`)
  },
  allCMCap2: () => {
    return db.load('select * from chuyenmuc where LoaiCM != 0 and Xoa = 0');
  },
  getCMbyID: id => {
    return db.load(`select * from chuyenmuc where idChuyenMuc = '${id}'' and Xoa = 0`)
  }


}