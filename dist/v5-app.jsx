/* v5 — Spatial portfolio: components, pages, app */

const POSTS_V5 = [
  {
    id: "bc-smtp-oauth2",
    no: "001",
    date: "OCT 2025",
    category: "Business Central",
    title: "Configuring SMTP with OAuth 2.0 in Business Central.",
    summary: "End-to-end walkthrough — Azure App Registration, Exchange Online service principal, mailbox-scoped permissions, and BC email account setup. The full chain, no shortcuts.",
    readTime: 18,
    grad: "linear-gradient(135deg, #00E5FF, #B6FF3D)"
  },
];

const useReveal = () => {
  const ref = React.useRef(null);
  React.useEffect(() => {
    const el = ref.current; if (!el) return;
    let fired = false;
    const reveal = () => { if (!fired) { fired = true; el.classList.add("in"); } };
    const t = setTimeout(reveal, 80);
    let io;
    try {
      io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { reveal(); io.unobserve(e.target); }}), { threshold: 0.05 });
      io.observe(el);
    } catch (e) { reveal(); }
    return () => { clearTimeout(t); if (io) io.disconnect(); };
  }, []);
  return ref;
};
const R = ({ children, delay = 0, className = "", as = "div" }) => {
  const ref = useReveal();
  const Tag = as;
  return <Tag ref={ref} className={"r " + className} style={{transitionDelay: delay + "ms"}}>{children}</Tag>;
};

/* Tilt-on-mouse-move card */
const Tilt = ({ children, className = "", strength = 6 }) => {
  const ref = React.useRef(null);
  const isTouch = typeof window !== "undefined" && window.matchMedia && window.matchMedia("(hover: none)").matches;
  const onMove = (e) => {
    if (isTouch || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    ref.current.style.transform = `perspective(900px) rotateX(${-y * strength}deg) rotateY(${x * strength}deg) translateZ(0)`;
  };
  const onLeave = () => {
    if (ref.current) ref.current.style.transform = "";
  };
  return (
    <div ref={ref} className={className} onMouseMove={onMove} onMouseLeave={onLeave}>{children}</div>
  );
};

/* Mesh / grain background */
const Background = () => (
  <>
    <div className="mesh">
      <div className="blob b1"></div>
      <div className="blob b2"></div>
      <div className="blob b3"></div>
    </div>
    <div className="bg-pattern"></div>
    <div className="grain"></div>
  </>
);

/* Side dock nav */
const Dock = ({ active, onNav }) => {
  const items = [
    { id:"home",    label:"Home",    icon:(<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12L12 3l9 9"/><path d="M5 10v10h14V10"/></svg>) },
    { id:"writing", label:"Writing", icon:(<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h12v16H4z"/><path d="M16 4l4 4v12h-4"/><path d="M8 9h4M8 13h4"/></svg>) },
    { id:"contact", label:"Contact", icon:(<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 7 9-7"/></svg>) },
  ];
  return (
    <nav className="dock">
      {items.map(it => (
        <a key={it.id} className={"dock-btn " + (active === it.id ? "active" : "")} onClick={() => onNav(it.id)}>
          {it.icon}
          <span className="dock-label">{it.label}</span>
        </a>
      ))}
    </nav>
  );
};

/* Status pill (top right) — shows UK + Nepal time, plus a mode toggle */
const StatusPill = ({ palette, onToggleMode }) => {
  const [t, setT] = React.useState({ uk:"", np:"" });
  React.useEffect(() => {
    const tick = () => {
      const d = new Date();
      const uk = d.toLocaleTimeString("en-GB", { hour:"2-digit", minute:"2-digit", second:"2-digit", hour12:false, timeZone:"Europe/London" });
      const np = d.toLocaleTimeString("en-GB", { hour:"2-digit", minute:"2-digit", hour12:false, timeZone:"Asia/Kathmandu" });
      setT({ uk, np });
    };
    tick(); const id = setInterval(tick, 1000); return () => clearInterval(id);
  }, []);
  const isLight = LIGHT_PALETTES.includes(palette);
  return (
    <div className="status-pill-group">
      <div className="status-pill">
        <span className="live"></span>
        <span>UK · {t.uk}</span>
        <span className="status-divider"></span>
        <span>NP · {t.np} <span className="status-utc">+05:45</span></span>
      </div>
      <button className="mode-toggle" onClick={onToggleMode} title={isLight ? "Switch to night mode" : "Switch to day mode"} aria-label="Toggle light / dark mode">
        {isLight ? (
          /* moon icon */
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
        ) : (
          /* sun icon */
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"></circle><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"></path></svg>
        )}
      </button>
    </div>
  );
};

/* Profile widget */
const ProfileWidget = () => {
  const imgRef = React.useRef(null);
  React.useEffect(() => {
    const img = imgRef.current;
    if (img && img.complete && img.naturalWidth > 0) {
      img.classList.add('is-loaded');
    }
  }, []);
  return (
  <Tilt className="widget profile" strength={3}>
    <div className="widget-eyebrow">
      <span className="pill"><span className="dot"></span> Open to roles</span>
    </div>
    <div className="profile-row">
      <div
        className="profile-avatar photo"
        style={{ backgroundImage: "url('assets/sudip-blur.jpg')" }}
      >
        <picture>
          <source
            type="image/webp"
            srcSet="assets/sudip-256.webp 1x, assets/sudip-512.webp 2x"
          />
          <source
            type="image/jpeg"
            srcSet="assets/sudip-256.jpg 1x, assets/sudip-512.jpg 2x"
          />
          <img
            ref={imgRef}
            src="assets/sudip-256.jpg"
            srcSet="assets/sudip-256.jpg 1x, assets/sudip-512.jpg 2x"
            alt="Sudip Shrestha"
            width="168"
            height="168"
            loading="eager"
            decoding="async"
            fetchpriority="high"
            onLoad={(e) => e.currentTarget.classList.add('is-loaded')}
          />
        </picture>
      </div>
      <div>
        <h2 className="profile-name">Sudip Shrestha</h2>
        <div className="profile-role">BC Technical Consultant · UK Payroll · Semi-Qualified CA</div>
        <div className="profile-loc">Kathmandu, Nepal · Dogma Group · since 2023</div>
      </div>
    </div>
    <p className="profile-bio">
      Microsoft Dynamics 365 <b>Business Central</b> consultant with a unique blend of technical AL development and UK payroll / HMRC compliance expertise. Three+ years auditing as a semi-qualified <b>chartered accountant</b> means I understand <em>why</em> a solution matters to the business — not just how to build it.
    </p>
    <div className="profile-cta-row">
      <a className="btn primary" href="mailto:sudeepstha08@gmail.com">↗ Email me</a>
      <a className="btn" href="https://www.linkedin.com/in/sudip-shrestha7675/" target="_blank" rel="noopener">@ LinkedIn</a>
      <a className="btn" href="tel:+9779828733265">↗ Call</a>
    </div>
  </Tilt>
  );
};

/* Clock widget — UK primary + Nepal secondary */
const ClockWidget = () => {
  const [t, setT] = React.useState({ hm:"", s:"", date:"", np:"", npDate:"" });
  React.useEffect(() => {
    const tick = () => {
      const d = new Date();
      const hm = d.toLocaleTimeString("en-GB", { hour:"2-digit", minute:"2-digit", hour12:false, timeZone:"Europe/London" });
      const s  = d.toLocaleTimeString("en-GB", { second:"2-digit", timeZone:"Europe/London" }).replace(/\D/g, "");
      const date = d.toLocaleDateString("en-GB", { weekday:"long", day:"2-digit", month:"short", timeZone:"Europe/London" });
      const np = d.toLocaleTimeString("en-GB", { hour:"2-digit", minute:"2-digit", hour12:false, timeZone:"Asia/Kathmandu" });
      const npDate = d.toLocaleDateString("en-GB", { weekday:"short", day:"2-digit", month:"short", timeZone:"Asia/Kathmandu" });
      setT({ hm, s, date, np, npDate });
    };
    tick(); const id = setInterval(tick, 1000); return () => clearInterval(id);
  }, []);
  return (
    <Tilt className="widget clock" strength={4}>
      <div className="widget-eyebrow">
        <span>UK · NP</span>
      </div>
      <div className="clock-time">{t.hm}<span className="ms">:{t.s}</span></div>
      <div className="clock-meta"><span>{t.date}</span><span>GMT</span></div>
      <div className="clock-secondary">
        <div className="cs-label">Kathmandu</div>
        <div className="cs-time">{t.np} <span className="cs-utc">UTC+05:45</span></div>
        <div className="cs-date">{t.npDate}</div>
      </div>
    </Tilt>
  );
};

/* Stats widget */
const StatsWidget = () => (
  <Tilt className="widget stats" strength={4}>
    <div className="widget-eyebrow">
      <span>Career</span>
    </div>
    <h3 className="stats-title">By the numbers.</h3>
    <div className="stat-grid">
      <div className="stat-cell"><div className="n">5+</div><div className="l">Years total</div></div>
      <div className="stat-cell"><div className="n">2.5+</div><div className="l">Yrs in BC / AL</div></div>
      <div className="stat-cell"><div className="n">3+</div><div className="l">Yrs auditing</div></div>
      <div className="stat-cell"><div className="n">CA</div><div className="l">Semi-qualified</div></div>
    </div>
  </Tilt>
);

/* Now widget */
const NowWidget = () => (
  <Tilt className="widget now" strength={3}>
    <div className="widget-eyebrow">
      <span>Q2 2026</span>
    </div>
    <h3 className="now-title">Currently building.</h3>
    <div className="now-list">
      {[
        { t:"Sirius Payroll integrations & AL extensions",   m:"Dogma Group · live",       p:0.78 },
        { t:"BC customisations for UK payroll workflows",     m:"HMRC compliance focus",     p:0.55 },
        { t:"UAT · user training · cutover sessions",          m:"Client-facing",              p:0.40 },
        { t:"Translating fit-gap into technical solutions",   m:"Discovery → delivery",      p:0.65 },
      ].map((it, i) => (
        <div key={i} className="now-item">
          <div className="body">
            <div className="title">{it.t}</div>
            <div className="meta">{it.m}</div>
          </div>
          <div className="progress"><div className="progress-fill" style={{width: (it.p*100)+"%"}}></div></div>
        </div>
      ))}
    </div>
  </Tilt>
);

/* Post card */
const PostCard = ({ post, onNav }) => (
  <article className="post-card" onClick={() => onNav("post:" + post.id)}>
    <div className="post-cover" style={{"--cover-grad": post.grad}}>
      <span className="cat">{post.category}</span>
      <span className="play">→</span>
      <span className="num">{post.no}</span>
    </div>
    <div className="post-body">
      <h3>{post.title}</h3>
      <p>{post.summary}</p>
      <div className="ft"><span>{post.date}</span><span>{post.readTime}m read</span></div>
    </div>
  </article>
);

/* HOME — also doubles as CV */
const HomePageV5 = ({ onNav }) => (
  <main className="shell page-enter">
    <R><div className="dash dash-3">
      <ProfileWidget />
      <ClockWidget />
      <StatsWidget />
    </div></R>

    {/* ABOUT — long-form bio */}
    <section className="section">
      <R>
        <div className="section-head">
          <div>
            <h2 className="section-title">A little more <span className="accent">context</span>.</h2>
          </div>
        </div>
      </R>
      <R delay={120}>
        <div className="about-grid">
          <p>
            My background as a <b>semi-qualified chartered accountant</b>, with three+ years of auditing experience, gives me a commercially grounded perspective that sets me apart — I understand not just <em>how</em> to build solutions, but <em>why</em> they matter to the business. This has proven invaluable in designing and developing AL extensions, customising Business Central to meet client-specific payroll and financial workflows, and translating complex business requirements into robust technical solutions.
          </p>
          <p>
            I specialise in AL development, object customisation, and system integration within the Business Central ecosystem, with hands-on experience delivering tailored ERP solutions across <b>payroll, finance, and operational processes</b>. My experience bridging functional requirements and technical delivery enables me to work effectively with both stakeholders and development teams.
          </p>
          <p>
            I'm passionate about leveraging ERP technology to <b>automate business processes</b>, improve operational efficiency, and ensure compliance — helping organisations get the most from their Microsoft Business Central investment.
          </p>
        </div>
      </R>
    </section>

    {/* EXPERIENCE TIMELINE */}
    <section className="section">
      <R>
        <div className="section-head">
          <div>
            <h2 className="section-title">Where I've <span className="accent">been</span>.</h2>
          </div>
        </div>
      </R>
      <div className="timeline">
        {[
          {
            p: "Jun 2025 — Present",
            t: "Business Central Technical Consultant",
            o: "Dogma Group · Hybrid · Kathmandu",
            d: [
              "AL development and customisation across the Microsoft Dynamics 365 Business Central ecosystem.",
              "Designing extensions for payroll and finance workflows; translating fit-gap analysis into deliverable technical specs.",
              "Working with senior consultants to scope, build, and ship to client environments."
            ],
          },
          {
            p: "Aug 2023 — Jun 2025 · 1 yr 11 mos",
            t: "Payroll Consultant",
            o: "Dogma Group · On-site",
            d: [
              "Understanding client business requirements and performing fit-gap analysis against standard Sirius Payroll functionalities.",
              "Compiling & documenting requirements and converting them into Blue Prints.",
              "Preparing integration process flows and handing customisation requirements to the technical team.",
              "Close collaboration with the technical team during customisation and testing.",
              "Explaining requirements to the QA team and handing over development for final testing and validation.",
              "Doing peer reviews of UAT testing.",
              "Piloting UAT sessions and getting client acceptance.",
              "Conducting user-level training.",
              "Developing & proposing innovative workflow and design solutions to streamline and enhance the system."
            ],
          },
          {
            p: "Jan 2023 — Aug 2023 · 8 mos",
            t: "Sirius Payroll Support",
            o: "Dogma Group",
            d: [
              "Case assessment — reviewing newly logged Sirius Payroll cases and determining whether the issue was configurable or technical in nature.",
              "Configurable issues: detailed investigation, escalating to the Senior Payroll Consultant, agreeing on a solution and preparing the client response.",
              "Technical issues: collaborating with Senior Payroll Consultant + Technical Consultant, providing a temporary workaround, then proposing a new workflow during the weekly routine call.",
              "QA team guidance — explaining the new workflow and validating updates with peer review.",
              "Client testing — instructing UAT, gathering feedback, finalising adjustments and helping compile the final update notes."
            ],
          },
          {
            p: "Aug 2018 — Jul 2022 · 3 yrs 11 mos",
            t: "Article Assistant",
            o: "Kalyaniwalla & Mistry LLP · Mumbai · On-site",
            d: [
              "Tax audits, statutory audits and assurance engagements across multiple sectors.",
              "Hands-on with reconciliations, ledger scrutiny and reporting under Indian and IFRS frameworks.",
              "Built the commercial intuition that now informs every ERP design decision."
            ],
          },
        ].map((j, i) => (
          <R key={i} delay={i*80}><div className="tl-item">
            <div className="tl-card">
              <div className="tl-period">{j.p}</div>
              <h4>{j.t}</h4>
              <div className="org">{j.o}</div>
              <ul>{j.d.map((x, k) => <li key={k}>{x}</li>)}</ul>
            </div>
          </div></R>
        ))}
      </div>
    </section>

    {/* SKILLS */}
    <section className="section">
      <R>
        <div className="section-head">
          <div>
            <h2 className="section-title">What I'm <span className="accent">hired</span> for.</h2>
          </div>
        </div>
      </R>
      <R delay={120}>
        <div className="skill-cloud">
          {[
            ["Business Central","xl acc"],["AL Development","xl"],["Sirius Payroll","lg"],["UK Payroll / HMRC","lg"],
            ["AL Extensions","lg"],["Object Customisation","lg"],["System Integration","lg"],
            ["Fit-Gap Analysis",""],["Blue Print Documentation",""],["UAT & Cutover",""],
            ["User Training",""],["Workflow Design",""],
            ["Statutory Audit",""],["Tax Audit",""],["Indian GAAP",""],["IFRS",""],
            ["Financial Reporting",""],["Reconciliations",""],["Ledger Scrutiny",""],
            ["Stakeholder Comms",""],["Requirements Gathering",""],["QA Coordination",""],
            ["MS SQL",""],["Power BI",""],["Excel (advanced)",""],["Git",""],
          ].map(([n, c], i) => <span key={i} className={"skill-tag " + c}>{n}</span>)}
        </div>
      </R>
    </section>

    {/* EDUCATION */}
    <section className="section">
      <R>
        <div className="section-head">
          <div>
            <h2 className="section-title">The <span className="accent">paper</span>.</h2>
          </div>
        </div>
      </R>
      <R delay={120}>
        <div className="certs">
          {[
            { c:"CA", n:"Semi-Qualified Chartered Accountant", o:"The Institute of Chartered Accountants of India", y:"Jun 2017 — Aug 2022" },
            { c:"BCA", n:"Bachelor of Computer Application, IT", o:"Prime College", y:"Nov 2023" },
            { c:"+2", n:"Higher Secondary · Management", o:"Rehdon H.S.S", y:"Jan 2015 — Feb 2017" },
            { c:"SLC", n:"School Leaving Certificate", o:"Kalyan H.S.S", y:"Apr 2003 — Jan 2014" },
          ].map(c => (
            <div key={c.c + c.y} className="cert">
              <div className="code">{c.c}</div>
              <div className="name">{c.n}</div>
              <div className="org" style={{fontSize:11,color:"var(--muted)",marginTop:4}}>{c.o}</div>
              <div className="yr">{c.y}</div>
            </div>
          ))}
        </div>
      </R>
    </section>

    {/* WRITING TEASER */}
    <section className="section">
      <R>
        <div className="section-head">
          <div>
            <h2 className="section-title">From the <span className="accent">journal</span>.</h2>
          </div>
          <a className="section-link" onClick={() => onNav("writing")}>View all →</a>
        </div>
      </R>
      <R delay={120}>
        <div className="posts-grid">
          {POSTS_V5.slice(0, 3).map(p => <PostCard key={p.id} post={p} onNav={onNav} />)}
        </div>
      </R>
    </section>

    {/* REFERENCES */}
    <ReferencesSection onNav={onNav} />
  </main>
);

/* Writing */
const WritingPageV5 = ({ onNav }) => {
  const [filter, setFilter] = React.useState("All");
  const cats = ["All", ...new Set(POSTS_V5.map(p => p.category))];
  const visible = filter === "All" ? POSTS_V5 : POSTS_V5.filter(p => p.category === filter);
  return (
    <main className="shell page-enter">
      <R><div className="page-hero">
        <h1>The <span className="accent">journal</span>.</h1>
        <p>Long-form, end-to-end walkthroughs from real BC engagements. More on the way.</p>
      </div></R>
      <R delay={100}>
        <div className="filter-row">
          {cats.map(c => (
            <button key={c} className={"filter-pill " + (filter === c ? "on" : "")} onClick={() => setFilter(c)}>{c}</button>
          ))}
        </div>
      </R>
      <R delay={200}>
        <div className="posts-grid">
          {visible.map(p => <PostCard key={p.id} post={p} onNav={onNav} />)}
        </div>
      </R>
    </main>
  );
};

/* Single post */
const PostPageV5 = ({ post, onNav }) => {
  const [pct, setPct] = React.useState(0);
  React.useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      setPct(Math.min(1, Math.max(0, h.scrollTop / max)));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  if (!post) return null;
  const C = 2 * Math.PI * 24;
  return (
    <div className="post-shell page-enter">
      <a className="post-back" onClick={() => onNav("writing")}>← Journal</a>
      <R><div className="post-meta-row">
        <span className="cat">{post.category}</span>
        <span>№ {post.no}</span>
        <span>{post.date}</span>
        <span>{post.readTime} min read</span>
      </div></R>
      <R delay={100}><h1 className="post-h1">{post.title}</h1></R>
      <R delay={200}><p className="post-lede">{post.summary}</p></R>
      <R delay={300}>
        <div className="post-content">
          {post.id === "bc-smtp-oauth2" && window.BCSmtpContent
            ? <window.BCSmtpContent />
            : <p>This essay is still being written.</p>}
        </div>
      </R>

      <a className="progress-ring" onClick={() => window.scrollTo({top: 0, behavior: "smooth"})}>
        <svg width="56" height="56">
          <circle className="track" cx="28" cy="28" r="24"/>
          <circle className="fill" cx="28" cy="28" r="24"
            strokeDasharray={C}
            strokeDashoffset={C * (1 - pct)} />
        </svg>
        <span style={{fontFamily:"var(--font-mono)", fontSize:11}}>↑</span>
      </a>
    </div>
  );
};

/* Contact view */
const ContactPageV5 = () => (
  <main className="shell page-enter">
    <R><div className="page-hero">
      <h1>Let's <span className="accent">talk</span>.</h1>
      <p>Open to BC technical roles, AL extension work, and UK payroll engagements. Best reached by email or LinkedIn.</p>
    </div></R>
    <R delay={100}>
      <div className="dash" style={{gridTemplateColumns: "1fr 1fr", gridTemplateRows: "auto"}}>
        <Tilt className="widget" strength={3}>
          <div className="widget-eyebrow"><span>Preferred</span></div>
          <div style={{fontSize: "clamp(20px, 3.4vw, 30px)", fontWeight: 600, letterSpacing: "-0.02em", marginTop: 16, wordBreak: "break-word"}}>
            sudeepstha08<span style={{color:"var(--accent)"}}>@</span>gmail.com
          </div>
          <div style={{marginTop: 24}}>
            <a className="btn primary" href="mailto:sudeepstha08@gmail.com">↗ Compose email</a>
          </div>
        </Tilt>
        <Tilt className="widget" strength={3}>
          <div className="widget-eyebrow"><span>Direct</span></div>
          <div style={{fontSize: "clamp(20px, 3.4vw, 30px)", fontWeight: 600, letterSpacing: "-0.02em", marginTop: 16}}>
            +977 <span style={{color:"var(--accent)"}}>9828</span> 733 265
          </div>
          <div style={{marginTop: 'auto', paddingTop: 24, display:'flex', gap:8, flexWrap:"wrap"}}>
            <a className="btn" href="tel:+9779828733265">↗ Call</a>
            <a className="btn" href="https://wa.me/9779828733265" target="_blank" rel="noopener">↗ WhatsApp</a>
          </div>
        </Tilt>
      </div>
    </R>
    <R delay={200}>
      <div className="section">
        <div className="section-head">
          <div>
            <h2 className="section-title">Around the web.</h2>
          </div>
        </div>
        <div className="filter-row">
          <a className="filter-pill" href="https://www.linkedin.com/in/sudip-shrestha7675/" target="_blank" rel="noopener">LinkedIn ↗</a>
          <a className="filter-pill" href="mailto:sudeepstha08@gmail.com">Email ↗</a>
          <a className="filter-pill" href="tel:+9779828733265">Phone ↗</a>
          <a className="filter-pill" href="https://wa.me/9779828733265" target="_blank" rel="noopener">WhatsApp ↗</a>
        </div>
      </div>
    </R>
  </main>
);

/* PALETTE SWATCHES — visual picker grid */
const PALETTE_SWATCHES = [
  { id: "electric",   bg: "#07090F", colors: ["#00E5FF", "#6E5BFF", "#FF3DC0"] },
  { id: "sunset",     bg: "#15080F", colors: ["#FF7E5F", "#FFB347", "#C9326E"] },
  { id: "forest",     bg: "#07100C", colors: ["#94D8A0", "#4FAB6E", "#C8D88E"] },
  { id: "royal",      bg: "#050A1F", colors: ["#F4C969", "#2B4DCF", "#6E84E8"] },
  { id: "pastel",     bg: "#131220", colors: ["#B8B5FF", "#9EE6D5", "#FFB3D9"] },
  { id: "plum",       bg: "#100614", colors: ["#C58AFF", "#6B2FB0", "#FF6BC8"] },
  { id: "ocean",      bg: "#04101A", colors: ["#4DD8E0", "#1E5C8A", "#82C8C0"] },
  { id: "terracotta", bg: "#1A0F0A", colors: ["#E89B73", "#C76E47", "#E5C39E"] },
  { id: "mono-red",   bg: "#0A0A0A", colors: ["#FF3838", "#1F1F1F", "#2A2A2A"] },
  { id: "mono-lime",  bg: "#08090A", colors: ["#C8FF00", "#181818", "#222222"] },
  { id: "mono-lime-light",  bg: "#F4F2EA", colors: ["#5C7A00", "#1A1A1A", "#D4D0C2"] },
  { id: "daylight",   bg: "#F5EFE3", colors: ["#C26A2D", "#F4A06B", "#B8C99B"] },
  { id: "mist",       bg: "#EDEEF2", colors: ["#2563EB", "#6FA8FF", "#B4C8E8"] },
];

const PaletteSwatches = ({ active, onPick }) => (
  <div style={{
    display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8, marginTop: 10
  }}>
    {PALETTE_SWATCHES.map(p => (
      <button key={p.id} onClick={() => onPick(p.id)} title={p.id}
        style={{
          background: p.bg,
          border: active === p.id ? "2px solid var(--accent)" : "1px solid var(--hairline)",
          borderRadius: 10, padding: 8, cursor: "pointer",
          display: "flex", flexDirection: "column", gap: 4,
          aspectRatio: "1 / 1", justifyContent: "center", alignItems: "center",
          transition: "transform .15s var(--ease)",
          boxShadow: active === p.id ? "0 0 0 3px var(--accent-soft)" : "none",
        }}
        onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
        onMouseLeave={e => e.currentTarget.style.transform = ""}>
        <div style={{ display: "flex", gap: 3 }}>
          {p.colors.map((c, i) => (
            <div key={i} style={{
              width: 10, height: 10, borderRadius: "50%", background: c,
              boxShadow: `0 0 6px ${c}80`,
            }} />
          ))}
        </div>
      </button>
    ))}
  </div>
);

/* ─── REFERENCES FULL PAGE ───────────────────────────────────────────── */
const ReferencesPageV5 = () => {
  const refs = window.REFERENCES_DATA || [];
  return (
    <main className="shell page-enter">
      <R><div className="page-hero">
        <h1>What people <span className="accent">say</span>.</h1>
        <p>Colleagues, clients, and collaborators who've worked with me directly.</p>
      </div></R>
      <R delay={100}>
        {refs.length === 0
          ? <p className="ref-empty" style={{marginTop:48}}>No references yet.</p>
          : <div className="ref-grid">
              {refs.map(r => (
                <div key={r.id} className="ref-card">
                  <p className="ref-quote">{r.quote}</p>
                  <div className="ref-meta">
                    <span className="ref-name">{r.name}</span>
                    <span className="ref-role">{r.role} · {r.company}</span>
                    {r.relationship && <span className="ref-relationship">{r.relationship}</span>}
                  </div>
                </div>
              ))}
            </div>
        }
      </R>
    </main>
  );
};

/* ─── REFERENCES SECTION (home page — list + inline form toggle) ─────── */
const GITHUB_REPO  = "SudeepStha767576/CV-and-Blog";
const GITHUB_FILE  = "dist/references-data.js";
const GITHUB_TOKEN = "YOUR_GITHUB_PAT_HERE"; // fine-grained PAT: contents write on this repo only

const ReferencesSection = ({ onNav }) => {
  const refs = window.REFERENCES_DATA || [];
  const [open, setOpen] = React.useState(false);
  const [form, setForm] = React.useState({ name:"", role:"", company:"", relationship:"", quote:"" });
  const [status, setStatus] = React.useState("idle"); // idle | submitting | success | error
  const [errMsg, setErrMsg] = React.useState("");

  const set = (k, v) => setForm(f => ({...f, [k]: v}));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.role || !form.company || !form.quote) {
      setErrMsg("Please fill in all required fields."); setStatus("error"); return;
    }
    setStatus("submitting");
    try {
      const res = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/contents/${GITHUB_FILE}`, {
        headers: { Authorization: `Bearer ${GITHUB_TOKEN}`, Accept: "application/vnd.github+json" }
      });
      if (!res.ok) throw new Error("Could not read references file from GitHub.");
      const { content: b64, sha } = await res.json();
      const existing = atob(b64.replace(/\n/g,""));
      const match = existing.match(/window\.REFERENCES_DATA\s*=\s*(\[[\s\S]*?\]);/);
      const currentArr = match ? JSON.parse(match[1]) : [];
      currentArr.push({
        id: "ref-" + Date.now(),
        name: form.name.trim(), role: form.role.trim(),
        company: form.company.trim(), relationship: form.relationship.trim(),
        quote: form.quote.trim(),
        date: new Date().toLocaleString("en-GB", { month:"short", year:"numeric" }).toUpperCase()
      });
      const newContent = `/* references-data.js — auto-updated by the reference form */\nwindow.REFERENCES_DATA = ${JSON.stringify(currentArr, null, 2)};\n`;
      const encoded = btoa(unescape(encodeURIComponent(newContent)));
      const put = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/contents/${GITHUB_FILE}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${GITHUB_TOKEN}`, Accept: "application/vnd.github+json", "Content-Type": "application/json" },
        body: JSON.stringify({ message: `add reference from ${form.name}`, content: encoded, sha })
      });
      if (!put.ok) throw new Error("Failed to save. Please try again.");
      setStatus("success");
    } catch(err) {
      setErrMsg(err.message || "Something went wrong."); setStatus("error");
    }
  };

  return (
    <section className="section">
      <R>
        <div className="section-head">
          <div>
            <h2 className="section-title">What people <span className="accent">say</span>.</h2>
          </div>
          <div style={{display:"flex", gap:12, alignItems:"center"}}>
            {refs.length > 0 && <a className="section-link" onClick={() => onNav("references")}>View all →</a>}
            <a className="section-link" onClick={() => { setOpen(o => !o); setStatus("idle"); setErrMsg(""); }}>
              {open ? "Cancel" : "↗ Leave a reference"}
            </a>
          </div>
        </div>
      </R>

      {/* Inline submit form — toggles open */}
      {open && (
        <R delay={60}>
          <div className="ref-inline-form">
            {status === "success"
              ? <div style={{textAlign:"center", padding:"40px 0"}}>
                  <div style={{fontSize:36, marginBottom:12}}>🙏</div>
                  <h3 style={{marginBottom:6}}>Thank you!</h3>
                  <p style={{color:"var(--muted)", fontSize:14}}>Your reference has been saved and will appear shortly.</p>
                </div>
              : <form className="ref-form" onSubmit={handleSubmit}>
                  <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:12}}>
                    <div className="ref-field">
                      <label className="ref-label">Full name *</label>
                      <input className="ref-input" value={form.name} onChange={e => set("name", e.target.value)} placeholder="Jane Doe" />
                    </div>
                    <div className="ref-field">
                      <label className="ref-label">Job title / role *</label>
                      <input className="ref-input" value={form.role} onChange={e => set("role", e.target.value)} placeholder="Finance Director" />
                    </div>
                    <div className="ref-field">
                      <label className="ref-label">Company *</label>
                      <input className="ref-input" value={form.company} onChange={e => set("company", e.target.value)} placeholder="Acme Ltd" />
                    </div>
                    <div className="ref-field">
                      <label className="ref-label">Your relationship to Sudip</label>
                      <input className="ref-input" value={form.relationship} onChange={e => set("relationship", e.target.value)} placeholder="Client · Dogma Group project" />
                    </div>
                  </div>
                  <div className="ref-field">
                    <label className="ref-label">Reference message *</label>
                    <textarea className="ref-textarea" value={form.quote} onChange={e => set("quote", e.target.value)} placeholder="Share your experience working with Sudip…" />
                  </div>
                  <div className="ref-submit-row">
                    <button className="btn primary" type="submit" disabled={status === "submitting"}>
                      {status === "submitting" ? "Saving…" : "↗ Submit reference"}
                    </button>
                    {status === "error" && <span className="ref-status error">{errMsg}</span>}
                  </div>
                </form>
            }
          </div>
        </R>
      )}

      {/* Preview list */}
      {!open && (
        <R delay={120}>
          <div className="ref-preview-list">
            {refs.length === 0
              ? <p className="ref-empty">No references yet — be the first to leave one.</p>
              : refs.slice(0, 2).map(r => (
                  <div key={r.id} className="ref-preview-item">
                    <div className="ref-preview-quote">{r.quote}</div>
                    <div className="ref-preview-name">{r.name} · {r.role}, {r.company}</div>
                  </div>
                ))
            }
          </div>
        </R>
      )}
    </section>
  );
};

/* APP */
const TWEAK_DEFAULTS_V5 = /*EDITMODE-BEGIN*/{
  "palette": "mono-lime",
  "lastDark": "mono-lime",
  "lastLight": "mono-lime-light"
}/*EDITMODE-END*/;

// Palettes that flip to a light surface — used to set data-theme so ink/muted vars switch
const LIGHT_PALETTES = ["daylight", "mist", "mono-lime-light"];

const getPageFromHash = () => {
  const hash = window.location.hash.replace(/^#/, "");
  return hash || "home";
};

const AppV5 = () => {
  const [page, setPage] = React.useState(getPageFromHash);
  const [tweaks, setTweak] = window.useTweaks(TWEAK_DEFAULTS_V5);
  React.useEffect(() => {
    const isLight = LIGHT_PALETTES.includes(tweaks.palette);
    document.documentElement.setAttribute("data-theme", isLight ? "day" : "night");
    document.documentElement.setAttribute("data-palette", tweaks.palette);
    document.documentElement.removeAttribute("data-accent");
    // Remember the most recent palette of each kind so the mode toggle has somewhere to go back to
    if (isLight && tweaks.lastLight !== tweaks.palette) setTweak("lastLight", tweaks.palette);
    if (!isLight && tweaks.lastDark !== tweaks.palette) setTweak("lastDark", tweaks.palette);
  }, [tweaks.palette]);

  // Sync hash → page (browser back/forward)
  React.useEffect(() => {
    const onHashChange = () => setPage(getPageFromHash());
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  const toggleMode = () => {
    const isLight = LIGHT_PALETTES.includes(tweaks.palette);
    if (isLight) {
      setTweak("palette", tweaks.lastDark || "mono-lime");
    } else {
      setTweak("palette", tweaks.lastLight || "mono-lime-light");
    }
  };
  React.useEffect(() => { window.scrollTo({top: 0, behavior: "instant"}); }, [page]);

  const navigate = (p) => {
    window.location.hash = p === "home" ? "" : p;
    setPage(p);
  };
  const isPost = page.startsWith("post:");
  const post = isPost ? POSTS_V5.find(p => p.id === page.split(":")[1]) : null;
  const activeNav = isPost ? "writing" : page;

  return (
    <>
      <Background />
      <Dock active={activeNav} onNav={navigate} />
      <StatusPill palette={tweaks.palette} onToggleMode={toggleMode} />

      {(page === "home" || page === "references") && <HomePageV5 onNav={navigate} />}
      {page === "writing" && <WritingPageV5 onNav={navigate} />}
      {page === "contact" && <ContactPageV5 />}
      {isPost             && <PostPageV5    post={post} onNav={navigate} />}

      <window.TweaksPanel title="Tweaks">
        <window.TweakSection label="Color palette">
          <window.TweakSelect label="Preset" value={tweaks.palette}
            options={[
              {value:"electric",   label:"Electric · cyan / violet / magenta"},
              {value:"sunset",     label:"Sunset · coral / amber / plum"},
              {value:"forest",     label:"Forest · sage / pine / lime"},
              {value:"royal",      label:"Royal · cobalt / gold"},
              {value:"pastel",     label:"Pastel cyber · lavender / mint"},
              {value:"plum",       label:"Plum · lilac / magenta"},
              {value:"ocean",      label:"Ocean · aqua / deep teal"},
              {value:"terracotta", label:"Terracotta · clay / cream"},
              {value:"mono-red",   label:"Mono · black + electric red"},
              {value:"mono-lime",  label:"Mono · black + neon lime"},
              {value:"mono-lime-light",  label:"Mono · paper + olive lime (light)"},
              {value:"daylight",   label:"Daylight · cream + clay (light)"},
              {value:"mist",       label:"Mist · grey + cobalt (light)"},
            ]}
            onChange={v => setTweak("palette", v)} />
          <PaletteSwatches active={tweaks.palette} onPick={v => setTweak("palette", v)} />
        </window.TweakSection>
        <window.TweakSection label="Theme">
          <window.TweakButton label={LIGHT_PALETTES.includes(tweaks.palette) ? "Switch to night mode" : "Switch to day mode"} onClick={toggleMode} />
        </window.TweakSection>
        <window.TweakSection label="Jump to">
          <window.TweakButton label="Home / CV" onClick={() => navigate("home")} />
          <window.TweakButton label="Writing" onClick={() => navigate("writing")} />
          <window.TweakButton label="Sample post" onClick={() => navigate("post:bc-smtp-oauth2")} />
          <window.TweakButton label="Contact" onClick={() => navigate("contact")} />
        </window.TweakSection>
      </window.TweaksPanel>
    </>
  );
};

ReactDOM.createRoot(document.getElementById("root")).render(<AppV5 />);
