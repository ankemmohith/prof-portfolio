import React from "react";
// add imports at the top
import { AuthProvider, useAuth } from "./auth/AuthContext";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

import { BrowserRouter as Router, Routes, Route, Link, NavLink, useLocation } from "react-router-dom";

/* ----------------------------------------------
   Tailwind (safe dev fallback) – optional
   ---------------------------------------------- */
(function ensureTailwind() {
  try {
    if (typeof window === "undefined" || typeof document === "undefined") return;
    // Predefine so we never hit "tailwind is not defined"
    window.tailwind = window.tailwind || {};
    const existing = window.tailwind.config || {};
    window.tailwind.config = { darkMode: "class", ...existing };
    if (!document.querySelector("#twcdn")) {
      const s = document.createElement("script");
      s.id = "twcdn";
      s.src = "https://cdn.tailwindcss.com";
      s.referrerPolicy = "no-referrer";
      document.head.appendChild(s);
    }
  } catch {}
})();

/* ----------------------------------------------
   Theme Context
   ---------------------------------------------- */
const ThemeContext = React.createContext({ theme: "light", toggle: () => {} });
const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = React.useState(() => {
    try { return localStorage.getItem("theme") || "light"; } catch { return "light"; }
  });

  React.useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") root.classList.add("dark"); else root.classList.remove("dark");
    try { localStorage.setItem("theme", theme); } catch {}
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, toggle: () => setTheme(t => (t === "dark" ? "light" : "dark")) }}>
      {children}
    </ThemeContext.Provider>
  );
};
const useTheme = () => React.useContext(ThemeContext);

/* ----------------------------------------------
   App Shell: global background + safe CSS fallback
   ---------------------------------------------- */
const AppShell = ({ children }) => (
  <>
    {/* Minimal fallback so background is full width even if Tailwind isn't present */}
    <style>{`
      *,*::before,*::after{box-sizing:border-box}
      :root{--bg-light:#f8fafc;--bg-dark:#0b0b0c;--text-light:#111827;--text-dark:#e5e7eb}
      html,body{margin:0;padding:0}
      /* Keep layout width stable between pages with/without vertical scrollbars */
      html{scrollbar-gutter: stable both-edges}
      /* Fallback for browsers that ignore scrollbar-gutter */
      body{background:var(--bg-light);color:var(--text-light);overflow-y:scroll}
      .dark body{background:var(--bg-dark);color:var(--text-dark)}
    `}</style>

    {/* Tailwind-driven background/text (will override fallback if Tailwind is loaded) */}
    <div className="min-h-screen bg-gray-50 text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100">
      {children}
    </div>
  </>
);

/* ----------------------------------------------
   Layout Helpers
   ---------------------------------------------- */
const Container = ({ children, className = "", full = false }) => (
  <div
    className={`px-4 sm:px-6 lg:px-8 ${className}`}
    style={{ marginInline: 'auto', width: full ? '100%' : 'min(100%, 80rem)' }}
  >
    {children}
  </div>
);

const Section = ({ title, eyebrow, children, className = "" }) => (
  <section className={`py-10 sm:py-14 ${className}`}>
    <Container>
      {eyebrow && (
        <p className="mb-2 text-xs uppercase tracking-widest text-neutral-500 dark:text-neutral-400">
          {eyebrow}
        </p>
      )}
      <h2 className="text-2xl sm:text-3xl font-bold">{title}</h2>
      <div className="mt-4">{children}</div>
    </Container>
  </section>
);

const NavLinkItem = ({ to, children }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `rounded-xl px-3 py-2 text-sm font-medium transition-colors duration-200
       ${
         isActive
           ? "bg-neutral-200 dark:bg-neutral-800 text-amber-500" // active tab color
           : "text-neutral-800 dark:text-neutral-200 hover:text-amber-400 hover:bg-neutral-100 dark:hover:bg-neutral-800"
       }`
    }
  >
    {children}
  </NavLink>
);

const NavbarActions = () => {
  const { user, isAdmin, editMode, setEditMode, logout } = useAuth();
  const { theme, toggle } = useTheme();

  return (
    <div className="flex items-center justify-end gap-2">
      <button
        onClick={toggle}
        className="hidden md:inline-flex rounded-xl border border-neutral-300 dark:border-neutral-700 px-3 py-2 text-sm"
      >
        {theme === "dark" ? "Light" : "Dark"}
      </button>

      {user ? (
        <>
          {isAdmin && (
            <button
              onClick={() => setEditMode(v => !v)}
              className={`rounded-xl border px-3 py-2 text-sm ${
                editMode
                  ? "bg-amber-500 text-black border-amber-500"
                  : "border-neutral-300 dark:border-neutral-700"
              }`}
              title="Toggle edit mode"
            >
              {editMode ? "Editing…" : "Edit"}
            </button>
          )}
          <button
            onClick={logout}
            className="rounded-xl border border-neutral-300 dark:border-neutral-700 px-3 py-2 text-sm"
          >
            Logout
          </button>
        </>
      ) : (
        <>
          <Link
            to="/login"
            className="rounded-xl border border-neutral-300 dark:border-neutral-700 px-3 py-2 text-sm"
          >
            Login
          </Link>
          <Link
            to="/signup"
            className="hidden sm:inline-block rounded-xl border border-neutral-300 dark:border-neutral-700 px-3 py-2 text-sm"
          >
            Sign up
          </Link>
        </>
      )}
    </div>
  );
};


/* ----------------------------------------------
   Navbar (brand | centered nav | actions)
   ---------------------------------------------- */
const Navbar = () => {
  const { theme, toggle } = useTheme();
  const [open, setOpen] = React.useState(false);
  const location = useLocation();
  React.useEffect(() => setOpen(false), [location.pathname]);

  return (
    <header className="sticky top-0 z-50 border-b bg-white/90 dark:bg-neutral-950/80 backdrop-blur">
      <Container className="grid grid-cols-[1fr_auto_1fr] items-center py-3">
        {/* Left: brand */}
        <Link to="/" className="font-semibold">
          <span className="text-blue-700 dark:text-amber-400">SJSU</span> · Prof. Navrati Saxena
        </Link>

        {/* Center: nav */}
        <nav className="hidden md:flex items-center justify-center gap-2">
          <NavLinkItem to="/">Home</NavLinkItem>
          <NavLinkItem to="/teaching">Teaching</NavLinkItem>
          <NavLinkItem to="/research">Research</NavLinkItem>
          <NavLinkItem to="/services">Services</NavLinkItem>
          <NavLinkItem to="/publications">Publications</NavLinkItem>
          <NavLinkItem to="/contact">Contact</NavLinkItem>
        </nav>

        {/* Right: actions */}
        {/* Right: actions */}
        <div className="flex items-center justify-end gap-2">
          <NavbarActions />
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden rounded-xl border border-neutral-300 dark:border-neutral-700 px-3 py-2 text-sm"
          >
            Menu
          </button>
        </div>

      </Container>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t">
          <Container className="flex flex-col gap-1 py-2">
            <button
              onClick={toggle}
              className="self-start rounded-xl border border-neutral-300 dark:border-neutral-700 px-3 py-2 text-sm mb-1"
            >
              Switch to {theme === "dark" ? "Light" : "Dark"}
            </button>
            <NavLinkItem to="/">Home</NavLinkItem>
            <NavLinkItem to="/teaching">Teaching</NavLinkItem>
            <NavLinkItem to="/research">Research</NavLinkItem>
            <NavLinkItem to="/services">Services</NavLinkItem>
            <NavLinkItem to="/publications">Publications</NavLinkItem>
            <NavLinkItem to="/contact">Contact</NavLinkItem>
          </Container>
        </div>
      )}
    </header>
  );
};

/* ----------------------------------------------
   Footer
   ---------------------------------------------- */
const Footer = () => (
  <footer className="border-t py-8 text-sm">
    <Container className="flex flex-col items-center sm:flex-row sm:justify-between gap-3">
      <p className="text-neutral-600 dark:text-neutral-400">
        {"\u00A9"} {new Date().getFullYear()} Navrati Saxena {"\u00B7"} Department of Computer Science, SJSU
      </p>
      <div className="flex gap-4">
        <a href="#" className="hover:underline">Privacy</a>
        <a href="#" className="hover:underline">Accessibility</a>
        <a href="#" className="hover:underline">Sitemap</a>
      </div>
    </Container>
  </footer>
);

/* ----------------------------------------------
   Pages
   ---------------------------------------------- */

const Home = () => (
  <main>
    <div className="bg-gradient-to-br from-blue-50 via-white to-yellow-50 dark:from-slate-900 dark:via-slate-950 dark:to-amber-950">
  <Container className="py-16 sm:py-24">
    <div className="grid items-center gap-12 md:grid-cols-[1fr,320px] lg:grid-cols-[1fr,360px]">
      {/* Left: title + summary + CTAs */}
      <div className="max-w-3xl">
        <h1 className="text-4xl sm:text-5xl font-extrabold">Saxena, Navrati</h1>
        <p className="mt-4 text-base sm:text-lg text-neutral-700 dark:text-neutral-300">
          Assistant Professor, <a href="https://www.sjsu.edu/cs/" target="_blank" rel="noreferrer" className="hover:underline">Department of Computer Science</a>
          <br />Graduate Coordinator for MS Computer Science
          <br />Undergraduate Research Opportunity Program (UROP) Mentor
          <br />San Jose State University (SJSU), California, USA.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link to="/teaching" className="rounded-xl border px-4 py-2 hover:bg-neutral-100 dark:hover:bg-neutral-800">
            Explore Teaching
          </Link>
          <Link to="/research" className="rounded-xl border px-4 py-2 hover:bg-neutral-100 dark:hover:bg-neutral-800">
            View Research
          </Link>
        </div>
      </div>

      {/* Right: larger headshot */}
      <figure className="justify-self-center md:justify-self-end">
        <div className="relative">
          <div
            className="absolute inset-0 rounded-full blur-2xl opacity-30
                       bg-gradient-to-br from-blue-500 to-amber-500"
            aria-hidden
          />
          <img
            src="/images/headshot.jpg"           
            alt="Prof. Navrati Saxena"
            loading="lazy"
            width={400}
            height={400}
            sizes="(min-width: 1024px) 360px, (min-width: 768px) 320px, 200px"
            className="relative h-44 w-44 sm:h-56 sm:w-56 md:h-72 md:w-72
                       rounded-full object-cover ring-6 ring-white dark:ring-neutral-900 shadow-2xl"
          />
        </div>
        <figcaption className="sr-only">Profile photo</figcaption>
      </figure>
    </div>
  </Container>
</div>


    <Section title="Bio" eyebrow="About">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border p-5">
          <p className="text-sm leading-6 text-neutral-700 dark:text-neutral-300">
            Prof. Saxena is an Assistant Professor at the Department of Computer Science, SJSU. Prior to SJSU, she was
            an Assistant/Associate Professor and Director of the Mobile Ubiquitous System Information Center (MUSIC) at
            the College of Information and Communication Engineering, Sungkyunkwan University (SKKU), South Korea,
            where she supervised 12 Ph.D. and 22 MS (research) students and served as an international student advisor.
            Earlier, she was a visiting researcher at the University of Texas at Arlington, USA. She received her Ph.D.
            from the University of Trento, Italy.
          </p>
          <p className="mt-4 text-sm leading-6 text-neutral-700 dark:text-neutral-300">
            Her research interests include 5G/6G wireless, IoT, social networking, smart grids, device-to-device (D2D),
            vehicular communications, and related areas. She has co-authored a book, filed two patents, published an international
            book chapter on 6G, and authored 90+ international journal and conference publications with 4,000+ citations.
            She also serves as guest editor for journals and as TPC chair/member for international conferences.
          </p>
        </div>

        <div className="grid gap-4">
          <div className="rounded-2xl border p-5">
            <h4 className="font-semibold">Highlights</h4>
            <ul className="mt-2 list-disc pl-5 text-sm">
              <li>Director, MUSIC research center at SKKU (previous workplace).</li>
              <li>Supervised 12 Ph.D. and 22 MS (research) students.</li>
              <li>Book chapter on next generation 6G wireless.</li>
              <li>90+ publications and 4,000+ citations.</li>
            </ul>
          </div>
          <div className="rounded-2xl border p-5">
            <h4 className="font-semibold">Selected Publications</h4>
            <ul className="mt-2 list-disc pl-5 text-sm">
              <li>
                “Next Generation 5G Wireless Networks: A Comprehensive Survey,” IEEE Communications Surveys & Tutorials,
                2016, Popular Article.
              </li>
              <li>
                “Efficient Monitoring and Contact Tracing for COVID-19: A Smart IoT-Based Framework,” IEEE Internet of Things Magazine, 2020,
                one of the most accessed articles on IEEE Xplore.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </Section>

    <Section title="Quick Access">
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <li><Link to="/teaching" className="block rounded-xl border p-4">Teaching</Link></li>
        <li><Link to="/research" className="block rounded-xl border p-4">Research</Link></li>
        <li><Link to="/services" className="block rounded-xl border p-4">Services</Link></li>
        <li><Link to="/publications" className="block rounded-xl border p-4">Publications</Link></li>
        <li><Link to="/contact" className="block rounded-xl border p-4">Contact</Link></li>
      </ul>
    </Section>

    <Section title="Links" eyebrow="Explore">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border p-5">
          <h4 className="font-semibold">Profiles & Labs</h4>
          <div className="mt-2 flex flex-wrap gap-2 text-sm">
            <a className="rounded border px-3 py-1 hover:underline" href="#" target="_blank" rel="noreferrer">Research Lab Website</a>
            <a className="rounded border px-3 py-1 hover:underline" href="https://scholar.google.com/citations?user=SfFcFBwAAAAJ&hl=en" target="_blank" rel="noreferrer">Google Scholar (Citations)</a>
            <a className="rounded border px-3 py-1 hover:underline" href="https://www.linkedin.com/in/navrati-saxena/" target="_blank" rel="noreferrer">LinkedIn</a>
            <a className="rounded border px-3 py-1 hover:underline" href="http://lab.icc.skku.ac.kr/~navrati/research.html" target="_blank" rel="noreferrer">Previous Workplace Webpage</a>
          </div>
        </div>

        <div className="rounded-2xl border p-5">
          <h4 className="font-semibold">Talks, Chapters, News</h4>
          <ul className="mt-2 list-disc pl-5 text-sm">
            <li><a className="hover:underline" href="#" target="_blank" rel="noreferrer">Research talk at College of Science, SJSU (Seminar)</a></li>
            <li><a className="hover:underline" href="#" target="_blank" rel="noreferrer">Book chapter on next generation 6G wireless (Springer)</a></li>
            <li><a className="hover:underline" href="#" target="_blank" rel="noreferrer">Korea Herald coverage of MUSIC, SKKU</a></li>
          </ul>
        </div>
      </div>
    </Section>
  </main>
);

/*
const Teaching = () => (
  <main>
    <Section title="Teaching" eyebrow="Courses & Student Info">
      
      <div className="overflow-hidden rounded-2xl border shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-neutral-100 dark:bg-neutral-900">
            <tr>
              <th className="p-3">#</th>
              <th className="p-3">Code / Course</th>
              <th className="p-3">Level</th>
              <th className="p-3">Links</th>
            </tr>
          </thead>
          <tbody>
            {[
              { i: 1, code: "CS 146 / Data Structures & Algorithms", level: "Undergraduate" },
              { i: 2, code: "CS 250 / Graduate Networking", level: "Graduate" },
              { i: 3, code: "CS 256 / Mobile & Wireless Systems", level: "Graduate" },
            ].map(row => (
              <tr key={row.i} className="odd:bg-white even:bg-neutral-50/60 dark:odd:bg-neutral-950 dark:even:bg-neutral-900">
                <td className="p-3">{row.i}</td>
                <td className="p-3 font-medium">{row.code}</td>
                <td className="p-3">{row.level}</td>
                <td className="p-3"><a className="rounded border px-2 py-1 hover:underline" href="#">Syllabus</a></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border p-5">
          <h4 className="font-semibold">Office Hours</h4>
          <p className="mt-2 text-sm">Mon & Wed: 12:15–1:15 PM (MSCS). Tue: 9:00–11:00 AM (course queries).</p>
        </div>
        <div className="rounded-2xl border p-5">
          <h4 className="font-semibold">Student Resources</h4>
          <ul className="mt-2 list-disc pl-5 text-sm">
            <li><a className="hover:underline" href="#">Canvas</a></li>
            <li><a className="hover:underline" href="#">one.SJSU</a></li>
            <li><a className="hover:underline" href="#">Academic Integrity</a></li>
          </ul>
        </div>
      </div>
    </Section>
  </main>
);
*/


const Teaching = () => (
  <main>
    <Section title="Teaching Courses" eyebrow="San Jose State University (SJSU)">
      <p className="text-amber-400 text-neutral-700 dark:text-neutral-300 mb-6">
        Current and past courses taught by Prof. Saxena at San José State University.
      </p>

      {/* --- Current & Past Courses at SJSU --- */}
      {[
        {
          term: "Summer 2022",
          courses: [
            { i: 1, code: "CS 146A-01&61 / Data Structures & Algorithms", level: "Under Graduate" },
            { i: 2, code: "CS 158A-01&61 / Computer Networks", level: "Under Graduate" },
          ],
        },
        {
          term: "Spring 2022",
          courses: [
            { i: 1, code: "CS 146-01 / Data Structures & Algorithms", level: "Under Graduate" },
            { i: 2, code: "CS 258-01 / Computer Communication System", level: "Graduate" },
          ],
        },
        {
          term: "Fall 2021",
          courses: [
            { i: 1, code: "CS 146-08 / Data Structures & Algorithms", level: "Under Graduate" },
            { i: 2, code: "CS 146-09 / Data Structures & Algorithms", level: "Under Graduate" },
            { i: 3, code: "CS 268-01 / Wireless Mobile Networks", level: "Graduate" },
            { i: 4, code: "CS 298-08 / Master's Writing Project", level: "Graduate" },
          ],
        },
        {
          term: "Summer 2021",
          courses: [
            { i: 1, code: "CS 158A-01&61 / Computer Networks", level: "Under Graduate" },
          ],
        },
        {
          term: "Spring 2021",
          courses: [
            { i: 1, code: "CS 146-04 / Data Structures & Algorithms", level: "Under Graduate" },
            { i: 2, code: "CS 258-01 / Computer Communication System", level: "Graduate" },
          ],
        },
        {
          term: "Fall 2020",
          courses: [
            { i: 1, code: "CS 146-09 / Data Structures & Algorithms", level: "Under Graduate" },
            { i: 2, code: "CS 146-11 / Data Structures & Algorithms", level: "Under Graduate" },
            { i: 3, code: "CS 268-01 / Wireless Mobile Networks", level: "Graduate" },
            { i: 4, code: "CS 297-17 / Pre Writing Project or Thesis", level: "Graduate" },
          ],
        },
      ].map(({ term, courses }) => (
        <div key={term} className="mb-10">
          <h4 className="text-amber-400 font-semibold mb-2">{term}</h4>
          <div className="overflow-x-auto rounded-2xl border shadow-sm">
            <table className="w-full text-left text-sm">
              <thead className="bg-neutral-100 dark:bg-neutral-900">
                <tr>
                  <th className="p-3 w-10">#</th>
                  <th className="p-3">Code / Course</th>
                  <th className="p-3">Level</th>
                </tr>
              </thead>
              <tbody>
                {courses.map((row) => (
                  <tr
                    key={row.i}
                    className="odd:bg-white even:bg-neutral-50/60 dark:odd:bg-neutral-950 dark:even:bg-neutral-900"
                  >
                    <td className="p-3">{row.i}</td>
                    <td className="p-3 font-medium">{row.code}</td>
                    <td className="p-3">{row.level}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </Section>

    {/* --- Previous Institutions --- */}
    <Section title="Courses Taught at Previous Institutions">
      <div className="overflow-x-auto rounded-2xl border shadow-sm divide-y divide-neutral-700/50 dark:divide-neutral-800/70">
        <table className="w-full text-left text-sm">
          <thead className="bg-neutral-100 dark:bg-neutral-900">
            <tr>
              <th className="p-3 w-10">#</th>
              <th className="p-3">Course Title</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-800/40 dark:divide-neutral-700/30">

            {/* ---------- Undergraduate courses ---------- */}
            <tr>
              <td colSpan="2" className="p-4 font-semibold text-amber-400 text-base bg-neutral-900 dark:bg-neutral-950 border-t border-neutral-700">
                Undergraduate Courses at Sungkyunkwan University (SKKU), South Korea
              </td>
            </tr>
            {[
              "Computer Programming for Engineers using C",
              "Computer Programming for Engineers using C++",
              "Computer Programming for Engineers using Java",
              "Computer Programming for Engineers using Python",
              "Web Programming for Engineers",
              "Computer Networks",
              "Operating Systems Concepts",
            ].map((title, i) => (
              <tr
                key={`ug-${i}`}
                className="odd:bg-neutral-950 even:bg-neutral-900 hover:bg-neutral-800/70 transition-colors"
              >
                <td className="p-3">{i + 1}</td>
                <td className="p-3 font-medium">{title}</td>
              </tr>
            ))}

            {/* ---------- Graduate courses ---------- */}
            <tr>
              <td colSpan="2" className="p-4 font-semibold text-amber-400 text-base bg-neutral-900 dark:bg-neutral-950 border-t border-neutral-700">
                Graduate Courses at Sungkyunkwan University (SKKU), South Korea
              </td>
            </tr>
            {[
              "Advanced Data Networks",
              "Genetic Algorithms",
              "Wireless Networks",
              "Research Methodologies - Writing IT Technical Papers",
              "Web Programming for Engineers",
              "Computer Networks",
              "Operating Systems Concepts",
            ].map((title, i) => (
              <tr
                key={`grad-${i}`}
                className="odd:bg-neutral-950 even:bg-neutral-900 hover:bg-neutral-800/70 transition-colors"
              >
                <td className="p-3">{i + 8}</td>
                <td className="p-3 font-medium">{title}</td>
              </tr>
            ))}

            {/* ---------- Samsung HQ ---------- */}
            <tr>
              <td colSpan="2" className="p-4 font-semibold text-amber-400 text-base bg-neutral-900 dark:bg-neutral-950 border-t border-neutral-700">
                Special Courses for Employees at Samsung Electronics, HQ (Suwon, South Korea)
              </td>
            </tr>
            {[
              "Advanced Data Networks",
              "Wireless Networks",
              "Research Methodologies - Writing IT Technical Papers",
              "Special Lectures on Presentation, Big Data, 5G and Beyond for Samsung Employees/Students",
            ].map((title, i) => (
              <tr
                key={`samsung-${i}`}
                className="odd:bg-neutral-950 even:bg-neutral-900 hover:bg-neutral-800/70 transition-colors"
              >
                <td className="p-3">{i + 15}</td>
                <td className="p-3 font-medium">{title}</td>
              </tr>
            ))}

            {/* ---------- International Summer Semester ---------- */}
            <tr>
              <td colSpan="2" className="p-4 font-semibold text-amber-400 text-base bg-neutral-900 dark:bg-neutral-950 border-t border-neutral-700">
                International Summer Semester (ISS), SKKU, South Korea
              </td>
            </tr>
            {[
              "Technology, Society and Sustainability",
              "Smart Phone Revolution",
            ].map((title, i) => (
              <tr
                key={`iss-${i}`}
                className="odd:bg-neutral-950 even:bg-neutral-900 hover:bg-neutral-800/70 transition-colors"
              >
                <td className="p-3">{i + 19}</td>
                <td className="p-3 font-medium">{title}</td>
              </tr>
            ))}

            {/* ---------- Samsung Medical Center ---------- */}
            <tr>
              <td colSpan="2" className="p-4 font-semibold text-amber-400 text-base bg-neutral-900 dark:bg-neutral-950 border-t border-neutral-700">
                Samsung Medical Center, Gangnam, South Korea
              </td>
            </tr>
            <tr className="odd:bg-neutral-950 even:bg-neutral-900 hover:bg-neutral-800/70 transition-colors">
              <td className="p-3">21</td>
              <td className="p-3 font-medium">Research Methodologies - Writing Research Papers</td>
            </tr>

            {/* ---------- Amity University ---------- */}
            <tr>
              <td colSpan="2" className="p-4 font-semibold text-amber-400 text-base bg-neutral-900 dark:bg-neutral-950 border-t border-neutral-700">
                Amity University, India
              </td>
            </tr>
            {[
              "Operating Systems Concepts",
              "Computer Networks",
            ].map((title, i) => (
              <tr
                key={`amity-${i}`}
                className="odd:bg-neutral-950 even:bg-neutral-900 hover:bg-neutral-800/70 transition-colors"
              >
                <td className="p-3">{i + 22}</td>
                <td className="p-3 font-medium">{title}</td>
              </tr>
            ))}

            {/* ---------- IMT Ghaziabad ---------- */}
            <tr>
              <td colSpan="2" className="p-4 font-semibold text-amber-400 text-base bg-neutral-900 dark:bg-neutral-950 border-t border-neutral-700">
                Institute of Management Technology (IMT), Ghaziabad, India
              </td>
            </tr>
            {[
              "Advanced Computer Networks",
              "Mobile Computing",
            ].map((title, i) => (
              <tr
                key={`imt-${i}`}
                className="odd:bg-neutral-950 even:bg-neutral-900 hover:bg-neutral-800/70 transition-colors"
              >
                <td className="p-3">{i + 24}</td>
                <td className="p-3 font-medium">{title}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Section>


  </main>
);


const Research = () => (
  <main>
    <Section title="Research" eyebrow="Lab, Interests & Grants">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border p-5">
          <h4 className="font-semibold">Research Interests</h4>
          <p className="mt-2 text-sm text-neutral-700 dark:text-neutral-300">
            5G/6G wireless networks, IoT, social networking, smart grids, device-to-device (D2D), vehicular
            communications, satellite networks, and wireless systems.
          </p>
        </div>
        <div className="rounded-2xl border p-5">
          <h4 className="font-semibold">Research Group / Lab</h4>
          <p className="mt-2 text-sm">Mobile Ubiquitous Systems Information Center (MUSIC).</p>
          <div className="mt-3 flex flex-wrap gap-2 text-sm">
            <a href="#" className="rounded border px-3 py-1 hover:underline">Lab Website</a>
            <a href="#" className="rounded border px-3 py-1 hover:underline">People</a>
            <a href="#" className="rounded border px-3 py-1 hover:underline">Grants</a>
          </div>
        </div>
      </div>

      <div className="mt-8 grid gap-5 md:grid-cols-3">
        {[
          { title: "6G Networks & Edge Intelligence", desc: "Resource allocation, reliability, and ultra-low latency." },
          { title: "IoT & Smart Mobility", desc: "Vehicular networks, V2X communication, and safety systems." },
          { title: "Social & Opportunistic Networking", desc: "D2D communication and decentralized coordination." },
        ].map(x => (
          <div key={x.title} className="rounded-2xl border p-5">
            <h5 className="font-semibold">{x.title}</h5>
            <p className="mt-2 text-sm text-neutral-700 dark:text-neutral-300">{x.desc}</p>
          </div>
        ))}
      </div>
    </Section>
  </main>
);

const Services = () => (
  <main>
    <Section title="Services" eyebrow="Committees & Outreach">
      <div className="overflow-hidden rounded-2xl border shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-neutral-100 dark:bg-neutral-900">
            <tr>
              <th className="p-3">#</th>
              <th className="p-3">Committee Name</th>
              <th className="p-3">Level</th>
              <th className="p-3">Role</th>
            </tr>
          </thead>
          <tbody>
            {[
              [1, "CoS Anti-Racism Committee", "College", "Member"],
              [2, "Systems & Architecture Committee", "Department", "Chair"],
              [3, "Executive Committee", "Department", "Member"],
              [4, "Diversity, Equity & Inclusion (DEI)", "Department", "Member"],
            ].map(([i, name, level, role]) => (
              <tr key={i} className="odd:bg-white even:bg-neutral-50/60 dark:odd:bg-neutral-950 dark:even:bg-neutral-900">
                <td className="p-3">{i}</td>
                <td className="p-3 font-medium">{name}</td>
                <td className="p-3">{level}</td>
                <td className="p-3">{role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border p-5">
          <h4 className="font-semibold">Other Services</h4>
          <ul className="mt-2 list-disc pl-5 text-sm">
            <li>CS Department Advising</li>
            <li>Peer Connections – Faculty Advisory Board</li>
            <li>Judge – Synopsys Outreach Foundation ACSEF</li>
            <li>Advisor – Yoga & Meditation Club @ SJSU</li>
          </ul>
        </div>
        <div className="rounded-2xl border p-5">
          <h4 className="font-semibold">Student Guidance</h4>
          <p className="mt-2 text-sm text-neutral-700 dark:text-neutral-300">
            Prospective MS students can find FAQs and process guidance here.
          </p>
          <div className="mt-3 flex flex-wrap gap-2 text-sm">
            <a href="#" className="rounded border px-3 py-1 hover:underline">MS CS Handbook</a>
            <a href="#" className="rounded border px-3 py-1 hover:underline">Graduate Forms</a>
            <a href="#" className="rounded border px-3 py-1 hover:underline">Advising Slots</a>
          </div>
        </div>
      </div>
    </Section>
  </main>
);

const Publications = () => (
  <main>
    <Section title="Publications" eyebrow="Selected Works & Links">
      <div className="grid gap-5 md:grid-cols-2">
        <div className="rounded-2xl border p-5">
          <h4 className="font-semibold">Highlights</h4>
          <ul className="mt-2 list-disc pl-5 text-sm">
            <li>Book chapter: <em>Next Generation 6G Wireless</em> (Springer).</li>
            <li>IEEE Communications Surveys & Tutorials (2016) – Popular Article.</li>
            <li>90+ journal and conference publications.</li>
          </ul>
        </div>
        <div className="rounded-2xl border p-5">
          <h4 className="font-semibold">Profiles</h4>
          <div className="mt-2 flex flex-wrap gap-2 text-sm">
            <a className="rounded border px-3 py-1 hover:underline" href="#">Google Scholar</a>
            <a className="rounded border px-3 py-1 hover:underline" href="#">Research Lab</a>
            <a className="rounded border px-3 py-1 hover:underline" href="#">Springer Chapter</a>
            <a className="rounded border px-3 py-1 hover:underline" href="#">IEEE Xplore</a>
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border p-5">
        <h4 className="font-semibold">Recent Publications</h4>
        <ul className="mt-2 space-y-3 text-sm">
          {[
            { title: "Next Generation 6G Wireless Networks: A Comprehensive Survey", venue: "IEEE Communications Surveys & Tutorials", year: 2016 },
            { title: "Opportunistic D2D in Vehicular Networks", venue: "IEEE Transactions on Mobile Computing", year: 2020 },
            { title: "Edge Intelligence for 6G", venue: "Computer Networks", year: 2022 },
          ].map((p, idx) => (
            <li key={idx} className="rounded-xl border p-3">
              <div className="font-medium">{p.title}</div>
              <div className="text-neutral-500">{p.venue} {"\u00B7"} {p.year}</div>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  </main>
);

const Contact = () => (
  <main>
    <Section title="Contact" eyebrow="Reach Out">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border p-5">
          <h4 className="font-semibold">Details</h4>
          <ul className="mt-2 space-y-2 text-sm">
            <li><span className="font-medium">Email:</span> navrati.saxena@sjsu.edu</li>
            <li><span className="font-medium">Phone:</span> 408-924-5121</li>
            <li><span className="font-medium">Office Hours:</span> See Teaching page</li>
          </ul>
        </div>
        <div className="rounded-2xl border p-5">
          <h4 className="font-semibold">Student Message (optional)</h4>
          <form onSubmit={(e)=>{e.preventDefault(); alert("Thanks! Your message has been noted.");}} className="mt-3 space-y-3">
            <input required placeholder="Your name" className="w-full rounded-xl border px-3 py-2" />
            <input required type="email" placeholder="Your email" className="w-full rounded-xl border px-3 py-2" />
            <textarea required placeholder="Message" rows={4} className="w-full rounded-xl border px-3 py-2" />
            <button className="rounded-xl border bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700">Send</button>
          </form>
        </div>
      </div>
    </Section>
  </main>
);

/* ----------------------------------------------
   App
   ---------------------------------------------- */
export default function App() {
  return (
    <AuthProvider>
    <ThemeProvider>
      <AppShell>
        <Router>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/teaching" element={<Teaching />} />
            <Route path="/research" element={<Research />} />
            <Route path="/services" element={<Services />} />
            <Route path="/publications" element={<Publications />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          </Routes>
          <Footer />
        </Router>
      </AppShell>
    </ThemeProvider>
    </AuthProvider>
  );
}
