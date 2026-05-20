import { useParams, useLocation, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../stores/authStore";
import { toast } from "react-hot-toast";
import { apiUrl } from "../config/api";
import {
  articlePageWrapper,
  articleHeader,
  articleCategory,
  articleMainTitle,
  articleAuthorRow,
  authorInfo,
  articleContent,
  articleFooter,
  articleActions,
  editBtn,
  deleteBtn,
  loadingClass,
  errorClass,
  inputClass,
  submitBtn,
  ghostBtn,
} from "../styles/common.js";

function ArticleByID() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const user = useAuth((state) => state.currentUser);

  const [article, setArticle] = useState(location.state || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [comment, setComment] = useState("");
  const [commentLoading, setCommentLoading] = useState(false);

  useEffect(() => {
    if (article) return;

    const getArticle = async () => {
      setLoading(true);

      try {
        const res = await axios.get(apiUrl(`/common-api/articles/${id}`), { withCredentials: true });

        setArticle(res.data.payload);
      } catch (err) {
        setError(err.response?.data?.message || err.response?.data?.error || "Article not found");
      } finally {
        setLoading(false);
      }
    };

    getArticle();
  }, [article, id]);

  const formatDate = (date) => {
    return new Date(date).toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  // delete & restore article
  const toggleArticleStatus = async () => {
    const newStatus = !article.isArticleActive;

    const confirmMsg = newStatus ? "Restore this article?" : "Delete this article?";
    if (!window.confirm(confirmMsg)) return;

    try {
      const res = await axios.patch(
        apiUrl(`/author-api/articles/${id}/status`),
        { isArticleActive: newStatus },
        { withCredentials: true },
      );

      console.log("SUCCESS:", res.data);

      setArticle(res.data.payload);

      toast.success(res.data.message);
    } catch (err) {
      console.log("ERROR:", err.response);

      const msg = err.response?.data?.message;

      if (err.response?.status === 400) {
        toast(msg); // already deleted/active case
      } else {
        setError(msg || "Operation failed");
      }
    }
  };
  
  const editArticle = (articleObj) => {
    navigate("/edit-article", { state: articleObj });
  };

  const submitComment = async (event) => {
    event.preventDefault();

    const userId = user?._id || user?.userId;
    const cleanComment = comment.trim();

    if (!userId || !cleanComment) return;

    try {
      setCommentLoading(true);
      const res = await axios.put(
        apiUrl("/user-api/articles"),
        {
          user: userId,
          articleId: article._id,
          comment: cleanComment,
        },
        { withCredentials: true },
      );

      setArticle(res.data.payload);
      setComment("");
      toast.success("Comment added");
    } catch (err) {
      toast.error(err.response?.data?.message || err.response?.data?.error || "Could not add comment");
    } finally {
      setCommentLoading(false);
    }
  };

  const deleteComment = async (commentId) => {
    if (!window.confirm("Delete this comment?")) return;

    const route =
      user?.role === "AUTHOR"
        ? `/author-api/articles/${article._id}/comments/${commentId}`
        : `/user-api/articles/${article._id}/comments/${commentId}`;

    try {
      const res = await axios.delete(apiUrl(route), { withCredentials: true });
      setArticle(res.data.payload);
      toast.success("Comment deleted");
    } catch (err) {
      toast.error(err.response?.data?.message || err.response?.data?.error || "Could not delete comment");
    }
  };

  const getCommentUserName = (commentObj) => {
    if (!commentObj.user) return "User";
    if (typeof commentObj.user === "string") return "User";
    return [commentObj.user.firstName, commentObj.user.lastName].filter(Boolean).join(" ") || commentObj.user.email || "User";
  };

  const canDeleteComment = (commentObj) => {
    const userId = user?._id || user?.userId;
    const commentUserId = typeof commentObj.user === "string" ? commentObj.user : commentObj.user?._id;
    const articleAuthorId = typeof article.author === "string" ? article.author : article.author?._id;

    return Boolean(
      userId &&
        ((user.role === "USER" && commentUserId === userId) || (user.role === "AUTHOR" && articleAuthorId === userId)),
    );
  };

  if (loading) return <p className={loadingClass}>Loading article...</p>;
  if (error) return <p className={errorClass}>{error}</p>;
  if (!article) return null;

  return (
    <div className={articlePageWrapper}>
      <button className={`${ghostBtn} mb-6`} onClick={() => navigate(-1)}>
        Go Back
      </button>

      {/* Header */}
      <div className={articleHeader}>
        <span className={articleCategory}>{article.category}</span>

        <h1 className={`${articleMainTitle} uppercase`}>{article.title}</h1>

        <div className={articleAuthorRow}>
          <div className={authorInfo}>✍️ {article.author?.firstName || "Author"}</div>

          <div>{formatDate(article.createdAt)}</div>
        </div>
      </div>

      {/* Content */}
      <div className={articleContent}>{article.content}</div>

      {/* AUTHOR actions */}
      {user?.role === "AUTHOR" && (
        <div className={articleActions}>
          <button className={editBtn} onClick={() => editArticle(article)}>
            Edit
          </button>

          <button className={deleteBtn} onClick={toggleArticleStatus}>
            {article.isArticleActive ? "Delete" : "Restore"}
          </button>
        </div>
      )}

      <section className="border-t border-[#e8e8ed] mt-12 pt-8">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-semibold text-[#1d1d1f]">Comments</h2>
          <span className="text-sm text-[#a1a1a6]">{article.comments?.length || 0}</span>
        </div>

        {user?.role === "USER" && (
          <form onSubmit={submitComment} className="mb-7">
            <textarea
              className={inputClass}
              rows="4"
              value={comment}
              onChange={(event) => setComment(event.target.value)}
              placeholder="Write what you felt about this article..."
            />
            <button className={`${submitBtn} max-w-44`} type="submit" disabled={commentLoading || !comment.trim()}>
              {commentLoading ? "Adding..." : "Add Comment"}
            </button>
          </form>
        )}

        {article.comments?.length ? (
          <div className="flex flex-col gap-4">
            {article.comments.map((commentObj) => (
              <div key={commentObj._id} className="bg-[#f5f5f7] rounded-xl p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-[#1d1d1f]">{getCommentUserName(commentObj)}</p>
                    <p className="text-sm text-[#6e6e73] mt-1 leading-relaxed">{commentObj.comment}</p>
                  </div>

                  {canDeleteComment(commentObj) && (
                    <button className="text-xs text-[#ff3b30] hover:text-[#d62c23]" onClick={() => deleteComment(commentObj._id)}>
                      Delete
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-[#a1a1a6]">No comments yet. Be the first one to say something.</p>
        )}
      </section>

      {/* Footer */}
      <div className={articleFooter}>Last updated: {formatDate(article.updatedAt)}</div>
    </div>
  );
}

export default ArticleByID;
