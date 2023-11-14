
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
 content:string,
 userId:string,
 tags:string[],
 caption:string[],
 location:string[]
}