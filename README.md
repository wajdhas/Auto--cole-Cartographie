# auto-ecole-cartographie
Carte de toutes les auto-écoles labélisées

## Comment ça marche:

## Pour lancer le site:

- installer node.js
- sur une invite de commande aller à l'endroit ou les fichiers son stocker et taper la commande: http-server
- 2 liens sont générés, copier-coller un des 2 sur un browser
- la carte apparaît

## Pour passer d'un fichier csv (comme par exemple le fichier auto-ecoles.csv) à un fichier json utilisable (comme autoecoles_simplifiees.json):

- télécharger le fichier à partir du site https://www.data.gouv.fr/fr/datasets/liste-des-auto-ecoles-et-taux-de-reussite-au-permis-de-conduire/
- utiliser le script geocodage_autoecoles.js pour geolocalisé toutes les auto-écoles et ajouter leurs localisations à la fin de chaque ligne (ça génére un fichier auto-ecoles-geocoded.csv)
- sur un site de convertisseur csv to json, générer le fichier en json (auto-ecoles-geocoded.json) comme par exemple https://csvjson.com/csv2json
- utiliser le script python transformerjsonfinal.py pour mettre le fichier json (auto-ecoles-geocoded.json) sous une forme utilisable (autoecoles_simplifiees.json)
