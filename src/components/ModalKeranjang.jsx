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
  if (!keranjangDetail) {
    return null; 
  }

  const tambah = () => setJumlah((j) => j + 1);
  const kurang = () => jumlah > 1 && setJumlah((j) => j - 1);

  const subTotalHarga = jumlah * (keranjangDetail.product?.harga || 0);

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
    <Modal show={show} onHide={handleClose} centered style={{ zIndex: 1050 }}>
      <Modal.Header closeButton>
        <Modal.Title>
          {keranjangDetail.product.nama}{" "}
          <strong>(Rp. {numberWithCommas(subTotalHarga)})</strong>
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Jumlah Item</Form.Label>
            <div className="d-flex align-items-center">
              <Button
                variant="outline-danger"
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
            <Form.Label>Catatan Khusus (Opsional)</Form.Label>
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










// import React from "react";
// import { Modal, Button, Form } from "react-bootstrap";
// import { numberWithCommas } from "../utils/utils";
// // import axios from "axios";
// // import { API_URL } from "../utils/constant";
// import swal from "sweetalert";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faPlus, faMinus } from "@fortawesome/free-solid-svg-icons";

// const ModalKeranjang = ({
//   showModal,
//   handleClose,
//   keranjangDetail,
//   jumlah,
//   setJumlah,
//   keterangan,
//   setKeterangan,
//   updateKeranjang,
// }) => {
//   const tambah = () => setJumlah((j) => j + 1);
//   const kurang = () => jumlah > 1 && setJumlah((j) => j - 1);

//   const subTotalHarga = jumlah * (keranjangDetail?.product?.harga || 0);

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     if (!keranjangDetail?.id) {
//       swal("Error", "Detail keranjang tidak ditemukan", "error");
//       return;
//     }

//     const payload = {
//       jumlah,
//       keterangan,
//     };

//     updateKeranjang(keranjangDetail.id, payload);

//     handleClose();
//   };

//   return (
//     <Modal
//       show={showModal && keranjangDetail}
//       onHide={handleClose}
//       centered
//       scrollable
//       size="lg"
//       style={{ zIndex: 10000 }}
//       backdrop="static"
//       keyboard={false}
//     >
//       <Modal.Header closeButton>
//         <Modal.Title>
//           {keranjangDetail?.product?.nama} (
//           {numberWithCommas(keranjangDetail?.product?.harga || 0)})
//         </Modal.Title>
//       </Modal.Header>

//       <Modal.Body>
//         <Form onSubmit={handleSubmit}>
//           {/* Tampilkan Total Harga Saat Ini (Readonly) */}
//           <Form.Group className="mb-3" controlId="formHarga">
//             <Form.Label>Total Harga</Form.Label>

//             <Form.Control
//               type="text"
//               value={`Rp ${numberWithCommas(subTotalHarga)}`}
//               readOnly
//               disabled
//             />
//           </Form.Group>
//           {/* Form Group untuk Jumlah Item */}
//           <Form.Group className="mb-3" controlId="formJumlah">
//             <Form.Label>Jumlah Item</Form.Label>
//             <div className="d-flex align-items-center">
//               <Button
//                 variant="outline-danger"
//                 size="sm"
//                 onClick={kurang}
//                 className="me-2"
//               >
//                 <FontAwesomeIcon icon={faMinus} />
//               </Button>
//               <strong className="px-3">{jumlah}</strong>

//               <Button
//                 variant="outline-success"
//                 size="sm"
//                 onClick={tambah}
//                 className="ms-2"
//               >
//                 <FontAwesomeIcon icon={faPlus} />
//               </Button>
//             </div>
//           </Form.Group>
//           {/* Form Group untuk Keterangan */}
//           <Form.Group className="mb-3" controlId="keterangan">
//             <Form.Label>Keterangan</Form.Label>

//             <Form.Control
//               as="textarea"
//               rows={3}
//               id="keterangan"
//               name="keterangan"
//               value={keterangan}
//               onChange={(e) => setKeterangan(e.target.value)}
//               placeholder="Contoh: Pedas, Panas"
//             />
//           </Form.Group>

//           <div className="d-flex justify-content-between">
//             <Button variant="secondary" onClick={handleClose}>
//               Batal
//             </Button>

//             <Button variant="success" type="submit">
//               Simpan Perubahan
//             </Button>
//           </div>
//         </Form>
//       </Modal.Body>
//     </Modal>
//   );
// };

// export default ModalKeranjang;
