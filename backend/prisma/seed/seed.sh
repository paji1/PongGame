! /bin/bash

# these because of forein keys requirments these scripts sould be run in this order 


read -r -p "run prisma migrate and generate? : y|n ? "  var
if [[ "$var" = "y"  ||  "$var" = "Y" ]]
then 
    npx prisma migrate dev --name init --schema='/code/prisma/schema.prisma'
    npx prisma generate --schema='/code/prisma/schema.prisma'
fi

echo "seeding users ..."echo "seeding users ..."
/code/node_modules/.bin/ts-node /code/prisma/seed/scripts/friends_seeder.ts
/code/node_modules/.bin/ts-node /code/prisma/seed/scripts/userseeder.ts
echo "seeding levels ..."
/code/node_modules/.bin/ts-node /code/prisma/seed/scripts/levelsseeder.ts
echo "seeding rooms ..."
/code/node_modules/.bin/ts-node /code/prisma/seed/scripts/roomseeder.ts
echo "seeding rooms participants ..."
/code/node_modules/.bin/ts-node /code/prisma/seed/scripts/room_parts.ts
echo "seeding messages ..."
/code/node_modules/.bin/ts-node /code/prisma/seed/scripts/messageseeder.ts




read -r -p "run prisma studio? : y|n ? "  studio

if [[ "$studio" = "y"  ||  "$studio" = "Y" ]]
then
    npx prisma studio --schema='/code/prisma/schema.prisma' 
fi