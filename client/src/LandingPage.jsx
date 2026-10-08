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
    const main = page?.querySelector('.landing-motion-main');
    if (!page || !main) return undefined;

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    let reducedMotion = motionQuery.matches;
    const pointerFine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const scenes = [...main.querySelectorAll('.landing-scene')];
    const progressBar = page.querySelector('.landing-progress span');
    const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));
    const smoothstep = (value) => {
      const t = clamp(value);
      return t * t * (3 - 2 * t);
    };
    const easeOut = (value) => 1 - ((1 - clamp(value)) ** 3);
    const motion = (x = 0, y = 0, z = 0, rx = 0, ry = 0, rz = 0, scale = 1, opacity = 1, blur = 0, clip = [0, 0, 0, 0]) => ({ x, y, z, rx, ry, rz, scale, opacity, blur, clip });
    const still = motion();
    const choreography = [
      {
        copy: { in: still, out: motion(-13, -3, -90, 0, -7, 0, .96, .76, 2) },
        title: { in: still, out: motion(-18, -2, -60, 0, -8, -1, .96, 1, 0, [0, 80, 0, 0]) },
        visual: { in: still, out: motion(5, 2, 60, 0, 13, 8, 1.09, 1) },
        background: { in: still, out: motion(3, -2, 0, 0, 0, 1.5, 1.08, 1) },
      },
      {
        copy: { in: motion(8, -2, -70, 0, -4, 0, .97, 1, 1), out: motion(-11, 0, -55, 0, -6, 0, .96, .8, 1) },
        title: { in: motion(9, 0, -45, 0, -3, 0, .98, 1, 0, [0, 0, 0, 100]), out: motion(-14, -1, -40, 0, -7, -1, .96, 1, 0, [0, 72, 0, 0]) },
        visual: { in: motion(2, 4, -65, 0, 9, 0, .82, .86), out: motion(-4, -1, 65, 0, -9, -7, 1.12, 1) },
        background: { in: motion(-2, 2, 0, 0, 0, -1, 1.05, 1), out: motion(4, -3, 0, 0, 0, 1.5, 1.08, 1) },
      },
      {
        copy: { in: motion(2, 7, -95, 2, 0, 0, .95, 1, 1), out: motion(0, -7, 95, -4, 0, 0, 1.04, .82, 1) },
        title: { in: motion(1, 10, -55, 0, 0, 0, .94, 1, 0, [0, 0, 100, 0]), out: motion(-3, -6, 60, -2, 0, 0, 1.04, 1, 0, [55, 0, 0, 0]) },
        visual: { in: motion(6, 3, -165, 2, 7, 0, .84, .92, 4, [0, 0, 22, 0]), out: motion(-3, 0, 190, -3, -2, 0, 1.12, 1, 0, [0, 0, 0, 65]) },
        background: { in: motion(0, 3, 0, 0, 0, 1, 1.05, 1), out: motion(-3, -3, 0, 0, 0, -1.6, 1.07, 1) },
      },
      {
        copy: { in: motion(-8, 1, -70, 0, 7, 0, .97, 1, 1), out: motion(-12, 0, -55, 0, -9, 0, .96, .84, 1) },
        title: { in: motion(-9, 0, -48, 0, 8, 0, .96, 1, 0, [0, 0, 0, 100]), out: motion(-12, 0, -35, 0, -8, -1, .95, 1, 0, [0, 0, 0, 64]) },
        visual: { in: motion(-5, 1, -120, 4, 8, 0, .86, .86, 3, [0, 0, 18, 0]), out: motion(-8, 0, 125, 0, -7, 0, 1.08, 1, 0, [0, 100, 0, 0]) },
        background: { in: motion(-3, 0, 0, 0, 0, -1, 1.06, 1), out: motion(5, 2, 0, 0, 0, 2, 1.1, 1) },
      },
      {
        copy: { in: motion(7, 0, -75, 0, -5, 0, .96, 1, 1), out: motion(1, -3, 100, -3, 0, 0, 1.02, .86, 1) },
        title: { in: motion(7, 4, -45, 0, -4, 0, .96, 1, 0, [0, 0, 0, 100]), out: motion(0, -5, 60, -2, 0, 0, 1.06, 1, 0, [0, 0, 52, 0]) },
        visual: { in: motion(1, 5, -155, 4, -3, 0, .78, .9, 3, [0, 0, 35, 0]), out: motion(0, 0, 185, 0, 3, 14, 1.2, 1, 0, [0, 0, 0, 45]) },
        background: { in: motion(2, 2, 0, 0, 0, 1.2, 1.06, 1), out: motion(-5, -3, 0, 0, 0, -2, 1.11, 1) },
      },
      {
        copy: { in: motion(8, 0, -65, 0, -4, 0, .98, 1, 1), out: motion(0, -4, -45, 0, 2, 0, .98, .88, 0) },
        title: { in: motion(10, 0, -40, 0, -4, 0, .97, 1, 0, [0, 70, 0, 0]), out: motion(0, -4, -30, 0, 2, 0, .98, 1, 0, [24, 0, 0, 0]) },
        visual: { in: motion(0, 1, -50, 0, 3, 0, .72, .45, 2, [50, 0, 0, 0]), out: motion(0, -3, -20, 0, 2, 0, .98, .76, 0) },
        background: { in: motion(-3, 1, 0, 0, 0, -1.2, 1.05, 1), out: motion(2, -2, 0, 0, 0, .8, 1.04, 1) },
      },
      {
        copy: { in: motion(0, 6, -55, 2, 0, 0, .97, 1, 1), out: still },
        title: { in: motion(0, 8, -35, 0, 0, 0, .95, 1, 0, [0, 0, 100, 0]), out: still },
        visual: { in: motion(-4, 0, -50, 0, 0, 0, .82, .36, 1, [35, 0, 0, 0]), out: still },
        background: { in: motion(0, 2, 0, 0, 0, .5, 1.03, 1), out: still },
      },
    ];
    const stops = new Array(scenes.length).fill(0);
    const orbAngles = [0, 46, 128, 196, 286, 354, 418];
    const orbScales = [1, .98, 1.12, .9, 1.16, 1.03, .78];
    let frame = 0;
    let maxScroll = 1;
    let pointerX = 0;
    let pointerY = 0;
    let nextPointerX = 0;
    let nextPointerY = 0;

    const rangeProgress = (value, start, end) => clamp((value - start) / Math.max(end - start, 0.0001));
    const samplePath = (value, values) => {
      let index = 0;
      while (index < stops.length - 2 && value > stops[index + 1]) index += 1;
      const segment = smoothstep(rangeProgress(value, stops[index], stops[index + 1]));
      return values[index] + (values[index + 1] - values[index]) * segment;
    };
    const blendMotion = (from, to, enter, exit) => {
      const incoming = easeOut(enter);
      const outgoing = smoothstep(exit);
      const mixed = (key) => (from[key] || 0) * (1 - incoming) + (to[key] || 0) * outgoing;
      return {
        x: mixed('x'), y: mixed('y'), z: mixed('z'),
        rx: mixed('rx'), ry: mixed('ry'), rz: mixed('rz'),
        scale: 1 + ((from.scale ?? 1) - 1) * (1 - incoming) + ((to.scale ?? 1) - 1) * outgoing,
        opacity: clamp(1 + ((from.opacity ?? 1) - 1) * (1 - incoming) + ((to.opacity ?? 1) - 1) * outgoing, .25, 1),
        blur: Math.max(0, (from.blur || 0) * (1 - incoming) + (to.blur || 0) * outgoing),
        clip: [0, 1, 2, 3].map((edge) => (from.clip?.[edge] || 0) * (1 - incoming) + (to.clip?.[edge] || 0) * outgoing),
      };
    };
    const setMotion = (scene, role, state) => {
      scene.style.setProperty(`--motion-${role}-x`, `${state.x.toFixed(2)}vw`);
      scene.style.setProperty(`--motion-${role}-y`, `${state.y.toFixed(2)}vh`);
      scene.style.setProperty(`--motion-${role}-z`, `${state.z.toFixed(2)}px`);
      scene.style.setProperty(`--motion-${role}-rx`, `${state.rx.toFixed(2)}deg`);
      scene.style.setProperty(`--motion-${role}-ry`, `${state.ry.toFixed(2)}deg`);
      scene.style.setProperty(`--motion-${role}-rz`, `${state.rz.toFixed(2)}deg`);
      scene.style.setProperty(`--motion-${role}-scale`, state.scale.toFixed(3));
      scene.style.setProperty(`--motion-${role}-opacity`, state.opacity.toFixed(3));
      scene.style.setProperty(`--motion-${role}-blur`, `${state.blur.toFixed(2)}px`);
      scene.style.setProperty(`--motion-${role}-clip`, state.clip.map((edge) => `${edge.toFixed(2)}%`).join(' '));
    };

    const measureTimeline = () => {
      const viewportHeight = Math.max(document.documentElement.clientHeight || window.innerHeight, 1);
      const documentHeight = Math.max(document.documentElement.scrollHeight, document.body?.scrollHeight || 0);
      maxScroll = Math.max(documentHeight - viewportHeight, 1);
      const scrollY = window.scrollY;

      scenes.forEach((scene, index) => {
        const offset = scene.getBoundingClientRect().top + scrollY;
        stops[index] = clamp(offset / maxScroll);
      });
      if (stops.length > 1) {
        stops[0] = 0;
        stops[stops.length - 1] = 1;
      }
    };

    const update = () => {
      frame = 0;
      const journey = clamp(window.scrollY / maxScroll);

      let activeSceneIndex = 0;
      for (let index = 1; index < stops.length; index += 1) {
        if (journey < stops[index]) break;
        activeSceneIndex = index;
      }

      page.style.setProperty('--journey-progress', journey.toFixed(4));
      const orbRotation = samplePath(journey, orbAngles);
      const orbScale = samplePath(journey, orbScales);
      page.style.setProperty('--journey-orb-rotation', orbRotation.toFixed(2) + 'deg');
      page.style.setProperty('--journey-orb-scale', orbScale.toFixed(3));
      page.style.setProperty('--pointer-offset-x', (pointerX * 10).toFixed(2) + 'px');
      page.style.setProperty('--pointer-offset-y', (pointerY * 10).toFixed(2) + 'px');
      page.style.setProperty('--pointer-tilt-x', (pointerY * -4).toFixed(2) + 'deg');
      page.style.setProperty('--pointer-tilt-y', (pointerX * 5).toFixed(2) + 'deg');

      scenes.forEach((scene, index) => {
        const profile = choreography[index];
        const enterStart = index === 0 ? 0 : stops[index - 1];
        const enterProgress = index === 0 ? 1 : rangeProgress(journey, enterStart, stops[index]);
        const exitEnd = index === scenes.length - 1 ? 1 : stops[index + 1];
        const exitProgress = index === scenes.length - 1 ? 0 : rangeProgress(journey, stops[index], exitEnd);
        scene.classList.toggle('is-in-view', index === activeSceneIndex);
        scene.style.setProperty('--scene-enter', enterProgress.toFixed(3));
        scene.style.setProperty('--scene-progress', exitProgress.toFixed(3));
        scene.style.setProperty('--scene-exit', exitProgress.toFixed(3));
        setMotion(scene, 'copy', blendMotion(profile.copy.in, profile.copy.out, enterProgress, exitProgress));
        setMotion(scene, 'title', blendMotion(profile.title.in, profile.title.out, enterProgress, exitProgress));
        const visualState = blendMotion(profile.visual.in, profile.visual.out, enterProgress, exitProgress);
        setMotion(scene, 'visual', visualState);
        setMotion(scene, 'background', blendMotion(profile.background.in, profile.background.out, enterProgress, exitProgress));
        if (index === 0) {
          const heroArt = scene.querySelector('.landing-hero-art');
          const mobileOpacity = window.innerWidth <= 430 ? .55 : window.innerWidth <= 760 ? .72 : 1;
          heroArt?.style.setProperty('--hero-art-opacity', (visualState.opacity * mobileOpacity).toFixed(3));
        }
        const copyState = blendMotion(profile.copy.in, profile.copy.out, enterProgress, exitProgress);
        const support = {
          ...copyState,
          x: copyState.x * .2,
          y: copyState.y * .28,
          z: 0,
          rx: 0,
          ry: 0,
          rz: 0,
          scale: 1,
          opacity: clamp(.86 + (copyState.opacity - .86) * .5, .78, 1),
          blur: copyState.blur * .35,
          clip: [0, 0, 0, 0],
        };
        setMotion(scene, 'support', support);
        const backgroundState = blendMotion(profile.background.in, profile.background.out, enterProgress, exitProgress);
        scene.style.setProperty('--scene-glow-opacity', (.16 + backgroundState.opacity * .22).toFixed(3));
        scene.style.setProperty('--detector-orbit-rotation', (orbRotation * .32 + exitProgress * 32).toFixed(2) + 'deg');
      });

      if (!reducedMotion && pointerFine) {
        pointerX += (nextPointerX - pointerX) * .14;
        pointerY += (nextPointerY - pointerY) * .14;
      }
      if (progressBar) progressBar.style.transform = 'scaleX(' + journey + ')';

      const pointerMoving = pointerFine && !reducedMotion && (Math.abs(nextPointerX - pointerX) > .006 || Math.abs(nextPointerY - pointerY) > .006);
      if (pointerMoving) scheduleUpdate();
    };
    const scheduleUpdate = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };    const onPointerMove = (event) => {
      if (reducedMotion || !pointerFine) return;
      nextPointerX = clamp((event.clientX / Math.max(window.innerWidth, 1) - .5) * 2, -1, 1);
      nextPointerY = clamp((event.clientY / Math.max(window.innerHeight, 1) - .5) * 2, -1, 1);
      scheduleUpdate();
    };
    const onPointerLeave = () => {
      nextPointerX = 0;
      nextPointerY = 0;
      scheduleUpdate();
    };

    const refreshTimeline = () => {
      measureTimeline();
      scheduleUpdate();
    };
    const resizeObserver = typeof ResizeObserver === 'undefined'
      ? null
      : new ResizeObserver(refreshTimeline);
    resizeObserver?.observe(main);
    window.addEventListener('scroll', scheduleUpdate, { passive: true });
    window.addEventListener('resize', refreshTimeline, { passive: true });
    window.addEventListener('pageshow', refreshTimeline);
    window.addEventListener('hashchange', scheduleUpdate);
    window.visualViewport?.addEventListener('resize', refreshTimeline, { passive: true });
    const onMotionPreferenceChange = () => {
      reducedMotion = motionQuery.matches;
      if (reducedMotion) {
        pointerX = 0;
        pointerY = 0;
        nextPointerX = 0;
        nextPointerY = 0;
      }
      scheduleUpdate();
    };
    if (motionQuery.addEventListener) motionQuery.addEventListener('change', onMotionPreferenceChange);
    else motionQuery.addListener?.(onMotionPreferenceChange);
    if (pointerFine && !reducedMotion) {
      page.addEventListener('pointermove', onPointerMove, { passive: true });
      page.addEventListener('pointerleave', onPointerLeave, { passive: true });
    }
    measureTimeline();
    update();

    return () => {
      window.removeEventListener('scroll', scheduleUpdate);
      window.removeEventListener('resize', refreshTimeline);
      window.removeEventListener('pageshow', refreshTimeline);
      window.removeEventListener('hashchange', scheduleUpdate);
      window.visualViewport?.removeEventListener('resize', refreshTimeline);
      if (motionQuery.removeEventListener) motionQuery.removeEventListener('change', onMotionPreferenceChange);
      else motionQuery.removeListener?.(onMotionPreferenceChange);
      resizeObserver?.disconnect();
      page.removeEventListener('pointermove', onPointerMove);
      page.removeEventListener('pointerleave', onPointerLeave);
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

      <section className="landing-scene landing-scene--promise" id="principles" aria-labelledby="promise-title" data-motion-scene>
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
