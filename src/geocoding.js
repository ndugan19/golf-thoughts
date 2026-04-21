export async function geocodeCourse(courseName) {
  if (!courseName || !courseName.trim()) return null;

  try {
    // Try Overpass with a strict timeout
    const overpassResult = await Promise.race([
      searchOverpass(courseName),
      new Promise(resolve => setTimeout(() => resolve(null), 5000)),
    ]);

    if (overpassResult) {
      console.log(`Overpass found "${courseName}":`, overpassResult);
      return overpassResult;
    }

    // Fall back to Nominatim
    const nominatimResult = await searchNominatim(courseName);
    if (nominatimResult) {
      console.log(`Nominatim found "${courseName}":`, nominatimResult);
      return nominatimResult;
    }

    console.log(`Could not find: "${courseName}"`);
    return null;

  } catch (e) {
    console.error('Geocoding error:', e);
    return null;
  }
}

async function searchOverpass(courseName) {
  try {
    const ohioBbox = '38.4,-84.8,42.3,-80.5';

    let query = `
      [out:json][timeout:8];
      (
        node["leisure"="golf_course"]["name"~"${courseName}",i](${ohioBbox});
        way["leisure"="golf_course"]["name"~"${courseName}",i](${ohioBbox});
        relation["leisure"="golf_course"]["name"~"${courseName}",i](${ohioBbox});
      );
      out center 1;
    `;

    let response = await fetch('https://overpass-api.de/api/interpreter', {
      method: 'POST',
      body: query,
    });

    // If not JSON it means Overpass returned an error page
    const text = await response.text();
    if (!text.startsWith('{')) return null;

    const data = JSON.parse(text);

    if (!data.elements || data.elements.length === 0) {
      // Try full USA search
      query = `
        [out:json][timeout:8];
        (
          node["leisure"="golf_course"]["name"~"${courseName}",i];
          way["leisure"="golf_course"]["name"~"${courseName}",i];
          relation["leisure"="golf_course"]["name"~"${courseName}",i];
        );
        out center 1;
      `;

      response = await fetch('https://overpass-api.de/api/interpreter', {
        method: 'POST',
        body: query,
      });

      const text2 = await response.text();
      if (!text2.startsWith('{')) return null;

      const data2 = JSON.parse(text2);
      if (!data2.elements || data2.elements.length === 0) return null;

      const el = data2.elements[0];
      const lat = el.center?.lat || el.lat;
      const lon = el.center?.lon || el.lon;
      if (lat && lon) return { latitude: lat, longitude: lon };
      return null;
    }

    const element = data.elements[0];
    const lat = element.center?.lat || element.lat;
    const lon = element.center?.lon || element.lon;
    if (lat && lon) return { latitude: lat, longitude: lon };
    return null;

  } catch (e) {
    console.error('Overpass error:', e);
    return null;
  }
}

async function searchNominatim(courseName) {
  try {
    const query = encodeURIComponent(`${courseName} golf course Ohio`);
    const url = `https://nominatim.openstreetmap.org/search`
      + `?q=${query}`
      + `&format=json`
      + `&countrycodes=us`
      + `&limit=1`;

    const response = await fetch(url, {
      headers: { 'User-Agent': 'GolfThoughtsApp/1.0' },
    });

    const data = await response.json();

    if (data && data.length > 0) {
      return {
        latitude: parseFloat(data[0].lat),
        longitude: parseFloat(data[0].lon),
      };
    }

    return null;
  } catch (e) {
    console.error('Nominatim error:', e);
    return null;
  }
}