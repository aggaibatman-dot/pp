(() => {
    'use strict';

    const state = {
        neutralizations: 0,
        stability: 50,
        crimeData: [82, 76, 79, 71, 66, 69, 62],
        threats: { low: 45, med: 30, high: 15, crit: 10 },
        missionStart: null
    };

    const quotes = [
        "Justice Restores Balance.",
        "Order Through Precision.",
        "Stability Is Maintained.",
        "The Night Protects Its Own.",
        "Fear Is A Necessary Tool.",
        "Shadows Keep The Peace.",
        "Every Action Has A Purpose.",
        "Balance Through Strength."
    ];

    const terminalLogs = [
        "> Scanning sector Alpha-7...",
        "> [OK] No anomalies detected.",
        "> Patrol unit dispatched to Zone-4.",
        "> [WARN] Elevated activity in Block-C.",
        "> Cross-referencing threat database...",
        "> [OK] Target identified. Logging coordinates.",
        "> Stability protocols engaged.",
        "> Surveillance feed active — 12 nodes online.",
        "> [OK] Perimeter secured.",
        "> Decrypting intercepted signal...",
        "> [WARN] Unauthorized movement detected.",
        "> Deploying counter-measure sequence.",
        "> [OK] Threat neutralized. Area clear.",
        "> Updating central intelligence matrix...",
        "> Community safety index: RISING."
    ];

    const $ = id => document.getElementById(id);

    const bootScreen = $('boot-screen');
    const loginScreen = $('login-screen');
    const welcomeScreen = $('welcome-screen');
    const dashScreen = $('dashboard-screen');
    const loginBtn = $('login-btn');
    const cursorGlow = $('cursor-glow');

    // ===== AUDIO ENGINE (Web Audio API) =====
    let audioCtx;
    function initAudio() {
        if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }

    function playClick() {
        initAudio();
        const o = audioCtx.createOscillator();
        const g = audioCtx.createGain();
        o.connect(g); g.connect(audioCtx.destination);
        o.type = 'sine'; o.frequency.setValueAtTime(800, audioCtx.currentTime);
        o.frequency.exponentialRampToValueAtTime(200, audioCtx.currentTime + 0.1);
        g.gain.setValueAtTime(0.15, audioCtx.currentTime);
        g.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.15);
        o.start(); o.stop(audioCtx.currentTime + 0.15);
    }

    function playImpact() {
        initAudio();
        const o = audioCtx.createOscillator();
        const g = audioCtx.createGain();
        o.connect(g); g.connect(audioCtx.destination);
        o.type = 'sawtooth'; o.frequency.setValueAtTime(120, audioCtx.currentTime);
        o.frequency.exponentialRampToValueAtTime(40, audioCtx.currentTime + 0.3);
        g.gain.setValueAtTime(0.2, audioCtx.currentTime);
        g.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.35);
        o.start(); o.stop(audioCtx.currentTime + 0.35);
    }

    // ===== CURSOR GLOW =====
    document.addEventListener('mousemove', e => {
        cursorGlow.style.left = e.clientX + 'px';
        cursorGlow.style.top = e.clientY + 'px';
    });

    document.querySelectorAll('button, a, .category-card, .dash-card').forEach(el => {
        el.addEventListener('mouseenter', () => cursorGlow.classList.add('hover-glow'));
        el.addEventListener('mouseleave', () => cursorGlow.classList.remove('hover-glow'));
    });

    // ===== PARTICLES =====
    const pCanvas = $('particle-canvas');
    const pCtx = pCanvas.getContext('2d');
    let parts = [];

    function resizeP() { pCanvas.width = innerWidth; pCanvas.height = innerHeight; }
    function initP() {
        resizeP(); parts = [];
        const n = Math.min(60, Math.floor(innerWidth * 0.03));
        for (let i = 0; i < n; i++) parts.push({ x: Math.random() * pCanvas.width, y: Math.random() * pCanvas.height, r: Math.random() * 1.5 + 0.3, dx: (Math.random() - 0.5) * 0.25, dy: -Math.random() * 0.35 - 0.1, o: Math.random() * 0.35 + 0.08 });
    }
    function drawP() {
        pCtx.clearRect(0, 0, pCanvas.width, pCanvas.height);
        parts.forEach(p => {
            p.x += p.dx; p.y += p.dy;
            if (p.y < -5) { p.y = pCanvas.height + 5; p.x = Math.random() * pCanvas.width; }
            if (p.x < -5) p.x = pCanvas.width + 5;
            if (p.x > pCanvas.width + 5) p.x = -5;
            pCtx.beginPath(); pCtx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            pCtx.fillStyle = `rgba(179,0,0,${p.o})`; pCtx.fill();
        });
        requestAnimationFrame(drawP);
    }

    // ===== FOG =====
    function initFog() {
        const c = $('fog-canvas'); if (!c) return;
        const ctx = c.getContext('2d');
        c.width = innerWidth; c.height = innerHeight;
        const blobs = [];
        for (let i = 0; i < 20; i++) blobs.push({ x: Math.random() * c.width, y: Math.random() * c.height, r: Math.random() * 140 + 60, dx: (Math.random() - 0.5) * 0.3, dy: (Math.random() - 0.5) * 0.3, o: Math.random() * 0.1 + 0.02 });
        function anim() {
            if (!loginScreen.classList.contains('active')) return;
            ctx.clearRect(0, 0, c.width, c.height);
            blobs.forEach(b => {
                b.x += b.dx; b.y += b.dy;
                if (b.x < -b.r || b.x > c.width + b.r) b.dx *= -1;
                if (b.y < -b.r || b.y > c.height + b.r) b.dy *= -1;
                const g = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r);
                g.addColorStop(0, `rgba(139,0,0,${b.o})`); g.addColorStop(1, 'rgba(139,0,0,0)');
                ctx.beginPath(); ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2); ctx.fillStyle = g; ctx.fill();
            });
            requestAnimationFrame(anim);
        }
        anim();
    }

    // ===== BOOT SEQUENCE =====
    const bootLines = [
        "PADMA PRASAD INTELLIGENCE SYSTEM v3.2",
        "========================================",
        "Initializing kernel modules...",
        "[OK] Kernel loaded.",
        "Loading threat analysis engine...",
        "[OK] Engine online.",
        "Connecting to surveillance network...",
        "[OK] 47 nodes connected.",
        "Verifying encryption protocols...",
        "[OK] AES-256 active.",
        "Loading facial recognition database...",
        "[OK] Database synced.",
        "Calibrating area scanner...",
        "[OK] Radar operational.",
        "Running system diagnostics...",
        "[OK] All systems nominal.",
        "",
        "SYSTEM READY. AWAITING AUTHENTICATION..."
    ];

    function runBoot() {
        const log = $('boot-log');
        let i = 0;
        const interval = setInterval(() => {
            if (i < bootLines.length) {
                log.textContent += bootLines[i] + '\n';
                log.scrollTop = log.scrollHeight;
                i++;
            } else {
                clearInterval(interval);
                setTimeout(() => {
                    bootScreen.classList.remove('active');
                    setTimeout(() => {
                        loginScreen.classList.add('active');
                        initFog();
                    }, 600);
                }, 800);
            }
        }, 150);
    }

    // ===== LOGIN =====
    loginBtn.addEventListener('click', e => {
        playClick();
        const ripple = loginBtn.querySelector('.btn-ripple');
        const rect = loginBtn.getBoundingClientRect();
        ripple.style.width = ripple.style.height = Math.max(rect.width, rect.height) + 'px';
        ripple.style.left = (e.clientX - rect.left - Math.max(rect.width, rect.height) / 2) + 'px';
        ripple.style.top = (e.clientY - rect.top - Math.max(rect.width, rect.height) / 2) + 'px';
        ripple.classList.remove('animate'); void ripple.offsetWidth; ripple.classList.add('animate');

        setTimeout(() => {
            loginScreen.classList.remove('active');
            setTimeout(() => {
                welcomeScreen.classList.add('active');
                setTimeout(() => {
                    welcomeScreen.classList.remove('active');
                    setTimeout(() => {
                        dashScreen.classList.add('active');
                        document.body.style.overflow = 'auto';
                        initDashboard();
                    }, 800);
                }, 3500);
            }, 800);
        }, 400);
    });

    // ===== DASHBOARD =====
    let gCanvas, gCtx;

    function initDashboard() {
        gCanvas = $('crime-graph');
        const cont = gCanvas.parentElement;
        gCanvas.width = cont.clientWidth; gCanvas.height = cont.clientHeight;
        gCtx = gCanvas.getContext('2d');

        drawGraph(); updateGauge(state.stability); startMessages(); startTerminal(); startMissionTimer();
        $('simulate-btn').addEventListener('click', simulate);

        const obs = new IntersectionObserver(entries => {
            entries.forEach(e => { if (e.isIntersecting) { e.target.style.opacity = '1'; e.target.style.transform = 'translateY(0)'; } });
        }, { threshold: 0.1 });
        document.querySelectorAll('.dash-card, .category-card, .certificate-section').forEach(c => {
            c.style.opacity = '0'; c.style.transform = 'translateY(20px)';
            c.style.transition = 'opacity 0.6s ease, transform 0.6s ease'; obs.observe(c);
        });

        window.addEventListener('resize', () => {
            if (dashScreen.classList.contains('active')) { gCanvas.width = cont.clientWidth; gCanvas.height = cont.clientHeight; drawGraph(); }
        });

        // Re-attach hover glow to new cards
        document.querySelectorAll('.dash-card, .category-card').forEach(el => {
            el.addEventListener('mouseenter', () => cursorGlow.classList.add('hover-glow'));
            el.addEventListener('mouseleave', () => cursorGlow.classList.remove('hover-glow'));
        });
    }

    function simulate() {
        playImpact();
        state.neutralizations++;
        $('neutralization-counter').textContent = state.neutralizations;

        const ov = $('impact-overlay'), card = $('neutralization-card');
        ov.classList.remove('impact-anim'); card.classList.remove('shake-anim'); document.body.classList.remove('global-pulse');
        void ov.offsetWidth;
        ov.classList.add('impact-anim'); card.classList.add('shake-anim'); document.body.classList.add('global-pulse');

        const last = state.crimeData[state.crimeData.length - 1];
        state.crimeData.shift(); state.crimeData.push(Math.max(8, last - Math.floor(Math.random() * 5) - 2));
        drawGraph();

        state.stability = Math.min(99, state.stability + Math.random() * 3 + 1);
        updateGauge(state.stability);

        if (state.threats.crit > 2) {
            state.threats.crit = +(state.threats.crit - 0.5).toFixed(1);
            state.threats.low = +(state.threats.low + 0.5).toFixed(1);
            $('t-crit').textContent = state.threats.crit + '%';
            $('t-low').textContent = state.threats.low + '%';
            document.querySelector('.threat-crit .cat-fill').style.width = state.threats.crit + '%';
            document.querySelector('.threat-low .cat-fill').style.width = state.threats.low + '%';
        }

        addTermLine('> [ACTION] Intervention executed. Target neutralized.', 'success');
    }

    // ===== GRAPH =====
    function drawGraph() {
        if (!gCtx) return;
        const w = gCanvas.width, h = gCanvas.height, pad = 30;
        const pw = w - pad * 2, ph = h - pad * 2;
        gCtx.clearRect(0, 0, w, h);

        gCtx.strokeStyle = 'rgba(255,255,255,0.03)'; gCtx.lineWidth = 1;
        for (let i = 0; i <= 4; i++) { const y = pad + (ph / 4) * i; gCtx.beginPath(); gCtx.moveTo(pad, y); gCtx.lineTo(w - pad, y); gCtx.stroke(); }

        gCtx.fillStyle = '#444'; gCtx.font = '10px Inter'; gCtx.textAlign = 'center';
        ['C1', 'C2', 'C3', 'C4', 'C5', 'C6', 'C7'].forEach((l, i) => { gCtx.fillText(l, pad + (pw / (state.crimeData.length - 1)) * i, h - 8); });

        const pts = state.crimeData.map((v, i) => ({ x: pad + (pw / (state.crimeData.length - 1)) * i, y: h - pad - (v / 100) * ph }));

        gCtx.beginPath(); gCtx.strokeStyle = '#B30000'; gCtx.lineWidth = 3; gCtx.shadowColor = 'rgba(179,0,0,0.8)'; gCtx.shadowBlur = 12; gCtx.lineJoin = 'round';
        pts.forEach((p, i) => { i === 0 ? gCtx.moveTo(p.x, p.y) : gCtx.lineTo(p.x, p.y); });
        gCtx.stroke(); gCtx.shadowBlur = 0;

        pts.forEach(p => {
            gCtx.beginPath(); gCtx.arc(p.x, p.y, 4, 0, Math.PI * 2); gCtx.fillStyle = '#fff'; gCtx.fill();
            gCtx.beginPath(); gCtx.arc(p.x, p.y, 6, 0, Math.PI * 2); gCtx.strokeStyle = 'rgba(179,0,0,0.4)'; gCtx.lineWidth = 1.5; gCtx.stroke();
        });

        gCtx.beginPath();
        pts.forEach((p, i) => { i === 0 ? gCtx.moveTo(p.x, p.y) : gCtx.lineTo(p.x, p.y); });
        gCtx.lineTo(pts[pts.length - 1].x, h - pad); gCtx.lineTo(pts[0].x, h - pad); gCtx.closePath();
        const gr = gCtx.createLinearGradient(0, pad, 0, h - pad);
        gr.addColorStop(0, 'rgba(179,0,0,0.2)'); gr.addColorStop(1, 'rgba(179,0,0,0)');
        gCtx.fillStyle = gr; gCtx.fill();
    }

    // ===== GAUGE =====
    function updateGauge(pct) {
        const el = $('stability-text'), ring = $('stability-gauge');
        let cur = parseInt(el.textContent) || 0;
        const tgt = Math.floor(pct);
        if (cur !== tgt) { const d = tgt > cur ? 1 : -1; const t = setInterval(() => { cur += d; el.textContent = cur; if (cur === tgt) clearInterval(t); }, 40); }
        ring.style.strokeDashoffset = 314 - (pct / 100) * 314;
    }

    // ===== MESSAGES =====
    function startMessages() {
        const el = $('dynamic-message'); let idx = 0;
        setInterval(() => { el.style.opacity = '0'; setTimeout(() => { idx = (idx + 1) % quotes.length; el.textContent = `"${quotes[idx]}"`; el.style.opacity = '1'; }, 500); }, 4500);
    }

    // ===== TERMINAL LOG =====
    let termIdx = 0;
    function addTermLine(text, cls) {
        const body = $('terminal-body');
        const p = document.createElement('p');
        p.className = 'term-line' + (cls ? ' ' + cls : '');
        p.textContent = text;
        body.appendChild(p);
        body.scrollTop = body.scrollHeight;
    }

    function startTerminal() {
        setInterval(() => {
            const line = terminalLogs[termIdx % terminalLogs.length];
            const cls = line.includes('[WARN]') ? 'warn' : line.includes('[OK]') ? 'success' : '';
            addTermLine(line, cls);
            termIdx++;
        }, 3500);
    }

    // ===== MISSION TIMER =====
    function startMissionTimer() {
        state.missionStart = Date.now();
        const el = $('mission-timer');
        setInterval(() => {
            const d = Date.now() - state.missionStart;
            const h = String(Math.floor(d / 3600000)).padStart(2, '0');
            const m = String(Math.floor((d % 3600000) / 60000)).padStart(2, '0');
            const s = String(Math.floor((d % 60000) / 1000)).padStart(2, '0');
            el.textContent = `${h}:${m}:${s}`;
        }, 1000);
    }

    // ===== INIT =====
    window.addEventListener('resize', resizeP);
    initP(); drawP();
    runBoot();
})();
