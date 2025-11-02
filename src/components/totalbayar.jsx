import React, { useState } from "react";
import { Button, Row, Col } from "react-bootstrap";
import { numberWithCommas } from "../utils/utils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { API_URL } from "../utils/constant";
import { useNavigate } from "react-router-dom";
import swal from "sweetalert";

export default function TotalBayar({ totalHarga, keranjangs, clearCart }) {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleBayar = async () => {
    if (keranjangs.length === 0) {
      return swal(
        "Keranjang kosong!",
        "Silakan tambahkan menu dulu.",
        "warning"
      );
    }

    const willPay = await swal({
      title: "Apakah Anda yakin dengan pesanan ini?",
      text: `Total: Rp. ${numberWithCommas(totalHarga)}`,
      icon: "warning",
      buttons: ["Batal", "Ya, Bayar!"],
      dangerMode: true,
    });

    if (!willPay) return;

    setLoading(true);
    try {
      const payload = {
        total_bayar: totalHarga,
      };

      await axios.post(`${API_URL}pesanans`, payload);
      clearCart();
      await swal({
        title: "Pembayaran Berhasil",
        text: `Total: Rp. ${numberWithCommas(totalHarga)}`,
        icon: "success",
        timer: 1500,
        buttons: false,
      });

      navigate("/sukses");
    } catch (err) {
      console.error("Error Checkout:", err.response?.data?.message || err);
      swal(
        "Error",
        err.response?.data?.message || "Gagal memproses pesanan. Coba lagi.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Row>
      <Col>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div className="fw-medium">Total Harga:</div>
          <div className="fw-bold text-success">
            Rp. {numberWithCommas(totalHarga)}
          </div>
        </div>

        <Button
          variant="success"
          className="w-100"
          onClick={handleBayar}
          disabled={loading}
        >
          <FontAwesomeIcon icon={faShoppingCart} className="me-2" />
          <strong>{loading ? "Memproses..." : "BAYAR"}</strong>
        </Button>
      </Col>
    </Row>
  );
}