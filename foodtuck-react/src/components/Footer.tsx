import { Link } from "react-router-dom";

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer__topBlock">
                <div className="container">
                    <div className="footer__topBlock-inner">
                        <div className="footer__topBlock-leftBlock">
                            <Link to="/" className="topBlock__leftBlock-title">Foodtuck</Link>
                            <p className="footer__leftBlock-text">Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                            Varius sed pharetra dictum neque massa congue</p>
                        </div>
                        <ul className="footer__topBlock-list">
                            <li className="topBlock__list-item">
                                <h4 className="topBlock__item-title">Links</h4>
                            </li>
                            <li className="topBlock__list-item">
                                <Link to="/aboutUs" className="footer__item-link">
                                    <p className="footer__item-linkText">About us</p>
                                </Link>
                            </li>
                            <li className="topBlock__list-item">
                                <Link to="/catalog" className="footer__item-link">
                                    <p className="footer__item-linkText">Our Menu</p>
                                </Link>
                            </li>
                            <li className="topBlock__list-item">
                                <Link to="/cart" className="footer__item-link">
                                    <p className="footer__item-linkText">Cart</p>
                                </Link>
                            </li>
                        </ul>
                        <ul className="footer__topBlock-list">
                            <li className="topBlock__list-item">
                                <h4 className="topBlock__item-title">Contact Us</h4>
                            </li>
                            <li className="topBlock__list-item">
                                <a href="#" className="footer__item-link">
                                    <img src="/images/footer/MapPin.png" alt="" className="footer__item-linkImg" />
                                    <p className="footer__item-linkText">Kolkata India , 3rd Floor, Office 45</p>
                                </a>
                            </li>
                            <li className="topBlock__list-item">
                                <a href="#" className="footer__item-link">
                                    <img src="/images/footer/Phone.png" alt="" className="footer__item-linkImg" />
                                    <p className="footer__item-linkText">065 - 96659986</p>
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            <div className="footer__bottomBlock">
                <div className="container">
                    <p className="footer__bottomBlock-text">Copyright © 2000-2020.logo.com. All rights reserved</p>
                </div>
            </div>
        </footer>
    )
}

export default Footer;