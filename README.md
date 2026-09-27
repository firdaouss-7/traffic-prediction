<div align="center">

# Traffic Lens
### Prédiction du Volume de Trafic Routier

[![Python](https://img.shields.io/badge/Python-3.8%2B-blue?logo=python&logoColor=white)](https://www.python.org/)
[![XGBoost](https://img.shields.io/badge/Model-XGBoost-orange)](https://xgboost.readthedocs.io/)
[![Flask](https://img.shields.io/badge/App-Flask-black?logo=flask)](https://flask.palletsprojects.com/)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)
[![R²](https://img.shields.io/badge/R2-0.96-success)]()

Projet de machine learning visant à prédire avec précision le volume de trafic routier à partir de données historiques, météorologiques et temporelles.
Le modèle final (XGBoost optimisé) atteint un **R² de 0.96**, déployé via une application web interactive.


</div>

---

## Table des Matières

- [Aperçu](#aperçu)
- [Problématique](#problématique)
- [Données](#données)
- [Méthodologie](#méthodologie)
- [Résultats](#résultats)
- [Installation](#installation)
- [Utilisation](#utilisation)
- [Structure du Projet](#structure-du-projet)
- [Technologies Utilisées](#technologies-utilisées)
- [Challenges & Solutions](#challenges-rencontrés-et-solutions)
- [Perspectives d'Amélioration](#perspectives-damélioration)
- [Auteurs](#auteurs)
- [Licence](#licence)

---

## Aperçu

| | |
|---|---|
| **Type de problème** | Régression |
| **Modèle final** | XGBoost (optimisé via GridSearchCV) |
| **Précision** | R² = 0.96 · RMSE ≈ 367 véh/h · MAE ≈ 224 véh/h |
| **Données** | 48 176 observations horaires (2012–2018), Minneapolis/Saint Paul, MN |
| **Features** | 89 (temporelles, météorologiques, encodage one-hot) |
| **Déploiement** | Application web Flask |

---

## Problématique

L'augmentation constante du trafic urbain pose des défis majeurs :
- Pertes de temps dues aux embouteillages
- Pollution atmosphérique accrue
- Coûts économiques importants

### Objectifs du Projet

1. Développer un modèle prédictif avec une précision supérieure à 95 %
2. Identifier les facteurs clés influençant le trafic
3. Créer une application web accessible aux utilisateurs non techniques
4. Comparer différentes approches de Machine Learning

---

## Données

### Source

- **Origine** : [Kaggle – Metro Interstate Traffic Volume](https://www.kaggle.com/)
- **Localisation** : Minneapolis et Saint Paul, Minnesota, USA
- **Période** : Octobre 2012 – Septembre 2018 (6 ans)
- **Fréquence** : Horaire — 48 204 observations brutes

### Variables

| Type | Variables |
|---|---|
| Cible | `traffic_volume` (véhicules/heure) |
| Temporelles | `date_time`, `holiday` |
| Météorologiques | `temp`, `rain_1h`, `snow_1h`, `clouds_all`, `weather_main`, `weather_description` |

### Insights Clés (Analyse Exploratoire)

**Patterns temporels**
- Baisse de 50–70 % du trafic le week-end et les jours fériés
- Pics aux heures de pointe : 7h–9h et 16h–18h
- Trafic minimal la nuit (0h–4h)

**Impact météorologique**
- Réduction de 30–40 % lors de conditions extrêmes (neige, pluie forte)
- Trafic normal à élevé par temps clair

**Saisonnalité**
- Été : baisse des déplacements domicile-travail
- Fin d'année : forte baisse pendant les congés
- Rentrée scolaire : reprise et augmentation du trafic

---

## Méthodologie

### 1. Prétraitement des Données

**Nettoyage**
- Suppression de 17 doublons
- Élimination de 11 outliers (valeurs météo physiquement impossibles)
- Remplissage des valeurs manquantes (`holiday` → `'None'`)
- Résultat : **48 176 observations propres**

**Feature Engineering — 89 features créées**

| Catégorie | Nombre | Exemples |
|---|---|---|
| Temporelles | 11 | `year`, `month`, `hour`, `day_of_week`, `is_weekend`, `is_rush_hour`, `season` |
| Météorologiques | 5 | `temp_celsius`, `is_raining`, `is_snowing`, `temp_level`, `cloud_category` |
| Encodage One-Hot | 73 | Jours fériés, conditions météo, saisons, niveaux de température |

### 2. Modèles Comparés

Trois modèles entraînés sur le même jeu de données (80 % train / 20 % test) :

1. **Random Forest** — baseline d'ensemble
2. **XGBoost Baseline** — paramètres par défaut
3. **XGBoost Optimisé** — hyperparamètres réglés via `GridSearchCV` (`max_depth`, `learning_rate`, `n_estimators`, `subsample`, `colsample_bytree`)

**Gains de l'optimisation** (XGBoost baseline → optimisé) :
- RMSE : **+8.32 %**
- MAE : **+10.35 %**
- R² : 0.94 → **0.96**

---

## Résultats

| Modèle | RMSE ↓ | MAE ↓ | R² ↑ | Temps |
|---|---|---|---|---|
| Random Forest | ~450 | ~280 | ~0.94 | Moyen |
| XGBoost Baseline | ~400 | ~250 | ~0.95 | Rapide |
| **XGBoost Optimisé**  | **~367** | **~224** | **~0.96** | Acceptable |

### Modèle final : XGBoost Optimisé
- Objectif de précision > 95 % **atteint**
- Feature engineering robuste (89 features)
- Généralisation cohérente sur les données de test
- Application web déployée et fonctionnelle

---

## Installation

### Prérequis
- Python 3.8 ou supérieur
- `pip`

### Étapes

```bash
# 1. Cloner le dépôt
git clone https://github.com/firdaouss-7/traffic-prediction.git
cd traffic-prediction

# 2. Créer un environnement virtuel (recommandé)
python -m venv venv

# Windows
venv\Scripts\activate
# Linux/Mac
source venv/bin/activate

# 3. Installer les dépendances
pip install -r requirements.txt
```

**Données** : placez `Metro_Interstate_Traffic_Volume.csv` dans `data/raw/` (téléchargeable depuis Kaggle).

---

## Utilisation

### Notebooks

```bash
jupyter notebook
```

| Notebook | Description |
|---|---|
| `cleaning_data.ipynb` | Nettoyage et prétraitement |
| `exploration_data.ipynb` | Analyse exploratoire (EDA) |
| `models.ipynb` | Entraînement et évaluation des modèles |

### Entraîner le modèle

```bash
python src/train_model.py
```
Le modèle entraîné est sauvegardé dans `models/xgboost_optimized.pkl`.

### Lancer l'application web

```bash
cd app
python app.py
```
Accessible sur **http://localhost:5000**

**Fonctionnalités** : sélection de la date/heure → saisie des conditions météo → indication d'un jour férié → prédiction instantanée du volume de trafic.

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
│   ├── cleaning_data.ipynb
│   ├── exploration_data.ipynb
│   └── models.ipynb
│
├── src/
│   ├── __init__.py
│   ├── temporal_features.py
│   ├── weather_features.py
│   ├── preprocessing.py
│   └── train_model.py
│
├── models/
│   ├── xgboost_optimized.pkl
│   └── encoders.pkl
│
├── app/
│   ├── app.py
│   ├── templates/
│   │   └── index.html
│   └── static/
│       ├── css/
│       └── js/
│
├── figures/
│   ├── traffic_by_hour.png
│   ├── traffic_by_day.png
│   └── weather_impact.png
│
├── requirements.txt
├── README.md
├── RAPPORT_FINAL.docx
└── .gitignore
```

---

## Technologies Utilisées

| Catégorie | Outils |
|---|---|
| Machine Learning & Data Science | Python 3.8+, Pandas, NumPy, Scikit-learn, XGBoost |
| Visualisation | Matplotlib, Seaborn |
| Application Web | Flask, HTML/CSS/JavaScript |
| Notebooks | Jupyter |

---

## Challenges Rencontrés et Solutions

| Challenge | Solution |
|---|---|
| Extraction de multiples features temporelles | Pipeline structuré avec 11 features temporelles distinctes |
| Valeurs aberrantes (températures/précipitations impossibles) | Détection et suppression basées sur des seuils réalistes |
| Équilibre précision / temps de calcul | `GridSearchCV` avec grille d'hyperparamètres soigneusement sélectionnée |
| Haute dimensionnalité (89 features) | XGBoost avec régularisation intégrée |
| Cohérence du prétraitement en production | Module réutilisable + sauvegarde des encodeurs |

---

## Perspectives d'Amélioration

**Court terme**
- Déploiement cloud (AWS, Heroku, Azure)
- Visualisations interactives (Plotly, Dash)
- Historique des prédictions

**Moyen terme**
- Extension à d'autres zones géographiques
- Intégration de données en temps réel (APIs météo)
- API REST

**Long terme**
- Modèles de séries temporelles (LSTM, Prophet)
- Données additionnelles (événements, travaux routiers)
- Prédictions multi-horizons (1h, 4h, 24h)
- Application mobile

---

## Auteurs

- **Firdaouss Zai**
- **Balmir Maryame**
- **Soulaimi Ahlam**

**Encadré par** : Pr. Sara El-Ateif
**Établissement** : École Nationale Supérieure de l'Intelligence Artificielle et Sciences des Données – Taroudant (ENSIASD)

---

## Licence

Ce projet est sous licence MIT — voir le fichier [LICENSE](LICENSE) pour plus de détails.

## Références

1. Dataset : [Metro Interstate Traffic Volume – Kaggle](https://www.kaggle.com/)
2. [XGBoost Documentation](https://xgboost.readthedocs.io/)
3. [Scikit-learn Documentation](https://scikit-learn.org/)
