const express = require("express");
const axios = require("axios");
const router = express.Router();

const serviceMap = {
  "tailor": '["shop"="tailor"]',
  "salon": '["shop"="hairdresser"]',
  "spa": '["amenity"="spa"]',
  "laundry": '["shop"="laundry"]',
  "dry wash": '["shop"="laundry"]',
  "cleaning": '["shop"="cleaning"]',
  "electrician": '["craft"="electrician"]',
  "ac repair": '["craft"="hvac"]',
  "car wash": '["amenity"="car_wash"]',
  "makeup": '["shop"="beauty"]',
};

router.get("/nearby-shops", async (req, res) => {
  try {
    let { lat, lng, service } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({
        error: "Latitude and Longitude required",
      });
    }

    service = service ? service.toLowerCase().trim() : "";
    const filter = serviceMap[service] || '["shop"]';

    const query = `
      [out:json];
      (
        node${filter}(around:5000,${lat},${lng});
        way${filter}(around:5000,${lat},${lng});
      );
      out center;
    `;

    const response = await axios.post(
      "https://overpass-api.de/api/interpreter",
      query,
      {
        headers: {
          "Content-Type": "text/plain",
        },
      }
    );

    const shops = response.data.elements
      .filter((place) => place.tags?.name)
      .map((place) => ({
        id: place.id,
        name: place.tags.name,
        lat: place.lat ?? place.center?.lat,
        lng: place.lon ?? place.center?.lon,
        address: (() => {
          const t = place.tags || {};
          if (t["addr:full"]) return t["addr:full"];
          const parts = [
            t["addr:housenumber"],
            t["addr:street"],
            t["addr:neighbourhood"],
            t["addr:suburb"],
            t["addr:quarter"],
            t["addr:village"],
            t["addr:town"],
            t["addr:city"],
            t["addr:district"],
            t["addr:state"],
          ].filter(Boolean);
          if (parts.length > 0) return parts.join(", ");
          return null;
        })(),
        rating: null,
        phone: place.tags?.phone || place.tags?.["contact:phone"] || null,
        category:
          place.tags?.shop ||
          place.tags?.amenity ||
          place.tags?.craft ||
          "service",
        isPartner: false,
        source: "osm",
        image: null,
      }));

    res.json(shops);
  } catch (error) {
    console.error("OSM API Error:", error.message);
    res.status(500).json({
      error: "Failed to fetch nearby shops",
    });
  }
});

module.exports = router;