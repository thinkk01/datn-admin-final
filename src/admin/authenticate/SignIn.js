import React from "react";
import { NavLink, useHistory } from "react-router-dom";
import "./signin.css";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { signIn, getMe } from "../../api/AccountApi";
import { MdPerson, MdLock } from "react-icons/md";
const SignIn = (props) => {
  const history = useHistory();

  const signInHandler = (data) => {
    const userFlag = {
      ...data,
      admin: true,
    };
    signIn(userFlag)
      .then((res) => {
        toast.success("Đăng nhập thành công!");
        localStorage.setItem("token", res.data.accessToken);
        getMe(res.data.accessToken)
          .then((res) => {
            props.userHandler(res.data);
            localStorage.setItem("username", "admin");
            localStorage.setItem("password", "123456");
            if (res.data.roleName === "ADMIN") {
              history.push("/");
            } else {
              history.push("/orders");
            }
          })
          .catch((error) => console.log(error));
      })
      .catch((error) => toast.error(error.response.data.Errors));
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  return (
    <div>
      {" "}
      <section className="vh-100 container-login100 bg-backgroundLogin">
        <div className="container py-5 h-100">
          <div className="row d-flex justify-content-center align-items-center h-100">
            <div className="col-12 col-md-8 col-lg-6 col-xl-5">
              <div
                className="card wrap-login text-white"
                style={{ borderRadius: "1rem" }}
              >
                <div className="card-body p-5">
                  <div className="mb-md-5 mt-md-4 pb-5 flex-col-d">
                    <h2 className="login100-form-title">Login Admin</h2>
                    <form
                      className="needs-validation flex-col-d"
                      onSubmit={handleSubmit(signInHandler)}
                    >
                      <div
                        className="wrap-input100 validate-input mb-[23px]"
                        data-validate="Username is reauired"
                      >
                        <span className="label-input100" htmlFor="typeEmailX">
                          Username
                        </span>
                        <input
                          type="text"
                          id="typeEmailX"
                          className=" input100 "
                          placeholder="Type your username"
                          {...register("username", {
                            required: true,
                            pattern: /^\s*\S+.*/,
                          })}
                        />
                        <span
                          className="focus-input100"
                          data-symbol="&#xf190;"
                        ></span>
                        <MdPerson className="focus-input100" color="#adadad" />
                        {errors.username && (
                          <div className="alert alert-danger" role="alert">
                            Tài khoản không hợp lệ!
                          </div>
                        )}
                      </div>
                      <div
                        className="wrap-input100 validate-input"
                        data-validate="Password is required"
                      >
                        <span
                          className="label-input100"
                          htmlFor="typePasswordX"
                        >
                          Password
                        </span>
                        <input
                          type="password"
                          id="typePasswordX"
                          className="input100"
                          placeholder="Type your password"
                          {...register("password", {
                            required: true,
                            pattern: /^\s*\S+.*/,
                          })}
                        />
                        <span
                          className="focus-input100"
                          data-symbol="&#xf190;"
                        ></span>
                        <MdLock className="focus-input100" color="#adadad" />
                        {errors.password && (
                          <div className="alert alert-danger" role="alert">
                            Mật khẩu không hợp lệ!
                          </div>
                        )}
                      </div>
                      <p className="small pb-lg-2">
                        <a className="" href="#!">
                          Quên mật khẩu?
                        </a>
                      </p>
                      <button
                        className="login100-form-btn w-full m-0"
                        type="submit"
                      >
                        Đăng nhập
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SignIn;
