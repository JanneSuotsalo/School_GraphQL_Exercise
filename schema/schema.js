const {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLList,
  GraphQLNonNull,
  GraphQLSchema,
  GraphQLBoolean,
  GraphQLFloat,
  GraphQLInt,
  GraphQLInputObjectType,
} = require("graphql");

const connection = require("../models/connection");
const connectionTypeId = require("../models/connectionType");
const currentType = require("../models/currentType");
const level = require("../models/level");
const station = require("../models/station");

const stationType = new GraphQLObjectType({
  name: "station",
  description: "Info about station",
  fields: () => ({
    id: { type: GraphQLID },
    Title: { type: GraphQLString },
    AddressLine1: { type: GraphQLString },
    Town: { type: GraphQLString },
    StateOrProvince: { type: GraphQLString },
    Postcode: { type: GraphQLString },

    Connections: {
      type: connectionType,
      resolve: async (parent, args) => {
        try {
          return await connection.findById(parent.Connections);
        } catch (e) {
          return new Error(e.message);
        }
      },
    },

    Location: {
      type: new GraphQLObjectType({
        name: "loc",
        fields: () => ({
          type: { type: GraphQLString },
          coordinates: { type: GraphQLList(GraphQLString) },
        }),
      }),
    },
  }),
});

const connectionType = new GraphQLObjectType({
  name: "connections",
  description: "Connections of stations",
  fields: () => ({
    Quantity: { type: GraphQLString },

    ConnectionTypeID: {
      type: typeOfConnection,
      resolve: async (parent, args) => {
        try {
          return await connectionTypeId.findById(parent.ConnectionTypeID);
        } catch (e) {
          return new Error(e.message);
        }
      },
    },

    CurrentTypeID: {
      type: typeOfCurrent,
      resolve: async (parent, args) => {
        try {
          return await currentType.findById(parent.CurrentTypeID);
        } catch (e) {
          return new Error(e.message);
        }
      },
    },

    LevelID: {
      type: typeOfLevel,
      resolve: async (parent, args) => {
        try {
          return await level.findById(parent.LevelID);
        } catch (e) {
          return new Error(e.message);
        }
      },
    },
  }),
});

const typeOfConnection = new GraphQLObjectType({
  name: "connectionType",
  description: "Describes what type of connection",
  fields: () => ({
    id: { type: GraphQLID },
    FormalName: { type: GraphQLString },
    Title: { type: GraphQLString },
  }),
});

const typeOfCurrent = new GraphQLObjectType({
  name: "currentType",
  description: "Describes the current type",
  fields: () => ({
    id: { type: GraphQLID },
    Description: { type: GraphQLString },
    Title: { type: GraphQLString },
  }),
});

const typeOfLevel = new GraphQLObjectType({
  name: "level",
  description: "Describes the connection level",
  fields: () => ({
    id: { type: GraphQLID },
    Comments: { type: GraphQLString },
    IsFastChargeCapable: { type: GraphQLString },
    Title: { type: GraphQLString },
  }),
});

// Used to help adding connections when adding stations
const connectionInputType = new GraphQLInputObjectType({
  name: "connectionsinput",
  description: "defines connection ID inputs",
  fields: () => ({
    ConnectionTypeID: {
      type: GraphQLID,
    },
    LevelID: {
      type: GraphQLID,
    },
    CurrentTypeID: {
      type: GraphQLID,
    },
    Quantity: { type: GraphQLInt },
  }),
});

// Used in "addStation" to make everything look more clear
const stationInputType = new GraphQLInputObjectType({
  name: "stationInput",
  description: "Input for adding a station",
  fields: () => ({
    Connections: { type: GraphQLID },

    Postcode: { type: GraphQLString },
    Title: { type: GraphQLString },
    AddressLine1: { type: GraphQLString },
    StateOrProvince: { type: GraphQLString },
    Town: { type: GraphQLString },

    Location: {
      type: new GraphQLInputObjectType({
        name: "location",
        fields: () => ({
          type: { type: GraphQLString },
          coordinates: {
            type: new GraphQLList(GraphQLString), //first is longitude, second latitude
          },
        }),
      }),
    },
  }),
});

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  description: "Main query",
  fields: {
    stations: {
      type: new GraphQLList(stationType),
      description: "Get all stations",
      args: {
        limit: { type: GraphQLInt },
        start: { type: GraphQLInt },
        bounds: { type: GraphQLString },
      },
      resolve: async (parent, args) => {
        console.log(args.bounds);
        try {
          let southWest;
          let northEast;

          if (args.limit == undefined) {
            args.limit = 10;
          }

          if (args.bounds != undefined) {
            let bounds = JSON.parse(args.bounds);
            southWest = bounds._southWest;
            console.log("test" + southWest);
            northEast = bounds._northEast;

            return await station
              .find()
              .where("Location")
              .within({
                box: [
                  [southWest.lng, southWest.lat],
                  [northEast.lng, northEast.lat],
                ],
              });
          } else {
            return await station
              .find()
              .limit(Number.parseInt(args.limit))
              .skip(Number.parseInt(args.start));
          }
        } catch (e) {
          return new Error(e.message);
        }
      },
    },

    station: {
      type: stationType,
      description: "Get station by id",
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve: async (parent, args) => {
        try {
          return await station.findById(args.id);
        } catch (e) {
          return new Error(e.message);
        }
      },
    },

    connectiontypes: {
      type: new GraphQLNonNull(GraphQLList(typeOfConnection)),
      description: "Get all connection types",
      resolve: async (parent, args) => {
        try {
          return await connectionTypeId.find();
        } catch (e) {
          return new Error(e.message);
        }
      },
    },

    currenttypes: {
      type: new GraphQLNonNull(GraphQLList(typeOfCurrent)),
      description: "Get all current types",
      resolve: async (parent, args) => {
        try {
          return await currentType.find();
        } catch (e) {
          return new Error(e.message);
        }
      },
    },

    leveltypes: {
      type: new GraphQLNonNull(GraphQLList(typeOfLevel)),
      description: "Get all levels",
      resolve: async (parent, args) => {
        try {
          return await level.find();
        } catch (e) {
          return new Error(e.message);
        }
      },
    },
  },
});

const Mutation = new GraphQLObjectType({
  name: "MutationType",
  description: "Mutations...",
  fields: {
    addStation: {
      type: stationType,
      description: "Add station",
      args: {
        input: { type: stationInputType },
      },
      resolve: async (parent, args) => {
        try {
          const newStation = new station(args.input);
          return await newStation.save();
        } catch (e) {
          return new Error(e.message);
        }
      },
    },

    modifyStation: {
      type: stationType,
      description: "Modify station by ID",
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
        input: { type: stationInputType },
      },
      resolve: async (parent, args) => {
        try {
          return await station.findByIdAndUpdate(args.id, args.input, {
            new: true,
          });
        } catch (e) {
          return new Error(e.message);
        }
      },
    },

    deleteStation: {
      type: stationType,
      description: "Delete a station by ID",
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve: async (parent, args) => {
        try {
          return await station.findOneAndDelete(args.id);
        } catch (e) {
          return new Error(e.message);
        }
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});
