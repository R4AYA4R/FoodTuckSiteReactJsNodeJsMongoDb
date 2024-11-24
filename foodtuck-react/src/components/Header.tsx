
const Header = () => {
    return(
        <header className="header">
            <div className="container">
                <div className="header__inner">
                    <a href="#" className="header__logo-link"><h2>FoodTuck</h2></a>
                    <ul className="header__menu-list">
                        <li className="menu__list-item">
                            <a href="#" className="header__menu-link">Home</a>
                        </li>
                        <li className="menu__list-item">
                            <a href="#" className="header__menu-link">Catalog</a>
                        </li>
                        <li className="menu__list-item">
                            <a href="#" className="header__menu-link">About Us</a>
                        </li>
                        <li className="menu__list-item">
                            <a href="#" className="header__menu-link">
                                <img src="/images/header/User.png" alt="" className="menu__list-itemImg" />
                            </a>
                        </li>
                        <li className="menu__list-item">
                            <a href="#" className="header__menu-link header__menu-linkCart">
                                <img src="/images/header/Tote.png" alt="" className="menu__list-itemImg" />
                                <span className="menu__link-spanCart">0</span>
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        </header>
    )
}

export default Header;