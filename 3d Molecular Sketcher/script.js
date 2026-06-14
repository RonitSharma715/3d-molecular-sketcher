// ─── GLOBALS ────────────────────────────────────────────────────────────────
let scene, camera, renderer;
let moleculeGroup = null;
let atomMeshes = [], bondMeshes = [];
let showAtoms = true, showBonds = true, autoRotate = true;

let isDragging = false, isRightDrag = false;
let prevMouse = { x: 0, y: 0 };
let rotX = 0, rotY = 0, panX = 0, panY = 0, zoom = 1;

// ─── INIT ───────────────────────────────────────────────────────────────────
function init() {
    const container = document.getElementById('canvas-container');
    const w = container.clientWidth || (window.innerWidth - 280);
    const h = container.clientHeight || window.innerHeight;

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0c10);

    camera = new THREE.PerspectiveCamera(55, w / h, 0.1, 1000);
    camera.position.set(0, 0, 18);

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Lights
    scene.add(new THREE.AmbientLight(0xffffff, 0.4));
    const key = new THREE.DirectionalLight(0xffffff, 0.9);
    key.position.set(15, 20, 15);
    scene.add(key);
    const fill = new THREE.DirectionalLight(0x8888ff, 0.35);
    fill.position.set(-15, -10, 10);
    scene.add(fill);
    const rim = new THREE.PointLight(0x00e5ff, 0.5, 60);
    rim.position.set(0, 10, -10);
    scene.add(rim);

    addStarfield();
    attachEvents();
    window.addEventListener('resize', onResize);
    animate();
}

function addStarfield() {
    const geo = new THREE.BufferGeometry();
    const verts = [];
    for (let i = 0; i < 800; i++) {
        verts.push(
            (Math.random() - 0.5) * 300,
            (Math.random() - 0.5) * 300,
            (Math.random() - 0.5) * 300
        );
    }
    geo.setAttribute('position', new THREE.Float32BufferAttribute(verts, 3));
    scene.add(new THREE.Points(geo, new THREE.PointsMaterial({ color: 0x223355, size: 0.28 })));
}

function attachEvents() {
    const cvs = renderer.domElement;
    cvs.addEventListener('mousedown', e => {
        isDragging = true;
        isRightDrag = e.button === 2;
        prevMouse = { x: e.clientX, y: e.clientY };
    });
    cvs.addEventListener('mousemove', e => {
        if (!isDragging) return;
        const dx = e.clientX - prevMouse.x;
        const dy = e.clientY - prevMouse.y;
        if (isRightDrag) { panX += dx * 0.025; panY -= dy * 0.025; }
        else { rotY += dx * 0.008; rotX += dy * 0.008; }
        prevMouse = { x: e.clientX, y: e.clientY };
    });
    cvs.addEventListener('mouseup', () => { isDragging = false; isRightDrag = false; });
    cvs.addEventListener('mouseleave', () => { isDragging = false; });
    cvs.addEventListener('wheel', e => {
        e.preventDefault();
        zoom = Math.max(0.15, Math.min(6, zoom - e.deltaY * 0.001));
    }, { passive: false });
    cvs.addEventListener('contextmenu', e => e.preventDefault());

    // Touch
    let lastTouchDist = null;
    cvs.addEventListener('touchstart', e => {
        if (e.touches.length === 1) {
            isDragging = true;
            prevMouse = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        }
        if (e.touches.length === 2) {
            lastTouchDist = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY);
        }
    });
    cvs.addEventListener('touchmove', e => {
        e.preventDefault();
        if (e.touches.length === 1 && isDragging) {
            const dx = e.touches[0].clientX - prevMouse.x;
            const dy = e.touches[0].clientY - prevMouse.y;
            rotY += dx * 0.008; rotX += dy * 0.008;
            prevMouse = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        }
        if (e.touches.length === 2) {
            const dist = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY);
            if (lastTouchDist) zoom = Math.max(0.2, Math.min(5, zoom * (dist / lastTouchDist)));
            lastTouchDist = dist;
        }
    }, { passive: false });
    cvs.addEventListener('touchend', () => { isDragging = false; lastTouchDist = null; });

    document.getElementById('moleculeInput').addEventListener('keydown', e => {
        if (e.key === 'Enter') searchMolecule();
    });

    // Live suggestions
    document.getElementById('moleculeInput').addEventListener('input', e => {
        const val = e.target.value.trim();
        if (val.length < 2) { hideSuggestions(); return; }
        const sugs = getSuggestions(val);
        showSuggestions(sugs);
    });
}

function onResize() {
    const container = document.getElementById('canvas-container');
    const w = container.clientWidth, h = container.clientHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
}

// ─── ANIMATION ──────────────────────────────────────────────────────────────
function animate() {
    requestAnimationFrame(animate);
    if (moleculeGroup) {
        if (autoRotate && !isDragging) moleculeGroup.rotation.y += 0.004;
        moleculeGroup.rotation.x = rotX;
        moleculeGroup.position.set(panX, panY, 0);
    }
    camera.position.z = 18 / zoom;
    renderer.render(scene, camera);
}

// ─── SCENE MANAGEMENT ───────────────────────────────────────────────────────
function clearMolecule() {
    if (moleculeGroup) {
        scene.remove(moleculeGroup);
        moleculeGroup.traverse(obj => {
            if (obj.geometry) obj.geometry.dispose();
            if (obj.material) obj.material.dispose();
        });
        moleculeGroup = null;
    }
    atomMeshes = []; bondMeshes = [];
    rotX = 0; rotY = 0; panX = 0; panY = 0; zoom = 1;
}

// ─── BUILD MOLECULE ─────────────────────────────────────────────────────────
function buildMolecule(data) {
    clearMolecule();
    moleculeGroup = new THREE.Group();

    const atoms = data.atoms;
    const bonds = data.bonds;

    // Centroid
    const c = atoms.reduce((a, v) => ({ x: a.x + v.x, y: a.y + v.y, z: a.z + v.z }), { x: 0, y: 0, z: 0 });
    c.x /= atoms.length; c.y /= atoms.length; c.z /= atoms.length;

    // Scale
    let maxD = 0;
    atoms.forEach(a => {
        const d = Math.sqrt((a.x - c.x) ** 2 + (a.y - c.y) ** 2 + (a.z - c.z) ** 2);
        if (d > maxD) maxD = d;
    });
    const scale = maxD > 0.1 ? Math.min(7 / maxD, 4) : 3.5;

    // Atoms
    atoms.forEach((atom, i) => {
        const el = getElementData(atom.element);
        const r = Math.max(0.3, Math.min(el.radius * scale * 0.52, 1.25));
        const geo = new THREE.SphereGeometry(r, 32, 32);
        const mat = new THREE.MeshPhongMaterial({ color: el.color, shininess: 90, specular: 0x333333 });
        const mesh = new THREE.Mesh(geo, mat);
        mesh.position.set((atom.x - c.x) * scale, (atom.y - c.y) * scale, (atom.z - c.z) * scale);
        atomMeshes.push(mesh);
        moleculeGroup.add(mesh);
    });

    // Bonds
    bonds.forEach(bond => {
        const a1 = atoms[bond.from], a2 = atoms[bond.to];
        if (!a1 || !a2) return;
        const p1 = new THREE.Vector3((a1.x - c.x) * scale, (a1.y - c.y) * scale, (a1.z - c.z) * scale);
        const p2 = new THREE.Vector3((a2.x - c.x) * scale, (a2.y - c.y) * scale, (a2.z - c.z) * scale);
        addBond(p1, p2, bond.order || 1);
    });

    scene.add(moleculeGroup);
}

function addBond(p1, p2, order) {
    const dir = new THREE.Vector3().subVectors(p2, p1);
    const len = dir.length();
    const mid = new THREE.Vector3().addVectors(p1, p2).multiplyScalar(0.5);
    const offsets = order === 1 ? [0] : order === 2 ? [-0.13, 0.13] : [-0.22, 0, 0.22];

    offsets.forEach(offset => {
        const geo = new THREE.CylinderGeometry(0.1, 0.1, len, 12);
        const mat = new THREE.MeshPhongMaterial({ color: 0xaaaaaa, shininess: 40 });
        const cyl = new THREE.Mesh(geo, mat);
        if (offset !== 0) {
            const perp = new THREE.Vector3(-dir.z, 0, dir.x).normalize().multiplyScalar(offset);
            cyl.position.copy(mid).add(perp);
        } else {
            cyl.position.copy(mid);
        }
        cyl.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.clone().normalize());
        bondMeshes.push(cyl);
        moleculeGroup.add(cyl);
    });
}

// ─── UI UPDATES ─────────────────────────────────────────────────────────────
function updateInfo(data) {
    document.getElementById('molecule-info').classList.remove('hidden');
    document.getElementById('legend').classList.remove('hidden');
    document.getElementById('empty-state').classList.add('hidden');

    document.getElementById('info-name').textContent = data.name;
    document.getElementById('info-formula').textContent = data.formula || '';
    document.getElementById('stat-atoms').textContent = data.atoms.length;
    document.getElementById('stat-bonds').textContent = data.bonds.length;

    const elSet = [...new Set(data.atoms.map(a => a.element))];
    document.getElementById('stat-elements').textContent = elSet.length;
    document.getElementById('info-desc').textContent = data.description || '';

    const legendEl = document.getElementById('legend-items');
    legendEl.innerHTML = '';
    elSet.forEach(sym => {
        const el = getElementData(sym);
        const row = document.createElement('div');
        row.className = 'legend-row';
        row.innerHTML = `
            <div class="legend-dot" style="background:${el.hexStr};border:1px solid #ffffff22;"></div>
            <span class="legend-symbol">${el.symbol}</span>
            <span>${el.name}</span>`;
        legendEl.appendChild(row);
    });
}

// ─── SUGGESTIONS ────────────────────────────────────────────────────────────
function showSuggestions(items) {
    let box = document.getElementById('suggest-box');
    if (!box) {
        box = document.createElement('div');
        box.id = 'suggest-box';
        box.style.cssText = `
            position:absolute; top:100%; left:0; right:0; background:#1e2129;
            border:1px solid #ffffff22; border-radius:8px; margin-top:4px;
            z-index:100; overflow:hidden;`;
        document.getElementById('input-wrap').style.position = 'relative';
        document.getElementById('input-wrap').appendChild(box);
    }
    if (!items.length) { box.style.display = 'none'; return; }
    box.style.display = 'block';
    box.innerHTML = items.map(name => `
        <div onclick="pickSuggestion('${name}')" style="
            padding:8px 12px; font-size:13px; color:#c0c8d8; cursor:pointer;
            border-bottom:1px solid #ffffff0a; transition:background 0.12s;"
            onmouseover="this.style.background='#00e5ff18'"
            onmouseout="this.style.background=''">${name}</div>`).join('');
}

function hideSuggestions() {
    const box = document.getElementById('suggest-box');
    if (box) box.style.display = 'none';
}

function pickSuggestion(name) {
    document.getElementById('moleculeInput').value = name;
    hideSuggestions();
    searchMolecule();
}

// ─── TOGGLE ─────────────────────────────────────────────────────────────────
function toggleAtoms() {
    showAtoms = !showAtoms;
    atomMeshes.forEach(m => m.visible = showAtoms);
    document.getElementById('btnAtoms').classList.toggle('active', showAtoms);
}
function toggleBonds() {
    showBonds = !showBonds;
    bondMeshes.forEach(m => m.visible = showBonds);
    document.getElementById('btnBonds').classList.toggle('active', showBonds);
}
function toggleRotation() {
    autoRotate = !autoRotate;
    document.getElementById('btnRotate').classList.toggle('active', autoRotate);
}
function quickLoad(name) {
    document.getElementById('moleculeInput').value = name;
    hideSuggestions();
    searchMolecule();
}

// ─── SEARCH ──────────────────────────────────────────────────────────────────
function searchMolecule() {
    const input = document.getElementById('moleculeInput').value.trim();
    if (!input) return;
    hideSuggestions();
    hideError();

    const data = findMolecule(input);

    if (!data) {
        // Show "not found" with suggestions
        const sugs = Object.values(MOLECULE_DB)
            .filter(m => m.name.toLowerCase().includes(input.toLowerCase().slice(0,3)))
            .slice(0, 3).map(m => m.name);
        const sugStr = sugs.length ? ` Try: ${sugs.join(', ')}.` : '';
        showError(`"${input}" not found in database.${sugStr}`);
        return;
    }

    buildMolecule(data);
    updateInfo(data);

    showAtoms = true; showBonds = true;
    atomMeshes.forEach(m => m.visible = true);
    bondMeshes.forEach(m => m.visible = true);
    document.getElementById('btnAtoms').classList.add('active');
    document.getElementById('btnBonds').classList.add('active');
}

// ─── ERROR / LOADING UI ─────────────────────────────────────────────────────
function showError(msg) {
    const t = document.getElementById('error-toast');
    document.getElementById('error-msg').textContent = msg;
    t.classList.remove('hidden');
    clearTimeout(window._errTimer);
    window._errTimer = setTimeout(() => t.classList.add('hidden'), 6000);
}
function hideError() {
    document.getElementById('error-toast').classList.add('hidden');
}

// ─── BOOT ────────────────────────────────────────────────────────────────────
init();
