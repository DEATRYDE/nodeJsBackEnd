const express = require("express");
const bodyParser = require("body-parser");
const authenticate = require("../authenticate");
const Favourites = require("../models/favourite");
const cors = require("./cors");

const favouriteRouter = express.Router();

favouriteRouter.use(bodyParser.json());

favouriteRouter
  .route("/")
  .options(cors.corsWithOptions, (req, res) => {
    res.sendStatus(200);
  })
  .get(cors.cors, (req, res, next) => {
    Favourites.find({})
      .populate("dishes")
      .populate("user")
      .then(
        (favourites) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(favourites);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .post(
    cors.cors,
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res, next) => {
      Favourites.findOne({ user: req.user._id })
        .then((favourite) => {
          if (favourite == null) {
            Favourites.create().then(
              (favourite) => {
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                for (const i in req.body) {
                  favourite.dishes.push(req.body[i]);
                }
                favourite.save();
                res.json(favourite);
              },
              (err) => next(err)
            );
          } else {
            for (const i in req.body) {
              Favourites.findOne({ user: newFavourite.user }).then(
                (oldFavourite) => {
                  if (oldFavourite == null) {
                    favorite.dishes.push(req.body[i]);
                  }
                }
              );
            }
            favourite.save();
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(favourite);
          }
        })
        .catch((err) => next(err));
    }
  )
  .put(
    cors.cors,
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res, next) => {
      res.statusCode = 403;
      res.end("PUT operation not supported on /leaders");
    }
  )
  .delete(
    cors.cors,
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res, next) => {
      Favourites.remove({})
        .then(
          (resp) => {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(resp);
          },
          (err) => next(err)
        )
        .catch((err) => next(err));
    }
  );

favouriteRouter
  .route("/:favouriteId")
  .options(cors.corsWithOptions, (req, res) => {
    res.sendStatus(200);
  })
  .get(cors.cors, authenticate.verifyUser, (req, res, next) => {
    Favourites.findById(req.params.favouriteId)
      .then(
        (favourite) => {
          if (!favourite.user.equals(req.user._id)) {
            var err = new Error("Only creator can perform this");
            err.status = 401;
            return next(err);
          }
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(favorite);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .post(
    cors.cors,
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res, next) => {
      Favourites.findById(req.body._id).then((favourite) => {
        if (favourite == null) {
          let newFavourite = {};
          newFavorite.user = req.user._id;
          Favourites.create(newFavourite)
            .then(
              (favourite) => {
                console.log("Favorite Created ", newFavourite);
                favourite.dishes.push(req.params.favouriteId);
                favourite.save().then(
                  (favourite) => {
                    Dishes.findById(favourite._id).then((favourite) => {
                      res.statusCode = 200;
                      res.setHeader("Content-Type", "application/json");
                      res.json(favourite);
                    });
                  },
                  (err) => next(err)
                );
              },
              (err) => next(err)
            )
            .catch((err) => next(err));
        } else {
          err = new Error("Dish " + req.params.dishId + " already exist");
          err.status = 404;
          return next(err);
        }
      });
    }
  )
  .put(
    cors.cors,
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res, next) => {
      Favourites.findByIdAndUpdate(
        req.params.favouriteId,
        {
          $set: req.body,
        },
        { new: true }
      )
        .then(
          (leader) => {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(leader);
          },
          (err) => next(err)
        )
        .catch((err) => next(err));
    }
  )
  .delete(
    cors.cors,
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res, next) => {
      Favourites.findOne({ user: req.user._id })
        .then((favourite) => {
          favourite.dishes.remove(req.params.favouriteId);
          favourite.save().then(
            (dish) => {
              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json");
              res.json(favourite);
            },
            (err) => next(err)
          );
        })
        .catch((err) => next(err));
    }
  );

module.exports = favouriteRouter;
