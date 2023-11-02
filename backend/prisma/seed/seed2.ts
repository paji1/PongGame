var fs = require('fs'); 
import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();
var rooms = []

async function seedrooms(rooms) {
  for (let i = 0; i < rooms.length ; i++)
  {
    await prisma.$executeRaw`insert into public.rooms(title, room_type ) values(${rooms[i].title}, ${rooms[i].type}::roomtype)`
  }
  
  const res = await prisma.$executeRaw`select * from public.rooms`
  console.log(res);
}

const getrooms = () =>
{
  fs.createReadStream('/code/prisma/seed/rooms.csv', 'utf-8')
  .on('data',function(csvrow) {
    csvrow.split('\n').forEach(element => {
      class obj  {
        constructor (title , type){
          this.title = title;
          this.type = type;
        }
        title ;
        type
      }
      const [title, type] = element.split(',')
      rooms.push(new obj(title, type))
    });
  }).on('end', () => seedrooms(rooms))
  
}
( async() => {
    await prisma.$connect();
    await getrooms();
    await prisma.$disconnect();
})()