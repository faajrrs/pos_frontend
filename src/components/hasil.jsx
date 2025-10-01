import React, { useState } from "react";
import { Card, ListGroup, CloseButton } from "react-bootstrap";
import { numberWithCommas } from "../utils/utils";
import TotalBayar from "./totalbayar";
import ModalKeranjang from "./ModalKeranjang";
import swal from "sweetalert";
import axios from "axios";
import { API_URL } from "../utils/constant";

const AppHasil = ({ keranjangs, refreshKeranjang, clearCart }) => {
  const [showModal, setShowModal] = useState(false);
  const [keranjangDetail, setKeranjangDetail] = useState(null);
  const [jumlah, setJumlah] = useState(1);
  const [keterangan, setKeterangan] = useState("");

  const handleShow = (item) => {
    setKeranjangDetail(item);
    setJumlah(item.jumlah);
    setKeterangan(item.keterangan || "");
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
    setKeranjangDetail(null);
    setJumlah(1);
    setKeterangan("");
  };

  const hapusItem = (item) => {
    axios
      .delete(`${API_URL}keranjangs/${item.id}`)
      .then(() => {
        refreshKeranjang();
        swal("Item berhasil dihapus!", {
          icon: "success",
          timer: 1500,
          buttons: false,
        });
      })
      .catch((err) => {
        console.error("Gagal hapus item:", err);
        swal("Gagal menghapus item!", { icon: "error" });
      });
  };

  const confirmHapus = (item) => {
    swal({
      title: "Apakah Anda ingin menghapus pesanan ini?",
      text: `${item.product.nama} akan dihapus dari keranjang.`,
      icon: "warning",
      buttons: ["Batal", "Ya, Hapus!"],
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        hapusItem(item);
      }
    });
  };

  const totalHarga = keranjangs.reduce(
    (total, item) => total + item.product.harga * item.jumlah,
    0
  );

  return (
    <>
      <Card className="p-3 shadow-sm hasil">
        <h4 className="mb-3">
          <b>Hasil</b>
        </h4>
        <hr className="mt-0 mb-3" />
        <div className="list-scroll">
          <ListGroup variant="flush">
            {keranjangs.length === 0 && (
              <ListGroup.Item as="div" className="text-center text-muted">
                <h5>Silahkan Pilih Menu</h5>
              </ListGroup.Item>
            )}
            {keranjangs.map((item) => (
              <ListGroup.Item
                as="div"
                key={item.id}
                className="d-flex justify-content-between align-items-center list-group-item-action"
                onClick={() => handleShow(item)}
              >
                <div>
                  {/* Baris 1: Jumlah dan Nama Produk */}
                  <div>
                    <span className="badge bg-success me-2">{item.jumlah}</span>
                    {item.product.nama}
                  </div>

                  {/* Baris 2: KETERANGAN (JIKA ADA) */}
                  {item.keterangan && (
                    <div
                      className="text-muted fst-italic mt-n1"
                      style={{ fontSize: "0.8rem" }}
                    >
                      Catatan: {item.keterangan}
                    </div>
                  )}

                  {/* Baris 3: HARGA PER ITEM */}
                  <small className="block mt-1">
                    {" "}
                    {/* Tambahkan class block atau margin untuk pemisah */}
                    Rp. {numberWithCommas(item.product.harga)} × {item.jumlah}
                  </small>
                </div>
                <div className="d-flex align-items-center">
                  <strong className="me-2">
                    Rp. {numberWithCommas(item.total_harga)}
                  </strong>
                  <CloseButton
                    onClick={(e) => {
                      e.stopPropagation();
                      confirmHapus(item);
                    }}
                  />
                </div>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </div>

        <hr />

        <TotalBayar
          totalHarga={totalHarga}
          keranjangs={keranjangs}
          clearCart={clearCart}
        />
      </Card>

      {keranjangDetail && (
        <ModalKeranjang
          show={showModal}
          handleClose={handleClose}
          keranjangDetail={keranjangDetail}
          jumlah={jumlah}
          setJumlah={setJumlah}
          keterangan={keterangan}
          setKeterangan={setKeterangan}
          refreshKeranjang={refreshKeranjang}
        />
      )}
    </>
  );
};

export default AppHasil;
