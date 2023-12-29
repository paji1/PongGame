#! /bin/bash

# these because of forein keys requirments these scripts sould be run in this order 


# read -r -p "run prisma migrate and generate? : y|n ? "  var
# if [[ "$var" = "y"  ||  "$var" = "Y" ]]
# then 
# fi



# read -r -p "run prisma studio? : y|n ? "  studio

# if [[ "$studio" = "y"  ||  "$studio" = "Y" ]]
# then
# npx --yes prisma migrate dev
# npm install -g ts-node 
timestamp=$(date "+%Y%m%d%H%M%S")
file_name="init_$timestamp"

expect <<EOF
  spawn npx --yes prisma migrate dev --name "init"
  expect {
    "We need to reset the \"public\" schema" {
      send "yes\r"
      exp_continue
    }
    "Enter a name for the new migration:" {
      # Send a predefined migration name or capture user input dynamically
      send "my_migration_name\r"
      exp_continue
    }
    "Are you sure you want to create and apply this migration?" {
      # Send a predefined migration name or capture user input dynamically
      send "y\r"
      exp_continue
    }
    eof
  }
EOF
# npx --yes prisma db seed
# echo "seeding users ..."
npx --yes prisma db pull
kill $(ps aux | grep "node /code/node_modules/.bin/prisma studio --port 5555" | awk '$11 == "node" {print $2}') &> /dev/null
# ts-node /code/prisma/seed/scripts/userseeder.ts
# echo "seeding levels ..."
# ts-node /code/prisma/seed/scripts/levelsseeder.ts
# echo "seeding rooms ..."
# ts-node /code/prisma/seed/scripts/roomseeder.ts
# echo "seeding rooms participants ..."
# ts-node /code/prisma/seed/scripts/room_parts.ts
# echo "seeding messages ..."
# ts-node /code/prisma/seed/scripts/messageseeder.ts
# npx --yes prisma db seed
# fi
