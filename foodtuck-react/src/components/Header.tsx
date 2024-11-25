import { NavLink } from "react-router-dom";

const Header = () => {
    return(
        <header className="header">
            <div className="container">
                <div className="header__inner">
                    <NavLink to="/" className="header__logo-link"><h2>FoodTuck</h2></NavLink>
                    <ul className="header__menu-list">
                        <li className="menu__list-item">
                            <NavLink to="/" className={({isActive}) => isActive ? "header__menu-link header__menu-linkActive" : "header__menu-link"}>Home</NavLink>
                        </li>
                        <li className="menu__list-item">
                            <NavLink to="/catalog" className={({isActive}) => isActive ? "header__menu-link header__menu-linkActive" : "header__menu-link"}>Catalog</NavLink>
                        </li>
                        <li className="menu__list-item">
                            <NavLink to="/aboutUs" className={({isActive}) => isActive ? "header__menu-link header__menu-linkActive" : "header__menu-link"}>About Us</NavLink>
                        </li>
                        <li className="menu__list-item">
                            <NavLink to="/userPage" className={({isActive}) => isActive ? "header__menu-link header__menu-linkActive" : "header__menu-link"}>
                                <img src="/images/header/User.png" alt="" className="menu__list-itemImg" />
                            </NavLink>
                        </li>
                        <li className="menu__list-item">
                            <NavLink to="/cart" className={({isActive}) => isActive ? "header__menu-link  header__menu-linkCart header__menu-linkActive" : "header__menu-link header__menu-linkCart"}>
                                <img src="/images/header/Tote.png" alt="" className="menu__list-itemImg" />
                                <span className="menu__link-spanCart">0</span>
                            </NavLink>
                        </li>
                    </ul>
                </div>
            </div>
        </header>
    )
}

export default Header;