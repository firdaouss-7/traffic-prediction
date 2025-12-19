// Initialisation
document.addEventListener('DOMContentLoaded', function() {
    initializeForm();
    initializeTheme();
    setupEventListeners();
    initializeWeatherIcons();
});

// Initialiser le formulaire
function initializeForm() {
    // Remplir les heures
    const hourSelect = document.getElementById('hour');
    for (let i = 0; i < 24; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = `${i.toString().padStart(2, '0')}:00`;
        hourSelect.appendChild(option);
    }
    
    // Date par défaut (demain)
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    document.getElementById('date').value = tomorrow.toISOString().split('T')[0];
    document.getElementById('hour').value = 8; // 8:00 par défaut
    
    updateCloudsValue();
    
    // Mettre à jour l'indicateur pour les jours fériés
    const holidayCheckbox = document.getElementById('is_holiday');
    holidayCheckbox.addEventListener('change', function() {
        const hint = holidayCheckbox.closest('.checkbox-card').querySelector('.checkbox-hint');
        if (this.checked) {
            hint.innerHTML = 'Activé - trafic réduit';
            hint.style.color = 'var(--success)';
        } else {
            hint.innerHTML = 'Réduit généralement le trafic';
            hint.style.color = '';
        }
    });
}

// Initialiser les icônes météo
function initializeWeatherIcons() {
    const weatherSelect = document.getElementById('weather_main');
    const iconContainer = document.querySelector('.weather-icon-container');
    
    const weatherIcons = {
        'Clear': 'fa-sun',
        'Clouds': 'fa-cloud',
        'Rain': 'fa-cloud-rain',
        'Snow': 'fa-snowflake',
        'Mist': 'fa-smog',
        'Fog': 'fa-fog',
        'Drizzle': 'fa-cloud-rain',
        'Thunderstorm': 'fa-bolt'
    };
    
    function updateWeatherIcon() {
        const selectedValue = weatherSelect.value;
        const iconClass = weatherIcons[selectedValue] || 'fa-sun';
        iconContainer.innerHTML = `<i class="fas ${iconClass}"></i>`;
    }
    
    updateWeatherIcon();
    weatherSelect.addEventListener('change', updateWeatherIcon);
}

// Gestion du thème
function initializeTheme() {
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = document.getElementById('themeIcon');
    const body = document.body;
    
    // Par défaut, thème clair
    const savedTheme = localStorage.getItem('theme') || 'light';
    if (savedTheme === 'dark') {
        body.classList.add('dark-theme');
        themeIcon.innerHTML = '<i class="fas fa-sun"></i>';
    } else {
        body.classList.remove('dark-theme');
        themeIcon.innerHTML = '<i class="fas fa-moon"></i>';
    }
    
    themeToggle.addEventListener('click', function() {
        body.classList.toggle('dark-theme');
        const isDark = body.classList.contains('dark-theme');
        themeIcon.innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        
        // Animation du bouton
        this.style.transform = 'rotate(180deg)';
        setTimeout(() => {
            this.style.transform = 'rotate(0deg)';
        }, 300);
    });
}

// Configuration des événements
function setupEventListeners() {
    const form = document.getElementById('predictionForm');
    const cloudsSlider = document.getElementById('clouds');
    
    form.addEventListener('submit', handleSubmit);
    cloudsSlider.addEventListener('input', updateCloudsValue);
    
    // Animations pour les cartes checkbox
    const checkboxes = document.querySelectorAll('.checkbox-card input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const card = this.closest('.checkbox-card');
            if (this.checked) {
                card.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    card.style.transform = 'scale(1)';
                }, 150);
            }
        });
    });
}

// Mettre à jour la valeur des nuages
function updateCloudsValue() {
    const slider = document.getElementById('clouds');
    const valueDisplay = document.getElementById('cloudsValue');
    const progress = document.getElementById('cloudsProgress');
    
    const value = slider.value;
    valueDisplay.textContent = value;
    progress.style.width = `${value}%`;
}

// Gérer la soumission
async function handleSubmit(e) {
    e.preventDefault();
    
    const btn = document.getElementById('predictBtn');
    btn.classList.add('loading');
    btn.disabled = true;
    
    // Animation du formulaire
    const formCard = document.querySelector('.form-card');
    formCard.style.boxShadow = '0 0 30px rgba(46, 91, 255, 0.15)';
    
    try {
        const formData = {
            date: document.getElementById('date').value,
            hour: parseInt(document.getElementById('hour').value),
            temperature: parseFloat(document.getElementById('temperature').value),
            is_raining: document.getElementById('is_raining').checked,
            is_snowing: document.getElementById('is_snowing').checked,
            clouds: parseInt(document.getElementById('clouds').value),
            weather_main: document.getElementById('weather_main').value,
            is_holiday: document.getElementById('is_holiday').checked
        };
        
        // Validation
        if (formData.is_raining && formData.is_snowing) {
            showNotification('Les précipitations et la neige ne peuvent pas être simultanées', 'error');
            throw new Error('Conditions météo incompatibles');
        }
        
        const response = await fetch('/predict', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        
        const data = await response.json();
        
        if (data.success) {
            // Animation de succès
            formCard.style.boxShadow = '0 0 30px rgba(0, 212, 170, 0.15)';
            setTimeout(() => {
                formCard.style.boxShadow = '';
            }, 1000);
            
            displayResults(data);
            showNotification('Prédiction générée avec succès', 'success');
        } else {
            formCard.style.boxShadow = '0 0 30px rgba(255, 107, 107, 0.15)';
            setTimeout(() => {
                formCard.style.boxShadow = '';
            }, 1000);
            throw new Error(data.error || 'Erreur lors de la prédiction');
        }
    } catch (error) {
        showNotification(error.message, 'error');
        console.error('Error:', error);
    } finally {
        btn.classList.remove('loading');
        btn.disabled = false;
    }
}

// Afficher les résultats
function displayResults(data) {
    const results = document.getElementById('results');
    
    // Déterminer l'icône en fonction du niveau
    let levelIcon = '';
    
    switch(data.level_class) {
        case 'success':
            levelIcon = '<i class="fas fa-check-circle"></i>';
            break;
        case 'warning':
            levelIcon = '<i class="fas fa-exclamation-triangle"></i>';
            break;
        case 'danger':
            levelIcon = '<i class="fas fa-exclamation-circle"></i>';
            break;
        case 'critical':
            levelIcon = '<i class="fas fa-skull-crossbones"></i>';
            break;
        default:
            levelIcon = '<i class="fas fa-info-circle"></i>';
    }
    
    const html = `
        <div class="result-content">
            <div class="result-header">
                <div class="result-value">${data.prediction.toLocaleString('fr-FR')}</div>
                <div class="result-label">véhicules par heure</div>
                <div class="traffic-level ${data.level_class}">
                    ${levelIcon} ${data.level}
                </div>
            </div>
            <div class="result-message">
                ${data.message}
            </div>
        </div>
    `;
    
    results.innerHTML = html;
}

// Afficher une notification
function showNotification(message, type = 'info') {
    // Supprimer les notifications existantes
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => {
        notification.remove();
    });
    
    // Icône selon le type
    let icon = '';
    if (type === 'success') icon = '<i class="fas fa-check-circle"></i>';
    else if (type === 'error') icon = '<i class="fas fa-exclamation-circle"></i>';
    else icon = '<i class="fas fa-info-circle"></i>';
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `${icon}<span>${message}</span>`;
    
    document.body.appendChild(notification);
    
    // Supprimer après 3 secondes
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Animation du slider de nuages
document.getElementById('clouds').addEventListener('input', function() {
    const progress = document.getElementById('cloudsProgress');
    const value = this.value;
    
    // Animation de couleur
    if (value < 25) {
        progress.style.background = 'var(--success)';
    } else if (value < 50) {
        progress.style.background = 'var(--warning)';
    } else {
        progress.style.background = 'var(--danger)';
    }
});

// Initialiser la couleur du slider
document.addEventListener('DOMContentLoaded', function() {
    const slider = document.getElementById('clouds');
    slider.dispatchEvent(new Event('input'));
});