// CPK color standards for elements
const CPK_COLORS = {
  
    H:  { color: 0xffffff, radius: 0.53, name: 'Hydrogen',   hexStr: '#ffffff' },
    He: { color: 0xd9ffff, radius: 0.31, name: 'Helium',     hexStr: '#d9ffff' },

    Li: { color: 0xcc80ff, radius: 1.67, name: 'Lithium',    hexStr: '#cc80ff' },
    Be: { color: 0xc2ff00, radius: 1.12, name: 'Beryllium',  hexStr: '#c2ff00' },
    B:  { color: 0xffb5b5, radius: 0.87, name: 'Boron',      hexStr: '#ffb5b5' },
    C:  { color: 0x404040, radius: 0.77, name: 'Carbon',     hexStr: '#606060' },
    N:  { color: 0x3050f8, radius: 0.75, name: 'Nitrogen',   hexStr: '#3050f8' },
    O:  { color: 0xff0d0d, radius: 0.73, name: 'Oxygen',     hexStr: '#ff0d0d' },
    F:  { color: 0x90e050, radius: 0.72, name: 'Fluorine',   hexStr: '#90e050' },
    Ne: { color: 0xb3e3f5, radius: 0.38, name: 'Neon',       hexStr: '#b3e3f5' },

    Na: { color: 0xab5cf2, radius: 1.54, name: 'Sodium',     hexStr: '#ab5cf2' },
    Mg: { color: 0x8aff00, radius: 1.30, name: 'Magnesium',  hexStr: '#8aff00' },
    Al: { color: 0xbfa6a6, radius: 1.18, name: 'Aluminium',  hexStr: '#bfa6a6' },
    Si: { color: 0xf0c8a0, radius: 1.11, name: 'Silicon',    hexStr: '#f0c8a0' },
    P:  { color: 0xff8000, radius: 1.06, name: 'Phosphorus', hexStr: '#ff8000' },
    S:  { color: 0xffff30, radius: 1.02, name: 'Sulfur',     hexStr: '#ffff30' },
    Cl: { color: 0x1ff01f, radius: 0.99, name: 'Chlorine',   hexStr: '#1ff01f' },
    Ar: { color: 0x80d1e3, radius: 0.71, name: 'Argon',      hexStr: '#80d1e3' },

    K:  { color: 0x8f40d4, radius: 1.96, name: 'Potassium',  hexStr: '#8f40d4' },
    Ca: { color: 0x3dff00, radius: 1.74, name: 'Calcium',    hexStr: '#3dff00' },
    Sc: { color: 0xe6e6e6, radius: 1.44, name: 'Scandium',   hexStr: '#e6e6e6' },
    Ti: { color: 0xbfc2c7, radius: 1.36, name: 'Titanium',   hexStr: '#bfc2c7' },
    V:  { color: 0xa6a6ab, radius: 1.34, name: 'Vanadium',   hexStr: '#a6a6ab' },
    Cr: { color: 0x8a99c7, radius: 1.22, name: 'Chromium',   hexStr: '#8a99c7' },
    Mn: { color: 0x9c7ac7, radius: 1.19, name: 'Manganese',  hexStr: '#9c7ac7' },
    Fe: { color: 0xe06633, radius: 1.25, name: 'Iron',       hexStr: '#e06633' },
    Co: { color: 0xf090a0, radius: 1.26, name: 'Cobalt',     hexStr: '#f090a0' },
    Ni: { color: 0x50d050, radius: 1.21, name: 'Nickel',     hexStr: '#50d050' },
    Cu: { color: 0xc88033, radius: 1.38, name: 'Copper',     hexStr: '#c88033' },
    Zn: { color: 0x7d80b0, radius: 1.22, name: 'Zinc',       hexStr: '#7d80b0' },
    DEFAULT: { color: 0xff69b4, radius: 1.0, name: 'Unknown', hexStr: '#ff69b4' }
    
};

function getElementData(symbol) {
    const s = symbol.charAt(0).toUpperCase() + symbol.slice(1).toLowerCase();
    if (CPK_COLORS[s]) return { ...CPK_COLORS[s], symbol: s };
    const s1 = symbol.charAt(0).toUpperCase();
    if (CPK_COLORS[s1]) return { ...CPK_COLORS[s1], symbol: s1 };
    return { ...CPK_COLORS.DEFAULT, symbol: s };
}

// ── MOLECULE DATABASE ──────────────────────────────────────────────────────
// 3D coordinates in Angstroms (from standard crystallographic/computed data)
const MOLECULE_DB = {
    "water": {
        name: "Water", formula: "H₂O",
        description: "The most abundant molecule on Earth's surface, essential for all known life.",
        atoms: [
            { element: "O", x: 0.000, y: 0.119, z: 0.000 },
            { element: "H", x: 0.757, y: -0.477, z: 0.000 },
            { element: "H", x: -0.757, y: -0.477, z: 0.000 }
        ],
        bonds: [{ from: 0, to: 1, order: 1 }, { from: 0, to: 2, order: 1 }]
    },
    "methane": {
        name: "Methane", formula: "CH₄",
        description: "The simplest alkane and primary component of natural gas.",
        atoms: [
            { element: "C", x: 0.000, y: 0.000, z: 0.000 },
            { element: "H", x: 0.629, y: 0.629, z: 0.629 },
            { element: "H", x: -0.629, y: -0.629, z: 0.629 },
            { element: "H", x: -0.629, y: 0.629, z: -0.629 },
            { element: "H", x: 0.629, y: -0.629, z: -0.629 }
        ],
        bonds: [{ from:0,to:1,order:1},{from:0,to:2,order:1},{from:0,to:3,order:1},{from:0,to:4,order:1}]
    },
    "ammonia": {
        name: "Ammonia", formula: "NH₃",
        description: "A colourless gas with a pungent smell, widely used in fertilisers.",
        atoms: [
            { element: "N", x: 0.000, y: 0.000, z: 0.116 },
            { element: "H", x: 0.000, y: 0.939, z: -0.271 },
            { element: "H", x: 0.813, y: -0.470, z: -0.271 },
            { element: "H", x: -0.813, y: -0.470, z: -0.271 }
        ],
        bonds: [{from:0,to:1,order:1},{from:0,to:2,order:1},{from:0,to:3,order:1}]
    },
    "co2": {
        name: "Carbon Dioxide", formula: "CO₂",
        description: "A greenhouse gas produced by combustion and respiration.",
        atoms: [
            { element: "C", x: 0.000, y: 0.000, z: 0.000 },
            { element: "O", x: 1.160, y: 0.000, z: 0.000 },
            { element: "O", x: -1.160, y: 0.000, z: 0.000 }
        ],
        bonds: [{from:0,to:1,order:2},{from:0,to:2,order:2}]
    },
    "carbon dioxide": {
        name: "Carbon Dioxide", formula: "CO₂",
        description: "A greenhouse gas produced by combustion and respiration.",
        atoms: [
            { element: "C", x: 0.000, y: 0.000, z: 0.000 },
            { element: "O", x: 1.160, y: 0.000, z: 0.000 },
            { element: "O", x: -1.160, y: 0.000, z: 0.000 }
        ],
        bonds: [{from:0,to:1,order:2},{from:0,to:2,order:2}]
    },
    "ethanol": {
        name: "Ethanol", formula: "C₂H₅OH",
        description: "A simple alcohol found in alcoholic beverages and used as a solvent and fuel.",
        atoms: [
            { element: "C", x: -1.268, y: 0.374, z: 0.000 },
            { element: "C", x: 0.000, y: -0.445, z: 0.000 },
            { element: "O", x: 1.215, y: 0.300, z: 0.000 },
            { element: "H", x: -1.216, y: 1.013, z: 0.889 },
            { element: "H", x: -1.216, y: 1.013, z: -0.889 },
            { element: "H", x: -2.168, y: -0.237, z: 0.000 },
            { element: "H", x: 0.031, y: -1.082, z: 0.889 },
            { element: "H", x: 0.031, y: -1.082, z: -0.889 },
            { element: "H", x: 1.972, y: -0.282, z: 0.000 }
        ],
        bonds: [{from:0,to:1,order:1},{from:1,to:2,order:1},{from:0,to:3,order:1},{from:0,to:4,order:1},{from:0,to:5,order:1},{from:1,to:6,order:1},{from:1,to:7,order:1},{from:2,to:8,order:1}]
    },
    "benzene": {
        name: "Benzene", formula: "C₆H₆",
        description: "An aromatic hydrocarbon with a planar hexagonal ring structure, key in organic chemistry.",
        atoms: [
            { element: "C", x: 1.400, y: 0.000, z: 0.000 },
            { element: "C", x: 0.700, y: 1.212, z: 0.000 },
            { element: "C", x: -0.700, y: 1.212, z: 0.000 },
            { element: "C", x: -1.400, y: 0.000, z: 0.000 },
            { element: "C", x: -0.700, y: -1.212, z: 0.000 },
            { element: "C", x: 0.700, y: -1.212, z: 0.000 },
            { element: "H", x: 2.490, y: 0.000, z: 0.000 },
            { element: "H", x: 1.245, y: 2.156, z: 0.000 },
            { element: "H", x: -1.245, y: 2.156, z: 0.000 },
            { element: "H", x: -2.490, y: 0.000, z: 0.000 },
            { element: "H", x: -1.245, y: -2.156, z: 0.000 },
            { element: "H", x: 1.245, y: -2.156, z: 0.000 }
        ],
        bonds: [{from:0,to:1,order:2},{from:1,to:2,order:1},{from:2,to:3,order:2},{from:3,to:4,order:1},{from:4,to:5,order:2},{from:5,to:0,order:1},{from:0,to:6,order:1},{from:1,to:7,order:1},{from:2,to:8,order:1},{from:3,to:9,order:1},{from:4,to:10,order:1},{from:5,to:11,order:1}]
    },
    "glucose": {
        name: "Glucose", formula: "C₆H₁₂O₆",
        description: "The primary energy source for living organisms, produced by photosynthesis.",
        atoms: [
            { element: "C", x: 0.740, y: 0.871, z: -0.089 },
            { element: "C", x: -0.740, y: 0.871, z: -0.089 },
            { element: "C", x: -1.250, y: -0.540, z: 0.121 },
            { element: "C", x: 0.000, y: -1.399, z: -0.230 },
            { element: "C", x: 1.250, y: -0.540, z: 0.121 },
            { element: "O", x: 1.429, y: 1.728, z: 0.833 },
            { element: "O", x: -1.429, y: 1.728, z: 0.833 },
            { element: "O", x: -2.598, y: -0.714, z: -0.358 },
            { element: "O", x: 0.000, y: -2.651, z: 0.450 },
            { element: "O", x: 2.598, y: -0.714, z: -0.358 },
            { element: "C", x: 0.000, y: 1.611, z: -1.378 },
            { element: "O", x: 0.000, y: 3.009, z: -1.227 },
            { element: "H", x: 0.900, y: 1.145, z: -2.250 },
            { element: "H", x: -0.900, y: 1.145, z: -2.250 },
            { element: "H", x: 1.429, y: 2.634, z: 0.584 },
            { element: "H", x: -1.429, y: 2.634, z: 0.584 },
            { element: "H", x: -2.919, y: -1.601, z: -0.122 },
            { element: "H", x: 0.000, y: -3.467, z: -0.076 },
            { element: "H", x: 2.919, y: -1.601, z: -0.122 },
            { element: "H", x: 0.628, y: 3.391, z: -1.864 }
        ],
        bonds: [{from:0,to:1,order:1},{from:1,to:2,order:1},{from:2,to:3,order:1},{from:3,to:4,order:1},{from:4,to:0,order:1},{from:0,to:5,order:1},{from:1,to:6,order:1},{from:2,to:7,order:1},{from:3,to:8,order:1},{from:4,to:9,order:1},{from:0,to:10,order:1},{from:10,to:11,order:1},{from:10,to:12,order:1},{from:10,to:13,order:1},{from:5,to:14,order:1},{from:6,to:15,order:1},{from:7,to:16,order:1},{from:8,to:17,order:1},{from:9,to:18,order:1},{from:11,to:19,order:1}]
    },
    "caffeine": {
        name: "Caffeine", formula: "C₈H₁₀N₄O₂",
        description: "A stimulant found in coffee, tea, and many soft drinks. Works by blocking adenosine receptors.",
        atoms: [
            { element: "N", x: 1.339, y: 0.131, z: 0.000 },
            { element: "C", x: 0.723, y: 1.348, z: 0.000 },
            { element: "N", x: -0.688, y: 1.348, z: 0.000 },
            { element: "C", x: -1.339, y: 0.131, z: 0.000 },
            { element: "C", x: -0.548, y: -1.027, z: 0.000 },
            { element: "N", x: 0.780, y: -1.189, z: 0.000 },
            { element: "C", x: 1.576, y: -2.398, z: 0.000 },
            { element: "N", x: -1.196, y: -2.234, z: 0.000 },
            { element: "C", x: -0.370, y: -3.292, z: 0.000 },
            { element: "C", x: 0.968, y: -3.104, z: 0.000 },
            { element: "O", x: 1.331, y: 2.381, z: 0.000 },
            { element: "O", x: -2.574, y: 0.009, z: 0.000 },
            { element: "C", x: 2.787, y: 0.066, z: 0.000 },
            { element: "C", x: -1.323, y: 2.607, z: 0.000 },
            { element: "H", x: 2.660, y: -2.398, z: 0.000 },
            { element: "H", x: -2.283, y: -2.315, z: 0.000 },
            { element: "H", x: -0.759, y: -4.306, z: 0.000 },
            { element: "H", x: 3.105, y: 1.096, z: 0.000 },
            { element: "H", x: 3.185, y: -0.461, z: 0.889 },
            { element: "H", x: 3.185, y: -0.461, z: -0.889 },
            { element: "H", x: -0.989, y: 3.174, z: 0.889 },
            { element: "H", x: -0.989, y: 3.174, z: -0.889 },
            { element: "H", x: -2.413, y: 2.531, z: 0.000 }
        ],
        bonds: [{from:0,to:1,order:1},{from:1,to:2,order:1},{from:2,to:3,order:1},{from:3,to:4,order:1},{from:4,to:5,order:1},{from:5,to:0,order:1},{from:5,to:6,order:1},{from:4,to:7,order:1},{from:7,to:8,order:1},{from:8,to:9,order:2},{from:9,to:6,order:1},{from:1,to:10,order:2},{from:3,to:11,order:2},{from:0,to:12,order:1},{from:2,to:13,order:1},{from:6,to:14,order:1},{from:7,to:15,order:1},{from:8,to:16,order:1},{from:12,to:17,order:1},{from:12,to:18,order:1},{from:12,to:19,order:1},{from:13,to:20,order:1},{from:13,to:21,order:1},{from:13,to:22,order:1}]
    },
    "aspirin": {
        name: "Aspirin (Acetylsalicylic acid)", formula: "C₉H₈O₄",
        description: "A pain reliever and anti-inflammatory drug. One of the most widely used medications worldwide.",
        atoms: [
            { element: "C", x: 0.000, y: 1.400, z: 0.000 },
            { element: "C", x: 1.213, y: 0.700, z: 0.000 },
            { element: "C", x: 1.213, y: -0.700, z: 0.000 },
            { element: "C", x: 0.000, y: -1.400, z: 0.000 },
            { element: "C", x: -1.213, y: -0.700, z: 0.000 },
            { element: "C", x: -1.213, y: 0.700, z: 0.000 },
            { element: "C", x: 0.000, y: 2.830, z: 0.000 },
            { element: "O", x: 1.060, y: 3.430, z: 0.000 },
            { element: "O", x: -1.127, y: 3.470, z: 0.000 },
            { element: "H", x: -2.040, y: 2.900, z: 0.000 },
            { element: "O", x: -2.430, y: 1.290, z: 0.000 },
            { element: "C", x: -3.580, y: 0.600, z: 0.000 },
            { element: "C", x: -4.730, y: 1.580, z: 0.000 },
            { element: "O", x: -3.640, y: -0.620, z: 0.000 },
            { element: "H", x: 2.156, y: 1.240, z: 0.000 },
            { element: "H", x: 2.156, y: -1.240, z: 0.000 },
            { element: "H", x: 0.000, y: -2.490, z: 0.000 },
            { element: "H", x: -2.156, y: -1.240, z: 0.000 },
            { element: "H", x: -4.670, y: 2.220, z: 0.889 },
            { element: "H", x: -4.670, y: 2.220, z: -0.889 },
            { element: "H", x: -5.680, y: 1.040, z: 0.000 }
        ],
        bonds: [{from:0,to:1,order:2},{from:1,to:2,order:1},{from:2,to:3,order:2},{from:3,to:4,order:1},{from:4,to:5,order:2},{from:5,to:0,order:1},{from:0,to:6,order:1},{from:6,to:7,order:2},{from:6,to:8,order:1},{from:8,to:9,order:1},{from:5,to:10,order:1},{from:10,to:11,order:1},{from:11,to:12,order:1},{from:11,to:13,order:2},{from:1,to:14,order:1},{from:2,to:15,order:1},{from:3,to:16,order:1},{from:4,to:17,order:1},{from:12,to:18,order:1},{from:12,to:19,order:1},{from:12,to:20,order:1}]
    },
    "ethylene": {
        name: "Ethylene", formula: "C₂H₄",
        description: "The simplest alkene with a carbon-carbon double bond. A plant hormone and industrial chemical.",
        atoms: [
            { element: "C", x: 0.000, y: 0.668, z: 0.000 },
            { element: "C", x: 0.000, y: -0.668, z: 0.000 },
            { element: "H", x: 0.923, y: 1.241, z: 0.000 },
            { element: "H", x: -0.923, y: 1.241, z: 0.000 },
            { element: "H", x: 0.923, y: -1.241, z: 0.000 },
            { element: "H", x: -0.923, y: -1.241, z: 0.000 }
        ],
        bonds: [{from:0,to:1,order:2},{from:0,to:2,order:1},{from:0,to:3,order:1},{from:1,to:4,order:1},{from:1,to:5,order:1}]
    },
    "acetylene": {
        name: "Acetylene", formula: "C₂H₂",
        description: "A linear molecule with a carbon-carbon triple bond. Used in welding torches.",
        atoms: [
            { element: "C", x: 0.000, y: 0.605, z: 0.000 },
            { element: "C", x: 0.000, y: -0.605, z: 0.000 },
            { element: "H", x: 0.000, y: 1.671, z: 0.000 },
            { element: "H", x: 0.000, y: -1.671, z: 0.000 }
        ],
        bonds: [{from:0,to:1,order:3},{from:0,to:2,order:1},{from:1,to:3,order:1}]
    },
    "hcl": {
        name: "Hydrogen Chloride", formula: "HCl",
        description: "A diatomic molecule that dissolves in water to form hydrochloric acid.",
        atoms: [
            { element: "H", x: 0.000, y: 0.628, z: 0.000 },
            { element: "Cl", x: 0.000, y: -0.628, z: 0.000 }
        ],
        bonds: [{from:0,to:1,order:1}]
    },
    "hydrogen chloride": {
        name: "Hydrogen Chloride", formula: "HCl",
        description: "A diatomic molecule that dissolves in water to form hydrochloric acid.",
        atoms: [
            { element: "H", x: 0.000, y: 0.628, z: 0.000 },
            { element: "Cl", x: 0.000, y: -0.628, z: 0.000 }
        ],
        bonds: [{from:0,to:1,order:1}]
    },
    "h2o2": {
        name: "Hydrogen Peroxide", formula: "H₂O₂",
        description: "A pale blue liquid used as an oxidizer and disinfectant.",
        atoms: [
            { element: "O", x: 0.000, y: 0.734, z: -0.052 },
            { element: "O", x: 0.000, y: -0.734, z: -0.052 },
            { element: "H", x: 0.815, y: 0.920, z: 0.444 },
            { element: "H", x: -0.815, y: -0.920, z: 0.444 }
        ],
        bonds: [{from:0,to:1,order:1},{from:0,to:2,order:1},{from:1,to:3,order:1}]
    },
    "hydrogen peroxide": {
        name: "Hydrogen Peroxide", formula: "H₂O₂",
        description: "A pale blue liquid used as an oxidizer and disinfectant.",
        atoms: [
            { element: "O", x: 0.000, y: 0.734, z: -0.052 },
            { element: "O", x: 0.000, y: -0.734, z: -0.052 },
            { element: "H", x: 0.815, y: 0.920, z: 0.444 },
            { element: "H", x: -0.815, y: -0.920, z: 0.444 }
        ],
        bonds: [{from:0,to:1,order:1},{from:0,to:2,order:1},{from:1,to:3,order:1}]
    },
    "methanol": {
        name: "Methanol", formula: "CH₃OH",
        description: "The simplest alcohol, also called wood alcohol. Toxic to humans.",
        atoms: [
            { element: "C", x: -0.748, y: 0.000, z: 0.000 },
            { element: "O", x: 0.683, y: 0.000, z: 0.000 },
            { element: "H", x: -1.084, y: 1.026, z: 0.000 },
            { element: "H", x: -1.084, y: -0.513, z: 0.889 },
            { element: "H", x: -1.084, y: -0.513, z: -0.889 },
            { element: "H", x: 1.050, y: 0.901, z: 0.000 }
        ],
        bonds: [{from:0,to:1,order:1},{from:0,to:2,order:1},{from:0,to:3,order:1},{from:0,to:4,order:1},{from:1,to:5,order:1}]
    },
    "formaldehyde": {
        name: "Formaldehyde", formula: "CH₂O",
        description: "The simplest aldehyde. Used in preservation and as a building block in organic synthesis.",
        atoms: [
            { element: "C", x: 0.000, y: 0.000, z: 0.000 },
            { element: "O", x: 0.000, y: 1.208, z: 0.000 },
            { element: "H", x: 0.940, y: -0.540, z: 0.000 },
            { element: "H", x: -0.940, y: -0.540, z: 0.000 }
        ],
        bonds: [{from:0,to:1,order:2},{from:0,to:2,order:1},{from:0,to:3,order:1}]
    },
    "acetic acid": {
        name: "Acetic Acid", formula: "CH₃COOH",
        description: "The main component of vinegar. A weak acid used in food and chemical synthesis.",
        atoms: [
            { element: "C", x: -1.171, y: 0.290, z: 0.000 },
            { element: "C", x: 0.282, y: -0.124, z: 0.000 },
            { element: "O", x: 0.355, y: -1.354, z: 0.000 },
            { element: "O", x: 1.310, y: 0.718, z: 0.000 },
            { element: "H", x: -1.192, y: 1.375, z: 0.000 },
            { element: "H", x: -1.671, y: -0.057, z: 0.889 },
            { element: "H", x: -1.671, y: -0.057, z: -0.889 },
            { element: "H", x: 2.201, y: 0.305, z: 0.000 }
        ],
        bonds: [{from:0,to:1,order:1},{from:1,to:2,order:2},{from:1,to:3,order:1},{from:0,to:4,order:1},{from:0,to:5,order:1},{from:0,to:6,order:1},{from:3,to:7,order:1}]
    },
    "vinegar": {
        name: "Acetic Acid (Vinegar)", formula: "CH₃COOH",
        description: "The main component of vinegar. A weak acid used in food and chemical synthesis.",
        atoms: [
            { element: "C", x: -1.171, y: 0.290, z: 0.000 },
            { element: "C", x: 0.282, y: -0.124, z: 0.000 },
            { element: "O", x: 0.355, y: -1.354, z: 0.000 },
            { element: "O", x: 1.310, y: 0.718, z: 0.000 },
            { element: "H", x: -1.192, y: 1.375, z: 0.000 },
            { element: "H", x: -1.671, y: -0.057, z: 0.889 },
            { element: "H", x: -1.671, y: -0.057, z: -0.889 },
            { element: "H", x: 2.201, y: 0.305, z: 0.000 }
        ],
        bonds: [{from:0,to:1,order:1},{from:1,to:2,order:2},{from:1,to:3,order:1},{from:0,to:4,order:1},{from:0,to:5,order:1},{from:0,to:6,order:1},{from:3,to:7,order:1}]
    },
    "toluene": {
        name: "Toluene", formula: "C₇H₈",
        description: "An aromatic hydrocarbon. Used as a solvent and as a precursor to many chemicals.",
        atoms: [
            { element: "C", x: 0.000, y: 1.399, z: 0.000 },
            { element: "C", x: 1.211, y: 0.700, z: 0.000 },
            { element: "C", x: 1.211, y: -0.700, z: 0.000 },
            { element: "C", x: 0.000, y: -1.399, z: 0.000 },
            { element: "C", x: -1.211, y: -0.700, z: 0.000 },
            { element: "C", x: -1.211, y: 0.700, z: 0.000 },
            { element: "C", x: 0.000, y: 2.830, z: 0.000 },
            { element: "H", x: 2.152, y: 1.243, z: 0.000 },
            { element: "H", x: 2.152, y: -1.243, z: 0.000 },
            { element: "H", x: 0.000, y: -2.490, z: 0.000 },
            { element: "H", x: -2.152, y: -1.243, z: 0.000 },
            { element: "H", x: -2.152, y: 1.243, z: 0.000 },
            { element: "H", x: 1.026, y: 3.201, z: 0.000 },
            { element: "H", x: -1.026, y: 3.201, z: 0.000 },
            { element: "H", x: 0.000, y: 3.441, z: 0.890 }
        ],
        bonds: [{from:0,to:1,order:2},{from:1,to:2,order:1},{from:2,to:3,order:2},{from:3,to:4,order:1},{from:4,to:5,order:2},{from:5,to:0,order:1},{from:0,to:6,order:1},{from:1,to:7,order:1},{from:2,to:8,order:1},{from:3,to:9,order:1},{from:4,to:10,order:1},{from:5,to:11,order:1},{from:6,to:12,order:1},{from:6,to:13,order:1},{from:6,to:14,order:1}]
    },
    "naphthalene": {
        name: "Naphthalene", formula: "C₁₀H₈",
        description: "A polycyclic aromatic hydrocarbon with two fused benzene rings. Found in mothballs.",
        atoms: [
            { element: "C", x: 2.440, y: 0.707, z: 0.000 },
            { element: "C", x: 1.230, y: 1.399, z: 0.000 },
            { element: "C", x: 0.000, y: 0.711, z: 0.000 },
            { element: "C", x: 0.000, y: -0.711, z: 0.000 },
            { element: "C", x: 1.230, y: -1.399, z: 0.000 },
            { element: "C", x: 2.440, y: -0.707, z: 0.000 },
            { element: "C", x: -1.230, y: 1.399, z: 0.000 },
            { element: "C", x: -2.440, y: 0.707, z: 0.000 },
            { element: "C", x: -2.440, y: -0.707, z: 0.000 },
            { element: "C", x: -1.230, y: -1.399, z: 0.000 },
            { element: "H", x: 3.381, y: 1.243, z: 0.000 },
            { element: "H", x: 1.230, y: 2.490, z: 0.000 },
            { element: "H", x: 1.230, y: -2.490, z: 0.000 },
            { element: "H", x: 3.381, y: -1.243, z: 0.000 },
            { element: "H", x: -1.230, y: 2.490, z: 0.000 },
            { element: "H", x: -3.381, y: 1.243, z: 0.000 },
            { element: "H", x: -3.381, y: -1.243, z: 0.000 },
            { element: "H", x: -1.230, y: -2.490, z: 0.000 }
        ],
        bonds: [{from:0,to:1,order:2},{from:1,to:2,order:1},{from:2,to:3,order:1},{from:3,to:4,order:2},{from:4,to:5,order:1},{from:5,to:0,order:2},{from:2,to:6,order:2},{from:6,to:7,order:1},{from:7,to:8,order:2},{from:8,to:9,order:1},{from:9,to:3,order:1},{from:0,to:10,order:1},{from:1,to:11,order:1},{from:4,to:12,order:1},{from:5,to:13,order:1},{from:6,to:14,order:1},{from:7,to:15,order:1},{from:8,to:16,order:1},{from:9,to:17,order:1}]
    },
    "h2": {
        name: "Hydrogen", formula: "H₂",
        description: "The lightest and most abundant element in the universe.",
        atoms: [
            { element: "H", x: 0.000, y: 0.371, z: 0.000 },
            { element: "H", x: 0.000, y: -0.371, z: 0.000 }
        ],
        bonds: [{from:0,to:1,order:1}]
    },
    "hydrogen": {
        name: "Hydrogen (H₂)", formula: "H₂",
        description: "The lightest and most abundant element in the universe.",
        atoms: [
            { element: "H", x: 0.000, y: 0.371, z: 0.000 },
            { element: "H", x: 0.000, y: -0.371, z: 0.000 }
        ],
        bonds: [{from:0,to:1,order:1}]
    },
    "o2": {
        name: "Oxygen", formula: "O₂",
        description: "A diatomic molecule essential for aerobic respiration.",
        atoms: [
            { element: "O", x: 0.000, y: 0.605, z: 0.000 },
            { element: "O", x: 0.000, y: -0.605, z: 0.000 }
        ],
        bonds: [{from:0,to:1,order:2}]
    },
    "oxygen": {
        name: "Oxygen (O₂)", formula: "O₂",
        description: "A diatomic molecule essential for aerobic respiration.",
        atoms: [
            { element: "O", x: 0.000, y: 0.605, z: 0.000 },
            { element: "O", x: 0.000, y: -0.605, z: 0.000 }
        ],
        bonds: [{from:0,to:1,order:2}]
    },
    "n2": {
        name: "Nitrogen", formula: "N₂",
        description: "Makes up 78% of Earth's atmosphere. Has an extremely strong triple bond.",
        atoms: [
            { element: "N", x: 0.000, y: 0.550, z: 0.000 },
            { element: "N", x: 0.000, y: -0.550, z: 0.000 }
        ],
        bonds: [{from:0,to:1,order:3}]
    },
    "nitrogen": {
        name: "Nitrogen (N₂)", formula: "N₂",
        description: "Makes up 78% of Earth's atmosphere. Has an extremely strong triple bond.",
        atoms: [
            { element: "N", x: 0.000, y: 0.550, z: 0.000 },
            { element: "N", x: 0.000, y: -0.550, z: 0.000 }
        ],
        bonds: [{from:0,to:1,order:3}]
    },
    "so2": {
        name: "Sulfur Dioxide", formula: "SO₂",
        description: "A pungent gas produced by burning sulfur. A major air pollutant.",
        atoms: [
            { element: "S", x: 0.000, y: 0.000, z: 0.366 },
            { element: "O", x: 1.252, y: 0.000, z: -0.183 },
            { element: "O", x: -1.252, y: 0.000, z: -0.183 }
        ],
        bonds: [{from:0,to:1,order:2},{from:0,to:2,order:2}]
    },
    "sulfur dioxide": {
        name: "Sulfur Dioxide", formula: "SO₂",
        description: "A pungent gas produced by burning sulfur. A major air pollutant.",
        atoms: [
            { element: "S", x: 0.000, y: 0.000, z: 0.366 },
            { element: "O", x: 1.252, y: 0.000, z: -0.183 },
            { element: "O", x: -1.252, y: 0.000, z: -0.183 }
        ],
        bonds: [{from:0,to:1,order:2},{from:0,to:2,order:2}]
    },
    "propane": {
        name: "Propane", formula: "C₃H₈",
        description: "A three-carbon alkane used as fuel for heating and cooking.",
        atoms: [
            { element: "C", x: -1.268, y: 0.000, z: 0.000 },
            { element: "C", x: 0.000, y: 0.820, z: 0.000 },
            { element: "C", x: 1.268, y: 0.000, z: 0.000 },
            { element: "H", x: -1.268, y: -0.635, z: 0.889 },
            { element: "H", x: -1.268, y: -0.635, z: -0.889 },
            { element: "H", x: -2.164, y: 0.620, z: 0.000 },
            { element: "H", x: 0.000, y: 1.456, z: 0.889 },
            { element: "H", x: 0.000, y: 1.456, z: -0.889 },
            { element: "H", x: 1.268, y: -0.635, z: 0.889 },
            { element: "H", x: 1.268, y: -0.635, z: -0.889 },
            { element: "H", x: 2.164, y: 0.620, z: 0.000 }
        ],
        bonds: [{from:0,to:1,order:1},{from:1,to:2,order:1},{from:0,to:3,order:1},{from:0,to:4,order:1},{from:0,to:5,order:1},{from:1,to:6,order:1},{from:1,to:7,order:1},{from:2,to:8,order:1},{from:2,to:9,order:1},{from:2,to:10,order:1}]
    },
    "cyclohexane": {
        name: "Cyclohexane", formula: "C₆H₁₂",
        description: "A cyclic alkane in chair conformation. Common solvent in organic chemistry.",
        atoms: [
            { element: "C", x: 1.240, y: 0.234, z: -0.735 },
            { element: "C", x: 0.000, y: 0.234, z: 0.580 },
            { element: "C", x: -1.240, y: 0.234, z: -0.735 },
            { element: "C", x: -1.240, y: -0.234, z: 0.735 },
            { element: "C", x: 0.000, y: -0.234, z: -0.580 },
            { element: "C", x: 1.240, y: -0.234, z: 0.735 },
            { element: "H", x: 1.240, y: 1.288, z: -1.034 },
            { element: "H", x: 2.154, y: -0.208, z: -1.123 },
            { element: "H", x: 0.000, y: 1.288, z: 1.269 },
            { element: "H", x: 0.000, y: -0.819, z: 0.987 },
            { element: "H", x: -1.240, y: 1.288, z: -1.034 },
            { element: "H", x: -2.154, y: -0.208, z: -1.123 },
            { element: "H", x: -1.240, y: -1.288, z: 1.034 },
            { element: "H", x: -2.154, y: 0.208, z: 1.123 },
            { element: "H", x: 0.000, y: -1.288, z: -1.269 },
            { element: "H", x: 0.000, y: 0.819, z: -0.987 },
            { element: "H", x: 1.240, y: -1.288, z: 1.034 },
            { element: "H", x: 2.154, y: 0.208, z: 1.123 }
        ],
        bonds: [{from:0,to:1,order:1},{from:1,to:2,order:1},{from:2,to:3,order:1},{from:3,to:4,order:1},{from:4,to:5,order:1},{from:5,to:0,order:1},{from:0,to:6,order:1},{from:0,to:7,order:1},{from:1,to:8,order:1},{from:1,to:9,order:1},{from:2,to:10,order:1},{from:2,to:11,order:1},{from:3,to:12,order:1},{from:3,to:13,order:1},{from:4,to:14,order:1},{from:4,to:15,order:1},{from:5,to:16,order:1},{from:5,to:17,order:1}]
    },
    "acetone": {
        name: "Acetone", formula: "C₃H₆O",
        description: "The simplest ketone. A common solvent used in nail polish remover.",
        atoms: [
            { element: "C", x: 0.000, y: 0.000, z: 0.218 },
            { element: "O", x: 0.000, y: 0.000, z: 1.438 },
            { element: "C", x: -1.279, y: 0.000, z: -0.537 },
            { element: "C", x: 1.279, y: 0.000, z: -0.537 },
            { element: "H", x: -1.282, y: 1.028, z: -0.885 },
            { element: "H", x: -1.282, y: -1.028, z: -0.885 },
            { element: "H", x: -2.148, y: 0.000, z: 0.128 },
            { element: "H", x: 1.282, y: 1.028, z: -0.885 },
            { element: "H", x: 1.282, y: -1.028, z: -0.885 },
            { element: "H", x: 2.148, y: 0.000, z: 0.128 }
        ],
        bonds: [{from:0,to:1,order:2},{from:0,to:2,order:1},{from:0,to:3,order:1},{from:2,to:4,order:1},{from:2,to:5,order:1},{from:2,to:6,order:1},{from:3,to:7,order:1},{from:3,to:8,order:1},{from:3,to:9,order:1}]
    },
    "urea": {
        name: "Urea", formula: "CH₄N₂O",
        description: "The main nitrogen-containing substance in mammalian urine. Used as fertilizer.",
        atoms: [
            { element: "C", x: 0.000, y: 0.000, z: 0.000 },
            { element: "O", x: 0.000, y: 1.216, z: 0.000 },
            { element: "N", x: 1.161, y: -0.685, z: 0.000 },
            { element: "N", x: -1.161, y: -0.685, z: 0.000 },
            { element: "H", x: 1.094, y: -1.694, z: 0.000 },
            { element: "H", x: 2.080, y: -0.224, z: 0.000 },
            { element: "H", x: -1.094, y: -1.694, z: 0.000 },
            { element: "H", x: -2.080, y: -0.224, z: 0.000 }
        ],
        bonds: [{from:0,to:1,order:2},{from:0,to:2,order:1},{from:0,to:3,order:1},{from:2,to:4,order:1},{from:2,to:5,order:1},{from:3,to:6,order:1},{from:3,to:7,order:1}]
    },
    "nh3": {
        name: "Ammonia", formula: "NH₃",
        description: "A colourless gas with a pungent smell, widely used in fertilisers.",
        atoms: [
            { element: "N", x: 0.000, y: 0.000, z: 0.116 },
            { element: "H", x: 0.000, y: 0.939, z: -0.271 },
            { element: "H", x: 0.813, y: -0.470, z: -0.271 },
            { element: "H", x: -0.813, y: -0.470, z: -0.271 }
        ],
        bonds: [{from:0,to:1,order:1},{from:0,to:2,order:1},{from:0,to:3,order:1}]
    },
    "ch4": {
        name: "Methane", formula: "CH₄",
        description: "The simplest alkane and primary component of natural gas.",
        atoms: [
            { element: "C", x: 0.000, y: 0.000, z: 0.000 },
            { element: "H", x: 0.629, y: 0.629, z: 0.629 },
            { element: "H", x: -0.629, y: -0.629, z: 0.629 },
            { element: "H", x: -0.629, y: 0.629, z: -0.629 },
            { element: "H", x: 0.629, y: -0.629, z: -0.629 }
        ],
        bonds: [{from:0,to:1,order:1},{from:0,to:2,order:1},{from:0,to:3,order:1},{from:0,to:4,order:1}]
    },
    "phenol": {
        name: "Phenol",
        formula: "C₆H₆O",
         description: "An aromatic compound consisting of a benzene ring bonded to a hydroxyl group. Used in chemical manufacturing, resins, and as a precursor to many pharmaceuticals.",
         atoms: [
            { element: "C", x: 0.000, y: 1.399, z: 0.000 },
            { element: "C", x: 1.211, y: 0.700, z: 0.000 },
            { element: "C", x: 1.211, y: -0.700, z: 0.000 },
            { element: "C", x: 0.000, y: -1.399, z: 0.000 },
            { element: "C", x: -1.211, y: -0.700, z: 0.000 },
            { element: "C", x: -1.211, y: 0.700, z: 0.000 },
            { element: "O", x: 0.000, y: 2.500, z: 0.000 },
            { element: "H", x: 2.152, y: 1.243, z: 0.000 },
            { element: "H", x: 2.152, y: -1.243, z: 0.000 },
            { element: "H", x: 0.000, y: -2.490, z: 0.000 },
            { element: "H", x: -2.152, y: -1.243, z: 0.000 },
            { element: "H", x: -2.152, y: 1.243, z: 0.000 },
            { element: "H", x: 0.000, y: 3.300, z: 0.000 }
    ],
    bonds: [
        { from:0, to:1, order:2 },
        { from:1, to:2, order:1 },
        { from:2, to:3, order:2 },
        { from:3, to:4, order:1 },
        { from:4, to:5, order:2 },
        { from:5, to:0, order:1 },
        { from:0, to:6, order:1 },
        { from:1, to:7, order:1 },
        { from:2, to:8, order:1 },
        { from:3, to:9, order:1 },
        { from:4, to:10, order:1 },
        { from:5, to:11, order:1 },
        { from:6, to:12, order:1 }
    ]
},

"lioh": {
    name: "Lithium Hydroxide",
    formula: "LiOH",
    description: "A strong base composed of lithium and hydroxide ions, commonly used in batteries and chemical absorption processes.",
    atoms: [
        { element: "O", x: 0.000, y: 0.000, z: 0.000 },
        { element: "Li", x: -2.000, y: 0.000, z: 0.000 },
        { element: "H", x: 1.000, y: 0.000, z: 0.000 }
    ],
    bonds: [
        { from: 0, to: 1, order: 1 },
        { from: 0, to: 2, order: 1 }
    ]
},

"salicylic_acid": {
    name: "Salicylic Acid",
    formula: "C₇H₆O₃",
    description: "An aromatic hydroxy acid with both hydroxyl and carboxyl functional groups attached to a benzene ring. Widely used in skincare, acne treatment, and as a precursor in aspirin synthesis.",
    atoms: [
        { element: "C", x: 0.000, y: 1.399, z: 0.000 },
        { element: "C", x: 1.211, y: 0.700, z: 0.000 },
        { element: "C", x: 1.211, y: -0.700, z: 0.000 },
        { element: "C", x: 0.000, y: -1.399, z: 0.000 },
        { element: "C", x: -1.211, y: -0.700, z: 0.000 },
        { element: "C", x: -1.211, y: 0.700, z: 0.000 },
        { element: "O", x: 0.000, y: 2.500, z: 0.000 },   // hydroxyl group
        { element: "O", x: -2.300, y: 1.200, z: 0.000 }, // carboxyl group oxygen
        { element: "C", x: -3.000, y: 2.000, z: 0.000 }, // carboxyl carbon
        { element: "O", x: -4.000, y: 2.000, z: 0.000 }, // carboxyl double-bond oxygen
        { element: "H", x: 2.152, y: 1.243, z: 0.000 },
        { element: "H", x: 2.152, y: -1.243, z: 0.000 },
        { element: "H", x: 0.000, y: -2.490, z: 0.000 },
        { element: "H", x: -2.152, y: -1.243, z: 0.000 },
        { element: "H", x: 0.000, y: 3.300, z: 0.000 },   // hydroxyl hydrogen
        { element: "H", x: -3.000, y: 3.000, z: 0.000 }  // carboxyl hydrogen
    ],
    bonds: [
        { from:0, to:1, order:2 },
        { from:1, to:2, order:1 },
        { from:2, to:3, order:2 },
        { from:3, to:4, order:1 },
        { from:4, to:5, order:2 },
        { from:5, to:0, order:1 },
        { from:0, to:6, order:1 },   // hydroxyl bond
        { from:6, to:14, order:1 },  // hydroxyl hydrogen
        { from:5, to:7, order:1 },   // carboxyl oxygen
        { from:7, to:8, order:1 },   // carboxyl carbon
        { from:8, to:9, order:2 },   // double bond to oxygen
        { from:8, to:15, order:1 },  // carboxyl hydrogen
        { from:1, to:10, order:1 },
        { from:2, to:11, order:1 },
        { from:3, to:12, order:1 },
        { from:4, to:13, order:1 }
    ]
}
};



// ── FUZZY SEARCH ────────────────────────────────────────────────────────────
function findMolecule(query) {
    const q = query.toLowerCase().trim();
    // Exact match
    if (MOLECULE_DB[q]) return MOLECULE_DB[q];
    // Check against name field
    for (const key of Object.keys(MOLECULE_DB)) {
        if (MOLECULE_DB[key].name.toLowerCase() === q) return MOLECULE_DB[key];
    }
    // Partial match on key
    for (const key of Object.keys(MOLECULE_DB)) {
        if (key.includes(q) || q.includes(key)) return MOLECULE_DB[key];
    }
    // Partial match on name
    for (const key of Object.keys(MOLECULE_DB)) {
        if (MOLECULE_DB[key].name.toLowerCase().includes(q)) return MOLECULE_DB[key];
    }
    return null;
}

function getSuggestions(query) {
    const q = query.toLowerCase().trim();
    return Object.values(MOLECULE_DB)
        .filter(m => m.name.toLowerCase().includes(q) || m.formula.toLowerCase().includes(q))
        .slice(0, 5)
        .map(m => m.name);
}
