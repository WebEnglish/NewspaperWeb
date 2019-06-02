var db = require('../utils/Database');

module.exports = {
  all: () => {
    return db.load('SELECT TenBaiBao, cm.TenCM as tenchuyenmuc, NgayDang, AnhDaiDien FROM baibao as bb JOIN chuyenmuc as cm ON ChuyenMuc = cm.idChuyenMuc LIMIT 3 OFFSET 0');
  },

  menu: () => {
    // return db.load(`select * from chuyenmuc where LoaiCM = 0`);
    return db.load(`SELECT bang1.idChuyenMuc as idcon1, bang1.TenCM as con1, bang2.TenCM AS con2, bang2.idChuyenMuc AS idcon2,bang2.LoaiCM, cm3.TenCM FROM (SELECT TenCM, LoaiCM, idChuyenMuc FROM chuyenmuc WHERE LoaiCM != 0 GROUP BY LoaiCM) AS bang1, (SELECT cm.TenCM, cm.LoaiCM, cm.idChuyenMuc FROM chuyenmuc as cm WHERE cm.LoaiCM != 0) as bang2, chuyenmuc as cm3 WHERE bang2.TenCM != bang1.TenCM AND bang1.LoaiCM = bang2.LoaiCM AND bang2.LoaiCM = cm3.idChuyenMuc`);
  },

  // dropdown: () => {
  //   return db.load(`SELECT bang1.idChuyenMuc, bang1.TenCM, bang2.TenCM, bang2.idChuyenMuc FROM (SELECT TenCM, LoaiCM, idChuyenMuc FROM chuyenmuc WHERE LoaiCM != 0 GROUP BY LoaiCM) AS bang1, (SELECT cm.TenCM, cm.LoaiCM, cm.idChuyenMuc FROM chuyenmuc as cm WHERE cm.LoaiCM != 0) as bang2 WHERE bang2.TenCM != bang1.TenCM AND bang1.LoaiCM = bang2.LoaiCM`);
  // },

  allByCat: id => {
    return db.load(`SELECT DISTINCT cm.TenCM as TenChuyenMuc FROM chuyenmuc AS cm JOIN baibao as bb ON bb.ChuyenMuc = cm.idChuyenMuc WHERE ChuyenMuc =  ${id}`);
  },

  pageByCat: (idCM, limit, offset) => {
    return db.load(`SELECT bb.*, ( SELECT tv.Hoten FROM thanhvien AS tv WHERE bb.TacGia = tv.idThanhVien ) AS TenTacGia, cm.TenCM as TenChuyenMuc FROM baibao AS bb JOIN chuyenmuc AS cm ON bb.ChuyenMuc = cm.idChuyenMuc WHERE ChuyenMuc = ${idCM} limit ${limit} offset ${offset}`);
  },

  countByCat: idCM => {
    return db.load(`select count(*) as total from baibao where ChuyenMuc = ${idCM}`);
  },

  tag: idCM => {
    return db.load(`SELECT nt.tenTag FROM tag_chuyenmuc as tcm JOIN nhantag as nt on tcm.idTag = nt.idTag WHERE tcm.idChuyenMuc = ${idCM}`);
  },

  // carousel: () => {
  //   return db.load(`SELECT * FROM baibao ORDER BY luotXem DESC LIMIT 3`);
  // },

  t10mostview: () => {
    return db.load(`SELECT bb.*, cm.tenCM FROM baibao as bb JOIN chuyenmuc as cm ON bb.ChuyenMuc = cm.idChuyenMuc ORDER BY bb.luotxem DESC LIMIT 10`);
  },

  newest: () => {
    return db.load(`SELECT bb.*, cm.tenCM FROM baibao as bb JOIN chuyenmuc as cm ON bb.ChuyenMuc = cm.idChuyenMuc ORDER BY bb.ngaydang DESC LIMIT 10`);
  },

  mostandnewest: () => {

  }, 

  newsdetail: (idBB) => {
    return db.load(`SELECT bb.*, cm.TenCM, tv.HoTen FROM baibao as bb, chuyenmuc as cm, thanhvien AS tv WHERE bb.idBaiBao= ${idBB} AND cm.idChuyenMuc = bb.ChuyenMuc AND tv.idThanhVien = bb.TacGia`);
  }
}


