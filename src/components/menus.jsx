import React from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import { numberWithCommas } from "../utils/utils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

const Menus = ({ menu, masukKeranjang }) => {
  return (
    <Col md={3} xs={6} className="mb-4">
      <Card className="shadow">
        <Card.Img
          variant="top"
          src={
            "assets/images/" +
            menu.category.nama.toLowerCase() +
            "/" +
            menu.gambar
          }
        />
        <Card.Body>
          <Card.Title>
            {menu.nama} <strong>({menu.kode})</strong>
          </Card.Title>
          <Card.Text>Rp. {numberWithCommas(menu.harga)}</Card.Text>
          <Button variant="success" onClick={() => masukKeranjang(menu)}>
            <FontAwesomeIcon icon={faPlus} /> Tambah
          </Button>
        </Card.Body>
      </Card>
    </Col>
  );
};

export default Menus;
