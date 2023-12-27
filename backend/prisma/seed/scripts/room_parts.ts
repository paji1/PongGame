var fs = require('fs'); 
import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();
var room_parts = []
async function seedrooms_parts(room_parts) {
  for (let i = 0; i < room_parts.length ; i++)
  {
    // console.log(room_parts[i])
    await prisma.$executeRaw`insert into public.rooms_members(roomid, userid, permission ) values(${room_parts[i].room_id}::integer, ${room_parts[i].user_id}::integer, ${room_parts[i].permission}::participation_type)`
  }
  
  const res = await prisma.$executeRaw`select * from public.rooms_members`
  console.log(res);
}


const getrooms_participants = () =>
{
  fs.createReadStream('/code/prisma/seed/csv/room_participant.csv', 'utf-8')
  .on('data',function(csvrow) {
    csvrow.split('\n').forEach(element => {
      class obj  {
        constructor (room_id , user_id, permission){
          this.room_id = room_id;
          this.user_id = user_id;
          this.permission = permission
        }
        room_id ;
        user_id;
        permission
      }
      const [room_id, user_id, permission] = element.split(',')
      room_parts.push(new obj(room_id, user_id, permission))
    });
  }).on('end', () => seedrooms_parts(room_parts))
  
}



( async() => {
  await prisma.$connect();
  await getrooms_participants();
  await prisma.$disconnect();
})()
