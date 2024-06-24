import React, { useState, useEffect } from "react";
import { getOrderById, getOrderDetailByOrderId } from "../../api/OrderApi";
import { useParams, NavLink, useHistory } from "react-router-dom";

const OrderDetail = () => {
  const history = useHistory();
  const [orderDetail, setOrderDetail] = useState([]);
  const [order, setOrder] = useState({});
  const { id } = useParams();
  const [amount, setAmount] = useState();
  const [sale, setSale] = useState();
  const [total, setTotal] = useState();

  useEffect(() => {
    onLoad();
  }, []);

  const onLoad = () => {
    getOrderById(id).then((resp) => {
      setOrder(resp.data);
      setSale(resp.data.voucher ? resp.data.voucher.discount : 0);
      setTotal(resp.data.total);
    });
    getOrderDetailByOrderId(id).then((resp) => {
      setOrderDetail(resp.data);
      const result = resp.data.reduce(
        (price, item) => price + item.sellPrice * item.quantity,
        0
      );
      setAmount(result);
    });
  };
  const goBack = () => {
    history.goBack();
  };
  const formatDate = (dateString) => {
    return dateString.split("T")[0];
  };
  return (
    <div className="container-fluid row padding mb-5 card">
      <button style={{ width: 60 }} onClick={() => goBack()}>
        <i
          className="fa fa-arrow-left"
          style={{ fontSize: 18 }}
          aria-hidden="true"
        ></i>
      </button>
      <div className="col-12 welcome mb-5 mt-5">
        <div className="col-10 offset-1 text-center ">
          <p
            className="display-4 text-danger"
            style={{ fontSize: "34px", fontWeight: "bolder" }}
          >
            Đơn hàng #{order && order.id}
          </p>
        </div>
        <div className="col-12 row mb-5 mt-5">
          <div className="col-6 text ">
            <p className="display-4 text-primary" style={{ fontSize: "24px" }}>
              Thông tin mua hàng
            </p>
            <p>Ngày tạo: {order && order.createDate}</p>
            <p>Người nhận: {order && order.fullname}</p>
            <p>Email: {order && order.email}</p>
          </div>
          <div className="col-6 text ">
            <p className="display-4 text-primary" style={{ fontSize: "24px" }}>
              Địa chỉ nhận hàng
            </p>
            <p>SDT: {order && order.phone}</p>
            <p>DC: {order && order.address}</p>
          </div>
        </div>
        <div className="col-12 mb-5">
          <p className="display-4 text-primary" style={{ fontSize: "24px" }}>
            Chi tiết đơn hàng
          </p>
          <table className="table table-striped table-bordered">
            <thead>
              <tr>
                <th scope="col">Tên sản phẩm</th>
                <th scope="col">Ngày tạo</th>
                <th scope="col">Size</th>
                <th scope="col">Giá</th>
                <th scope="col">Số lượng</th>
                <th scope="col">Tổng</th>
                <th scope="col">Trạng thái thanh toán</th>
              </tr>
            </thead>
            <tbody>
              {orderDetail &&
                orderDetail.map((item, index) => (
                  <tr key={index}>
                    <th scope="row">{item.attribute.name}</th>
                    <td>{order.createDate}</td>
                    <td>{item.attribute.size}</td>
                    <td>{item.sellPrice.toLocaleString()}₫</td>
                    <td>{item.quantity}</td>
                    <td>
                      {(item.sellPrice * item.quantity).toLocaleString()}₫
                    </td>
                    <td>
                      {" "}
                      <div className="col text ">
                        <p
                          className="status-success"
                          style={{ fontWeight: "bolder" }}
                        >
                          {order && order.isPending ? (
                            <p style={{ color: "#28a745" }}>Đã Thanh Toán </p>
                          ) : (
                            <div className="text-black">
                              <p className="text-danger">Chưa Thanh Toán </p>
                            </div>
                          )}
                        </p>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
          <div className="row mb-5">
            {/* <div className="col-12 text ">
              <p style={{ fontWeight: "bolder" }}>
                Tạm tính: {amount && amount.toLocaleString()} đ
              </p>
              <p style={{ fontWeight: "bolder" }}>
                Giảm giá: -{" "}
                {sale ? ((amount * sale) / 100).toLocaleString() : 0} đ
              </p>
              <p className="text-danger" style={{ fontWeight: "bolder" }}>
                Tổng cộng: {total && total.toLocaleString()} đ
              </p>
            </div> */}
            <table className="table table-striped table-bordered">
              <thead>
                <tr>
                  <th scope="col">Tổng tiền sản phẩm</th>
                  <th scope="col">Voucher sử dụng</th>
                  <th scope="col">Giảm giá / Voucher</th>
                  <th scope="col">Tổng tiền phải trả</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{amount && amount.toLocaleString()} đ</td>
                  <td>
                    {order.voucher?.code
                      ? order.voucher.code
                      : "Không có voucher nào sử dụng!"}
                  </td>
                  <td>
                    {" "}
                    {sale ? ((amount * sale) / 100).toLocaleString() : 0} đ
                  </td>
                  <td className="text-danger" style={{ fontWeight: "bolder" }}>
                    {total && total.toLocaleString()} đ
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="row mb-5">
            {/* <div className="col text ">
              <p
                className="display-4 text-primary"
                style={{ fontSize: "24px" }}
              >
                Trạng thái thanh toán
              </p>
              <p className="text-danger" style={{ fontWeight: "bolder" }}>
                {order && order.isPending ? "Đã thanh toán" : "Chưa thanh toán"}
              </p>
            </div>
            <div className="col text ">
              <p
                className="display-4 text-primary"
                style={{ fontSize: "24px" }}
              >
                Trạng thái đơn hàng
              </p>
              <p className="text-danger" style={{ fontWeight: "bolder" }}>
                {order.orderStatus && order.orderStatus.name}
              </p>
            </div> */}
            <h4 class="offset-1  card-title text-newproduct mb-0 fw-bolder">
              Thông tin vận chuyển
            </h4>
            <table className="table table-striped table-bordered">
              <thead>
                <tr>
                  <th scope="col">Shipment</th>
                  <th scope="col">Mã vận đơn</th>
                  <th scope="col">Ngày dự kiến giao hàng</th>
                  <th scope="col">Phương thức thanh toán</th>
                </tr>
              </thead>
              <tbody>
                {orderDetail &&
                  orderDetail.map((item, index) => (
                    <tr key={index}>
                      <td>
                        {order.shipment ? order.shipment : "Chưa có thông tin"}
                      </td>
                      <td>{order.code ? order.code : "Chưa có thông tin"}</td>

                      <td>
                        {" "}
                        {order.shipDate
                          ? formatDate(order.shipDate)
                          : "Chưa có thông tin"}
                      </td>
                      <td>
                        <p className="" style={{ fontWeight: "bolder" }}>
                          {order && order.payment}
                        </p>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
