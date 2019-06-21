var db = require('../utils/Database');

module.exports = {
  menu: () => {
    return db.load(`SELECT * FROM trangthai`);
  },

  category: () => {
    return db.load(`SELECT * from chuyenmuc AS cm WHERE cm.LoaiCM != 0 and cm.Xoa = 0`);
  },

  tag: () => {
    return db.load(`SELECT * from nhantag where Xoa = 0`);
  },

  addNews: entity => {
    return db.add(`baibao`,entity);
  },

  status: (idTT) => {
    return db.load(`SELECT * FROM trangthai AS tt WHERE tt.idTrangThai = ${idTT}`);
  },

  baiviet: (idTT, idTG, limit, offset) => {
    return db.load(`SELECT tt.tenTrangThai as trangthai, bb.*, cm.TenCM FROM baibao AS bb, chuyenmuc as cm, trangthai as tt WHERE bb.TrangThai = ${idTT} AND bb.TacGia = ${idTG} AND tt.idTrangThai = bb.TrangThai AND cm.idChuyenMuc = bb.ChuyenMuc ORDER BY bb.NgayDang DESC limit ${limit} offset ${offset}`)
  },

  countByCat: idTT => {
    return db.load(`select count(*) as total from baibao where TrangThai = ${idTT}`);
  },

  rewrite: idBB => {
    return db.load(`SELECT bb.*, cm.TenCM FROM baibao AS bb, chuyenmuc AS cm WHERE bb.idBaiBao=${idBB} AND bb.ChuyenMuc = cm.idChuyenMuc`);
  },

  update: entity =>{
    return db.update('baibao', 'idBaiBao', entity);
  },

  addTag: entity => {
    return db.add(`tag_baibao`,entity);
  },
  updateTagBB: entity =>{
    return db.update('tag_baibao','idBaiBao', entity);
  },
  listTagById: id => {
    return db.load(`SELECT * FROM tag_baibao tbb, nhantag nt WHERE tbb.idTag = nt.idTag and tbb.idBaiBao = '${id}'`);
  },
  delete: id => {
    return db.delete('tag_baibao', 'idBaiBao', id);
  },

}