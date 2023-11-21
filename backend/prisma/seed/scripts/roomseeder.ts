var fs = require('fs'); 
import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();
var rooms = []

async function seedrooms(rooms) {
  for (let i = 0; i < rooms.length ; i++)
  {
    // console.log(rooms[i])
    await prisma.$executeRaw`insert into public.rooms(name, roompassword , roomtypeof) values(${rooms[i].title},${rooms[i].password}, ${rooms[i].type}::permission)`
  }
  
  const res = await prisma.$executeRaw`select * from public.rooms`
  console.log(res);
}

const getrooms = () =>
{
  fs.createReadStream('/code/prisma/seed/csv/rooms.csv', 'utf-8')
  .on('data',function(csvrow) {
    csvrow.split('\n').forEach(element => {
      class obj  {
        constructor (title , password, type){
          this.title = title;
          this.type = type;
          this.password = password
        }
        title ;
        password ;
        type
      }
      const [title,password,type] = element.split(',')
      rooms.push(new obj(title,password,type))
    });
  }).on('end', () => seedrooms(rooms))
  
}
( async() => {
    await prisma.$connect();
    await getrooms();
    await prisma.$disconnect();
})()