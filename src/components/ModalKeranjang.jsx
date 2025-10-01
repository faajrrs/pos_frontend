import React from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { numberWithCommas } from "../utils/utils";
import axios from "axios";
import { API_URL } from "../utils/constant";
import swal from "sweetalert";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faMinus } from "@fortawesome/free-solid-svg-icons";

const ModalKeranjang = ({
  show,
  handleClose,
  keranjangDetail,
  jumlah,
  setJumlah,
  keterangan,
  setKeterangan,
  refreshKeranjang,
}) => {
  if (!keranjangDetail) return null;

  const tambah = () => setJumlah((j) => j + 1);
  const kurang = () => jumlah > 1 && setJumlah((j) => j - 1);

  const subTotalHarga = jumlah * keranjangDetail.product.harga;

  const handleSubmit = async (e) => {
    e.preventDefault();
    handleClose();

    const payload = {
      jumlah,
      total_harga: subTotalHarga,
      product: keranjangDetail.product,
      keterangan,
    };

    try {
      await axios.put(`${API_URL}keranjangs/${keranjangDetail.id}`, payload);
      swal({
        title: "Pesanan Diperbarui",
        text: `${payload.product.nama} berhasil diperbarui`,
        icon: "success",
        timer: 1500,
        buttons: false,
      });
      refreshKeranjang();
    } catch (err) {
      console.error(err);
      swal("Error", "Gagal memperbarui pesanan", "error");
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>
          {keranjangDetail.product.nama}{" "}
          <strong>(Rp. {numberWithCommas(subTotalHarga)})</strong>
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="jumlah">
            <Form.Label>Jumlah Item</Form.Label>
            <div className="d-flex align-items-center">
              <Button
                variant="outline-success"
                size="sm"
                onClick={kurang}
                className="me-2"
              >
                <FontAwesomeIcon icon={faMinus} />
              </Button>
              <strong>{jumlah}</strong>
              <Button
                variant="outline-success"
                size="sm"
                onClick={tambah}
                className="ms-2"
              >
                <FontAwesomeIcon icon={faPlus} />
              </Button>
            </div>
          </Form.Group>

          <Form.Group className="mb-3" controlId="keterangan">
            <Form.Label>Keterangan</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={keterangan}
              onChange={(e) => setKeterangan(e.target.value)}
              placeholder="Contoh: Pedas, Panas"
            />
          </Form.Group>

          <div className="d-flex justify-content-between">
            <Button variant="secondary" onClick={handleClose}>
              Batal
            </Button>
            <Button variant="primary" type="submit">
              Simpan
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default ModalKeranjang;
