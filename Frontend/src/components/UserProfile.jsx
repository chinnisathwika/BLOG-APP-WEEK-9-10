import { useAuth } from "../stores/authStore";
import { useNavigate } from "react-router";
import { toast } from "react-hot-toast";
import axios from "axios";
import { useEffect, useState } from "react";
import { apiUrl } from "../config/api";

import {
  articleGrid,
  articleCardClass,
  articleTitle,
  ghostBtn,
  loadingClass,
  errorClass,
  timestampClass,
} from "../styles/common.js";

function UserProfile() {
  const logout = useAuth((state) => state.logout);
  const currentUser = useAuth((state) => state.currentUser);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    if (!currentUser) return;

    const getArticles = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get(apiUrl("/user-api/articles"), { 
          withCredentials: true 
        });

        setArticles(res.data.payload || []);
      } catch (err) {
        // Read the exact backend response message ("Unauthorized. Please login", etc.)
        setError(err.response?.data?.message || err.response?.data?.error || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    getArticles();
  }, [currentUser]);

  // convert UTC → IST
  const formatDateIST = (date) => {
    return new Date(date).toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  const onLogout = async () => {
    await logout();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const navigateToArticleByID = (articleObj) => {
    navigate(`/article/${articleObj._id}`, {
      state: articleObj,
    });
  };

  if (loading) {
    return <p className={loadingClass}>Loading articles...</p>;
  }

  return (
    <div>
      {error && <p className={errorClass}>{error}</p>}

      <div className="text-end">
        <p className="text-2xl"> Welcome, {currentUser?.firstName || "User"}</p>
        {currentUser?.profileImageUrl && (
          <img src={currentUser?.profileImageUrl} className="w-14 mr-2 rounded-full block ms-auto" alt="" />
        )}
      </div>
      <div className="flex justify-end mb-6 mt-3">
        <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={onLogout}>
          Logout
        </button>
      </div>

      <div className={articleGrid}>
        {articles.length === 0 && !error ? (
          <p className="text-center col-span-full text-gray-500">No articles available.</p>
        ) : (
          articles.map((articleObj) => (
            <div className={articleCardClass} key={articleObj._id}>
              <div className="flex flex-col h-full">
                {/* Top Content */}
                <div>
                  <p className={articleTitle}>{articleObj.title}</p>
                  <p>{articleObj.content ? `${articleObj.content.slice(0, 20)}...` : ""}</p>
                  <p className={timestampClass}>{formatDateIST(articleObj.createdAt)}</p>
                </div>

                {/* Button at bottom */}
                <button className={`${ghostBtn} mt-auto pt-4`} onClick={() => navigateToArticleByID(articleObj)}>
                  Read Article →
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default UserProfile;
