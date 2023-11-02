var fs = require('fs'); 
import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();
var room_parts = []




async function seedrooms_parts(room_parts) {
  console.log(room_parts)
  for (let i = 0; i < room_parts.length ; i++)
  {
    await prisma.$executeRaw`insert into public.room_particiants(room_id, user_id ) values(${room_parts[i].room_id}::integer, ${room_parts[i].user_id}::integer)`
  }
  
  const res = await prisma.$executeRaw`select * from public.room_particiants`
  console.log(res);}

const getrooms_participants = () =>
{
  fs.createReadStream('/code/prisma/seed/room_participant.csv', 'utf-8')
  .on('data',function(csvrow) {
    csvrow.split('\n').forEach(element => {
      class obj  {
        constructor (room_id , user_id){
          this.room_id = room_id;
          this.user_id = user_id;
        }
        room_id ;
        user_id
      }
      const [title, type] = element.split(',')
      room_parts.push(new obj(title, type))
    });
  }).on('end', () => seedrooms_parts(room_parts))
  
}



( async() => {
  await prisma.$connect();
  await getrooms_participants()
  await prisma.$disconnect();
})();
