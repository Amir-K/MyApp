import { ApolloServer } from 'apollo-server';
import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLFloat,
} from 'graphql';
import express from 'express';
import fetch from 'node-fetch';
import { IPerson } from './interfaces/IPerson';
import { IFacility } from './interfaces/IFacility';
import { IExposure } from './interfaces/IExposure';

function personResolver(id: number): Promise<IPerson> {
  return fetch(`http://localhost:4001/person/${id}`, {
    method: 'GET',
    headers: {
      Accept: 'json',
    },
  }).then((response) => response.json());
}

function facilityResolver(id: number): Promise<IFacility> {
  return fetch(`http://localhost:4001/facility/${id}`, {
    method: 'GET',
    headers: {
      Accept: 'json',
    },
  }).then((response) => response.json());
}

function exposureResolver(id: number): Promise<IExposure> {
  return fetch(`http://localhost:4001/exposure/${id}`, {
    method: 'GET',
    headers: {
      Accept: 'json',
    },
  }).then((response) => response.json());
}

const exposureType = new GraphQLObjectType<IExposure>({
  name: 'Exposure',
  fields: {
    val5: { type: GraphQLFloat },
  },
});

const facilityType = new GraphQLObjectType<IFacility>({
  name: 'Facility',
  fields: {
    val3: { type: GraphQLFloat },
    val4: { type: GraphQLFloat },
  },
});

const personType = new GraphQLObjectType<IPerson>({
  name: 'Person',
  fields: {
    val1: { type: GraphQLFloat },
    val2: { type: GraphQLFloat },
    facility: {
      type: facilityType,
      resolve: ({ val1 }, _args, _context) => facilityResolver(val1),
    },
    exposure: {
      type: exposureType,
      resolve: ({ val2 }, _args, _context) => exposureResolver(val2),
    },
  },
});

const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Queries',
    fields: {
      person: {
        type: personType,
        resolve: (_source, args: { input: number }, _context) =>
          personResolver(args.input),
        args: {
          input: { type: new GraphQLNonNull(GraphQLFloat) },
        },
      },
    },
  }),
});

const server = new ApolloServer({
  schema,
});

server.listen().then(({ url }) => {
  console.log(`🚀 Apollo GraphQL server ready at ${url}`);
});

const expressApp = express();

expressApp.get('/person/:input', ({ params }, res) => {
  res.json({ val1: 1, val2: params.input });
});

expressApp.get('/facility/:input', ({ params }, res) =>
  res.json({ val3: params.input + 3, val4: 4 })
);
expressApp.get('/exposure/:input', ({ params }, res) =>
  res.json({ val5: params.input + 5 })
);

expressApp.listen(4001, () =>
  console.log('Express server ready at http://localhost:4001')
);
