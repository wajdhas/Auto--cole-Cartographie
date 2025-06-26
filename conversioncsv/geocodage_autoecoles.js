const fs = require('fs');
const csv = require('csv-parser');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const axios = require('axios');
const Bottleneck = require('bottleneck');
const chalk = require('chalk'); 

const inputFile = './auto-ecoles.csv';
const outputFile = './auto-ecoles-geocoded.csv';


const limiter = new Bottleneck({ minTime: 40 });

const nominatimBaseUrl = 'https://srv7.coachaac.com:4443/nominatim/search';
const apiKey = 'tPtaE703LsZl6WHSp7orTedX9dv8o7eGZWedJhK0.nominatim';

async function geocode({ street, city, postalcode }) {
  const tryGeocode = async (params, label) => {
    try {
      const response = await axios.get(nominatimBaseUrl, {
        params: {
          format: 'json',
          addressdetails: 1,
          ...params,
        },
        headers: {
          'x-api-key': apiKey,
        },
      });

      if (response.data?.length > 0) {
        const loc = response.data[0];
        console.log(chalk.green(`✅ ${label} → ${loc.lat}, ${loc.lon}`));
        return { lat: loc.lat, lon: loc.lon };
      } else {
        console.warn(chalk.yellow(`❗ Aucun résultat pour ${label}`));
        return null;
      }
    } catch (err) {
      console.error(chalk.red(`🚨 Erreur lors de la tentative ${label} : ${err.message}`));
      return null;
    }
  };

 
  let result = await tryGeocode({ street, city, postalcode }, `${street}, ${postalcode} ${city}`);
  if (result) return result;

  
  result = await tryGeocode({ street, city }, `${street}, ${city}`);
  if (result) return result;

  
  result = await tryGeocode({ city }, city);
  if (result) return result;

  return { lat: '', lon: '' }; 
}

(async () => {
  console.log(chalk.blue('📥 Lecture du fichier CSV...'));

  const results = [];
  const headers = [];
  let count = 0;

  const readStream = fs.createReadStream(inputFile).pipe(csv({ separator: ';' }));

  for await (const row of readStream) {
    if (headers.length === 0) headers.push(...Object.keys(row));

    const address = {
      street: row['aue_adresse'] || '',
      city: row['aue_commune'] || '',
      postalcode: row['aue_codepostal'] || '',
    };

    const { lat, lon } = await limiter.schedule(() => geocode(address));

    row.latitude = lat;
    row.longitude = lon;
    results.push(row);

    count++;
    if (count % 100 === 0) {
      console.log(chalk.green(`✅ ${count} lignes traitées...`));
    }

    console.log(
      chalk.gray(
        `→ ${address.street}, ${address.postalcode} ${address.city} → ` +
        (lat && lon ? chalk.green(`${lat}, ${lon}`) : chalk.red('Non trouvé'))
      )
    );
  }

  console.log(chalk.blue(`📝 Écriture du fichier de sortie : ${outputFile}`));

  const csvWriter = createCsvWriter({
    path: outputFile,
    header: [...headers, 'latitude', 'longitude'].map((h) => ({ id: h, title: h })),
    fieldDelimiter: ';',
  });

  await csvWriter.writeRecords(results);

  console.log(chalk.green(`✅ Terminé ! ${count} auto-écoles traitées.`));
})();