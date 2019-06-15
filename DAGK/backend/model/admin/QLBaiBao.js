var db = require('../../utils/Database');

module.exports = {
    all: () => {
      return db.load('select * from baibao where Xoa = 0');
    },
    GetTTByID: () =>{
      return db.load(`select * from baibao bb , trangthai tt where bb.Xoa = 0 and bb.TrangThai = tt.idTrangThai and bb.TrangThai = tt.idTrangThai`);
    },
    update: entity => {
      return db.update('baibao', 'idBaiBao', entity);
    }
}