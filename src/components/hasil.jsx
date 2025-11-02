import React, { useState } from "react";
import { Card, ListGroup, CloseButton } from "react-bootstrap";
import { numberWithCommas } from "../utils/utils";
import TotalBayar from "./totalbayar";
import ModalKeranjang from "./ModalKeranjang";
import swal from "sweetalert";
// import axios from "axios";
// import import { API_URL } from "../utils/constant"

const AppHasil = ({
  keranjangs,
  hapusItem,
  clearCart,
  refreshKeranjang,
  updateKeranjang,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [keranjangDetail, setKeranjangDetail] = useState(null);
  const [jumlah, setJumlah] = useState(1);
  const [keterangan, setKeterangan] = useState("");
  console.log("Current Modal State:", showModal);

  const handleShow = (item) => {
    console.log("handleShow dipanggil. Item:", item.product.nama);
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

  const confirmHapus = (item) => {
    return swal({
      title: "Apakah Anda yakin?",
      text: `${item.product.nama} akan dihapus dari keranjang.`,
      icon: "warning",
      buttons: ["Batal", "Ya, Hapus!"],
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        return hapusItem(item);
      }
    });
  };

  const totalHarga = keranjangs.reduce(
    (result, item) => result + item.total_harga,
    0
  );

  return (
    <>
      <Card className="p-3 shadow-sm hasil">
        <h4 className="fw-bold mb-3">Keranjang Pemesanan</h4>
        <div className="list-scroll mb-3">
          <ListGroup variant="flush">
            {keranjangs.length === 0 ? (
              <p className="text-center text-muted mt-3">
                Keranjang Anda kosong.
              </p>
            ) : (
              keranjangs.map((item) => (
                <ListGroup.Item
                  key={item.id}
                  onClick={() => {
                    console.log("Item diklik:", item.product.nama);
                    handleShow(item);
                  }}
                  style={{ cursor: "pointer" }}
                  className="d-flex justify-content-between align-items-center mb-2 p-2 rounded shadow-sm list-item-keranjang"
                >
                  <div className="d-flex align-items-center flex-grow-1 gap-2">
                    <div className="me-2 text-success fw-bold">
                      {item.jumlah}x
                    </div>

                    <div className="flex-grow-1">
                      <p className="mb-0 fw-medium">{item.product.nama}</p>

                      {item.keterangan && (
                        <small className="d-block text-muted italic text-xs">
                          Catatan: {item.keterangan}
                        </small>
                      )}

                      <small className="text-sm text-black">
                        Rp.
                        {numberWithCommas(item.product.harga)}
                      </small>
                    </div>
                  </div>

                  <div className="d-flex align-items-center">
                    <span className="me-3 fw-bold text-end text-green-700">
                      Rp.
                      {numberWithCommas(item.total_harga)}
                    </span>

                    <CloseButton
                      style={{ cursor: "default" }}
                      onClick={(e) => {
                        e.stopPropagation();
                        confirmHapus(item);
                      }}
                      aria-label="Hapus Item"
                    />
                  </div>
                </ListGroup.Item>
              ))
            )}
          </ListGroup>
        </div>

        <TotalBayar
          totalHarga={totalHarga}
          keranjangs={keranjangs}
          clearCart={clearCart}
        />
      </Card>

      <ModalKeranjang
        show={showModal}
        handleClose={handleClose}
        keranjangDetail={keranjangDetail}
        jumlah={jumlah}
        setJumlah={setJumlah}
        keterangan={keterangan}
        setKeterangan={setKeterangan}
        refreshKeranjang={refreshKeranjang}
        updateKeranjang={updateKeranjang}
      />
    </>
  );
};

export default AppHasil;