import React from "react";
import Container from "./Container";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import LogoutButton from "./LogoutBtn";

function Header() {
  const authStatus = useSelector((state) => state.auth.status);

  const navItems = [
    { name: "Home", slug: "/", active: !authStatus },
    { name: "Dashboard", slug: "/dashboard", active: authStatus },
    { name: "Login", slug: "/login", active: !authStatus },
    { name: "Signup", slug: "/signup", active: !authStatus },
    { name: "Resumes", slug: "/resumes", active: authStatus },
    { name: "Jobs", slug: "/jobs", active: authStatus },
  ];

  console.log("Auth Status in Navbar:", authStatus);
  

  return (
    <header className="bg-white flex flex-col gap-5 justify-between">
      <Container>
        <nav className="flex pt-3">
          <ul className="flex ml-auto gap-6 mt-2">
            {navItems.map(
              (item) =>
                item.active && (
                  <li key={item.name}>
                    <NavLink
                      to={item.slug}
                      className={({ isActive }) =>
                        `relative px-2 py-1 text-gray-700 hover:text-emerald-700 
                        after:absolute after:left-0 after:bottom-0 after:h-[2px] after:bg-blue-500 
                        after:transition-all after:duration-300
                        ${isActive ? "after:w-full text-emerald-700" : "after:w-0"} hover:after:w-full`
                      }
                    >
                      {item.name}
                    </NavLink>
                  </li>
                )
            )}
            {authStatus && (
              <li>
                <LogoutButton />
              </li>
            )}
          </ul>
        </nav>
      </Container>
      <div className="w-5/6 h-[1px] bg-blue-300 mx-auto"></div>
    </header>
  );
}

export default Header;
