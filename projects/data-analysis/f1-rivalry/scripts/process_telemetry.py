import fastf1
import json
import sys
import os
import numpy as np
import pandas as pd

# Setup cache
if not os.path.exists('cache'):
    os.makedirs('cache')
fastf1.Cache.enable_cache('cache')

def process_race_telemetry(year, race_name, driver_code, session_type='Q'):
    print(f"Loading {session_type} session for {race_name} {year}...")
    session = fastf1.get_session(year, race_name, session_type)
    session.load()

    print(f"Getting telemetry for {driver_code}...")
    driver_laps = session.laps.pick_driver(driver_code)
    
    # Get the fastest lap
    fastest_lap = driver_laps.pick_fastest()
    
    if fastest_lap is None:
        print(f"No fastest lap found for {driver_code}")
        return

    # Get telemetry data
    telemetry = fastest_lap.get_telemetry()
    
    # Prepare data for JSON
    # We'll downsample if necessary, but for now let's take all points
    # FastF1 telemetry is usually high frequency
    
    data = {
        "driver": driver_code,
        "circuit": race_name,
        "year": year,
        "lapTime": str(fastest_lap['LapTime']),
        "sector1": str(fastest_lap['Sector1Time']),
        "sector2": str(fastest_lap['Sector2Time']),
        "sector3": str(fastest_lap['Sector3Time']),
        "telemetry": {
            "Distance": telemetry['Distance'].tolist(),
            "Time": telemetry['Time'].dt.total_seconds().tolist(),
            "Speed": telemetry['Speed'].tolist(),
            "Throttle": telemetry['Throttle'].tolist(),
            "Brake": telemetry['Brake'].tolist(),
            "nGear": telemetry['nGear'].tolist(),
            "RPM": telemetry['RPM'].tolist(),
            "DRS": telemetry['DRS'].tolist(),
            "X": telemetry['X'].tolist(),
            "Y": telemetry['Y'].tolist()
        }
    }

    # Output file path
    output_dir = os.path.join('assets', 'telemetry')
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
        
    output_file = os.path.join(output_dir, f"{race_name}_{driver_code}.json")
    
    with open(output_file, 'w') as f:
        json.dump(data, f)
    
    print(f"Telemetry saved to {output_file}")

if __name__ == "__main__":
    if len(sys.argv) < 4:
        print("Usage: python process_telemetry.py <year> <race> <driver> [session]")
        sys.exit(1)
        
    year = int(sys.argv[1])
    race = sys.argv[2]
    driver = sys.argv[3]
    session = sys.argv[4] if len(sys.argv) > 4 else 'Q'
    
    process_race_telemetry(year, race, driver, session)
