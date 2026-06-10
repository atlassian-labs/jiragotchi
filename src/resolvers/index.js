import * as ResolverPkg from '@forge/resolver';
import { registerKvsResolvers } from './pet-kvs.js';
import { registerEntityResolvers } from './pet-entities.js';
import { registerSqlResolvers } from './pet-sql.js';

const Resolver = ResolverPkg.default ?? ResolverPkg;
const resolver = new Resolver();

registerKvsResolvers(resolver);
registerEntityResolvers(resolver);
registerSqlResolvers(resolver);

export const handler = resolver.getDefinitions();
