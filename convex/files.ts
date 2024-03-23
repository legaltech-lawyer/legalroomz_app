import { ConvexError, v } from 'convex/values'
import { mutation, query } from './_generated/server'

//Mutation: Endpoint that you can call from Frontend a do some action such as store an entry on convex database
//Action: Contact a third party library or service

export const createFile = mutation({
  args: {
    name: v.string(),
  },
  async handler(ctx, args) {
    //User Authenticated?
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) {
      throw new ConvexError('User not authenticated')
    }

    //Do something
    await ctx.db.insert('files', {
      name: args.name,
    })
  },
})

//Query: Fetch data from convex database

export const getFiles = query({
  async handler(ctx) {
    //User Authenticated?
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) {
      throw new ConvexError('User not authenticated')
    }
    //Do something
    return ctx.db.query('files').collect()
  },
})
