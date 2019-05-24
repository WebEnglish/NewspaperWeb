var db = require('../utils/Database');

module.exports = {
  all: () => {
    return db.load('SELECT TenBaiBao, cm.TenCM as tenchuyenmuc, NgayDang, AnhDaiDien FROM baibao as bb JOIN chuyenmuc as cm ON ChuyenMuc = cm.idChuyenMuc LIMIT 6 OFFSET 0');
  },

  menu: ()=> {
    return db.load(`select * from chuyenmuc where LoaiCM = 0`);
  },

  allByCat: id =>{
    return db.load(`SELECT cm.TenCM as TenChuyenMuc FROM chuyenmuc AS cm WHERE ChuyenMuc = ${id}`);
  }, 

  pageByCat: (idCM, limit, offset) => {
    return db.load(`SELECT bb.*, ( SELECT tv.Hoten FROM thanhvien AS tv WHERE bb.TacGia = tv.idThanhVien ) AS TenTacGia, cm.TenCM as TenChuyenMuc FROM baibao AS bb JOIN chuyenmuc AS cm ON bb.ChuyenMuc = cm.idChuyenMuc WHERE ChuyenMuc = ${idCM} limit ${limit} offset ${offset}`);
  },

  countByCat: idCM => {
    return db.load(`select count(*) as total from baibao where ChuyenMuc = ${idCM}`);
  },

  tag: idCM => {
    return db.load(`SELECT nt.tenTag FROM tag_chuyenmuc as tcm JOIN nhantag as nt on tcm.idTag = nt.idTag WHERE tcm.idChuyenMuc = ${idCM}`);
  }
}

