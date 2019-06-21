var db = require('../utils/Database');

module.exports = {
  updateBaiBao: entity => {
    return db.update('baibao', 'idBaiBao', entity);
  },
  getAllBaiBao:() => {
    return db.load('SELECT * from baibao where Xoa = 0');
  },
  all: () => {
    return db.load('SELECT bb.*, cm.TenCM as tenchuyenmuc FROM baibao as bb JOIN chuyenmuc as cm ON ChuyenMuc = cm.idChuyenMuc where bb.Xoa=0 and bb.premium = 0 ORDER BY bb.luotXem DESC LIMIT 3 OFFSET 0');
  },

  menu: () => {
    // return db.load(`select * from chuyenmuc where LoaiCM = 0`);
    return db.load(`SELECT bang1.idChuyenMuc as idcon1, bang1.TenCM as con1, bang2.TenCM AS con2, bang2.idChuyenMuc AS idcon2,bang2.LoaiCM, cm3.TenCM FROM (SELECT TenCM, LoaiCM, idChuyenMuc FROM chuyenmuc WHERE LoaiCM != 0 AND Xoa = 0 GROUP BY LoaiCM) AS bang1, (SELECT cm.TenCM, cm.LoaiCM, cm.idChuyenMuc FROM chuyenmuc as cm WHERE cm.LoaiCM != 0 AND cm.Xoa = 0) as bang2, chuyenmuc as cm3 WHERE bang2.TenCM != bang1.TenCM AND bang1.LoaiCM = bang2.LoaiCM AND bang2.LoaiCM = cm3.idChuyenMuc`);
  },

  // dropdown: () => {
  //   return db.load(`SELECT bang1.idChuyenMuc, bang1.TenCM, bang2.TenCM, bang2.idChuyenMuc FROM (SELECT TenCM, LoaiCM, idChuyenMuc FROM chuyenmuc WHERE LoaiCM != 0 GROUP BY LoaiCM) AS bang1, (SELECT cm.TenCM, cm.LoaiCM, cm.idChuyenMuc FROM chuyenmuc as cm WHERE cm.LoaiCM != 0) as bang2 WHERE bang2.TenCM != bang1.TenCM AND bang1.LoaiCM = bang2.LoaiCM`);
  // },

  allByCat: id => {
    return db.load(`SELECT DISTINCT cm.TenCM as TenChuyenMuc FROM chuyenmuc AS cm JOIN baibao as bb ON bb.ChuyenMuc = cm.idChuyenMuc WHERE bb.ChuyenMuc =  ${id} AND bb.Xoa =0 AND cm.Xoa =0`);
  },

  pageByCat: (idCM, limit, offset) => {
    return db.load(`SELECT bb.*, ( SELECT tv.ButDanh FROM thanhvien AS tv WHERE bb.TacGia = tv.idThanhVien ) as ButDanh, cm.TenCM as TenChuyenMuc FROM baibao AS bb JOIN chuyenmuc AS cm ON bb.ChuyenMuc = cm.idChuyenMuc WHERE bb.ChuyenMuc = ${idCM} AND bb.TrangThai = 1 AND bb.Xoa=0 AND cm.Xoa=0 AND bb.Premium=0 ORDER BY bb.NgayDang DESC limit ${limit} offset ${offset}`);
  },

  pageByCat2: (idCM, limit, offset) => {
    return db.load(`SELECT bb.*, ( SELECT tv.ButDanh FROM thanhvien AS tv WHERE bb.TacGia = tv.idThanhVien ) as ButDanh, cm.TenCM as TenChuyenMuc FROM baibao AS bb JOIN chuyenmuc AS cm ON bb.ChuyenMuc = cm.idChuyenMuc WHERE bb.ChuyenMuc = ${idCM} AND bb.TrangThai = 1 AND bb.Xoa=0 AND cm.Xoa=0 ORDER BY bb.Premium DESC limit ${limit} offset ${offset} `);
  },

  countByCat: idCM => {
    return db.load(`select count(*) as total from baibao where ChuyenMuc = ${idCM} AND Xoa =0 AND Premium =0`);
  },
  countByCatnoPre: idCM => {
    return db.load(`select count(*) as total from baibao where ChuyenMuc = ${idCM} AND Xoa =0`);
  },

  tag: idCM => {
    return db.load(`SELECT nt.* FROM tag_chuyenmuc as tcm JOIN nhantag as nt on tcm.idTag = nt.idTag WHERE tcm.idChuyenMuc = ${idCM} AND nt.Xoa=0`);
  },

  byTag: (idTag, limit, offset) => {
    return db.load(`SELECT bb.*, nt.*, tv.HoTen, tv.ButDanh, cm.TenCM FROM tag_baibao as tbb, nhantag as nt, baibao AS bb, thanhvien AS tv, chuyenmuc as cm WHERE tbb.idTag = ${idTag} AND tbb.idBaiBao = bb.idBaiBao AND tbb.idTag = nt.idTag AND tv.idThanhVien = bb.TacGia AND bb.ChuyenMuc=cm.idChuyenMuc AND cm.Xoa=0 AND bb.Xoa =0 AND nt.Xoa =0 AND bb.TrangThai =1 AND bb.Premium =0 ORDER BY bb.NgayDang DESC LIMIT ${limit} OFFSET ${offset}`)
  },

  byTag2: (idTag, limit, offset) => {
    return db.load(`SELECT bb.*, nt.*, tv.HoTen, tv.ButDanh, cm.TenCM FROM tag_baibao as tbb, nhantag as nt, baibao AS bb, thanhvien AS tv, chuyenmuc as cm WHERE tbb.idTag = ${idTag} AND tbb.idBaiBao = bb.idBaiBao AND tbb.idTag = nt.idTag AND tv.idThanhVien = bb.TacGia AND bb.ChuyenMuc=cm.idChuyenMuc AND cm.Xoa=0 AND bb.Xoa =0 AND nt.Xoa =0 AND bb.TrangThai =1 ORDER BY bb.Premium DESC LIMIT ${limit} OFFSET ${offset}`)
  },

  tagByTag: idTag => {
    return db.load(`SELECT DISTINCT tbb.idTag, nt.tenTag FROM tag_baibao AS tbb, nhantag as nt WHERE tbb.idTag = ${idTag} AND nt.idTag = tbb.idTag AND nt.Xoa =0`)
  },

  countByTag: idTag => {
    return db.load(`SELECT count(*) as total FROM tag_baibao as tbb JOIN baibao AS bb ON bb.idBaiBao = tbb.idBaiBao WHERE tbb.idTag =  ${idTag} AND bb.Premium = 0`)
  },

  countByTag2: idTag => {
    return db.load(`SELECT COUNT(*) AS total FROM tag_baibao as tbb WHERE tbb.idTag = ${idTag}`)
  },

  t10mostview: () => {
    return db.load(`SELECT bb.*, cm.tenCM FROM baibao as bb JOIN chuyenmuc as cm ON bb.ChuyenMuc = cm.idChuyenMuc WHERE bb.TrangThai =1 AND bb.Xoa =0 AND cm.Xoa=0 AND bb.Premium = 0 ORDER BY bb.luotxem DESC LIMIT 10`);
  },

  newest: () => {
    return db.load(`SELECT bb.*, cm.tenCM FROM baibao as bb JOIN chuyenmuc as cm ON bb.ChuyenMuc = cm.idChuyenMuc WHERE bb.TrangThai =1 AND bb.Xoa =0 AND cm.Xoa=0 AND bb.Premium = 0 ORDER BY bb.ngaydang DESC LIMIT 10`);
  },

  topCat: () => {
    return db.load(`SELECT bb.*, cm.TenCM, tv.HoTen FROM baibao AS bb, chuyenmuc AS cm, thanhvien AS tv WHERE bb.ChuyenMuc = cm.idChuyenMuc AND bb.TacGia = tv.idThanhVien AND bb.Premium = 0 AND bb.TrangThai =1 AND bb.Xoa =0 GROUP BY bb.ChuyenMuc HAVING MAX(bb.NgayDang) ORDER BY bb.luotXem DESC LIMIT 10`);
  },

  t10mostview2: () => {
    return db.load(`SELECT bb.*, cm.tenCM FROM baibao as bb JOIN chuyenmuc as cm ON bb.ChuyenMuc = cm.idChuyenMuc WHERE bb.TrangThai =1 AND bb.Xoa =0 AND cm.Xoa=0 ORDER BY bb.luotxem DESC LIMIT 10`);
  },

  newest2: () => {
    return db.load(`SELECT bb.*, cm.tenCM FROM baibao as bb JOIN chuyenmuc as cm ON bb.ChuyenMuc = cm.idChuyenMuc WHERE bb.TrangThai =1 AND bb.Xoa =0 AND cm.Xoa=0 ORDER BY bb.ngaydang DESC LIMIT 10`);
  },

  topCat2: () => {
    return db.load(`SELECT bb.*, cm.TenCM, tv.HoTen FROM baibao AS bb, chuyenmuc AS cm, thanhvien AS tv WHERE bb.ChuyenMuc = cm.idChuyenMuc AND bb.TacGia = tv.idThanhVien AND bb.TrangThai =1 AND bb.Xoa =0 GROUP BY bb.ChuyenMuc HAVING MAX(bb.NgayDang) ORDER BY bb.luotXem DESC LIMIT 10`);
  },

  top1view: () => {
    return db.load(`SELECT bb.*, cm.tenCM FROM baibao as bb JOIN chuyenmuc as cm ON bb.ChuyenMuc = cm.idChuyenMuc WHERE bb.TrangThai =1 AND bb.Xoa =0 AND cm.Xoa=0 ORDER BY bb.luotxem DESC LIMIT 1`)
  },

  newsdetail: (idBB) => {
    return db.load(`SELECT bb.*, cm.TenCM, tv.HoTen, tv.ButDanh FROM baibao as bb, chuyenmuc as cm, thanhvien AS tv WHERE bb.idBaiBao= ${idBB} AND cm.idChuyenMuc = bb.ChuyenMuc AND tv.idThanhVien = bb.TacGia AND bb.Xoa = 0`);
  },

  newstag: (idBB) => {
    return db.load(`SELECT tag.tenTag, bb.TenBaiBao, bb.ChuyenMuc, cm.TenCM FROM tag_baibao AS tbb, nhantag AS tag, baibao as bb, chuyenmuc AS cm WHERE bb.idBaiBao = ${idBB} AND bb.idBaiBao = tbb.idBaiBao AND tbb.idTag = tag.idTag AND bb.ChuyenMuc = cm.idChuyenMuc AND bb.TrangThai =1`);
  },

  comment: (idBB) => {
    return db.load(`SELECT bl.*, tv.HoTen FROM binhluan AS bl, thanhvien AS tv, baibao AS bb WHERE bb.idBaiBao = ${idBB} AND bb.idBaiBao = bl.BaiBao AND bl.NguoiBL = tv.idThanhVien AND bb.TrangThai =1`);
  },

  relate: (idBB) => {
    return db.load(`SELECT bb2.* FROM baibao AS bb1, baibao AS bb2 WHERE bb1.ChuyenMuc = bb2.ChuyenMuc AND bb2.Premium =0 AND bb1.idBaiBao = ${idBB} AND bb1.idBaiBao != bb2.idBaiBao AND bb2.TrangThai =1 ORDER BY bb2.NgayDang DESC LIMIT 5 OFFSET 0`);
  },
  relate2: (idBB) => {
    return db.load(`SELECT bb2.* FROM baibao AS bb1, baibao AS bb2 WHERE bb1.ChuyenMuc = bb2.ChuyenMuc AND bb1.idBaiBao = ${idBB} AND bb1.idBaiBao != bb2.idBaiBao AND bb2.TrangThai =1 ORDER BY bb2.Premium DESC LIMIT 5 OFFSET 0`);
  },

  addComment: entity => {
    return db.add(`binhluan`, entity);
  },

  searchKTK: (word, limit, offset) =>{
    return db.load(`select bb.*, cm.*, tv.* from baibao bb , chuyenmuc cm, thanhvien as tv where bb.TacGia = tv.idThanhVien AND bb.Premium = 0 and bb.Xoa =0 and bb.Chuyenmuc = cm.idChuyenmuc and bb.TrangThai = 1 and (bb.TenBaiBao like "%${word}%" or cm.TenCM like "%${word}%" or bb.NoiDung like "%${word}%" or bb.NoiDungTomTat like "%${word}%") group by idbaibao order by bb.NgayXuatBan DESC LIMIT ${limit} OFFSET ${offset}`)
  },
  searchCTK: (word, limit, offset) =>{
    return db.load(`select bb.*, cm.*, tv.* from baibao bb , chuyenmuc cm, thanhvien as tv where bb.TacGia = tv.idThanhVien AND bb.Chuyenmuc = cm.idChuyenmuc and bb.Xoa =0 and bb.TrangThai = 1 and (bb.TenBaiBao like "%${word}%" or cm.TenCM like "%${word}%" or bb.NoiDung like "%${word}%" or bb.NoiDungTomTat like "%${word}%") group by idbaibao order by  bb.Premium DESC  LIMIT ${limit} OFFSET ${offset}`)
  },

  countsearchKTK: (word) =>{
    return db.load(`Select count(*) as total from (select bb.idBaiBao from baibao bb , chuyenmuc cm, thanhvien as tv where bb.TacGia = tv.idThanhVien AND bb.Premium = 0 and bb.Xoa =0 and bb.Chuyenmuc = cm.idChuyenmuc and bb.TrangThai = 1 and (bb.TenBaiBao like "%${word}%" or cm.TenCM like "%${word}%" or bb.NoiDung like "%${word}%" or bb.NoiDungTomTat like "%${word}%") group by idbaibao order by bb.NgayXuatBan DESC) as bang1 `)
  },
  countsearchCTK: (word) =>{
    return db.load(`select count(*) as total from (select bb.idBaiBao from baibao bb , chuyenmuc cm, thanhvien as tv where bb.TacGia = tv.idThanhVien and bb.Xoa =0 AND  bb.Chuyenmuc = cm.idChuyenmuc and bb.TrangThai = 1 and (bb.TenBaiBao like "%${word}%" or cm.TenCM like "%${word}%" or bb.NoiDung like "%${word}%" or bb.NoiDungTomTat like "%${word}%") group by idbaibao order by  bb.Premium DESC) as bang`)
  }
}


