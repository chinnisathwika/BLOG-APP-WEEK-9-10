import { NavLink } from "react-router";
import { pageWrapper, pageTitleClass, bodyText, primaryBtn, secondaryBtn } from "../styles/common";

function Home() {
  return (
    <div className={pageWrapper}>
      <div className="max-w-3xl py-10">
        <p className="text-sm text-[#0066cc] font-medium mb-3">Welcome to MyBlog</p>
        <h1 className={pageTitleClass}>A simple place to write and read.</h1>
        <p className={`${bodyText} text-lg mt-5`}>
          This blog is made for small thoughts, useful notes, and articles that people actually want to come back to.
          You can read posts as a user, or write your own as an author.
        </p>
        <p className={`${bodyText} mt-3`}>
          Nothing too heavy here. Just open an article, read it slowly, leave a comment if you want, and keep going.
        </p>

        <div className="flex flex-wrap gap-3 mt-8">
          <NavLink to="/register" className={primaryBtn}>
            Start Writing
          </NavLink>
          <NavLink to="/login" className={secondaryBtn}>
            Sign In
          </NavLink>
        </div>
      </div>
    </div>
  );
}

export default Home;
