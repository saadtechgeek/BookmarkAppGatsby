const { ApolloServer, gql } = require('apollo-server-lambda')
const faunadb = require('faunadb'),
  q = faunadb.query;

const typeDefs = gql`
  type Query {
    bookmarks: [Bookmark]
  }
  type Bookmark {
    id: ID!
    title: String!
    url: String!
  }
  type Mutation {
    addBookmark(title: String!, 
      url: String!) : Bookmark
  }
`

const resolvers = {
  Query: {
    bookmarks: async(root,args,context) => {
      try{
        var adminClient = new faunadb.Client({ secret: 'fnAD_-wxDGACBT883NW5NX3nKoF0ue1O0FQSZjti' });
        const result = await adminClient.query(
          q.Map(
            q.Paginate(q.Match(q.Index('url'))),
            q.Lambda(x=> q.Get(x))
          )
        )
        console.log(result.data);
      }catch(err){
        console.log(err);
      }
      
      return [{id:1,title:'temp Title',url:'temp.com'}]
    }
  },
  Mutation: {
    addBookmark: async (_, { title, url }) => {
      console.log(title,url);
      var adminClient = new faunadb.Client({ secret: 'fnAD_-wxDGACBT883NW5NX3nKoF0ue1O0FQSZjti' });

      console.log(title,url)
      // const result = await adminClient.query(
      //   q.Create(
      //     q.Collection('vCards'),
      //     {
      //       data: {
      //         c1, c2, c3, rec, msg, sender,
      //         link: shortid.generate()
      //       }
      //     },
      //   )
      // )
      return {id:1,title,url}
    }
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

exports.handler = server.createHandler()
