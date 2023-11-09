var fs = require('fs'); 
import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();
var messages = []

async function seedmessages(messages) {
  for (let i = 0; i < messages.length ; i++)
  {
    await console.log(messages[i])
    await prisma.$executeRaw`insert into public.messages(room_id, user_id, message) values(${messages[i].room_id}::integer, ${messages[i].user_id}::integer, ${messages[i].message})`
  }
  
  const res = await prisma.$executeRaw`select * from public.messages`

  console.log(res);
}

const getmessages = () =>
{
  fs.createReadStream('/code/prisma/seed/csv/messages.csv', 'utf-8')
  .on('data',function(csvrow) {
    csvrow.split('\n').forEach(element => {
      class obj  {
        constructor (room_id , user_id, message){
          this.room_id = room_id;
          this.user_id = user_id;
          this.message = message;
        }
        room_id ;
        user_id;
        message;
      }
      const [room_id, user_id, message] = element.split(',')
      messages.push(new obj(room_id, user_id, message))
    });
  }).on('end', () => seedmessages(messages))
  
}
( async() => {
    await prisma.$connect();
    await getmessages();
    await prisma.$disconnect();
})()