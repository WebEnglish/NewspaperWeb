var db = require('../../utils/Database');

module.exports = {
    all: () => {
      return db.load('select * from chuyenmuc');
    },
  
    single: id => {
      return db.load(`select * from chuyenmuc where idChuyenMuc = ${id}`);
    },

    CMCap: () => {
        return db.load(`select * from chuyenmuc where Xoa = 0 `);
    },
  
    singleByUserName: LoaiCM => {
      return db.load(`select * from chuyenmuc where LoaiCM = '${LoaiCM}'`);
    },
  
    add: entity => {
      return db.add('chuyenmuc', entity);
    },
  
    update: entity => {
      return db.update('chuyenmuc', 'idChuyenMuc',entity);
    },
  
    delete: id => {
      return db.delete('chuyenMuc', 'idChuyenMuc', id);
    }
};