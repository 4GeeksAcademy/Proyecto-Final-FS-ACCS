import React, { useState, useEffect, useContext } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { Context } from "../store/appContext";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencil } from '@fortawesome/free-solid-svg-icons';
import "../../styles/all_blogs.css";

export const All_News = props => {
    const { store, actions } = useContext(Context);
    const [blogs, setBlogs] = useState([]);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const response = await fetch(process.env.BACKEND_URL + "api/blog");
                const data = await response.json();

                const filteredBlogs = data.data.filter(blog => blog.type === 'news');

                setBlogs(filteredBlogs);
            } catch (error) {
                console.error("Error fetching blogs:", error);
            }
        };

        const checkAdminStatus = async () => {
            try {
                const response = await fetch(process.env.BACKEND_URL + "api/check_admin", {
                    headers: {
                        'Authorization': `Bearer ${store.token}`
                    }
                });
                const data = await response.json();
                setIsAdmin(data.is_admin);
            } catch (error) {
                console.error("Error checking admin status:", error);
            }
        };

        fetchBlogs();
        checkAdminStatus();
    }, [store.token]);

    return (
        <div className="container all-blogs-container">
            <h1 className="display-4 mb-4 all-blogs-big-title">Blog</h1>
            <div className="d-flex overflow-auto">
                {blogs.length > 0 ? (
                    blogs.map(blog => (
                        <div key={blog.id} className="card all-blogs-card">
                            <Link to={`/blog/${blog.type}/${blog.id}`} className="stretched-link">
                                <img src={blog.img_header} className="card-img-top" alt={blog.title} />
                                <div className="card-img-overlay">
                                    <h5 className="card-title all-blogs-title">
                                        {blog.title}
                                    </h5>
                                </div>
                            </Link>
                            <div className="card-body">
                                <p className="card-text">
                                    {blog.text_intro ? blog.text_intro : blog.text}
                                </p>
                                <div className="all-blogs-btn-container">
                                    {isAdmin && (
                                        <div className="mt-2">
                                            <Link to={`/edit_blog/${blog.type}/${blog.id}`} className="btn btn-warning all-blogs-btn">
                                                <FontAwesomeIcon icon={faPencil} />
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="no-found">
                        <p>No news found.</p>
                    </div>
                )}
            </div>
            {isAdmin && (
                <Link to="/new_blog" className="btn btn-secondary mt-3 all-blogs-btn">
                    New Blog
                </Link>
            )}
        </div>
    );
};

All_News.propTypes = {
    match: PropTypes.object
};