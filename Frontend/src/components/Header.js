import React, { useEffect, useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { BsSearch } from "react-icons/bs";
import compare from "../images/compare.svg";
import wishlist from "../images/wishlist.svg";
import user from "../images/user.svg";
import cart from "../images/cart.svg";
import menu from "../images/menu.svg";
import { useDispatch, useSelector } from "react-redux";
import { Typeahead } from "react-bootstrap-typeahead";
import "react-bootstrap-typeahead/css/Typeahead.css";
import { getAProduct } from "../features/products/productSlilce";
import { getUserCart } from "../features/user/userSlice";

const Header = () => {
  const dispatch = useDispatch();
  const cartState = useSelector((state) => state?.auth?.cartProducts);
  const authState = useSelector((state) => state?.auth);
  const [total, setTotal] = useState(null);
  const [paginate, setPaginate] = useState(true);
  const productState = useSelector((state) => state?.product?.product);
  const navigate = useNavigate();

  const getTokenFromLocalStorage = localStorage.getItem("customer")
    ? JSON.parse(localStorage.getItem("customer"))
    : null;

  const config2 = {
    headers: {
      Authorization: `Bearer ${
        getTokenFromLocalStorage !== null ? getTokenFromLocalStorage.token : ""
      }`,
      Accept: "application/json",
    },
  };

  useEffect(() => {
    dispatch(getUserCart(config2));
  }, []);

  const [productOpt, setProductOpt] = useState([]);
  useEffect(() => {
    let sum = 0;
    for (let index = 0; index < cartState?.length; index++) {
      sum = sum + Number(cartState[index].quantity) * cartState[index].price;
      setTotal(sum);
    }
  }, [cartState]);

  useEffect(() => {
    let data = [];
    for (let index = 0; index < productState?.length; index++) {
      const element = productState[index];
      data.push({ id: index, prod: element?._id, name: element?.title });
    }
    setProductOpt(data);
  }, [productState]);

  const handleLogout = () => {
    localStorage.clear();
    window.location.reload();
  };
  return (
    <>
      <header className="header-top-strip py-3">
  <div className="container-xxl">
    <div className="row">
      <div className="col-6">
        <p className="text-white mb-0">Enjoy Free Delivery on Orders Over Rs.100</p>
      </div>
      <div className="col-6">
        <p className="text-end text-white mb-0">
          Reach us at:
          <a className="text-white" href="tel:+91 8264954234">
            +91 878348348
          </a>
        </p>
      </div>
    </div>
  </div>
</header>
<header className="header-upper py-3">
  <div className="container-xxl">
    <div className="row align-items-center">
      <div className="col-2">
        <h2>
          <Link className="text-white" to="/ ">
            Trendy Haven
          </Link>
        </h2>
      </div>
      <div className="col-5">
        <div className="input-group">
          <Typeahead
            id="search-products"
            onPaginate={() => console.log("Fetching more results...")}
            onChange={(selected) => {
              navigate(`/product/${selected[0]?.prod}`);
              dispatch(getAProduct(selected[0]?.prod));
            }}
            options={productOpt}
            paginate={paginate}
            labelKey={"name"}
            placeholder="Find Your Perfect Style"
          />
          <span className="input-group-text p-3" id="search-icon">
            <BsSearch className="fs-6" />
          </span>
        </div>
      </div>
      <div className="col-5">
        <div className="header-upper-links d-flex align-items-center justify-content-between">
          <div>
            <Link to="/wishlist" className="d-flex align-items-center gap-10 text-white">
              <img src={wishlist} alt="wishlist" />
              <p className="mb-0">Your Favorites</p>
            </Link>
          </div>
          <div>
            <Link
              to={authState?.user === null ? "/login" : "my-profile"}
              className="d-flex align-items-center gap-10 text-white"
            >
              <img src={user} alt="user" />
              {authState?.user === null ? (
                <p className="mb-0">Sign In</p>
              ) : (
                <p className="mb-0">Hi, {authState?.user?.firstname}</p>
              )}
            </Link>
          </div>
          <div>
            <Link to="/cart" className="d-flex align-items-center gap-10 text-white">
              <img src={cart} alt="cart" />
              <div className="d-flex flex-column gap-10">
                <span className="badge bg-white text-dark">
                  {cartState?.length ? cartState?.length : 0}
                </span>
                <p className="mb-0">Total: Rs. {total ? total : 0}</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  </div>
</header>
<header className="header-bottom py-3">
  <div className="container-xxl">
    <div className="row">
      <div className="col-12">
        <div className="menu-bottom d-flex align-items-center gap-30">
          <div>
            <div className="dropdown">
              <button
                className="btn btn-secondary dropdown-toggle bg-transparent border-0 gap-15 d-flex align-items-center"
                type="button"
                id="dropdownMenuButton1"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <img src={menu} alt="menu" />
                <span className="me-5 d-inline-block">Browse Categories</span>
              </button>
              <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                {productState &&
                  productState.map((item, index) => (
                    <li key={index}>
                      <Link className="dropdown-item text-white" to="">
                        {item?.category}
                      </Link>
                    </li>
                  ))}
              </ul>
            </div>
          </div>
          <div className="menu-links">
            <div className="d-flex align-items-center gap-15">
              <NavLink to="/">Home</NavLink>
              <NavLink to="/product">Shop</NavLink>
              <NavLink to="/my-orders">Orders</NavLink>
              <NavLink to="/blogs">Latest Trends</NavLink>
              <NavLink to="/contact">Support</NavLink>
              {authState?.user !== null ? (
                <button
                  className="border border-0 bg-transparent text-white text-uppercase"
                  type="button"
                  style={{ backgroundColor: "#232f3e" }}
                  onClick={handleLogout}
                >
                  Sign Out
                </button>
              ) : (
                ""
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</header>
</>
  );
};
export default Header
