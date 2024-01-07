//
export const typeDefs = `#graphql

  type User {
    email: String
    password: String
    username: String
    avatar: String
    bio: String
    tokens: [Token]
  }
  type Token {
    token: String
    uniqueBrowserId: String
  }
 
  type Mutation {
    addUser(userInput:AddUserInput):User
  }

  type Query {
    _empty: String
  }

  # if anything get added here using ! marks then it required in payload
  input AddUserInput{
    email: String
    password: String
    username: String
    avatar: String
    bio: String
    uniqueBrowserId:String
  }
`;
