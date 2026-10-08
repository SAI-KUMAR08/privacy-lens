import React, { useEffect, useRef } from 'react';
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Check,
  CheckCircle2,
  Database,
  Eye,
  Files,
  Fingerprint,
  LockKeyhole,
  ScanSearch,
  ShieldCheck,
} from 'lucide-react';
import './landing-scroll.css';

const detectors = ['Aadhaar', 'PAN', 'Phone', 'UPI', 'IFSC', 'Email', 'Date of birth', 'Bank account'];
const fileTypes = ['CSV', 'TSV', 'XLSX', 'XLS', 'ODS', 'PDF*', 'DOCX', 'TXT', 'JSON', 'XML', 'HTML', 'EML', 'YAML', 'Markdown', 'LOG'];
const steps = [
  { icon: Files, number: '01', title: 'Choose a file', text: 'Upload a supported export or connect Google Drive with read-only access.' },
  { icon: ScanSearch, number: '02', title: 'Scan in memory', text: 'PrivacyLens checks structure and identifiers without retaining raw file values.' },
  { icon: Eye, number: '03', title: 'Review the findings', text: 'Explore masked samples, deterministic risk scores, and practical recommendations.' },
];

function BrandMark({ className = '' }) {
  return <img className={`landing-brand-mark ${className}`} src="/privacylens-mark.png" alt="" />;
}

function BrandOrb({ className = '' }) {
  return <div className={`landing-brand-orb ${className}`} aria-hidden="true">
    <span className="landing-orb-halo" />
    <span className="landing-orb-ring landing-orb-ring--outer" />
    <span className="landing-orb-ring landing-orb-ring--middle" />
    <span className="landing-orb-ring landing-orb-ring--inner" />
    <span className="landing-orb-arc landing-orb-arc--one" />
    <span className="landing-orb-arc landing-orb-arc--two" />
    <span className="landing-orb-particles">{[0, 60, 120, 180, 240, 300].map((angle) => <i key={angle} style={{ '--particle-angle': `${angle}deg` }} />)}</span>
    <span className="landing-orb-core"><BrandMark /></span>
  </div>;
}

function Reveal({ children, className = '' }) {
  return <div className={`landing-reveal ${className}`}>{children}</div>;
}

export default function Landing() {
  const root = useRef(null);

  useEffect(() => {
    const page = root.current;
    if (!page) return undefined;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const scenes = [...page.querySelectorAll('[data-motion-scene]:not(.landing-scene--static)')];
    const hero = page.querySelector('#intro');
    const progress = page.querySelector('.landing-progress span');
    const pointerFine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    let frame = 0;
    let pointerX = 0;
    let pointerY = 0;
    let nextPointerX = 0;
    let nextPointerY = 0;

    const update = () => {
      frame = 0;
      const viewport = Math.max(window.innerHeight, 1);
      scenes.forEach((scene) => {
        const rect = scene.getBoundingClientRect();
        const reveal = reducedMotion ? 1 : Math.max(0, Math.min(1, (viewport * 0.92 - rect.top) / (viewport * 0.72)));
        const sceneProgress = reducedMotion ? 0 : Math.max(0, Math.min(1, (viewport - rect.top) / (viewport + rect.height)));
        scene.style.setProperty('--scene-enter', reveal.toFixed(3));
        scene.style.setProperty('--scene-progress', sceneProgress.toFixed(3));
        scene.style.setProperty('--scene-offset-y', `${(1 - reveal) * 26}px`);
        scene.style.setProperty('--scene-glow-opacity', (0.35 + sceneProgress * 0.35).toFixed(3));
        scene.style.setProperty('--scene-card-offset-y', `${(1 - reveal) * 22}px`);
        scene.style.setProperty('--scene-card-tilt-y', `${(1 - reveal) * -3}deg`);
        scene.style.setProperty('--scene-orbit-rotation', `${sceneProgress * 18}deg`);
        scene.style.setProperty('--statement-rotation', `${sceneProgress * 24}deg`);
        scene.style.setProperty('--statement-scale', (0.94 + sceneProgress * 0.08).toFixed(3));
      });

      if (!reducedMotion && pointerFine) {
        pointerX += (nextPointerX - pointerX) * 0.14;
        pointerY += (nextPointerY - pointerY) * 0.14;
        page.style.setProperty('--pointer-offset-x', `${pointerX * 10}px`);
        page.style.setProperty('--pointer-offset-y', `${pointerY * 10}px`);
        page.style.setProperty('--pointer-tilt-x', `${pointerY * -4}deg`);
        page.style.setProperty('--pointer-tilt-y', `${pointerX * 5}deg`);
      }

      if (hero && !reducedMotion) {
        const rect = hero.getBoundingClientRect();
        const progressThroughHero = Math.max(0, Math.min(1, -rect.top / Math.max(rect.height * 0.84, 1)));
        page.style.setProperty('--hero-rotation', `${progressThroughHero * 29}deg`);
        page.style.setProperty('--hero-scale', (1 - progressThroughHero * 0.23).toFixed(3));
      }

      if (progress) {
        const maxScroll = document.documentElement.scrollHeight - viewport;
        const pageProgress = maxScroll > 0 ? Math.max(0, Math.min(1, window.scrollY / maxScroll)) : 0;
        progress.style.transform = `scaleX(${pageProgress})`;
      }

      if (!reducedMotion && pointerFine && (Math.abs(nextPointerX - pointerX) > 0.006 || Math.abs(nextPointerY - pointerY) > 0.006)) {
        scheduleUpdate();
      }
    };
    const scheduleUpdate = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    const onPointerMove = (event) => {
      if (reducedMotion || !pointerFine) return;
      nextPointerX = Math.max(-1, Math.min(1, (event.clientX / window.innerWidth - 0.5) * 2));
      nextPointerY = Math.max(-1, Math.min(1, (event.clientY / window.innerHeight - 0.5) * 2));
      scheduleUpdate();
    };
    const onPointerLeave = () => {
      nextPointerX = 0;
      nextPointerY = 0;
      scheduleUpdate();
    };

    let observer;
    if ('IntersectionObserver' in window) {
      observer = new IntersectionObserver((entries) => {
        entries.forEach(({ target, isIntersecting }) => target.classList.toggle('is-in-view', isIntersecting));
      }, { threshold: 0.04 });
      page.querySelectorAll('.landing-scene:not(.landing-scene--static)').forEach((scene) => observer.observe(scene));
    } else {
      page.querySelectorAll('.landing-scene:not(.landing-scene--static)').forEach((scene) => scene.classList.add('is-in-view'));
    }

    window.addEventListener('scroll', scheduleUpdate, { passive: true });
    window.addEventListener('resize', scheduleUpdate, { passive: true });
    if (pointerFine && !reducedMotion) {
      page.addEventListener('pointermove', onPointerMove, { passive: true });
      page.addEventListener('pointerleave', onPointerLeave, { passive: true });
    }
    update();

    return () => {
      window.removeEventListener('scroll', scheduleUpdate);
      window.removeEventListener('resize', scheduleUpdate);
      page.removeEventListener('pointermove', onPointerMove);
      page.removeEventListener('pointerleave', onPointerLeave);
      observer?.disconnect();
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return <div className="landing landing-scroll landing-motion" ref={root}>
    <header className="landing-nav landing-motion-nav">
      <a className="landing-motion-home" href="/" aria-label="PrivacyLens home"><img src="/privacylens-mark.png" alt="" /><span>PrivacyLens</span></a>
      <nav aria-label="Landing page navigation">
        <a href="#principles">Approach</a>
        <a href="#discovery">Privacy scan</a>
        <a href="#capabilities">Capabilities</a>
      </nav>
      <div className="landing-nav-actions"><a className="signin-link" href="/login">Sign in</a><a className="primary landing-nav-cta" href="/register">Get started <ArrowUpRight size={15} /></a></div>
      <div className="landing-progress" aria-hidden="true"><span /></div>
    </header>

    <main className="landing-scroll-main landing-motion-main">
      <section className="landing-scene landing-scene--hero" id="intro" aria-labelledby="landing-title" data-motion-scene>
        <div className="landing-atmosphere" aria-hidden="true" />
        <div className="landing-hero-copy">
          <Reveal>
            <span className="landing-eyebrow"><i /> PRIVACY-FIRST DATA DISCOVERY</span>
            <h1 id="landing-title"><span>Know what</span><span>you hold.</span><em>Keep it private.</em></h1>
            <p>Discover sensitive data across your organisation’s files. Raw file contents stay out of storage; scan metadata gives your team a clear view of what to review.</p>
            <div className="landing-hero-actions"><a className="primary landing-primary" href="/register">Create your workspace <ArrowUpRight size={16} /></a><a className="landing-secondary-link" href="#workflow">See how it works <ArrowDown size={15} /></a></div>
            <div className="landing-trustline"><ShieldCheck size={15} /><span>Files are parsed in memory. Raw values are not retained.</span></div>
          </Reveal>
        </div>
        <div className="landing-hero-art" data-hero-orb aria-label="PrivacyLens circular logo visual">
          <BrandOrb />
          <span className="landing-orb-label landing-orb-label--one"><LockKeyhole size={13} /> Scanned in memory</span>
          <span className="landing-orb-label landing-orb-label--two"><CheckCircle2 size={13} /> Masked samples</span>
        </div>
        <a className="landing-scroll-cue" href="#principles"><span>Scroll to explore</span><ArrowDown size={15} /></a>
        <span className="landing-scene-number" aria-hidden="true">01 <i /> 07</span>
      </section>

      <section className="landing-scene landing-scene--promise landing-scene--static" id="principles" aria-labelledby="promise-title">
        <div className="landing-section-inner landing-promise-inner">
          <span className="landing-section-kicker">PRIVACY, BUILT INTO THE SCAN</span>
          <h2 id="promise-title">Your files stay yours.<br /><em>Your risks become visible.</em></h2>
          <p className="landing-section-lede">PrivacyLens scans supported files in memory and stores structured scan metadata so your team can review what needs attention.</p>
          <div className="landing-promise-grid">
            <article><span className="landing-promise-icon"><Database /></span><b>Raw content is not retained</b><p>File bytes and cell or message values are not written to disk or the database.</p></article>
            <article><span className="landing-promise-icon"><Fingerprint /></span><b>Deterministic detection</b><p>Identifier patterns are checked by built-in PrivacyLens rules.</p></article>
            <article><span className="landing-promise-icon"><Eye /></span><b>Reviewable results</b><p>Inspect masked examples, findings, and risk scores in your workspace.</p></article>
          </div>
        </div>
        <BrandMark className="landing-promise-watermark" />
        <span className="landing-scene-number" aria-hidden="true">02 <i /> 07</span>
      </section>

      <section className="landing-scene landing-scene--discovery" id="discovery" aria-labelledby="discovery-title" data-motion-scene>
        <div className="landing-section-inner landing-two-column">
          <Reveal className="landing-scene-copy">
            <span className="landing-section-kicker">01 / DISCOVER</span>
            <h2 id="discovery-title">See the fields.<br /><em>Not the raw values.</em></h2>
            <p className="landing-section-lede">The inventory shows field names, categories, detector evidence, and masked samples. Sensitive values stay hidden.</p>
            <a className="landing-inline-link" href="/register">Explore your workspace <ArrowRight size={15} /></a>
          </Reveal>
          <Reveal className="landing-sample-wrap">
            <article className="landing-sample-card" aria-label="Synthetic example of masked scan results">
              <header><span className="landing-sample-icon"><Files size={17} /></span><span><b>Scan inventory</b><small>Synthetic example · masked samples</small></span><CheckCircle2 size={18} /></header>
              <div className="landing-sample-columns"><span>FIELD</span><span>CLASSIFICATION</span><span>MASKED SAMPLE</span></div>
              <div className="landing-sample-row"><b>aadhaar_number</b><span>Identity · Aadhaar</span><strong>XXXX XXXX 1234</strong></div>
              <div className="landing-sample-row"><b>student_email</b><span>Contact · Email</span><strong>s***@***.com</strong></div>
              <div className="landing-sample-row"><b>diagnosis_notes</b><span>Health information</span><strong>Values hidden</strong></div>
              <footer><ShieldCheck size={14} /><span>Example data only</span><i>RAW VALUES NOT SHOWN</i></footer>
            </article>
            <span className="landing-sample-orbit" aria-hidden="true"><BrandMark /></span>
          </Reveal>
        </div>
        <span className="landing-scene-number" aria-hidden="true">03 <i /> 07</span>
      </section>

      <section className="landing-scene landing-scene--workflow" id="workflow" aria-labelledby="workflow-title" data-motion-scene>
        <div className="landing-section-inner landing-workflow-inner">
          <Reveal className="landing-workflow-heading">
            <span className="landing-section-kicker">02 / HOW IT WORKS</span>
            <h2 id="workflow-title">A clear path from file<br /><em>to next step.</em></h2>
            <p className="landing-section-lede">Keep the workflow understandable at every stage, from the first upload to a focused review.</p>
          </Reveal>
          <div className="landing-steps">
            {steps.map(({ icon: Icon, number, title, text }, index) => <Reveal key={number} className={`landing-step landing-step--${index + 1}`}>
              <div className="landing-step-top"><span>{number}</span><Icon size={19} /></div>
              <h3>{title}</h3><p>{text}</p>
              {index < steps.length - 1 && <ArrowRight className="landing-step-arrow" size={19} aria-hidden="true" />}
            </Reveal>)}
          </div>
          <p className="landing-workflow-note"><LockKeyhole size={14} /> Google Drive uses read-only OAuth access when connected.</p>
        </div>
        <span className="landing-scene-number" aria-hidden="true">04 <i /> 07</span>
      </section>

      <section className="landing-scene landing-scene--capabilities" id="capabilities" aria-labelledby="capabilities-title" data-motion-scene>
        <div className="landing-section-inner landing-two-column landing-capabilities-inner">
          <Reveal className="landing-scene-copy">
            <span className="landing-section-kicker">03 / CLASSIFY</span>
            <h2 id="capabilities-title">Recognise the signals<br /><em>that matter.</em></h2>
            <p className="landing-section-lede">PrivacyLens checks common Indian identifiers and uses field context to surface sensitive information for review.</p>
            <div className="landing-capability-note"><Fingerprint size={17} /><span><b>Rule-based detection</b><small>Results include detector evidence and masked examples.</small></span></div>
          </Reveal>
          <Reveal className="landing-detector-panel">
            <div className="landing-detector-orbit"><span className="landing-detector-center"><BrandMark /></span>
              {detectors.map((label, index) => <span className={`landing-detector-chip landing-detector-chip-${index + 1}`} key={label}>{label}</span>)}
            </div>
            <div className="landing-file-types"><span>SUPPORTED FILE CONTENT</span><div>{fileTypes.map((type) => <i key={type}>{type}</i>)}</div><small>* Text-based PDFs are supported.</small></div>
          </Reveal>
        </div>
        <span className="landing-scene-number" aria-hidden="true">05 <i /> 07</span>
      </section>

      <section className="landing-scene landing-scene--statement" id="privacy" aria-labelledby="statement-title" data-motion-scene>
        <div className="landing-statement-backdrop" aria-hidden="true"><BrandOrb className="landing-brand-orb--statement" /></div>
        <Reveal className="landing-statement-copy">
          <span className="landing-section-kicker">A DIFFERENT WAY TO REVIEW DATA</span>
          <h2 id="statement-title">Keep the file.<br /><em>Lose the blind spot.</em></h2>
          <p>Raw uploads are parsed in memory and discarded after scanning. Your workspace keeps the structured results needed to decide what to review next.</p>
          <div className="landing-statement-proof"><span><Check size={14} /> Raw file values not retained</span><span><Check size={14} /> Findings and scan metadata remain reviewable</span></div>
        </Reveal>
        <span className="landing-scene-number" aria-hidden="true">06 <i /> 07</span>
      </section>

      <section className="landing-scene landing-scene--final" id="start" aria-labelledby="final-title" data-motion-scene>
        <div className="landing-final-aura" aria-hidden="true"><BrandMark /></div>
        <Reveal className="landing-final-content">
          <span className="landing-section-kicker">A CLEARER VIEW STARTS HERE</span>
          <h2 id="final-title">Know what you hold.<br /><em>Choose what happens next.</em></h2>
          <p className="landing-section-lede">Create a PrivacyLens workspace and start with a file your team already uses.</p>
          <div className="landing-final-actions"><a className="primary landing-primary" href="/register">Create your workspace <ArrowUpRight size={16} /></a><a className="landing-secondary-link" href="/login">Sign in <ArrowRight size={15} /></a></div>
        </Reveal>
        <footer className="landing-motion-footer"><a href="/" aria-label="PrivacyLens home"><img src="/privacylens-mark.png" alt="" /><span>PrivacyLens</span></a><span>PrivacyLens · Privacy-preserving data discovery</span><a href="#intro">Back to top ↑</a></footer>
        <span className="landing-scene-number" aria-hidden="true">07 <i /> 07</span>
      </section>
    </main>
  </div>;
}
