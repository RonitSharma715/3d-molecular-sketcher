// ─── GLOBALS ────────────────────────────────────────────────────────────────
let scene, camera, renderer;
let moleculeGroup = null;
let atomMeshes = [], bondMeshes = [];
let lonePairMeshes = [], angleMeshes = [], angleLabels = [];
let showAtoms = true, showBonds = true, autoRotate = true;
let showLonePairs = false, showBondAngles = false;

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
    lonePairMeshes = []; angleMeshes = []; angleLabels = [];
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
    createLonePairs(data);
    createBondAngles(data);

    showAtoms = true; showBonds = true;
    atomMeshes.forEach(m => m.visible = true);
    bondMeshes.forEach(m => m.visible = true);
    document.getElementById('btnAtoms').classList.add('active');
    document.getElementById('btnBonds').classList.add('active');

    // Reset lone pairs / angle visibility to match button states
    lonePairMeshes.forEach(m => m.visible = showLonePairs);
    angleMeshes.forEach(m => m.visible = showBondAngles);
    angleLabels.forEach(s => s.visible = showBondAngles);
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

// ─── LONE PAIRS ─────────────────────────────────────────────────────────────
// Number of lone pairs per element symbol in typical bonding contexts.
const LONE_PAIR_COUNT = {
    O: 2, S: 2,
    N: 1,
    F: 3, Cl: 3, Br: 3, I: 3
};

/**
 * Create lone pair lobe meshes for every eligible atom.
 * Each lone pair is a teardrop-shaped lobe (wide at atom, tapered at tip)
 * rendered as a scaled sphere, semi-transparent light-blue, with two small
 * red dots inside — matching standard VSEPR orbital diagrams.
 */
function createLonePairs(data) {
    if (!moleculeGroup) return;

    const atoms = data.atoms;
    const bonds = data.bonds;

    // Same centroid & scale as buildMolecule
    const c = atoms.reduce((a, v) => ({ x: a.x + v.x, y: a.y + v.y, z: a.z + v.z }), { x: 0, y: 0, z: 0 });
    c.x /= atoms.length; c.y /= atoms.length; c.z /= atoms.length;
    let maxD = 0;
    atoms.forEach(a => {
        const d = Math.sqrt((a.x - c.x) ** 2 + (a.y - c.y) ** 2 + (a.z - c.z) ** 2);
        if (d > maxD) maxD = d;
    });
    const scale = maxD > 0.1 ? Math.min(7 / maxD, 4) : 3.5;

    // Build neighbour list
    const neighbours = atoms.map(() => []);
    bonds.forEach(b => {
        neighbours[b.from].push(b.to);
        neighbours[b.to].push(b.from);
    });

    atoms.forEach((atom, idx) => {
        const el = atom.element.charAt(0).toUpperCase() + atom.element.slice(1).toLowerCase();
        const numLP = LONE_PAIR_COUNT[el];
        if (!numLP) return;

        const atomPos = new THREE.Vector3(
            (atom.x - c.x) * scale,
            (atom.y - c.y) * scale,
            (atom.z - c.z) * scale
        );

        const bondDirs = neighbours[idx].map(nIdx => {
            const n = atoms[nIdx];
            return new THREE.Vector3(
                (n.x - atom.x) * scale,
                (n.y - atom.y) * scale,
                (n.z - atom.z) * scale
            ).normalize();
        });

        const lpDirs = computeLonePairDirections(bondDirs, numLP);

        const elData = getElementData(el);
        const atomR = Math.max(0.3, Math.min(elData.radius * scale * 0.52, 1.25));

        // Lobe dimensions: elongated along the LP direction (teardrop)
        const lobeLength = atomR * 1.5;   // height of the lobe
        const lobeWidth  = atomR * 0.85;  // widest radius of the lobe

        // Lobe material: light blue, semi-transparent (like the reference image)
        const lobeMat = new THREE.MeshPhongMaterial({
            color: 0xaee6f8,
            emissive: 0x1a5f7a,
            shininess: 40,
            transparent: true,
            opacity: 0.45,
            side: THREE.DoubleSide,
            depthWrite: false
        });

        // Red dot material (the two electrons inside each lobe)
        const dotMat = new THREE.MeshPhongMaterial({
            color: 0xff2222,
            emissive: 0x660000,
            shininess: 80
        });

        lpDirs.forEach(dir => {
            // ── Teardrop lobe ──────────────────────────────────────────────
            // Built from a sphere scaled non-uniformly: tall along Y, narrower in X/Z.
            // Then rotated so its Y-axis aligns with the LP direction.
            // The base of the lobe sits at the atom surface.
            const lobeGeo = new THREE.SphereGeometry(1, 24, 16);
            const lobeMesh = new THREE.Mesh(lobeGeo, lobeMat.clone());

            // Scale to teardrop proportions
            lobeMesh.scale.set(lobeWidth, lobeLength, lobeWidth);

            // Position: center of the lobe is offset along dir by lobeLength from atom surface
            const lobeCenter = atomPos.clone().add(dir.clone().multiplyScalar(atomR + lobeLength));
            lobeMesh.position.copy(lobeCenter);

            // Rotate so sphere's Y-axis → LP direction
            lobeMesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.clone().normalize());

            lobeMesh.visible = showLonePairs;
            lonePairMeshes.push(lobeMesh);
            moleculeGroup.add(lobeMesh);

            // ── Two red electron dots inside the lobe ──────────────────────
            // Placed side-by-side perpendicular to the LP direction,
            // about 60% up the lobe (matching the image).
            const perpRef = Math.abs(dir.y) < 0.9
                ? new THREE.Vector3(0, 1, 0)
                : new THREE.Vector3(1, 0, 0);
            const sideVec = new THREE.Vector3().crossVectors(dir, perpRef).normalize();

            const dotR = lobeWidth * 0.18;
            const dotOffset = lobeWidth * 0.30;   // separation between the two dots
            const dotForward = atomR + lobeLength * 0.55; // distance along LP dir

            [-1, 1].forEach(side => {
                const dotGeo = new THREE.SphereGeometry(dotR, 12, 12);
                const dot = new THREE.Mesh(dotGeo, dotMat.clone());
                const pos = atomPos.clone()
                    .add(dir.clone().multiplyScalar(dotForward))
                    .add(sideVec.clone().multiplyScalar(side * dotOffset));
                dot.position.copy(pos);
                dot.visible = showLonePairs;
                lonePairMeshes.push(dot);
                moleculeGroup.add(dot);
            });
        });
    });
}

/**
 * Compute directions for N lone pairs given the existing bond directions.
 * Uses a greedy algorithm: each new LP direction maximises the minimum
 * angle to all bond vectors and previously placed LP directions.
 */
function computeLonePairDirections(bondDirs, numLP) {
    // If no bonds, place LPs evenly around z-axis
    if (bondDirs.length === 0) {
        const dirs = [];
        for (let i = 0; i < numLP; i++) {
            const angle = (2 * Math.PI * i) / numLP;
            dirs.push(new THREE.Vector3(Math.cos(angle), Math.sin(angle), 0));
        }
        return dirs;
    }

    // Candidate directions: dense sample of sphere
    const candidates = [];
    for (let i = 0; i < 60; i++) {
        const theta = Math.acos(1 - 2 * (i + 0.5) / 60);
        for (let j = 0; j < 60; j++) {
            const phi = 2 * Math.PI * j / 60;
            candidates.push(new THREE.Vector3(
                Math.sin(theta) * Math.cos(phi),
                Math.sin(theta) * Math.sin(phi),
                Math.cos(theta)
            ));
        }
    }

    const chosen = [];
    for (let lp = 0; lp < numLP; lp++) {
        let bestDir = null, bestScore = -Infinity;
        const occupied = [...bondDirs, ...chosen];
        candidates.forEach(c => {
            const minAngle = Math.min(...occupied.map(o => Math.acos(Math.max(-1, Math.min(1, c.dot(o))))));
            if (minAngle > bestScore) { bestScore = minAngle; bestDir = c.clone(); }
        });
        if (bestDir) chosen.push(bestDir);
    }
    return chosen;
}

// ─── BOND ANGLES ─────────────────────────────────────────────────────────────

/**
 * Create arc + label annotations for every bond angle in the molecule.
 * Angles are computed from the 3D coordinates (never hardcoded).
 * Called once per molecule load; visibility is toggled without rebuilding.
 */
function createBondAngles(data) {
    if (!moleculeGroup) return;

    const atoms = data.atoms;
    const bonds = data.bonds;

    // Same centroid/scale as buildMolecule
    const c = atoms.reduce((a, v) => ({ x: a.x + v.x, y: a.y + v.y, z: a.z + v.z }), { x: 0, y: 0, z: 0 });
    c.x /= atoms.length; c.y /= atoms.length; c.z /= atoms.length;
    let maxD = 0;
    atoms.forEach(a => {
        const d = Math.sqrt((a.x - c.x) ** 2 + (a.y - c.y) ** 2 + (a.z - c.z) ** 2);
        if (d > maxD) maxD = d;
    });
    const scale = maxD > 0.1 ? Math.min(7 / maxD, 4) : 3.5;

    // Build neighbour list
    const neighbours = atoms.map(() => []);
    bonds.forEach(b => {
        neighbours[b.from].push(b.to);
        neighbours[b.to].push(b.from);
    });

    // Deduplicate: for each central atom, consider all unique pairs of neighbours
    atoms.forEach((atom, idx) => {
        const nbrs = neighbours[idx];
        if (nbrs.length < 2) return;

        const centerPos = new THREE.Vector3(
            (atom.x - c.x) * scale,
            (atom.y - c.y) * scale,
            (atom.z - c.z) * scale
        );

        // Only draw one representative angle per central atom to avoid clutter
        // (the smallest angle among all pairs, which is most chemically meaningful)
        let bestAngle = Infinity, bestA = null, bestB = null;
        for (let i = 0; i < nbrs.length; i++) {
            for (let j = i + 1; j < nbrs.length; j++) {
                const nA = atoms[nbrs[i]], nB = atoms[nbrs[j]];
                const vA = new THREE.Vector3((nA.x - atom.x), (nA.y - atom.y), (nA.z - atom.z)).normalize();
                const vB = new THREE.Vector3((nB.x - atom.x), (nB.y - atom.y), (nB.z - atom.z)).normalize();
                const cosA = Math.max(-1, Math.min(1, vA.dot(vB)));
                const angleDeg = (Math.acos(cosA) * 180) / Math.PI;
                if (angleDeg < bestAngle) {
                    bestAngle = angleDeg;
                    bestA = vA; bestB = vB;
                }
            }
        }
        if (bestA === null) return;

        const arcRadius = 0.55;
        const arcMesh = buildArc(centerPos, bestA, bestB, arcRadius);
        arcMesh.visible = showBondAngles;
        angleMeshes.push(arcMesh);
        moleculeGroup.add(arcMesh);

        // Label sprite positioned at the arc midpoint
        const bisect = bestA.clone().add(bestB).normalize().multiplyScalar(arcRadius * 1.7);
        const labelPos = centerPos.clone().add(bisect);
        const sprite = makeTextSprite(Math.round(bestAngle) + '°');
        sprite.position.copy(labelPos);
        sprite.visible = showBondAngles;
        angleLabels.push(sprite);
        moleculeGroup.add(sprite);
    });
}

/** Build a thin arc (tube) between two unit-vector directions from a center. */
function buildArc(center, vA, vB, radius) {
    const points = [];
    const steps = 20;
    for (let i = 0; i <= steps; i++) {
        const t = i / steps;
        // Slerp between vA and vB
        const cosA = Math.max(-1, Math.min(1, vA.dot(vB)));
        const omega = Math.acos(cosA);
        let pt;
        if (omega < 0.001) {
            pt = vA.clone();
        } else {
            const sinO = Math.sin(omega);
            pt = vA.clone().multiplyScalar(Math.sin((1 - t) * omega) / sinO)
                   .add(vB.clone().multiplyScalar(Math.sin(t * omega) / sinO));
        }
        points.push(center.clone().add(pt.multiplyScalar(radius)));
    }
    const curve = new THREE.CatmullRomCurve3(points);
    const geo = new THREE.TubeGeometry(curve, 20, 0.03, 6, false);
    const mat = new THREE.MeshPhongMaterial({ color: 0x00e5ff, emissive: 0x003344, shininess: 60 });
    return new THREE.Mesh(geo, mat);
}

/** Create a canvas-based text sprite that always faces the camera (billboard). */
function makeTextSprite(text) {
    const canvas = document.createElement('canvas');
    canvas.width = 128; canvas.height = 64;
    const ctx = canvas.getContext('2d');
    // Draw background pill manually (fillRoundRect not universally available in r128 era)
    ctx.fillStyle = 'rgba(0,0,0,0.6)';
    ctx.beginPath();
    const x = 4, y = 10, w = 120, h = 44, r = 8;
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
    ctx.fill();
    ctx.font = 'bold 28px Arial';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, 64, 32);

    const tex = new THREE.CanvasTexture(canvas);
    const mat = new THREE.SpriteMaterial({ map: tex, transparent: true, depthTest: false });
    const sprite = new THREE.Sprite(mat);
    sprite.scale.set(1.1, 0.55, 1);
    return sprite;
}

// ─── TOGGLE EXTENSIONS ───────────────────────────────────────────────────────
function toggleLonePairs() {
    showLonePairs = !showLonePairs;
    lonePairMeshes.forEach(m => m.visible = showLonePairs);
    document.getElementById('btnLonePairs').classList.toggle('active', showLonePairs);
}
function toggleBondAngles() {
    showBondAngles = !showBondAngles;
    angleMeshes.forEach(m => m.visible = showBondAngles);
    angleLabels.forEach(s => s.visible = showBondAngles);
    document.getElementById('btnBondAngles').classList.toggle('active', showBondAngles);
}

// ─── BOOT ────────────────────────────────────────────────────────────────────
init();