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
    return db.load(`SELECT bb.*, ( SELECT tv.Hoten FROM thanhvien AS tv WHERE bb.TacGia = tv.idThanhVien ) AS TenTacGia, cm.TenCM as TenChuyenMuc FROM baibao AS bb JOIN chuyenmuc AS cm ON bb.ChuyenMuc = cm.idChuyenMuc WHERE ChuyenMuc = ${idCM} ORDER BY bb.NgayDang DESC limit ${limit} offset ${offset}`);
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

  topCat: () => {
    return db.load(`SELECT DISTINCT cm.TenCM, cm.idChuyenMuc FROM baibao as bb, chuyenmuc AS cm WHERE bb.ChuyenMuc = cm.idChuyenMuc ORDER BY bb.luotXem DESC LIMIT 10`);
  }, 

  top1view: () => {
    return db.load(`SELECT bb.*, cm.tenCM FROM baibao as bb JOIN chuyenmuc as cm ON bb.ChuyenMuc = cm.idChuyenMuc ORDER BY bb.luotxem DESC LIMIT 1`)
  },

  newsdetail: (idBB) => {
    return db.load(`SELECT bb.*, cm.TenCM, tv.HoTen FROM baibao as bb, chuyenmuc as cm, thanhvien AS tv WHERE bb.idBaiBao= ${idBB} AND cm.idChuyenMuc = bb.ChuyenMuc AND tv.idThanhVien = bb.TacGia`);
  },

  newstag: (idBB) => {
    return db.load(`SELECT tag.tenTag, bb.TenBaiBao, bb.ChuyenMuc, cm.TenCM FROM tag_baibao AS tbb, nhantag AS tag, baibao as bb, chuyenmuc AS cm WHERE bb.idBaiBao = ${idBB} AND bb.idBaiBao = tbb.idBaiBao AND tbb.idTag = tag.idTag AND bb.ChuyenMuc = cm.idChuyenMuc`);
  }, 

  comment: (idBB) => {
    return db.load(`SELECT bl.*, tv.HoTen FROM binhluan AS bl, thanhvien AS tv, baibao AS bb WHERE bb.idBaiBao = ${idBB} AND bb.idBaiBao = bl.BaiBao AND bl.NguoiBL = tv.idThanhVien`);
  },

  relate: (idBB) => {
    return db.load(`SELECT bb2.* FROM baibao AS bb1, baibao AS bb2 WHERE bb1.ChuyenMuc = bb2.ChuyenMuc AND bb1.idBaiBao = ${idBB} AND bb1.idBaiBao != bb2.idBaiBao ORDER BY bb2.NgayDang DESC LIMIT 5 OFFSET 0`);
  },

  addComment: entity => {
    return db.add(`binhluan`,entity);
  }
}


