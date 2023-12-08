


var fs = require('fs'); 
import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();
var users = []



async function seedUsers(users){

  for (let i = 0; i < users.length ; i++)
  {
    await prisma.$executeRaw`insert into public.user(user42, nickname) values(${users[i].user42},${users[i].nickname} )`
  }
  const res = await prisma.$executeRaw`select * from public.user`
  console.log(res);
}

const getdata = () =>
{
  fs.createReadStream('./prisma/seed/csv/users.csv', 'utf-8')
  .on('data',function(csvrow) {
    csvrow.split('\n').forEach(element => {
      class obj  {
        constructor (user42 , nickname){
          this.user42 = user42;
          this.nickname = nickname;
        }
        user42 ;
        nickname ;
      }
      const [user42,nickname] = element.split(',')
      users.push(new obj(user42,nickname))
    });
  }).on('end', () => seedUsers(users))
  
}

( async() => {
    await prisma.$connect();
    await getdata();
    await prisma.$disconnect();
})()