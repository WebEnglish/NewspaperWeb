
var db = require('../utils/Database');

module.exports = {
  all: () => {
    return db.load('select * from thanhvien');
  },

  

  single: id => {
    return db.load(`select * from thanhvien where idThanhVien = ${id}`);
  },

  singleByUserName: email => {
    return db.load(`select * from thanhvien where Email = '${email}' and Xoa = 0`);
  },

  add: entity => {
    return db.add('thanhvien', entity);
  },

  update: entity => {
    var id = entity.idThanhVien;
    delete entity.idThanhVien;
    return db.update('thanhvien', 'idThanhVien', entity, id);
  },
  updatetk: entity => {
    return db.update('thanhvien', 'idThanhVien', entity);
  },
  delete: id => {
    return db.delete('thanhvien', 'idThanhVien', id);
  },

};
