import React, { useState, useEffect } from "react";
import { Button, Form } from "react-bootstrap";
import Modal from "react-bootstrap/Modal";
import {
  getAllProductsByBrand,
  getAllProductsCloseByBrand,
  updateProductStatus,
} from "../../api/ProductApi";
import { NavLink } from "react-router-dom";
import { getBrands } from "../../api/BrandApi";
import { FaCircle } from "react-icons/fa";
import ConfirmModal from "./ConFirmModal";
const ProductClose = () => {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState({});
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const [brand, setBrand] = useState([]);

  useEffect(() => {
    onLoad();
  }, [page]);

  const onLoad = () => {
    getAllProductsCloseByBrand(0, page, 10, false).then((response) => {
      setProducts(response.data.content);
      setTotal(response.data.totalPages);
    });

    getBrands(1, 20)
      .then((resp) => setBrand(resp.data.content))
      .catch((error) => console.log(error));
  };

  const onChangePage = (page) => {
    setPage(page);
  };

  var rows = new Array(total).fill(0).map((zero, index) => (
    <li
      className={page === index + 1 ? "page-item active" : "page-item"}
      key={index}
    >
      <button
        className="page-link"
        style={{ borderRadius: "0px" }}
        onClick={() => onChangePage(index + 1)}
      >
        {index + 1}
      </button>
    </li>
  ));

  const getProductByBrandHandler = (value) => {
    console.log(value);
    if (value == 0) {
      onLoad();
    } else {
      getAllProductsByBrand(value, 1, 10, false)
        .then((resp) => {
          setProducts(resp.data.content);
          setTotal(resp.data.totalPages);
        })
        .catch((error) => console.log(error));
    }
  };
  // toggle online off
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const handleOpenModal = (product) => {
    setSelectedProduct(product);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedProduct(null);
  };

  const handleConfirmModal = () => {
    if (selectedProduct) {
      toggleProductStatus(selectedProduct.id, selectedProduct.active);
    }
    handleCloseModal();
  };
  const toggleProductStatus = (productId, currentStatus) => {
    console.log(productId, currentStatus);
    const newStatus = !currentStatus;
    updateProductStatus(productId, newStatus)
      .then(() => {
        setProducts(
          products.map((product) =>
            product.id === productId
              ? { ...product, active: newStatus }
              : product
          )
        );
      })
      .catch((error) => console.log(error));
  };
  return (
    <div className="col-12">
      <div className="">
        {/* <div className="card__header">
          <NavLink
            to="/add-product"
            className="btn btn-primary"
            style={{ borderRadius: 50 }}
          >
            Thêm sản phẩm
          </NavLink>
        </div> */}
        <div className="row mb-3 mt-3">
          <div className="col-sm-4 mt-2">
            <select
              className="form-control"
              onChange={(event) => getProductByBrandHandler(event.target.value)}
            >
              <option value="0">Tất cả</option>
              {brand &&
                brand.map((item, index) => (
                  <option key={index} value={item.id}>
                    {item.name}
                  </option>
                ))}
            </select>
          </div>
        </div>
        <div className="card__body">
          <div>
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">Hình ảnh sản phẩm</th>
                    <th scope="col">Tên sản phẩm</th>
                    <th scope="col">Mã sản phẩm</th>
                    <th scope="col">Thương hiệu</th>
                    <th scope="col">Trạng thái</th>
                    <th scope="col">Cập nhật</th>
                  </tr>
                </thead>
                <tbody>
                  {products &&
                    products.map((item, index) => (
                      <tr key={index}>
                        <th scope="row">
                          <NavLink to={`/product-view/${item.id}`} exact>
                            #{index + 1}
                          </NavLink>
                        </th>
                        <th>
                          {" "}
                          <img
                            className="img-fluid"
                            style={{ width: "100px", height: "100px" }}
                            src={require(`../../static/images/${item.image}`)}
                            alt=""
                          />
                        </th>
                        <th>{item.name}</th>
                        <th>{item.code}</th>
                        <th>{item.brand}</th>

                        <th>
                          <FaCircle
                            className={item.active ? "svg-online" : ""}
                            onClick={() => handleOpenModal(item)}
                            style={{ cursor: "pointer" }}
                          />
                        </th>
                        <th>
                          <NavLink to={`/product-detail/${item.id}`} exact>
                            <i
                              className="fa fa-pencil-square-o"
                              aria-hidden="true"
                            ></i>
                          </NavLink>
                        </th>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <nav aria-label="Page navigation">
          <ul className="pagination offset-5 mt-3">
            <li className={page === 1 ? "page-item disabled" : "page-item"}>
              {/* <button
                className="page-link"
                style={{ borderRadius: 50 }}
                onClick={() => onChangePage(1)}
              >
                {`<<`}
              </button> */}
            </li>
            {rows}
            <li className={page === total ? "page-item disabled" : "page-item"}>
              {/* <button
                className="page-link"
                style={{ borderRadius: 50 }}
                onClick={() => onChangePage(total)}
              >
                {`>>`}
              </button> */}
            </li>
          </ul>
        </nav>
      </div>
      <ConfirmModal
        show={showModal}
        handleClose={handleCloseModal}
        handleConfirm={handleConfirmModal}
      />
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Xác nhận cập nhật?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Modal.Footer>
              <Button variant="danger" onClick={handleClose}>
                Xác nhận
              </Button>
              <Button variant="primary" onClick={handleClose}>
                Đóng
              </Button>
            </Modal.Footer>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default ProductClose;
