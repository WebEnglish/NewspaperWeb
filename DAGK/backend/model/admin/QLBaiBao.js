var db = require('../../utils/Database');

module.exports = {

  all: () => {
    return db.load('select * from baibao where Xoa = 0');
  },
  GetTTByID: (limit,offset) =>{
    return db.load(`select * from baibao bb , trangthai tt where bb.Xoa = 0 and bb.TrangThai = tt.idTrangThai and bb.TrangThai = tt.idTrangThai LIMIT ${limit} OFFSET ${offset}`);
  },
  countBB: () => {
    return db.load(`select COUNT(*) as total from baibao bb`)
  },

  update: entity => {
    return db.update('baibao', 'idBaiBao', entity);
  },
  GetSingleTT: id => {
    return db.load(`select * from baibao bb , trangthai tt, chuyenMuc cm, thanhvien tv where bb.Xoa = 0 and bb.TrangThai = tt.idTrangThai and bb.TrangThai = tt.idTrangThai and bb.idBaiBao = '${id}' and bb.ChuyenMuc = cm.idChuyenMuc and bb.TacGia = tv.idThanhVien`)
  },
  getidTVByTen: id => {
    return db.load('select * from thanhvien where HoTen Xoa = 0');
  }
}