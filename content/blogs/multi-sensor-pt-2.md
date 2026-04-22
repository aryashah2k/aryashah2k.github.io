---
title: "Part 2: Multi-Sensor Vehicle Positioning System Employing Shared Data Protocol"
date: 2025-10-13
summary: A guided tour of the app — markers, CAN bus monitor, error plots, and how to run it yourself.
tags: [patent, sensor-fusion, demo]
---

# Part 2. Multi-Sensor Vehicle Positioning System Employing Shared Data Protocol

# C. A Guided Tour of the App (Screenshots Coming Soon)

> Click-by-click walkthrough of what you’ll see and what it means.
> 
## The Main Screen

-  **Top Left — Controls**

- Start / Pause / Reset the simulation.

- Adjust simulation speed (0.1× to 10×).

- Load a custom route (CSV).

- Force GPS failure manually (for demos/tests).

-  **Center — Map**

- 🔵 Blue marker: ground truth (where the car really is in the sim).

- 🔴 Red marker: estimated position (what the system believes).

- Red rectangle overlays: GPS‑denied zones.

- Trails: past path of blue and red markers.

-  **Bottom — Performance Metrics**

- A live plot of **position error over time**.

- Flat line near zero = GPS available.

- Rising line = Dead‑reckoning (GPS off) — expected behavior.

-  **Right — CAN Bus Monitor**

- Live list of incoming sensor messages.

- Columns: Timestamp, Bus, CAN ID, Message, Data.

 
## Demo

1. Click **Start**.

2. Watch the **blue and red markers** move together.

3. When entering the red rectangle, the red marker drifts slowly — that’s **dead‑reckoning**.

4. As you leave the rectangle, red snaps back close to blue — that’s **GPS recovery**.

5. Error plot drops again — back to normal.

## Key Interactions

-  **Reset** puts the car back to the first waypoint and clears the plot.

-  **Load Route** lets you demo different paths (straight lines, turns, loops).

-  **Force GPS Failure** triggers dead‑reckoning anywhere on the map.

## Behind the Scenes (Only What’s Useful)

- Messages from sensors are sent over a simulated CAN bus.

- The Positioning ECU listens, fuses data, and emits a **position update** signal.

- The GUI receives that signal and updates the red marker and plots.

## Troubleshooting (Friendly Tips)

-  **Markers don’t move**: Click Start. Check the log for “Default route loaded successfully”.

-  **Red doesn’t appear**: Wait a second — first GPS must arrive. Then you’ll see estimates.

-  **Error looks huge**: This can happen only if GPS state is misread; the app now handles the “Valid” status correctly.

-  **CAN panel empty**: Fixed — it now updates at ~10 Hz to stay readable.

# D. Results, Demos, and How to Try It Yourself

> What you can expect to see, and a super-quick way to run the demo.

## What You’ll See (At a Glance)

-  **Markers move together** when GPS is available — red ≈ blue.

-  **Red drifts gradually** inside a GPS‑denied zone — that’s expected dead‑reckoning.

-  **Error plot rises** during GPS loss and **drops back** when GPS returns.

-  **CAN monitor fills** with GPS/IMU/Compass/Wheel Speed messages (~10 Hz view).

## Demo Script 

1. Click **Start**.

2. Point at the **blue** (truth) and **red** (estimate) markers.

3. Watch the car enter the **red rectangle** — error grows slowly.

4. As it exits, the red re‑aligns — error falls.

5. Open the **CAN Bus Monitor** and show live frames.


## How To Run Locally

```bash

# 1) Create environment

conda  create  -n  multi-sensor  python=3.9  -y

conda  activate  multi-sensor

# 2) Install deps

pip  install  -r  requirements.txt

# 3) Run the app

python  src/main.py

```
## Where to Put Your Own Route

- File: `data/route1.csv` (CSV with `latitude,longitude` header)

- Load it from the GUI via **Load Route File**.

## Tips for a Smooth Demo

-  **Slow it down**: set speed to 0.5× for explanations.

-  **Point out the zone** before entry so viewers know what to expect.

-  **Use Reset** between takes to keep plots clean.

## What’s Unique About This (Patent Angle)

-  **Sensor fusion that fails gracefully**: no jumps, no panic when GPS is gone.

-  **Clear separation of concerns**: sensors → CAN → fusion → GUI.

-  **Practical demoability**: zones, plots, and monitor make behavior obvious.

