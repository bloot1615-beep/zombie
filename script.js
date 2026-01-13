// script.js
let state = {
    dna: 0,
    totalDna: 0,
    perSecond: 0,
    upgrades: [
        { id: 1, name: "Piège à Loup", cost: 15, power: 0.5, owned: 0 },
        { id: 2, name: "Sentinelle Armée", cost: 100, power: 3, owned: 0 },
        { id: 3, name: "Laboratoire Bio", cost: 1100, power: 15, owned: 0 },
        { id: 4, name: "Escouade de Nettoyage", cost: 12000, power: 50, owned: 0 }
    ]
};

// Charger la sauvegarde au démarrage
if(localStorage.getItem('zombieClickerSave')) {
    state = JSON.parse(localStorage.getItem('zombieClickerSave'));
}

function updateUI() {
    document.getElementById('score-display').innerText = `${Math.floor(state.dna)} ADN Récupéré`;
    document.getElementById('pps').innerText = state.perSecond.toFixed(1);
    
    const shop = document.getElementById('shop-container');
    shop.innerHTML = ''; // Effacer pour reconstruire
    
    state.upgrades.forEach(upg => {
        const btn = document.createElement('div');
        btn.className = `upgrade-card ${state.dna < upg.cost ? 'disabled' : ''}`;
        btn.innerHTML = `
            <strong>${upg.name} (x${upg.owned})</strong><br>
            Coût: ${Math.floor(upg.cost)} | +${upg.power}/s
        `;
        btn.onclick = () => buyUpgrade(upg.id);
        shop.appendChild(btn);
    });
}

function buyUpgrade(id) {
    const upg = state.upgrades.find(u => u.id === id);
    if (state.dna >= upg.cost) {
        state.dna -= upg.cost;
        upg.owned++;
        upg.cost *= 1.15; // Augmentation du prix
        calculatePPS();
        updateUI();
    }
}

function calculatePPS() {
    state.perSecond = state.upgrades.reduce((acc, upg) => acc + (upg.owned * upg.power), 0);
}

// Clic principal
document.getElementById('zombie-target').onclick = () => {
    state.dna += 1;
    updateUI();
};

// Boucle de gain passif (toutes les 100ms pour plus de fluidité)
setInterval(() => {
    state.dna += state.perSecond / 10;
    updateUI();
}, 100);

// Sauvegarde automatique toutes les 30 secondes
setInterval(() => {
    localStorage.setItem('zombieClickerSave', JSON.stringify(state));
    console.log("Partie sauvegardée");
}, 30000);

// Initialisation
calculatePPS();
updateUI();