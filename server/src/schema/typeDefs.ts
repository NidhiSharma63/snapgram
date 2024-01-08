//
export const typeDefs = `#graphql

  type User {
    email: String
    password: String
    username: String
    avatar: String
    bio: String
    tokens: [Token]
    _id:String
  }
  type Token {
    token: String
    uniqueBrowserId: String
  }

  # create post
  type Post {
    file: String
    userId: String
    tags: [String]
    location: [String]
    caption: [String]
    createdAt:String
    likes:[Int]
    _id:String
  }
 
  type Mutation {
    addUser(userInput:AddUserInput):User
    logoutUser(userInput:logoutUser):String
    loginUser(userInput:LoginUserInput):User
    createPost(userInput:CreatePostInput):Post
    updatePost(userInput:UpdatePostInput):Post
    deletePost(_id:String):Post
  }


  type Query {
    _empty: String
  }

  # inputs 
  # if anything get added here using ! marks then it required in payload
  input AddUserInput {
    email: String
    password: String
    username: String
    avatar: String
    bio: String
    uniqueBrowserId:String
  }

  input LoginUserInput {
    email: String
    password: String
    uniqueBrowserId:String
  }

  input logoutUser {
   userId:String
   token:String
  }

  input CreatePostInput {
    file: String
    userId: String
    tags: [String]
    location: [String]
    caption: [String]
    createdAt:String
    likes:[String]
  }

  input UpdatePostInput{
    _id: String
    tags: [String]
    caption: [String]
    location: [String]
  }
`;
