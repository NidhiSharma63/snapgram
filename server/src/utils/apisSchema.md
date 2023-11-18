
User api register
{
  "email": "test@gmail.com",
  "password": "",
  "avatar": "",
  "bio": "",
  "username": ""
}

User login
{
  "email":"",
  "password":""
}

User logout
{
  userId:id,
  token:""
}

Create post
{
 file:File,
 userId:string,
 tags:string[],
 caption:string[],
 location:string[]
}

Update post
{
 content:string,
 userId:string,
 tags:string[],
 caption:string[],
 location:string[],
 _id:postId
}


Delete post
{
 _id:postId
}