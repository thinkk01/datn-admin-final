import React, { useState, useEffect } from "react";
import statusCards from "../../assets/JsonData/status-card-data.json";
import StatusCard from "../status-card/StatusCard";
import Chart from "react-apexcharts";
import { Link, NavLink } from "react-router-dom";
import {
  reportByProduct,
  reportAmountYear,
  countOrder,
  countOrderByName,
} from "../../api/OrderApi";
import { countAccount } from "../../api/AccountApi";
import { countProduct } from "../../api/ProductApi";

const Dashboard = () => {
  const [product, setProduct] = useState([]);
  const [year, setYear] = useState([]);
  const [countOr, setCountOr] = useState();
  const [total, setTotal] = useState();
  const [countAcc, setCountAcc] = useState();
  const [countPro, setCountPro] = useState();
  const [seri, setSeri] = useState([]);
  const [option, setOption] = useState({});

  useEffect(() => {
    reportByProduct(1, 8)
      .then((resp) => {
        setProduct(resp.data.content);
      })
      .catch((error) => console.log(error));

    reportAmountYear()
      .then((resp) => {
        setYear(resp.data);
        const result = resp.data.reduce((price, item) => price + item.total, 0);
        setTotal(result);
      })
      .catch((error) => console.log(error));

    countOrder()
      .then((resp) => setCountOr(resp.data))
      .catch((error) => console.log(error));

    countAccount()
      .then((resp) => setCountAcc(resp.data))
      .catch((error) => console.log(error));

    countProduct()
      .then((resp) => setCountPro(resp.data))
      .catch((error) => console.log(error));

    countOrderByName()
      .then((resp) => {
        const x = resp.data.map((item) => item.name);
        setOption({
          labels: x,
        });
        const y = resp.data.map((item) => item.count);
        setSeri(y);
      })
      .catch((error) => console.log(error));
  }, []);

  return (
    <div>
      <h2 className="page-header">Thống kê</h2>
      <div className="">
        <div className="">
          <div className="row container-fluid">
            <div className="col status-card-1">
              <StatusCard count={countAcc} title={`Khách hàng`} />
              <StatusCard count={countPro} title={`Sản phẩm`} />
              <StatusCard count={countOr} title={`Đơn hàng`} />
              <StatusCard
                count={total && total.toLocaleString()}
                title={`Tổng doanh thu`}
              />
            </div>
          </div>
        </div>
        <div className="">
          <div className=" full-height">
            <Chart options={option} series={seri} type="pie" height="500" />
          </div>
        </div>
        <div className="d-flex">
          <div className="col-6">
            <div className="">
              <div className="card__header">
                <h3 className="">Tổng Doanh Thu Theo Sản Phẩm</h3>
              </div>
              <div className="card__body">
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th scope="col">Mã sản phẩm</th>
                      <th scope="col">Tên sản phẩm</th>
                      <th scope="col">Số lượng bán</th>
                      <th scope="col">Doanh thu</th>
                    </tr>
                  </thead>
                  <tbody>
                    {product &&
                      product.map((item, index) => (
                        <tr key={index}>
                          <th scope="row">
                            <NavLink to={`/order-product/${item.id}`} exact>
                              {" "}
                              {item.id}
                            </NavLink>
                          </th>
                          <td>{item.name}</td>
                          <td>{item.count}</td>
                          <td>{item.amount.toLocaleString()} đ</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
              <div className="card__footer">
                <Link to="/report-product">Xem chi tiết</Link>
              </div>
            </div>
          </div>
          <div className="col-6">
            <div className="">
              <div className="card__header">
                <h3 className="">Tổng Doanh thu theo Năm</h3>
              </div>
              <div className="card__body">
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th scope="col">STT</th>
                      <th scope="col">Năm</th>
                      <th scope="col">Số lượng đơn</th>
                      <th scope="col">Doanh thu</th>
                    </tr>
                  </thead>
                  <tbody>
                    {year &&
                      year.map((item, index) => (
                        <tr key={index}>
                          <th scope="row">
                            <NavLink exact to={`/report-month/${item.year}`}>
                              {index + 1}
                            </NavLink>
                          </th>
                          <td>{item.year}</td>
                          <td>{item.count}</td>
                          <td>{item.total && item.total.toLocaleString()} đ</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
              <div className="card__footer">
                <NavLink exact to={`/report-month/2022`}>
                  Xem chi tiết
                </NavLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
