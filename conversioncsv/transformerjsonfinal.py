import json

with open("auto-ecoles-geocoded.json", "r", encoding="utf-8") as f:
    data = json.load(f)

simplified_data = []

for ae in data:
    lat = ae.get("latitude")
    lon = ae.get("longitude")

    # Vérifier que latitude et longitude sont bien définies et non vides
    if lat and lon:
        try:
            lat = float(lat)
            lon = float(lon)
        except ValueError:
            # Si la conversion échoue, on saute cette entrée
            continue
    else:
        # Sauter les entrées sans coordonnées
        continue

    simplified_data.append({
        "name": ae.get("aue_raisonsociale"),
        "address": ae.get("aue_adresse"),
        "postalCode": str(ae.get("aue_codepostal")),
        "city": ae.get("aue_commune"),
        "location": {
            "lat": lat,
            "lon": lon
        }
    })

with open("autoecoles_simplifiees.json", "w", encoding="utf-8") as f:
    json.dump(simplified_data, f, ensure_ascii=False, indent=4)