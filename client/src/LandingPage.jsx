import React, { useEffect, useRef } from 'react';
import { ArrowDown, ArrowUpRight, CheckCircle2, Eye, Files, Fingerprint, ScanSearch, ShieldCheck } from 'lucide-react';
import './landing-scroll.css';

const detectors = ['Aadhaar', 'PAN', 'Phone', 'UPI', 'IFSC', 'Email', 'Date of birth', 'Bank account'];

function BrandMark() {
  return <img className="landing-orbit-mark" src="/privacylens-mark.png" alt="PrivacyLens" />;
}

export default function Landing() {
  const root = useRef(null);

  useEffect(() => {
    const page = root.current;
    if (!page) return undefined;

    const screens = [...page.querySelectorAll('.landing-screen:not(.landing-screen--static)')];
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => entry.target.classList.toggle('is-visible', entry.isIntersecting));
      }, { threshold: 0.22 });
      screens.forEach((screen) => observer.observe(screen));
      screens[0]?.classList.add('is-visible');
      page._landingObserver = observer;
    } else {
      screens.forEach((screen) => screen.classList.add('is-visible'));
    }

    const mark = page.querySelector('.landing-orbit-mark');
    const hero = page.querySelector('.landing-screen--hero');
    let frame = 0;
    const updateMark = () => {
      frame = 0;
      if (!mark || !hero || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      const progress = Math.min(1, Math.max(0, -hero.getBoundingClientRect().top / Math.max(hero.offsetHeight, 1)));
      mark.style.transform = `rotate(${progress * 190}deg) scale(${1 - progress * 0.16})`;
      page.style.setProperty('--landing-scroll-progress', progress.toFixed(3));
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(updateMark);
    };
    updateMark();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (frame) window.cancelAnimationFrame(frame);
      page._landingObserver?.disconnect();
      delete page._landingObserver;
    };
  }, []);

  return <div className="landing landing-scroll" ref={root}>
    <header className="landing-nav">
      <a href="/" aria-label="PrivacyLens home"><span className="logo"><img className="brand-logo" src="/privacylens-logo.png" alt="PrivacyLens" /></span></a>
      <nav aria-label="Landing page">
        <a href="#discovery">How it works</a>
        <a href="#privacy-promise">Privacy promise</a>
      </nav>
      <div><a className="signin-link" href="/login">Sign in</a><a className="primary" href="/register">Get started <ArrowUpRight size={15}/></a></div>
    </header>

    <main className="landing-scroll-main">
      <section className="landing-screen landing-screen--hero" id="top">
        <div className="landing-scroll-copy landing-reveal">
          <span className="hero-kicker"><i/> PRIVACY-FIRST DATA DISCOVERY</span>
          <h1>Know what you hold.<br/><em>Keep it private.</em></h1>
          <p>Discover sensitive data across your organisation’s files, understand what needs attention, and keep raw file contents out of storage.</p>
          <div className="hero-actions"><a className="primary" href="/register">Create your workspace <ArrowUpRight size={16}/></a><a className="quiet-link" href="#discovery">Explore PrivacyLens <ArrowDown size={15}/></a></div>
          <div className="hero-trust"><ShieldCheck size={16}/><span>Private scanning. Clear next steps.</span></div>
        </div>
        <div className="landing-orbit-stage" aria-hidden="true">
          <span className="landing-orbit-ring landing-orbit-ring--outer"/>
          <span className="landing-orbit-ring landing-orbit-ring--inner"/>
          <span className="landing-orbit-glow"/>
          <BrandMark/>
          <span className="landing-orbit-caption">PrivacyLens · See clearly</span>
        </div>
        <a className="landing-scroll-cue" href="#privacy-promise"><span>Scroll to explore</span><ArrowDown size={15}/></a>
      </section>

      <section className="landing-screen landing-screen--static" id="privacy-promise">
        <div className="landing-section-inner landing-promise-content">
          <span className="landing-section-kicker">A CLEARER VIEW, WITH PRIVACY BUILT IN</span>
          <h2>Your files stay yours.<br/><em>Your risks become visible.</em></h2>
          <p className="landing-section-lede">PrivacyLens processes files in memory and keeps scan metadata, not the raw file contents.</p>
          <div className="landing-promise-grid">
            <article><span className="landing-promise-icon"><Files/></span><b>Scan</b><p>Review supported files without retaining their raw contents.</p></article>
            <article><span className="landing-promise-icon"><ScanSearch/></span><b>Understand</b><p>See fields, detector matches, masked samples, and findings.</p></article>
            <article><span className="landing-promise-icon"><ShieldCheck/></span><b>Take action</b><p>Use practical recommendations to guide your next review.</p></article>
          </div>
        </div>
        <span className="landing-static-orbit" aria-hidden="true"><BrandMark/></span>
      </section>

      <section className="landing-screen landing-screen--discovery" id="discovery">
        <div className="landing-section-inner landing-split">
          <div className="landing-reveal">
            <span className="landing-section-kicker">01 / DISCOVER</span>
            <h2>See the fields.<br/><em>Not the raw values.</em></h2>
            <p className="landing-section-lede">A useful inventory shows what kinds of information appear in a file while masking detected examples.</p>
            <a className="landing-text-link" href="/register">Explore your workspace <ArrowUpRight size={15}/></a>
          </div>
          <article className="landing-data-card landing-reveal" aria-label="Synthetic PrivacyLens sample inventory">
            <div className="landing-data-card-head"><span className="landing-file-icon"><Files size={17}/></span><span><b>Sample workspace</b><small>Synthetic example · processed in memory</small></span><CheckCircle2 size={18}/></div>
            <div className="landing-data-row"><span><b>aadhaar_number</b><small>Identity · Aadhaar</small></span><strong>XXXX XXXX 1234</strong></div>
            <div className="landing-data-row"><span><b>student_email</b><small>Contact · Email</small></span><strong>s***@***.com</strong></div>
            <div className="landing-data-row"><span><b>diagnosis_notes</b><small>Health information</small></span><strong>Values not shown</strong></div>
            <div className="landing-data-card-foot"><ShieldCheck size={15}/> Masked samples only <span>●</span></div>
          </article>
        </div>
      </section>

      <section className="landing-screen landing-screen--signals" id="signals">
        <div className="landing-section-inner landing-split landing-split--reverse">
          <div className="landing-reveal">
            <span className="landing-section-kicker">02 / CLASSIFY</span>
            <h2>Find the signals<br/><em>that need attention.</em></h2>
            <p className="landing-section-lede">Deterministic checks identify common Indian identifiers and help prioritise sensitive fields for review.</p>
            <div className="landing-signal-note"><Fingerprint size={18}/><span>India-specific identifier detection</span></div>
          </div>
          <div className="landing-detector-orbit landing-reveal" aria-label="Supported identifier detectors">
            <span className="landing-detector-ring"/>
            <span className="landing-detector-center"><BrandMark/></span>
            {detectors.map((label, index) => <span className={`landing-detector-chip landing-detector-chip-${index + 1}`} key={label}>{label}</span>)}
          </div>
        </div>
      </section>

      <section className="landing-screen landing-screen--action" id="action">
        <div className="landing-section-inner landing-split">
          <div className="landing-reveal">
            <span className="landing-section-kicker">03 / PRIORITISE</span>
            <h2>Turn findings<br/><em>into next steps.</em></h2>
            <p className="landing-section-lede">Review the risks your scans identify, then use clear recommendations to decide what your team should address.</p>
            <a className="landing-text-link" href="/register">Start with a scan <ArrowUpRight size={15}/></a>
          </div>
          <div className="landing-finding-stack landing-reveal">
            <article className="landing-finding-card"><span className="landing-finding-mark"><Eye size={17}/></span><span><b>Government ID data discovered</b><small>Restrict access and remove unnecessary copies.</small></span><i>Critical</i></article>
            <article className="landing-finding-card"><span className="landing-finding-mark"><ShieldCheck size={17}/></span><span><b>Health information discovered</b><small>Review access and document a retention period.</small></span><i>High</i></article>
            <div className="landing-finding-foot"><CheckCircle2 size={16}/> Suggestions never change your assessment without your confirmation.</div>
          </div>
        </div>
      </section>

      <section className="landing-screen landing-screen--final" id="start">
        <div className="landing-final-mark" aria-hidden="true"><BrandMark/></div>
        <div className="landing-section-inner landing-final-content landing-reveal">
          <span className="landing-section-kicker">A CLEARER VIEW STARTS HERE</span>
          <h2>Know what you hold.<br/><em>Choose what happens next.</em></h2>
          <p className="landing-section-lede">Create a PrivacyLens workspace and start with a file your team already uses.</p>
          <div className="hero-actions"><a className="primary" href="/register">Create your workspace <ArrowUpRight size={16}/></a><a className="quiet-link" href="/login">Sign in</a></div>
        </div>
        <footer className="landing-scroll-footer"><span>PrivacyLens · Privacy-preserving data discovery</span><a href="#top">Back to top ↑</a></footer>
      </section>
    </main>
  </div>;
}
