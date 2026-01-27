// app.js - VERSION MINIMALE POUR DÉMARRER

// Constantes
const JOURS_FRANCAIS = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];
const DATE_AFFECTATION_BASE = "2025-11-01";
// Ajoutez ces constantes au début du fichier (après JOURS_FRANCAIS)
const SHIFT_LABELS = {
    '1': 'Matin',
    '2': 'Après-midi',
    '3': 'Nuit',
    'R': 'Repos',
    'C': 'Congé',
    'M': 'Maladie',
    'A': 'Autre absence',
    '-': 'Non défini'
};
// Variables globales
let agents = [];
let planningData = {};
let holidays = [];
let currentUser = {
    username: 'admin',
    name: 'Administrateur',
    role: 'admin'
};

// Initialisation
document.addEventListener('DOMContentLoaded', function() {
    console.log("🚀 SGA initialisé");
    
    // Cacher l'écran de chargement
    document.getElementById('loading-screen').style.display = 'none';
    
    // Charger les données
    loadData();
    
    // Afficher le menu principal
    displayMainMenu();
    
    // Mettre à jour l'affichage utilisateur
    updateUserDisplay();
});

// Fonctions de base
function loadData() {
    try {
        // Charger depuis localStorage
        const savedAgents = localStorage.getItem('sga_agents');
        const savedPlanning = localStorage.getItem('sga_planning');
        
        if (savedAgents) agents = JSON.parse(savedAgents);
        if (savedPlanning) planningData = JSON.parse(savedPlanning);
        
        // Si pas de données, initialiser avec des données de test
        if (agents.length === 0) {
            initializeTestData();
        }
        
        console.log(`✅ Données chargées: ${agents.length} agents`);
        updateDataCount();
        
    } catch (error) {
        console.error("❌ Erreur chargement données:", error);
        initializeTestData();
    }
}

function saveData() {
    try {
        localStorage.setItem('sga_agents', JSON.stringify(agents));
        localStorage.setItem('sga_planning', JSON.stringify(planningData));
        localStorage.setItem('sga_lastBackup', new Date().toLocaleTimeString());
        
        updateDataCount();
        console.log("💾 Données sauvegardées");
        
    } catch (error) {
        console.error("❌ Erreur sauvegarde:", error);
    }
}

function initializeTestData() {
    agents = [
        {
            code: 'CPA',
            nom: 'OUKHA',
            prenom: 'NABIL',
            groupe: 'A',
            tel: '0681564713',
            poste: 'CP',
            cin: 'A758609',
            date_entree: DATE_AFFECTATION_BASE,
            statut: 'actif'
        },
        {
            code: 'CONA',
            nom: 'EL JAMALI',
            prenom: 'Younes',
            groupe: 'A',
            tel: '0663290648',
            poste: 'CON',
            cin: 'A370180',
            date_entree: DATE_AFFECTATION_BASE,
            statut: 'actif'
        },
        {
            code: 'MOTA',
            nom: 'TISSIRT',
            prenom: 'hakim',
            groupe: 'A',
            tel: '0611160166',
            poste: 'MOT',
            cin: 'CB230482',
            date_entree: DATE_AFFECTATION_BASE,
            statut: 'actif'
        },
        {
            code: 'CPB',
            nom: 'CHMAREKH',
            prenom: 'Noureddine',
            groupe: 'B',
            tel: '0660337343',
            poste: 'CPA',
            cin: '604196',
            date_entree: DATE_AFFECTATION_BASE,
            statut: 'actif'
        },
        {
            code: 'CONB',
            nom: 'IBRAHIMY',
            prenom: 'ABDELLAHADIB',
            groupe: 'B',
            tel: '0662815350',
            poste: 'CON',
            cin: 'C475743',
            date_entree: DATE_AFFECTATION_BASE,
            statut: 'actif'
        },
        {
            code: 'MOTB',
            nom: 'KAALI',
            prenom: 'MAJID',
            groupe: 'B',
            tel: '0777934644',
            poste: 'MOT',
            cin: 'Q210329',
            date_entree: DATE_AFFECTATION_BASE,
            statut: 'actif'
        }
    ];
    
    saveData();
    console.log("📦 Données de test initialisées");
}

function updateDataCount() {
    const count = agents.length;
    document.getElementById('data-count').textContent = count;
    document.getElementById('save-time').textContent = new Date().toLocaleTimeString();
}

function updateUserDisplay() {
    document.getElementById('current-user').textContent = currentUser.name;
    const roleBadge = document.getElementById('user-role');
    roleBadge.textContent = currentUser.role;
    roleBadge.className = `role-badge role-${currentUser.role}`;
}

// AFFICHAGE DU MENU PRINCIPAL
function displayMainMenu() {
    const mainContent = document.getElementById('main-content');
    document.getElementById('sub-title').textContent = "MENU PRINCIPAL";
    
    const activeAgents = agents.filter(a => a.statut === 'actif').length;
    
    mainContent.innerHTML = `
        <div class="dashboard">
            <div class="welcome-banner">
                <h1>Système de Gestion des Agents</h1>
                <p>Bienvenue ${currentUser.name}</p>
                <div class="quick-stats-grid">
                    <div class="stat-card-quick">
                        <div class="stat-number-quick">${agents.length}</div>
                        <div class="stat-label-quick">Agents total</div>
                    </div>
                    <div class="stat-card-quick">
                        <div class="stat-number-quick">${activeAgents}</div>
                        <div class="stat-label-quick">Agents actifs</div>
                    </div>
                    <div class="stat-card-quick">
                        <div class="stat-number-quick">0</div>
                        <div class="stat-label-quick">Congés</div>
                    </div>
                    <div class="stat-card-quick">
                        <div class="stat-number-quick">A/B/C/D/E</div>
                        <div class="stat-label-quick">Groupes</div>
                    </div>
                </div>
            </div>
            
            <div class="menu-grid-enhanced">
                <div class="menu-card-enhanced" onclick="displayAgentsList()">
                    <div class="menu-icon-enhanced">👤</div>
                    <div class="menu-title-enhanced">Gestion Agents</div>
                    <div class="menu-desc-enhanced">Voir et modifier les agents</div>
                </div>
                
                <div class="menu-card-enhanced" onclick="displayMonthlyPlanning()">
                    <div class="menu-icon-enhanced">📅</div>
                    <div class="menu-title-enhanced">Planning</div>
                    <div class="menu-desc-enhanced">Gérer les shifts mensuels</div>
                </div>
                
                <div class="menu-card-enhanced" onclick="showSnackbar('Fonctionnalité en développement')">
                    <div class="menu-icon-enhanced">🏖️</div>
                    <div class="menu-title-enhanced">Congés</div>
                    <div class="menu-desc-enhanced">Gérer les absences</div>
                </div>
                
                <div class="menu-card-enhanced" onclick="showSnackbar('Fonctionnalité en développement')">
                    <div class="menu-icon-enhanced">📊</div>
                    <div class="menu-title-enhanced">Statistiques</div>
                    <div class="menu-desc-enhanced">Analyses et rapports</div>
                </div>
                
                <div class="menu-card-enhanced" onclick="showConfigMenu()">
                    <div class="menu-icon-enhanced">⚙️</div>
                    <div class="menu-title-enhanced">Configuration</div>
                    <div class="menu-desc-enhanced">Paramètres système</div>
                </div>
                
                <div class="menu-card-enhanced" onclick="showBackupMenu()">
                    <div class="menu-icon-enhanced">💾</div>
                    <div class="menu-title-enhanced">Sauvegarde</div>
                    <div class="menu-desc-enhanced">Exporter/Importer données</div>
                </div>
            </div>
            
            <div style="text-align: center; margin-top: 30px; color: #95a5a6;">
                <p>Sélectionnez une option pour commencer</p>
            </div>
        </div>
    `;
}

// FONCTION POUR AFFICHER LA LISTE DES AGENTS
function displayAgentsList() {
    const mainContent = document.getElementById('main-content');
    document.getElementById('sub-title').textContent = "LISTE DES AGENTS";
    
    let html = `
        <div style="margin-bottom: 20px;">
            <button class="menu-button" onclick="showAddAgentForm()" style="width: 100%;">
                <i class="fas fa-user-plus"></i> Ajouter un nouvel agent
            </button>
        </div>
        
        <div class="info-section">
            <h3>Agents (${agents.length})</h3>
            <div style="max-height: 400px; overflow-y: auto;">
    `;
    
    agents.forEach(agent => {
        html += `
            <div class="info-item" style="border-bottom: 1px solid rgba(255,255,255,0.1); padding: 10px 0;">
                <div>
                    <strong>${agent.code}</strong> - ${agent.prenom} ${agent.nom}<br>
                    <small style="color: #95a5a6;">Groupe ${agent.groupe} | ${agent.poste} | ${agent.statut}</small>
                </div>
                <div>
                    <button class="action-btn blue small" onclick="editAgent('${agent.code}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn red small" onclick="deleteAgent('${agent.code}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
    });
    
    html += `
            </div>
        </div>
        
        <div style="margin-top: 20px; text-align: center;">
            <button class="menu-button back-button" onclick="displayMainMenu()">
                <i class="fas fa-arrow-left"></i> Retour au menu
            </button>
        </div>
    `;
    
    mainContent.innerHTML = html;
}

// FONCTIONS POUR LES AGENTS
function showAddAgentForm() {
    openPopup(
        'Ajouter un agent',
        `
        <div style="padding: 15px;">
            <div class="form-group">
                <label>Code agent:</label>
                <input type="text" id="newAgentCode" class="form-input" placeholder="Ex: CPB01" required>
            </div>
            <div class="form-group">
                <label>Nom:</label>
                <input type="text" id="newAgentNom" class="form-input" required>
            </div>
            <div class="form-group">
                <label>Prénom:</label>
                <input type="text" id="newAgentPrenom" class="form-input" required>
            </div>
            <div class="form-group">
                <label>Groupe:</label>
                <select id="newAgentGroupe" class="form-input">
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                    <option value="D">D</option>
                    <option value="E">E</option>
                </select>
            </div>
            <div class="form-group">
                <label>Téléphone:</label>
                <input type="tel" id="newAgentTel" class="form-input">
            </div>
        </div>
        `,
        `
        <button class="popup-button green" onclick="addAgent()">Ajouter</button>
        <button class="popup-button gray" onclick="closePopup()">Annuler</button>
        `
    );
}

function addAgent() {
    const code = document.getElementById('newAgentCode').value.toUpperCase();
    const nom = document.getElementById('newAgentNom').value;
    const prenom = document.getElementById('newAgentPrenom').value;
    const groupe = document.getElementById('newAgentGroupe').value;
    const tel = document.getElementById('newAgentTel').value;
    
    if (!code || !nom || !prenom) {
        showSnackbar("Veuillez remplir les champs obligatoires");
        return;
    }
    
    // Vérifier si le code existe déjà
    if (agents.find(a => a.code === code)) {
        showSnackbar(`L'agent ${code} existe déjà`);
        return;
    }
    
    agents.push({
        code,
        nom,
        prenom,
        groupe,
        tel,
        poste: 'Agent',
        date_entree: new Date().toISOString().split('T')[0],
        statut: 'actif'
    });
    
    saveData();
    closePopup();
    displayAgentsList();
    showSnackbar(`Agent ${code} ajouté avec succès`);
}

function editAgent(code) {
    const agent = agents.find(a => a.code === code);
    if (!agent) return;
    
    openPopup(
        `Modifier ${code}`,
        `
        <div style="padding: 15px;">
            <div class="form-group">
                <label>Code:</label>
                <input type="text" value="${agent.code}" class="form-input" readonly>
            </div>
            <div class="form-group">
                <label>Nom:</label>
                <input type="text" id="editAgentNom" value="${agent.nom}" class="form-input">
            </div>
            <div class="form-group">
                <label>Prénom:</label>
                <input type="text" id="editAgentPrenom" value="${agent.prenom}" class="form-input">
            </div>
            <div class="form-group">
                <label>Groupe:</label>
                <select id="editAgentGroupe" class="form-input">
                    <option value="A" ${agent.groupe === 'A' ? 'selected' : ''}>A</option>
                    <option value="B" ${agent.groupe === 'B' ? 'selected' : ''}>B</option>
                    <option value="C" ${agent.groupe === 'C' ? 'selected' : ''}>C</option>
                    <option value="D" ${agent.groupe === 'D' ? 'selected' : ''}>D</option>
                    <option value="E" ${agent.groupe === 'E' ? 'selected' : ''}>E</option>
                </select>
            </div>
            <div class="form-group">
                <label>Téléphone:</label>
                <input type="tel" id="editAgentTel" value="${agent.tel || ''}" class="form-input">
            </div>
            <div class="form-group">
                <label>Statut:</label>
                <select id="editAgentStatut" class="form-input">
                    <option value="actif" ${agent.statut === 'actif' ? 'selected' : ''}>Actif</option>
                    <option value="inactif" ${agent.statut === 'inactif' ? 'selected' : ''}>Inactif</option>
                </select>
            </div>
        </div>
        `,
        `
        <button class="popup-button green" onclick="saveAgentEdit('${code}')">Enregistrer</button>
        <button class="popup-button gray" onclick="closePopup()">Annuler</button>
        `
    );
}

function saveAgentEdit(oldCode) {
    const agentIndex = agents.findIndex(a => a.code === oldCode);
    if (agentIndex === -1) return;
    
    agents[agentIndex] = {
        ...agents[agentIndex],
        nom: document.getElementById('editAgentNom').value,
        prenom: document.getElementById('editAgentPrenom').value,
        groupe: document.getElementById('editAgentGroupe').value,
        tel: document.getElementById('editAgentTel').value,
        statut: document.getElementById('editAgentStatut').value
    };
    
    saveData();
    closePopup();
    displayAgentsList();
    showSnackbar(`Agent ${oldCode} modifié`);
}

function deleteAgent(code) {
    if (confirm(`Supprimer l'agent ${code} ?`)) {
        agents = agents.filter(a => a.code !== code);
        saveData();
        displayAgentsList();
        showSnackbar(`Agent ${code} supprimé`);
    }
}

// FONCTION POUR LE PLANNING
function displayMonthlyPlanning() {
    const today = new Date();
    const currentMonth = today.getMonth() + 1;
    const currentYear = today.getFullYear();
    
    const mainContent = document.getElementById('main-content');
    document.getElementById('sub-title').textContent = `PLANNING - ${currentMonth}/${currentYear}`;
    
    mainContent.innerHTML = `
        <div style="margin-bottom: 20px; text-align: center;">
            <button class="action-btn blue" onclick="changePlanningMonth(-1)">← Mois précédent</button>
            <span style="margin: 0 15px; font-weight: bold;">${getMonthName(currentMonth)} ${currentYear}</span>
            <button class="action-btn blue" onclick="changePlanningMonth(1)">Mois suivant →</button>
        </div>
        
        <div class="info-section">
            <p style="text-align: center; color: #95a5a6;">
                Sélectionnez un jour pour modifier le shift d'un agent
            </p>
        </div>
        
        <div style="margin-top: 20px; text-align: center;">
            <button class="menu-button" onclick="displayMainMenu()">
                <i class="fas fa-arrow-left"></i> Retour au menu
            </button>
        </div>
    `;
}

function changePlanningMonth(delta) {
    showSnackbar("Navigation planning - Fonctionnalité en développement");
}

// FONCTION POUR LA CONFIGURATION
function showConfigMenu() {
    const mainContent = document.getElementById('main-content');
    document.getElementById('sub-title').textContent = "CONFIGURATION";
    
    mainContent.innerHTML = `
        <div class="info-section">
            <h3>Informations système</h3>
            <div class="info-item">
                <span class="info-label">Version:</span>
                <span class="info-value">SGA 1.0</span>
            </div>
            <div class="info-item">
                <span class="info-label">Agents:</span>
                <span class="info-value">${agents.length} enregistrés</span>
            </div>
            <div class="info-item">
                <span class="info-label">Dernière sauvegarde:</span>
                <span class="info-value">${localStorage.getItem('sga_lastBackup') || 'Jamais'}</span>
            </div>
        </div>
        
        <div class="info-section">
            <h3>Actions</h3>
            <div style="display: flex; flex-direction: column; gap: 10px;">
                <button class="menu-button" onclick="showBackupMenu()">
                    <i class="fas fa-download"></i> Sauvegarder les données
                </button>
                <button class="menu-button" onclick="showResetConfirmation()">
                    <i class="fas fa-redo"></i> Réinitialiser les données
                </button>
                <button class="menu-button" onclick="showLoginForm()">
                    <i class="fas fa-user-cog"></i> Changer d'utilisateur
                </button>
            </div>
        </div>
        
        <div style="margin-top: 20px;">
            <button class="menu-button back-button" onclick="displayMainMenu()">
                <i class="fas fa-arrow-left"></i> Retour au menu
            </button>
        </div>
    `;
}

// FONCTION POUR SAUVEGARDE
function showBackupMenu() {
    openPopup(
        'Sauvegarde des données',
        `
        <div style="padding: 15px;">
            <div class="info-section">
                <p>Exporter toutes les données de l'application.</p>
                <div class="info-item">
                    <span class="info-label">Agents:</span>
                    <span class="info-value">${agents.length}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Dernière sauvegarde:</span>
                    <span class="info-value">${localStorage.getItem('sga_lastBackup') || 'Jamais'}</span>
                </div>
            </div>
            
            <div style="margin-top: 20px; text-align: center;">
                <button class="menu-button" onclick="createBackup()" style="width: 100%;">
                    <i class="fas fa-file-export"></i> Exporter en JSON
                </button>
            </div>
        </div>
        `,
        `
        <button class="popup-button gray" onclick="closePopup()">Fermer</button>
        `
    );
}

function createBackup() {
    const backupData = {
        version: 'SGA_1.0',
        date: new Date().toISOString(),
        agents: agents,
        planning: planningData
    };
    
    const dataStr = JSON.stringify(backupData, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    
    const url = URL.createObjectURL(dataBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sga_backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    localStorage.setItem('sga_lastBackup', new Date().toLocaleString());
    updateDataCount();
    
    closePopup();
    showSnackbar('Sauvegarde créée et téléchargée');
}

function showResetConfirmation() {
    openPopup(
        'Réinitialisation',
        `
        <div style="padding: 15px; text-align: center;">
            <div style="font-size: 3em; color: #e74c3c; margin: 10px 0;">⚠️</div>
            <h3>Attention !</h3>
            <p>Cette action va supprimer toutes les données et charger les données de test.</p>
            
            <div class="form-group" style="text-align: left; margin-top: 20px;">
                <label>
                    <input type="checkbox" id="confirmReset">
                    Je confirme la réinitialisation
                </label>
            </div>
        </div>
        `,
        `
        <button class="popup-button red" onclick="performReset()" id="resetBtn" disabled>RÉINITIALISER</button>
        <button class="popup-button gray" onclick="closePopup()">Annuler</button>
        `
    );
    
    document.getElementById('confirmReset').addEventListener('change', function() {
        document.getElementById('resetBtn').disabled = !this.checked;
    });
}

function performReset() {
    localStorage.clear();
    initializeTestData();
    closePopup();
    displayMainMenu();
    showSnackbar('Données réinitialisées avec succès');
}

function showLoginForm() {
    openPopup(
        'Changer d\'utilisateur',
        `
        <div style="padding: 15px;">
            <div class="form-group">
                <label>Nom:</label>
                <input type="text" id="loginName" value="${currentUser.name}" class="form-input">
            </div>
            <div class="form-group">
                <label>Rôle:</label>
                <select id="loginRole" class="form-input">
                    <option value="admin" ${currentUser.role === 'admin' ? 'selected' : ''}>Administrateur</option>
                    <option value="supervisor" ${currentUser.role === 'supervisor' ? 'selected' : ''}>Superviseur</option>
                    <option value="viewer" ${currentUser.role === 'viewer' ? 'selected' : ''}>Consultant</option>
                </select>
            </div>
        </div>
        `,
        `
        <button class="popup-button green" onclick="changeUser()">Changer</button>
        <button class="popup-button gray" onclick="closePopup()">Annuler</button>
        `
    );
}

function changeUser() {
    currentUser.name = document.getElementById('loginName').value;
    currentUser.role = document.getElementById('loginRole').value;
    
    updateUserDisplay();
    closePopup();
    displayMainMenu();
    showSnackbar(`Utilisateur changé: ${currentUser.name}`);
}

// FONCTIONS UTILITAIRES
function getMonthName(month) {
    const months = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 
                   'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
    return months[month - 1] || '';
}

// GESTION DES POPUPS
function openPopup(title, body, footer) {
    document.getElementById('popup-title').textContent = title;
    document.getElementById('popup-body').innerHTML = body;
    document.getElementById('popup-footer').innerHTML = footer;
    document.getElementById('popup-overlay').classList.add('visible');
}

function closePopup() {
    document.getElementById('popup-overlay').classList.remove('visible');
}

// Gestion du bouton fermer popup
document.getElementById('popup-close-btn').addEventListener('click', closePopup);

// Fermer popup avec ESC
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closePopup();
    }
});

// SNACKBAR
function showSnackbar(message) {
    const snackbar = document.getElementById('snackbar');
    snackbar.textContent = message;
    snackbar.className = "show";
    
    setTimeout(function() {
        snackbar.className = snackbar.className.replace("show", "");
    }, 3000);
}

// Initialiser au chargement
updateDataCount();

console.log("✅ SGA version minimale chargée");
// FONCTION POUR LE PLANNING (version complète)
function displayMonthlyPlanning() {
    const today = new Date();
    const month = today.getMonth() + 1;
    const year = today.getFullYear();
    const daysInMonth = new Date(year, month, 0).getDate();
    
    const mainContent = document.getElementById('main-content');
    document.getElementById('sub-title').textContent = 
        `PLANNING - ${getMonthName(month)} ${year}`;
    
    let html = `
        <div style="margin-bottom: 20px; text-align: center;">
            <button class="action-btn blue" onclick="changePlanningMonth(-1)">
                <i class="fas fa-chevron-left"></i> Mois précédent
            </button>
            <span style="margin: 0 15px; font-weight: bold; font-size: 1.2em;">
                ${getMonthName(month)} ${year}
            </span>
            <button class="action-btn blue" onclick="changePlanningMonth(1)">
                Mois suivant <i class="fas fa-chevron-right"></i>
            </button>
        </div>
        
        <div style="overflow-x: auto;">
            <table class="planning-table">
                <thead>
                    <tr>
                        <th style="min-width: 120px;">Agent</th>
    `;
    
    // En-têtes des jours
    for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month - 1, day);
        const jourSemaine = JOURS_FRANCAIS[date.getDay()];
        const isWeekend = date.getDay() === 0 || date.getDay() === 6;
        
        html += `
            <th class="${isWeekend ? 'weekend' : ''}" style="min-width: 40px;">
                ${jourSemaine}<br>${day}
            </th>
        `;
    }
    
    html += `
                    </tr>
                </thead>
                <tbody>
    `;
    
    // Lignes des agents
    agents.forEach(agent => {
        if (agent.statut !== 'actif') return;
        
        html += `
            <tr>
                <td style="text-align: left; padding: 5px;">
                    <strong>${agent.code}</strong><br>
                    <small>${agent.prenom} ${agent.nom}</small>
                </td>
        `;
        
        // Cellules des jours
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month - 1, day);
            const dateStr = date.toISOString().split('T')[0];
            const shift = getShiftForAgent(agent.code, dateStr);
            
            html += `
                <td class="shift-cell" 
                    style="background: ${getShiftColor(shift)}; 
                           color: white; 
                           cursor: pointer;"
                    onclick="editShift('${agent.code}', '${dateStr}')"
                    title="${agent.code} - ${dateStr}">
                    ${shift || '-'}
                </td>
            `;
        }
        
        html += `</tr>`;
    });
    
    html += `
                </tbody>
            </table>
        </div>
        
        <div style="margin-top: 20px; padding: 15px; background: #34495e; border-radius: 8px;">
            <h3 style="margin-top: 0;">Légende</h3>
            <div style="display: flex; flex-wrap: wrap; gap: 10px;">
                <div style="display: flex; align-items: center;">
                    <div style="width: 20px; height: 20px; background: #3498db; margin-right: 5px;"></div>
                    <span>Matin (1)</span>
                </div>
                <div style="display: flex; align-items: center;">
                    <div style="width: 20px; height: 20px; background: #e74c3c; margin-right: 5px;"></div>
                    <span>Après-midi (2)</span>
                </div>
                <div style="display: flex; align-items: center;">
                    <div style="width: 20px; height: 20px; background: #9b59b6; margin-right: 5px;"></div>
                    <span>Nuit (3)</span>
                </div>
                <div style="display: flex; align-items: center;">
                    <div style="width: 20px; height: 20px; background: #2ecc71; margin-right: 5px;"></div>
                    <span>Repos (R)</span>
                </div>
                <div style="display: flex; align-items: center;">
                    <div style="width: 20px; height: 20px; background: #f39c12; margin-right: 5px;"></div>
                    <span>Congé (C)</span>
                </div>
            </div>
        </div>
        
        <div style="margin-top: 20px; text-align: center;">
            <button class="menu-button" onclick="showMassEditor()">
                <i class="fas fa-edit"></i> Éditeur en masse
            </button>
            <button class="menu-button back-button" onclick="displayMainMenu()" style="margin-left: 10px;">
                <i class="fas fa-arrow-left"></i> Retour
            </button>
        </div>
    `;
    
    mainContent.innerHTML = html;
}

// Fonctions utilitaires pour le planning
function getShiftForAgent(agentCode, dateStr) {
    const monthKey = dateStr.substring(0, 7); // YYYY-MM
    if (planningData[monthKey] && 
        planningData[monthKey][agentCode] && 
        planningData[monthKey][agentCode][dateStr]) {
        return planningData[monthKey][agentCode][dateStr].shift || '-';
    }
    return '-';
}

function getShiftColor(shift) {
    const colors = {
        '1': '#3498db',  // Matin - bleu
        '2': '#e74c3c',  // Après-midi - rouge
        '3': '#9b59b6',  // Nuit - violet
        'R': '#2ecc71',  // Repos - vert
        'C': '#f39c12',  // Congé - orange
        'M': '#e67e22',  // Maladie - orange foncé
        'A': '#95a5a6',  // Autre - gris
        '-': '#34495e'   // Non défini
    };
    return colors[shift] || '#34495e';
}

function editShift(agentCode, dateStr) {
    const currentShift = getShiftForAgent(agentCode, dateStr);
    const agent = agents.find(a => a.code === agentCode);
    
    if (!agent) return;
    
    openPopup(
        `Modifier shift - ${agentCode} - ${dateStr}`,
        `
        <div style="padding: 15px;">
            <div class="info-item">
                <span class="info-label">Agent:</span>
                <span class="info-value">${agent.prenom} ${agent.nom} (${agent.groupe})</span>
            </div>
            <div class="info-item">
                <span class="info-label">Date:</span>
                <span class="info-value">${dateStr}</span>
            </div>
            
            <div class="form-group" style="margin-top: 15px;">
                <label>Shift:</label>
                <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin-top: 10px;">
                    ${Object.entries({
                        '1': {label: 'Matin', color: '#3498db'},
                        '2': {label: 'Après-midi', color: '#e74c3c'},
                        '3': {label: 'Nuit', color: '#9b59b6'},
                        'R': {label: 'Repos', color: '#2ecc71'},
                        'C': {label: 'Congé', color: '#f39c12'},
                        'M': {label: 'Maladie', color: '#e67e22'},
                        'A': {label: 'Autre', color: '#95a5a6'},
                        '-': {label: 'Non défini', color: '#34495e'}
                    }).map(([value, data]) => `
                        <button type="button" 
                                class="shift-option ${currentShift === value ? 'selected' : ''}"
                                data-value="${value}"
                                style="padding: 10px; background: ${data.color}; color: white; border: none; border-radius: 5px; cursor: pointer;">
                            ${data.label} (${value})
                        </button>
                    `).join('')}
                </div>
                <input type="hidden" id="selectedShift" value="${currentShift}">
            </div>
            
            <div class="form-group" style="margin-top: 15px;">
                <label>Commentaire (optionnel):</label>
                <textarea id="shiftComment" class="form-input" rows="3" placeholder="Note..."></textarea>
            </div>
        </div>
        `,
        `
        <button class="popup-button green" onclick="saveShift('${agentCode}', '${dateStr}')">Enregistrer</button>
        <button class="popup-button gray" onclick="closePopup()">Annuler</button>
        `
    );
    
    // Gérer la sélection des shifts
    document.querySelectorAll('.shift-option').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.shift-option').forEach(b => b.classList.remove('selected'));
            this.classList.add('selected');
            document.getElementById('selectedShift').value = this.dataset.value;
        });
    });
}

function saveShift(agentCode, dateStr) {
    const shift = document.getElementById('selectedShift').value;
    const comment = document.getElementById('shiftComment').value;
    const monthKey = dateStr.substring(0, 7);
    
    // Initialiser les structures si nécessaire
    if (!planningData[monthKey]) planningData[monthKey] = {};
    if (!planningData[monthKey][agentCode]) planningData[monthKey][agentCode] = {};
    
    // Sauvegarder le shift
    planningData[monthKey][agentCode][dateStr] = {
        shift: shift,
        modified: new Date().toISOString(),
        modifiedBy: currentUser.username,
        comment: comment || null
    };
    
    saveData();
    closePopup();
    displayMonthlyPlanning();
    showSnackbar(`Shift ${shift} enregistré pour ${agentCode}`);
}

function showMassEditor() {
    openPopup(
        'Éditeur en masse',
        `
        <div style="padding: 15px;">
            <p>Sélectionnez une période et un shift à appliquer à plusieurs agents.</p>
            
            <div class="form-group">
                <label>Date de début:</label>
                <input type="date" id="massStart" class="form-input" value="${new Date().toISOString().split('T')[0]}">
            </div>
            
            <div class="form-group">
                <label>Date de fin:</label>
                <input type="date" id="massEnd" class="form-input" value="${new Date().toISOString().split('T')[0]}">
            </div>
            
            <div class="form-group">
                <label>Shift:</label>
                <select id="massShift" class="form-input">
                    <option value="1">Matin (1)</option>
                    <option value="2">Après-midi (2)</option>
                    <option value="3">Nuit (3)</option>
                    <option value="R">Repos (R)</option>
                    <option value="C">Congé (C)</option>
                    <option value="M">Maladie (M)</option>
                    <option value="A">Autre (A)</option>
                </select>
            </div>
            
            <div class="form-group">
                <label>Agents (Groupe):</label>
                <select id="massGroup" class="form-input">
                    <option value="ALL">Tous les groupes</option>
                    <option value="A">Groupe A</option>
                    <option value="B">Groupe B</option>
                    <option value="C">Groupe C</option>
                    <option value="D">Groupe D</option>
                    <option value="E">Groupe E</option>
                </select>
            </div>
        </div>
        `,
        `
        <button class="popup-button green" onclick="applyMassEdit()">Appliquer</button>
        <button class="popup-button gray" onclick="closePopup()">Annuler</button>
        `
    );
}

function applyMassEdit() {
    const startDate = document.getElementById('massStart').value;
    const endDate = document.getElementById('massEnd').value;
    const shift = document.getElementById('massShift').value;
    const group = document.getElementById('massGroup').value;
    
    if (!startDate || !endDate) {
        showSnackbar("Veuillez sélectionner une période");
        return;
    }
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    // Filtrer les agents
    let selectedAgents = agents.filter(a => a.statut === 'actif');
    if (group !== 'ALL') {
        selectedAgents = selectedAgents.filter(a => a.groupe === group);
    }
    
    let modifications = 0;
    
    // Appliquer à chaque agent
    selectedAgents.forEach(agent => {
        let currentDate = new Date(start);
        
        while (currentDate <= end) {
            const dateStr = currentDate.toISOString().split('T')[0];
            const monthKey = dateStr.substring(0, 7);
            
            // Initialiser
            if (!planningData[monthKey]) planningData[monthKey] = {};
            if (!planningData[monthKey][agent.code]) planningData[monthKey][agent.code] = {};
            
            // Appliquer le shift
            planningData[monthKey][agent.code][dateStr] = {
                shift: shift,
                modified: new Date().toISOString(),
                modifiedBy: currentUser.username,
                massEdit: true
            };
            
            modifications++;
            currentDate.setDate(currentDate.getDate() + 1);
        }
    });
    
    saveData();
    closePopup();
    displayMonthlyPlanning();
    showSnackbar(`${modifications} shifts appliqués à ${selectedAgents.length} agents`);
}

function changePlanningMonth(delta) {
    // Pour l'instant, juste une notification
    showSnackbar(`Navigation mois ${delta > 0 ? 'suivant' : 'précédent'} - Fonctionnalité complète à implémenter`);
}


