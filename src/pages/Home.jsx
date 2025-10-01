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
    axios
      .get(`${API_URL}keranjangs?product.id=${value.id}`)
      .then((res) => {
        if (res.data.length === 0) {
          const keranjang = {
            jumlah: 1,
            total_harga: value.harga,
            product: value,
            keterangan: "",
          };
          axios
            .post(`${API_URL}keranjangs`, keranjang)
            .then(() => {
              swal({
                title: "Masuk Keranjang",
                text: `${keranjang.product.nama} ditambahkan ke keranjang`,
                icon: "success",
                button: false,
                timer: 1500,
              });
              this.getKeranjangs();
            })
            .catch((err) => console.error(err));
        } else {
          const existing = res.data[0];
          const updated = {
            jumlah: existing.jumlah + 1,
            total_harga: existing.total_harga + value.harga,
            product: value,
            keterangan: existing.keterangan || "",
          };
          axios
            .put(`${API_URL}keranjangs/${existing.id}`, updated)
            .then(() => {
              swal({
                title: "Masuk Keranjang",
                text: `${updated.product.nama} ditambahkan ke keranjang`,
                icon: "success",
                button: false,
                timer: 1500,
              });
              this.getKeranjangs();
            })
            .catch((err) => console.error(err));
        }
      })
      .catch((err) => console.error(err));
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
      .catch((err) => console.error(err));
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
            />
          </Col>
        </Row>
      </Container>
    );
  }
}
