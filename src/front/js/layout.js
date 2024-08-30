import React from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import ScrollToTop from "./component/scrollToTop";
import { BackendURL } from "./component/backendURL";

import { Home } from "./pages/home";
import { Navbar } from "./component/navbar";
import { Footer } from "./component/footer.jsx";
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
import { NotFound } from "./pages/404.jsx";

import injectContext from "./store/appContext";

import { Gestor_perfil } from "./pages/gestor_perfil.js";
import { Reset_password } from "./pages/reset_password.js";
import { Gestor_bebes } from "./pages/gestor_bebes.js";
import { Add_baby } from "./pages/add_baby";

// Create your first component
const Layout = () => {
    const location = useLocation();
    const showFooter = !['/login', '/register'].includes(location.pathname);

    if (!process.env.BACKEND_URL || process.env.BACKEND_URL === "") return <BackendURL />;

    return (
        <div>
            <ScrollToTop>
                <Navbar />
                <Routes>
                    {/* Home */}
                    <Route path="/" element={<Home />} />
                    {/* Perfil */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/reset_password" element={<Reset_password />} />
                    {/* Bebé */}
                    <Route path="/profile" element={<Gestor_perfil />} />
                    <Route path="/manage_baby/:id" element={<Gestor_bebe />} />
                    <Route path="/manage_babies" element={<Gestor_bebes />} />
                    <Route path="/add_baby" element={<Add_baby />} />
                    {/* Report */}
                    <Route path="/dashboard" element={<AddReport />} />
                    <Route path="/baby/:babyId/:reportId" element={<ViewReport />} />
                    <Route path="/edit_report/:babyId/:reportId" element={<EditReport />} />
                    <Route path="/baby/:babyId/reports" element={<ViewReports />} />
                    <Route path="/average-report/:babyId" element={<AverageReportPage />} />
                    {/* Blog */}
                    <Route path="/new_blog" element={<New_Blog />} />
                    <Route path="/blog" element={<All_Blogs />} />
                    <Route path="/recipes" element={<All_Recipes />} />
                    <Route path="/news" element={<All_News />} />
                    <Route path="/blog/:type/:id" element={<BlogDetail />} />
                    <Route path="/edit_blog/:type/:id" element={<EditBlog />} />
                    {/* 404 */}
                    <Route path="*" element={<NotFound />} />
                </Routes>
                {showFooter && <Footer />}
            </ScrollToTop>
        </div>
    );
};

export default injectContext(Layout);