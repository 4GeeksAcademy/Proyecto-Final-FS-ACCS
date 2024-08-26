import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ScrollToTop from "./component/scrollToTop";
import { BackendURL } from "./component/backendURL";

import { Home } from "./pages/home";
import { Navbar } from "./component/navbar";
import { Footer } from "./component/footer";
import { Gestor_bebe } from "./pages/gestor_bebe";
import { Login } from "./component/Login";
import { Register } from "./component/Register";
import { New_Blog } from "./pages/new_blog.jsx";
import { All_Blogs } from "./pages/all_blogs.jsx";
import { All_Recipes } from "./pages/all_recipes.jsx";
import { All_News } from "./pages/all_news.jsx";
import { EditBlog } from "./pages/edit_blog.jsx";
import { BlogDetail } from "./pages/blog_detail.jsx";
import { AddReport } from "./pages/add_report.jsx";
import { ViewReport } from "./pages/view_report.jsx";
import { EditReport } from "./pages/edit_report.jsx";
import { ViewReports } from "./pages/view_all_reports.jsx";
import { AverageReportPage } from "./pages/average_report.jsx";

import injectContext from "./store/appContext";

import { Gestor_perfil } from "./pages/gestor_perfil.js";
import { Reset_password } from "./pages/reset_password.js";
import { Change_password } from "./pages/change_password.js";
import { Gestor_bebes } from "./pages/gestor_bebes.js";
import { Add_baby } from "./pages/add_baby";

//create your first component
const Layout = () => {
    //the basename is used when your project is published in a subdirectory and not in the root of the domain
    // you can set the basename on the .env file located at the root of this project, E.g: BASENAME=/react-hello-webapp/
    const basename = process.env.BASENAME || "";

    if(!process.env.BACKEND_URL || process.env.BACKEND_URL == "") return <BackendURL/ >;

    return (
        <div>
            <BrowserRouter basename={basename}>
                <ScrollToTop>
                {<Navbar /> }
                    <Routes>
                        {/* Home */}
                        <Route element={<Home />} path="/" />
                        {/* Perfil */}
                        <Route element={<Login />} path="/login" />
                        <Route element={<Register />} path="/register" />
                        <Route element={<Reset_password />} path="/reset_password" />
                        <Route element={<Change_password />} path="/change_password" />
                        {/* Bebé */}
                        <Route element={<Gestor_perfil />} path="/gestor_perfil" />
                        <Route element={<Gestor_bebe />} path="/gestor_bebe/:id" />
                        <Route element={<Gestor_bebes />} path="/gestor_bebes" />
                        <Route element={<Add_baby />} path="/add_baby" />
                        {/* Report */}
                        <Route element={<AddReport />} path="/dashboard" />
                        <Route path="/baby/:babyId/:reportId" element={<ViewReport />} />
                        <Route path="/edit_report/:babyId/:reportId" element={<EditReport />} />
                        <Route path="/baby/:babyId/reports" element={<ViewReports />} />
                        <Route path="/average-report/:babyId" element={<AverageReportPage />} />
                        {/* Blog */}
                        <Route element={<New_Blog />} path="/new_blog" />
                        <Route element={<All_Blogs />} path="/blog" />
                        <Route element={<All_Recipes />} path="/recipes" />
                        <Route element={<All_News />} path="/news" />
                        <Route path="/blog/:type/:id" element={<BlogDetail />} />
                        <Route path="/edit_blog/:type/:id" element={<EditBlog />} />
                        {/* 404 */}
                        <Route element={<h1>Not found!</h1>} />
                    </Routes>
                </ScrollToTop>
            </BrowserRouter>
        </div>
    );
};

export default injectContext(Layout);
