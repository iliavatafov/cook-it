import { useState } from "react";

import { Link } from "react-router-dom";
import { MyLinks, MyLinksLoggedIn } from "./MyLinks";

import "../Navbar/Navbar.css";

export const Navbar = () => {
  const [clicked, setClicked] = useState(false);

  const myLinks = MyLinks.map(({ title, url }, index) => {
    return (
      <li key={index}>
        <Link to={url} className="actve">
          {title}
        </Link>
      </li>
    );
  });

  const navbarClickHandler = () => {
    setClicked(!clicked);
  };

  return (
    <nav>
      <Link className="logo" to="/">
        Cook <font>Me</font>
      </Link>
      <div className="links">
        <div className="nav-icon" onClick={navbarClickHandler}>
          <i className={clicked ? "fa fa-times" : "fa fa-bars"}></i>
        </div>
        <ul
          onClick={navbarClickHandler}
          className={clicked ? "nav-list" : "nav-list close"}
        >
          {myLinks}

          <li className="logout">
            <Link to="/" className="actve">
              Logout
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};
