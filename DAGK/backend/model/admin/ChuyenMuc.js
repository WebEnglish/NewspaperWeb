var db = require('../../utils/Database');

module.exports = {
  all: () => {
    return db.load('select * from chuyenmuc where Xoa = 0');
  },

  single: id => {
    return db.load(`select * from chuyenmuc where idChuyenMuc = ${id} and Xoa = 0`);
  },
  LocCM: id  =>{
    return db.load(`SELECT cm.*,cm1.TenCM as TenC1 FROM chuyenmuc as cm,chuyenmuc as cm1 WHERE cm.LoaiCM = ${id} and cm.Xoa = 0 and cm.LoaiCM != 0 and cm.LoaiCM = cm1.idChuyenMuc `);
  },

  allNguoiQuanLi: () => {
    return db.load('SELECT DISTINCT tv.* FROM chuyenmuc as cm, thanhvien as tv WHERE cm.NguoiQuanLyCM = tv.idThanhVien');
  },

  getallnamebyid: () =>{
    return db.load('SELECT cm.*,cm1.TenCM as TenC1 FROM chuyenmuc as cm, chuyenmuc as cm1 WHERE cm.LoaiCM != 0 and cm.xoa = 0 and cm.LoaiCM = cm1.idChuyenMuc');
  },

  getCateC1 : id => {
    return db.load(`SELECT cm1.* FROM chuyenmuc as cm, chuyenmuc as cm1 where cm.idChuyenMuc = ${id} AND cm.LoaiCM = cm1.idChuyenMuc and cm.Xoa = 0`);
  },

  NguoiQuanLi: id => {
    return db.load(`SELECT DISTINCT tv.* FROM chuyenmuc as cm, thanhvien as tv WHERE cm.Xoa = 0 and cm.NguoiQuanLyCM = tv.idThanhVien and cm.idChuyenMuc = ${id}`);
  },

  CMCap1: () => {
    return db.load(`select * from chuyenmuc where Xoa = 0 and LoaiCM = 0 `);
  },

  singleCap2: id => {
    return db.load(`select * from chuyenmuc where idChuyenMuc = ${id} and Xoa = 0 and LoaiCM != 0`);
  },
  singleCap1: id => {
    return db.load(`select * from chuyenmuc where idChuyenMuc = ${id} and Xoa = 0 and LoaiCM = 0`);
  },

  CMCap2: () => {
    return db.load(`select * from chuyenmuc where Xoa = 0 and LoaiCM != 0 `);
  },

  singleByUserName: LoaiCM => {
    return db.load(`select * from chuyenmuc where LoaiCM = '${LoaiCM}'`);
  },

  add: entity => {
    return db.add('chuyenmuc', entity);
  },

  update: entity => {
    return db.update('chuyenmuc', 'idChuyenMuc', entity);
  },

  delete: id => {
    return db.delete('chuyenMuc', 'idChuyenMuc', id);
  }
};