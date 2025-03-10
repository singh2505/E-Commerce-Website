import React, { useEffect } from "react";
import CustomInput from "../components/CustomInput";
import { Link, useNavigate } from "react-router-dom";
import * as yup from "yup";
import { useFormik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../features/auth/authSlice";

const schema = yup.object().shape({
  email: yup.string().email("Email should be valid").required("Email is Required"),
  password: yup.string().required("Password is Required"),
});

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isError, isSuccess, isLoading, message } = useSelector((state) => state.auth);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: schema,
    onSubmit: (values) => {
      console.log("Form Values:", values);
      dispatch(login(values));
    },
  });

  useEffect(() => {
    console.log("Redux State - User:", user); // Log the user object
    console.log("Redux State - isSuccess:", isSuccess); // Log isSuccess
    console.log("Redux State - isError:", isError); // Log isError
    console.log("Redux State - message:", message); // Log message
    if (isSuccess && user?.role === "admin") {
      navigate("/admin");
    } else if (isSuccess && user?.role !== "admin") {
      alert("You are not an admin!");
    }
  }, [user, isSuccess, navigate]);

  return (
    <div className="py-5" style={{ background: "#ffd333", minHeight: "100vh" }}>
      <div className="my-5 w-25 bg-white rounded-3 mx-auto p-4">
        <h3 className="text-center title">Login</h3>
        <p className="text-center">Login to your account to continue.</p>
        {isError && <div className="error text-center">{message}</div>}
        <form onSubmit={formik.handleSubmit}>
          <CustomInput
            type="text"
            label="Email Address"
            id="email"
            name="email"
            onChng={formik.handleChange("email")}
            onBlr={formik.handleBlur("email")}
            val={formik.values.email}
          />
          <CustomInput
            type="password"
            label="Password"
            id="password"
            name="password"
            onChng={formik.handleChange("password")}
            onBlr={formik.handleBlur("password")}
            val={formik.values.password}
          />
          <button type="submit" className="btn btn-primary w-100">
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>
        <p className="text-center mt-3">
          Don't have an account? <Link to="/register">Register here</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
