import React, { Component } from "react";
import { Container, Row, Col } from "react-bootstrap";
import AppMenu from "../components/menu";
import AppMenus from "../components/menus";
import AppHasil from "../components/hasil";
import { API_URL } from "../utils/constant";
import axios from "axios";
import swal from "sweetalert";

export default class Home extends Component {
  state = {
    menus: [],
    categoriYangDipilih: "Makanan",
    keranjangs: [],
  };

  changeCategory = (newCategory) => {
    this.setState({ categoriYangDipilih: newCategory });
  };

  clearCart = () => {
    this.setState({ keranjangs: [] });
  };

  componentDidMount() {
    this.getProductByCategory(this.state.categoriYangDipilih);
    this.getKeranjangs();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.categoriYangDipilih !== this.state.categoriYangDipilih) {
      this.getProductByCategory(this.state.categoriYangDipilih);
    }
  }

  getProductByCategory = (category) => {
    axios
      .get(`${API_URL}products?category.nama=${category}`)
      .then((res) => this.setState({ menus: res.data }))
      .catch((err) => console.error(err));
  };

  getKeranjangs = () => {
    axios
      .get(`${API_URL}keranjangs`)
      .then((res) => this.setState({ keranjangs: res.data }))
      .catch((err) => console.error(err));
  };

  masukKeranjang = (value) => {
    const keranjangPayload = {
      jumlah: 1,
      total_harga: value.harga,
      product: value,
      keterangan: "",
    };

    axios
      .post(`${API_URL}keranjangs`, keranjangPayload)
      .then(() => {
        swal({
          title: "Masuk Keranjang",
          text: `${value.nama} berhasil ditambahkan/diperbarui`,
          icon: "success",
          button: false,
          timer: 1500,
        });
        this.getKeranjangs();
      })
      .catch((err) => {
        console.error("Gagal menambah/memperbarui keranjang:", err);
        swal("Error", "Gagal menambahkan item ke keranjang", "error");
      });
  };

  hapusItem = (item) => {
    axios
      .delete(`${API_URL}keranjangs/${item.id}`)
      .then(() => {
        swal({
          title: "Item Dihapus",
          text: `${item.product.nama} dihapus dari keranjang`,
          icon: "success",
          button: false,
          timer: 1000,
        });
        this.getKeranjangs();
      })
      .catch((err) => {
        const errorMessage = err.response
          ? err.response.data.message || `Server Error: ${err.response.status}`
          : err.message;

        console.error(
          `Gagal menghapus item ID ${item.id}:`,
          err.response || err
        );

        swal(
          "Error Penghapusan",
          `Gagal menghapus item dari keranjang: ${errorMessage}`,
          "error"
        );
      });
  };

  updateKeranjang = (keranjangId, payload) => {
    axios
      .put(`${API_URL}keranjangs/${keranjangId}`, payload)
      .then(() => {
        swal({
          title: "Keranjang Diperbarui",
          text: `Item berhasil diperbarui`,
          icon: "success",
          button: false,
          timer: 1500,
        });
        this.getKeranjangs();
      })
      .catch((err) => {
        console.error("Gagal memperbarui keranjang:", err.response || err);
        swal("Error", "Gagal memperbarui item keranjang", "error");
      });
  };

  render() {
    const { menus, categoriYangDipilih, keranjangs } = this.state;
    return (
      <Container fluid className="mt-4">
        <Row>
          <Col xs={12}>
            <AppMenu
              changeCategory={this.changeCategory}
              kategoriDipilih={categoriYangDipilih}
            />
          </Col>
        </Row>

        <Row className="align-items-start">
          <Col lg={8}>
            <Row>
              {menus.map((menu) => (
                <AppMenus
                  key={menu.id}
                  menu={menu}
                  masukKeranjang={this.masukKeranjang}
                />
              ))}
            </Row>
          </Col>

          <Col lg={4} className="align-self-start">
            <AppHasil
              keranjangs={keranjangs}
              hapusItem={this.hapusItem}
              clearCart={this.clearCart}
              refreshKeranjang={this.getKeranjangs}
              updateKeranjang={this.updateKeranjang}
            />
          </Col>
        </Row>
      </Container>
    );
  }
}