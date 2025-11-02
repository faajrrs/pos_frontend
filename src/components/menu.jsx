import React, { Component } from "react";
import { Nav } from "react-bootstrap";
import axios from "axios";
import { API_URL } from "../utils/constant";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUtensils,
  faCoffee,
  faCheese,
} from "@fortawesome/free-solid-svg-icons";

const Icon = ({ nama }) => {
  const lowerNama = nama?.toLowerCase();
  if (lowerNama === "makanan")
    return <FontAwesomeIcon icon={faUtensils} className="me-1" />;
  if (lowerNama === "minuman")
    return <FontAwesomeIcon icon={faCoffee} className="me-1" />;
  if (lowerNama === "camilan")
    return <FontAwesomeIcon icon={faCheese} className="me-1" />;
  return <FontAwesomeIcon icon={faCheese} className="me-2" />;
};

export default class AppMenu extends Component {
  state = {
    categories: [],
  };

  componentDidMount() {
    axios
      .get(API_URL + "categories")
      .then((res) => this.setState({ categories: res.data }))
      .catch((err) => console.error(err));
  }

  render() {
    const { categories } = this.state;
    const { changeCategory, kategoriDipilih } = this.props;

    return (
      <Nav justify variant="tabs" className="mb-3 shadow ">
        {categories.map((category) => (
          <Nav.Item key={category.id} className="menu">
            <Nav.Link
              className={`menu_text ${
                kategoriDipilih === category.nama ? "category_active" : ""
              }`}
              onClick={() => changeCategory(category.nama)}
            >
              <Icon nama={category.nama} /> {category.nama}
            </Nav.Link>
          </Nav.Item>
        ))}
      </Nav>
    );
  }
}