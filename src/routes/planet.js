const express = require("express"); // inyectamos express
const router = express.Router(); // inyectamos router
const mongoose = require("mongoose"); // inyectamos mongoose
let Planet = require("../models/planet"); // importamos el modelo de planets

router.get("/planets", async (req, res) => {
  //ruta con tabla estilizada
  const Planets = await Planet.find({});
  res.render("planetList", { Planets });
});

// rutas para agregar planetas
router.get("/addPlanet", (req, res) => {
  // ruta para recuperar el formulario para agregar planetas
  res.render("addPlanets");
});
router.post("/addPlanet", (req, res) => {
  // ruta para mandar la información a la base de datos
  let rings = false;
  if (req.body.rings === "on") {
    rings = true;
  }
  const newPlanet = Planet({
    name: req.body.name,
    orderFromSun: req.body.order,
    hasRings: rings,
    mainAtmosphere: req.body.atmosphere.split(","),
    surfaceTemperatureC: {
      min: req.body.min,
      mean: req.body.mean,
      max: req.body.max,
    },
  });
  newPlanet
    .save() // se guarda el documento (función asincrona)
    .then((data) => {
      res.redirect("/planets");
    }) // nos redirecciona a la tabla con todos los planetas
    .catch((error) => {
      res.json({ message: error });
    }); // nos regresa un error
});

// rutas para modificar planetas
router.get("/findById/:id", (req, res) => {
  // nos permite encontrar el objeto para obtener sus propiedades
  Planet.findById(req.params.id)
    .then((myPlanet) => {
      res.render("planetUpdate", { myPlanet });
    })
    .catch((error) => {
      res.json({ message: error });
    });
});
router.post("/updatePlanet", (req, res) => {
  // ruta para mandar la información a la base de datos
  let rings = false;
  if (req.body.rings === "on") {
    rings = true;
  }
  // método para encontrar por Id y actualizarlo, toma la Id del objeto y todos sus atributos
  Planet.findByIdAndUpdate(req.body.objId, {
    name: req.body.name,
    orderFromSun: req.body.order,
    hasRings: rings,
    mainAtmosphere: req.body.atmosphere.split(","),
    surfaceTemperatureC: {
      min: req.body.min,
      mean: req.body.mean,
      max: req.body.max,
    },
  })
    .then((data) => {
      res.redirect("/planets");
    }) // nos redirecciona a la tabla con todos los planetas
    .catch((error) => {
      res.json({ message: error });
    }); // nos regresa un error
});

// rutas para eliminar un documento
router.get("/deletePlanet/:id", (req, res) => {
  // nos permite encontrar el objeto para obtener sus propiedades
  Planet.findByIdAndDelete(req.params.id)
    .then((data) => {
      res.redirect("/planets");
    })
    .catch((error) => {
      res.json({ message: error });
    }); // nos regresa un error
});

// rutas para encontrar un documento
router.post("/findPlanet", (req, res) => {
  Planet.find({ name: { $regex: req.body.criteria, $options: "i" } })
    .then((Planets) => {
      res.render("planetList", { Planets });
    })
    .catch((error) => {
      res.json({ message: error });
    });
});

module.exports = router; // exportamos el router de planets
