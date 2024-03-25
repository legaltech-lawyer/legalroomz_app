import { ConvexError, v } from 'convex/values'
import { MutationCtx, QueryCtx, mutation, query } from './_generated/server'
import { getUser } from './users'

//Mutation: Endpoint that you can call from Frontend a do some action such as store an entry on convex database
//Action: Contact a third party library or service

async function hasAccessToOrg(
  ctx: QueryCtx | MutationCtx,
  tokenIdentifier: string,
  orgId: string
) {
  //Check if user has access to the org
  const user = await getUser(ctx, tokenIdentifier)

  const hasAccess =
    user.orgIds.includes(orgId) || user.tokenIdentifier.includes(orgId)

  return hasAccess
}

export const createFile = mutation({
  args: {
    name: v.string(),
    orgId: v.string(),
  },
  async handler(ctx, args) {
    //User Authenticated?
    const identity = await ctx.auth.getUserIdentity()

    console.log('identity', identity)

    if (!identity) {
      throw new ConvexError('User not authenticated')
    }
    //Do something

    const hasAccess = await hasAccessToOrg(
      ctx,
      identity.tokenIdentifier,
      args.orgId
    )

    if (!hasAccess) {
      throw new ConvexError('User not authorized to this Org')
    }

    await ctx.db.insert('files', {
      name: args.name,
      orgId: args.orgId,
    })
  },
})

//Query: Fetch data from convex database

export const getFiles = query({
  args: {
    orgId: v.string(),
  },
  async handler(ctx, args) {
    //User Authenticated?
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) {
      return []
    }

    const hasAccess = await hasAccessToOrg(
      ctx,
      identity.tokenIdentifier,
      args.orgId
    )

    if (!hasAccess) {
      return []
    }

    //Do something
    return ctx.db
      .query('files')
      .withIndex('by_orgId', (q) => q.eq('orgId', args.orgId))
      .collect()
  },
})
