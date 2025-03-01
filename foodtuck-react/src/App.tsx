// чтобы удалить установленную зависимость(установленный модуль через npm),нужно прописать в терминале npm uninstall и название установленного модуля(например,npm uninstall nodemon),лучше создать, подключить git репозиторий в проект,сделать первый commit и push данных в git до того,как создали папку с фронтендом на react js,иначе могут быть ошибки(могут и не быть) сохранений git папки всего проекта и git папки самого фронтенда на react js

import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import HomePage from "./pages/HomePage";
import Catalog from "./pages/Catalog";
import AboutUs from "./pages/AboutUs";
import Cart from "./pages/Cart";
import UserPage from "./pages/UserPage";
import ProductItemPage from "./pages/ProductItemPage";
import ScrollToTop from "./utils/ScrollToTop";
import Footer from "./components/Footer";

function App() {
  return (
    <>
      <BrowserRouter>
        <ScrollToTop/>
        <div className="wrapper">
          <Header/>
          <Routes>
            <Route path="/" element={<HomePage/>} />
            <Route path="/catalog" element={<Catalog/>} />

            {/* закомментировали этот путь до страницы AboutUs,так как не сделали эту страницу */}
            {/* <Route path="/aboutUs" element={<AboutUs/>} /> */}
            <Route path="/cart" element={<Cart/>} />
            <Route path="/userPage" element={<UserPage/>} />
            <Route path="/catalog/:id" element={<ProductItemPage/>} /> {/* указываем после /catalog/ :id,для динамического id,чтобы потом открывалась отдельная страница товара по конкретному id  */}

            <Route path="/*" element={<Navigate to="/" />} /> {/* если пользователь введет в url несуществующую страницу,то его перекинет на главную(в данном случае если пользователь введет в url несуществующую страницу( в path= "/*" - любое значение,кроме тех,которые уже есть в Route), то его перекинет на главную страницу с помощью Navigate(импортировали этот модуль из библиотеки react-router-dom) и в to= указываем на какую страницу(на какой из существующих Route) перекинуть пользователя) */}
          </Routes>
          <Footer/>
        </div>
      </BrowserRouter>
    </>
  );
}

export default App;
