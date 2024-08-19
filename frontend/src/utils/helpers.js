import { setKey, fromLatLng } from "react-geocode";
import { getHotelsByCity } from "../services/hotel";

export const getUserLocation = async (setHotels, setLocation) => {
    const permission = await navigator.permissions.query({ name: 'geolocation' });
    if (permission.state === 'denied') {
        setLocation("California");
        getHotelsByCity({query: "California"}).then((response) => {
            setHotels(response.data);
        }
        );

    } else {
    navigator.geolocation.getCurrentPosition((position) => {
      console.log(position);
        setKey(import.meta.env.VITE_GOOGLE_API_KEY);  
        fromLatLng(position.coords.latitude, position.coords.longitude).then(
            (response) => {
                const city = response.results[0].address_components[3].long_name;
                setLocation(city);
                const query = { query: city };
                getHotelsByCity(query).then((response) => {
                    setHotels(response.data);
                });
            },
            (error) => {
                console.error(error);
            });
    });
}
};

export const idbPromise = (storeName, method, object) => {
  return new Promise((resolve, reject) => {
    const request = window.indexedDB.open(storeName, 1);
    let db, tx, store;
    request.onupgradeneeded = function(e) {
      const db = request.result;
      db.createObjectStore(storeName, { keyPath: 'id' });
    };
    request.onerror = function(e) {
      console.log('There was an error');
    };
    request.onsuccess = function(e) {
      db = request.result;
      tx = db.transaction(storeName, 'readwrite');
      store = tx.objectStore(storeName);

      db.onerror = function(e) {
        console.log('error', e);
      };

      if (method === 'put') {
        store.put(object);
        resolve(object);
      } else if (method === 'get') {
        const all = store.getAll();
        all.onsuccess = function() {
          resolve(all.result);
        };
      } else if (method === 'delete') {
        store.delete(object.id);
        resolve(object);
      } else if (method === 'clear') {
        store.clear();
        resolve('Cleared store');
      }

      tx.oncomplete = function() {
        db.close();
      };
    };
  });
};


// utils/imageHelpers.js

export const handleAddImageHelper = (e, setImages, setError) => {
  const files = Array.from(e.target.files);
  setError("");

  const newImages = [];

  for (const file of files) {
    const reader = new FileReader();

    if (file.size > 12000000) {
      setError("Image must be less than 12MB.");
      return;
    }

    if (!file.type.startsWith("image")) {
      setError("File must be an image.");
      return;
    }

    reader.onload = (e) => {
      const fileData = {};
      const data = e.target.result;
      const name = file.name;
      const blob = new Blob([data], { type: file.type });
      const url = URL.createObjectURL(blob);

      fileData['name'] = name;
      fileData['data'] = data;
      fileData['type'] = file.type;
      fileData['url'] = url;

      newImages.push(fileData);

      if (newImages.length === files.length) {
        setImages((prevImages) => [...prevImages, ...newImages]);
      }
    };

    reader.readAsArrayBuffer(file);
  }
};


export const stateAbbreviations = {
    'Alabama': 'AL',
    'Alaska': 'AK',
    'American Samoa': 'AS',
    'Arizona': 'AZ',
    'Arkansas': 'AR',
    'California': 'CA',
    'Colorado': 'CO',
    'Connecticut': 'CT',
    'Delaware': 'DE',
    'District of Columbia': 'DC',
    'Florida': 'FL',
    'Georgia': 'GA',
    'Guam': 'GU',
    'Hawaii': 'HI',
    'Idaho': 'ID',
    'Illinois': 'IL',
    'Indiana': 'IN',
    'Iowa': 'IA',
    'Kansas': 'KS',
    'Kentucky': 'KY',
    'Louisiana': 'LA',
    'Maine': 'ME',
    'Maryland': 'MD',
    'Massachusetts': 'MA',
    'Michigan': 'MI',
    'Minnesota': 'MN',
    'Mississippi': 'MS',
    'Missouri': 'MO',
    'Montana': 'MT',
    'Nebraska': 'NE',
    'Nevada': 'NV',
    'New Hampshire': 'NH',
    'New Jersey': 'NJ',
    'New Mexico': 'NM',
    'New York': 'NY',
    'North Carolina': 'NC',
    'North Dakota': 'ND', 
    'Northern Mariana Islands':'MP',
    'Ohio': 'OH',
    'Oklahoma': 'OK',
    'Oregon': 'OR',
    'Pennsylvania': 'PA',
    'Puerto Rico': 'PR',
    'Rhode Island': 'RI',
    'South Carolina': 'SC',
    'South Dakota': 'SD',
    'Tennessee': 'TN',
    'Texas': 'TX',
    'Utah': 'UT',
    'Vermont': 'VT',
    'Virgin Islands': 'VI',
    'Virginia': 'VA',
    'Washington': 'WA',
    'West Virginia': 'WV',
    'Wisconsin': 'WI'
}