var fs = require('fs'); 
import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();
var levels = []

const getdata = ()=>
{
  fs.createReadStream('/code/prisma/seed/csv/levels.csv', 'utf-8')
      .on('data',function(csvrow) {
         csvrow.split('\n').forEach(element => {
            levels.push(element)
        });
      })
      .on('end', () => seedUsers(levels))

}


async function seedUsers(levels){
  // console.log(levels.length + '\n', levels)
  for (let i = 0; i < levels.length ; i++)
  {
    await prisma.$executeRaw`insert into public.level(condition) values(${levels[i]}::integer)`
  }
  const res = await prisma.$executeRaw`select * from public.level`
  console.log(res);
}

( async() => {
    await prisma.$connect();
    await getdata();
    await prisma.$disconnect();
})()