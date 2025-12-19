# Traffic Lens - Prédiction du Volume de Trafic Routier

Projet de machine learning visant à prédire avec précision le volume de trafic routier en utilisant des données historiques, météorologiques et temporelles. Le modèle atteint une précision de 96% (R² = 0.96) et est déployé via une application web interactive.

---

## Table des Matières

- [Problématique](#problématique)
- [Données](#données)
- [Méthodologie](#méthodologie)
- [Résultats](#résultats)
- [Installation](#installation)
- [Utilisation](#utilisation)
- [Structure du Projet](#structure-du-projet)
- [Technologies Utilisées](#technologies-utilisées)
- [Auteurs](#auteurs)

---

## Problématique

L'augmentation constante du trafic urbain pose des défis majeurs :
- Pertes de temps dues aux embouteillages
- Pollution atmosphérique accrue
- Coûts économiques importants

### Objectifs du Projet

1. Développer un modèle prédictif avec une précision supérieure à 95%
2. Identifier les facteurs clés influençant le trafic
3. Créer une application web accessible aux utilisateurs
4. Comparer différentes approches de Machine Learning

---

## Données

### Source

- **Origine** : Kaggle - Metro Interstate Traffic Volume
- **Localisation** : Minneapolis et Saint Paul, Minnesota, USA
- **Période** : Octobre 2012 - Septembre 2018 (6 ans)
- **Fréquence** : Horaire (48,204 observations)

### Variables

| Type | Variables |
|------|-----------|
| Cible | traffic_volume (véhicules/heure) |
| Temporelles | date_time, holiday |
| Météorologiques | temp, rain_1h, snow_1h, clouds_all, weather_main, weather_description |

### Insights Clés (Analyse Exploratoire)

**Patterns Temporels**
- Baisse de 50-70% du trafic le week-end
- Pics aux heures de pointe : 7h-9h et 16h-18h
- Trafic minimal la nuit (0h-4h)

**Impact Météorologique**
- Réduction de 30-40% lors de conditions extrêmes (neige, pluie forte)
- Trafic normal à élevé par temps clair

**Saisonnalité**
- Été : baisse des déplacements domicile-travail
- Fin d'année : forte baisse pendant les congés
- Rentrée scolaire : reprise et augmentation du trafic

---

## Méthodologie

### 1. Prétraitement des Données

#### Nettoyage
- Suppression de 17 doublons
- Élimination de 11 outliers (valeurs météo impossibles)
- Remplissage des valeurs manquantes (holiday → 'None')
- Résultat : 48,176 observations propres

#### Feature Engineering (89 features créées)

**Features Temporelles (11)**
- year, month, day, hour
- day_of_week, week_of_year
- is_weekend, is_rush_hour, is_holiday
- time_of_day (morning, afternoon, evening, night)
- season (spring, summer, fall, winter)

**Features Météorologiques (5)**
- temp_celsius (conversion)
- is_raining, is_snowing (binaires)
- temp_level (catégorisation)
- cloud_category (catégories)

**Encodage One-Hot (73)**
- Jours fériés, conditions météo, saisons, etc.

### 2. Modèles de Machine Learning

Comparaison de 3 modèles sur le même jeu de données (80% train / 20% test) :

| Modèle | RMSE | MAE | R² | Temps |
|--------|------|-----|-----|-------|
| Random Forest | ~450 | ~280 | ~0.94 | Moyen |
| XGBoost Baseline | ~400 | ~250 | ~0.95 | Rapide |
| XGBoost Optimisé | ~367 | ~224 | ~0.96 | Acceptable |

#### Optimisation des Hyperparamètres

Utilisation de GridSearchCV pour optimiser :
- max_depth : profondeur des arbres
- learning_rate : taux d'apprentissage
- n_estimators : nombre d'arbres
- subsample : échantillonnage
- colsample_bytree : échantillonnage des features

**Amélioration obtenue** :
- RMSE : +8.32%
- MAE : +10.35%
- R² : 0.94 → 0.96

---

## Résultats

### Modèle Final : XGBoost Optimisé

- **Précision** : 96% (R² = 0.96)
- **RMSE** : ~367 véhicules/heure
- **MAE** : ~224 véhicules/heure
- **Objectif atteint** : Précision > 95%

### Points Forts

- Haute précision : Prédictions fiables et cohérentes
- Feature engineering robuste : 89 features capturant la complexité du trafic
- Application déployée : Interface utilisateur fonctionnelle
- Méthodologie rigoureuse : Comparaison systématique de modèles

---

## Installation

### Prérequis

- Python 3.8 ou supérieur
- pip (gestionnaire de paquets Python)

### Étapes d'Installation

1. **Cloner le dépôt**
```bash
git clone https://github.com/VOTRE_USERNAME/traffic-prediction.git
cd traffic-prediction
```

2. **Créer un environnement virtuel** (recommandé)
```bash
python -m venv venv

# Windows
venv\Scripts\activate

# Linux/Mac
source venv/bin/activate
```

3. **Installer les dépendances**
```bash
pip install -r requirements.txt
```

4. **Télécharger les données**
- Placez le fichier Metro_Interstate_Traffic_Volume.csv dans data/raw/
- Ou téléchargez depuis Kaggle

---

## Utilisation

### 1. Explorer les Notebooks

Les notebooks Jupyter sont dans le dossier notebooks/ :

```bash
jupyter notebook
```

- **cleaning_data.ipynb** : Nettoyage et prétraitement
- **exploration_data.ipynb** : Analyse exploratoire (EDA)
- **models.ipynb** : Entraînement et évaluation des modèles

### 2. Entraîner le Modèle

```bash
python src/train_model.py
```

Le modèle entraîné sera sauvegardé dans models/xgboost_optimized.pkl

### 3. Lancer l'Application Web

```bash
cd app
python app.py
```

L'application sera accessible à : http://localhost:5000

#### Fonctionnalités de l'Application

1. Sélectionnez la date et l'heure
2. Renseignez les conditions météorologiques
3. Indiquez si c'est un jour férié
4. Obtenez la prédiction instantanée du volume de trafic

---

## Structure du Projet

```
traffic-prediction/
│
├── data/
│   ├── raw/                          # Données brutes
│   │   └── Metro_Interstate_Traffic_Volume.csv
│   └── processed/                    # Données prétraitées
│       └── cleaned_data.csv
│
├── notebooks/
│   ├── cleaning_data.ipynb           # Nettoyage des données
│   ├── exploration_data.ipynb        # Analyse exploratoire (EDA)
│   └── models.ipynb                  # Modèles ML
│
├── src/
│   ├── __init__.py
│   ├── temporal_features.py          # Features temporelles
│   ├── weather_features.py           # Features météorologiques
│   ├── preprocessing.py              # Pipeline de prétraitement
│   └── train_model.py                # Entraînement du modèle
│
├── models/
│   ├── xgboost_optimized.pkl         # Modèle final
│   └── encoders.pkl                  # Encodeurs One-Hot
│
├── app/
│   ├── app.py                        # Application Flask
│   ├── templates/
│   │   └── index.html                # Interface web
│   └── static/
│       ├── css/
│       └── js/
│
├── figures/                          # Visualisations (EDA)
│   ├── traffic_by_hour.png
│   ├── traffic_by_day.png
│   └── weather_impact.png
│
├── requirements.txt                  # Dépendances Python
├── README.md                         # Ce fichier
├── RAPPORT_FINAL.docx                # Rapport détaillé
└── .gitignore
```

---

## Technologies Utilisées

### Machine Learning et Data Science
- Python 3.8+ : Langage de programmation
- Pandas : Manipulation de données
- NumPy : Calculs numériques
- Scikit-learn : Modèles ML et métriques
- XGBoost : Modèle de gradient boosting

### Visualisation
- Matplotlib : Graphiques statiques
- Seaborn : Visualisations statistiques

### Application Web
- Flask : Framework web Python
- HTML/CSS/JavaScript : Interface utilisateur

### Notebooks
- Jupyter : Notebooks interactifs

---

## Challenges Rencontrés et Solutions

### 1. Gestion des Données Temporelles
**Challenge** : Extraction de multiples features temporelles  
**Solution** : Pipeline structuré avec 11 features temporelles distinctes

### 2. Valeurs Aberrantes
**Challenge** : Températures extrêmes, précipitations négatives  
**Solution** : Détection et suppression basée sur des seuils réalistes

### 3. Équilibrage Précision/Temps
**Challenge** : Optimisation des hyperparamètres coûteuse  
**Solution** : GridSearchCV avec grille soigneusement sélectionnée

### 4. Dimensionnalité Élevée
**Challenge** : 89 features après feature engineering  
**Solution** : XGBoost avec régularisation intégrée

### 5. Déploiement
**Challenge** : Cohérence du prétraitement  
**Solution** : Module réutilisable et sauvegarde des encodeurs

---

## Perspectives d'Amélioration

### Court Terme
- Déploiement sur cloud (AWS, Heroku, Azure)
- Visualisations interactives (Plotly, Dash)
- Historique des prédictions

### Moyen Terme
- Extension à d'autres zones géographiques
- Intégration de données en temps réel (APIs météo)
- Développement d'une API REST

### Long Terme
- Modèles de séries temporelles (LSTM, Prophet)
- Données supplémentaires (événements, travaux routiers)
- Prédictions multi-horizons (1h, 4h, 24h)
- Application mobile

---

## Auteurs

- Balmir Maryame
- Firdaouss Zai
- Soulaimi Ahlam

**Encadré par** : Pr. Sara El-Ateif

---

## Licence

Ce projet est sous licence MIT - voir le fichier LICENSE pour plus de détails.

---

## Références

1. Dataset : Metro Interstate Traffic Volume - Kaggle
2. XGBoost Documentation : https://xgboost.readthedocs.io/
3. Scikit-learn Documentation : https://scikit-learn.org/