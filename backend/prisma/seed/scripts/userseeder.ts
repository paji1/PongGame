


var fs = require('fs'); 
import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();
var users = []

const getdata = ()=>
{
  fs.createReadStream('/code/prisma/seed/csv/users.csv', 'utf-8')
      .on('data',function(csvrow) {
         csvrow.split('\n').forEach(element => {
          users.push(element)
        });
      })
      .on('end', () => seedUsers(users))

}


async function seedUsers(users){
  for (let i = 0; i < users.length ; i++)
  {
    await prisma.$executeRaw`insert into public.user(user42) values(${users[i]})`
  }
  const res = await prisma.$executeRaw`select * from public.user`
  console.log(res);
}

( async() => {
    await prisma.$connect();
    await getdata();
    await prisma.$disconnect();
})()