const axios = require("axios");

const getRoute = async (req, res) => {
  const { pickup, destination } = req.body;

  if (!pickup || !destination) {
    return res.status(400).json({ error: "Thiếu pickup hoặc destination" });
  }

  try {
    const orsResponse = await axios.post(
      "https://api.openrouteservice.org/v2/directions/driving-car/geojson",
      {
        coordinates: [pickup.slice().reverse(), destination.slice().reverse()],
      },
      {
        headers: {
          Authorization: process.env.API_OSM,
          "Content-Type": "application/json",
        },
      }
    );

    const coords = orsResponse.data.features[0].geometry.coordinates.map(
      (coord) => [coord[1], coord[0]]
    );

    res.json({ coordinates: coords });
  } catch (err) {
    res.status(500).json({ error: "Không lấy được tuyến đường" });
  }
};

const getRouteDistance = async (req, res) => {
  const { start, end } = req.body;
  // Validate coordinates: must be [lat, lng]
  if (
    !start || !end ||
    !Array.isArray(start) || !Array.isArray(end) ||
    start.length !== 2 || end.length !== 2
  ) {
    return res.status(400).json({ error: "Invalid coordinates format" });
  }

  // Đảo từ [lat, lng] → [lng, lat] cho ORS
  const startCoord = [start[1], start[0]];
  const endCoord = [end[1], end[0]];

  try {
    const orsRes = await axios.post(
      "https://api.openrouteservice.org/v2/directions/driving-car",
      { coordinates: [startCoord, endCoord] },
      {
        headers: {
          Authorization: process.env.API_OSM,
          "Content-Type": "application/json",
        },
      }
    );

    const distanceInMeters = orsRes.data.routes?.[0]?.summary?.distance;

    if (!distanceInMeters) {
      return res.status(500).json({ error: "No distance data returned" });
    }

    res.json({ distanceKm: Math.max(distanceInMeters / 1000, 1) });
  } catch (error) {
    console.error("ORS backend error:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to fetch route from ORS" });
  }
};


module.exports = { getRoute, getRouteDistance };
