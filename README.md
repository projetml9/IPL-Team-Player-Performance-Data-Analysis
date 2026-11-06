# IPL-Team-Player-Performance-Data-Analysis
🏏 IPL Match &amp; Player Performance Analytics 
# 🏏 IPL Team & Player Performance Analytics Engine

An advanced, data-driven cricket analytics platform built in Python to evaluate Indian Premier League (IPL) match telemetry, phase-specific player dynamics, and team strategies beyond traditional vanity metrics.

---

## 📌 Project Overview

Traditional cricket statistics rely heavily on aggregate metrics like raw batting averages or total wickets, which fail to capture match context. This project implements a granular, ball-by-ball analytical framework to evaluate performance dynamically across tactical match phases (**Powerplay**, **Middle Overs**, and **Death Overs**).

By analyzing phase-wise strike rates, boundary frequencies, dot-ball ratios, and head-to-head match-up matrices, this tool provides actionable insights for player selection, match strategy, and venue-based tactics.

---

## 🚀 Key Features

- **Phase-Wise Telemetry Breakdown:** Segments every delivery into Powerplay (Overs 1–6), Middle (Overs 7–15), and Death (Overs 16–20) overs.
- **Advanced Batting Performance:** Computes **True Strike Rate (TSR)**, **Boundary Percentage**, and **Dot Ball Pressure Index** instead of basic averages.
- **Granular Bowling Analytics:** Measures phase-wise Economy Rates ($Econ = \frac{Runs}{Overs}$), Bowling Strike Rates, and boundary containment efficiency.
- **Player Matchup Engine:** Interactively queries historical Head-to-Head (Batter vs. Bowler) statistics to uncover tactical advantages.
- **Venue & Toss Impact Matrix:** Evaluates toss bias and win percentages based on pitch dimensions and historical match conditions.

---

## 🛠️ Tech Stack & Dependencies

- **Language:** Python 3.7+
- **Data Processing:** Pandas, NumPy
- **Data Visualization:** Matplotlib, Seaborn, Plotly
- **Environment:** Visual Studio / Jupyter Notebook
- **Version Control:** Git & GitHub

---

## 📂 Repository Structure

```text
ipl-performance-analytics/
│
├── data/
│   ├── matches.csv              # Match metadata and venue records
│   └── deliveries.csv           # Ball-by-ball telemetry dataset
│
├── notebooks/
│   ├── 01_data_cleaning.ipynb   # Data preprocessing & team name normalization
│   ├── 02_batting_metrics.ipynb # Phase-wise batting calculations & TSR
│   └── 03_bowling_metrics.ipynb # Phase economy & boundary percentage analysis
│
├── src/
│   ├── preprocess.py            # Automated phase assignment and cleaning scripts
│   └── metrics.py               # Tactical calculation formulas
│
├── README.md                    # Project documentation
└── requirements.txt             # Required Python libraries
