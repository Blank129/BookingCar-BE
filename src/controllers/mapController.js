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

module.exports = { getRoute };
