

PAUSE=pause unpause
DETACH=d detach
.DEFAULT_GOAL := all

ifeq ($(filter kill ${PAUSE} test exec start restart,$(firstword $(MAKECMDGOALS))),$(firstword $(MAKECMDGOALS)))
  NAME := $(wordlist 2,$(words $(MAKECMDGOALS)),$(MAKECMDGOALS))
  $(eval $(NAME):;@:)
endif



all: build
	docker-compose up --build

${DETACH}:
	docker-compose up  -d --build

kill:
    ifneq ($(NAME),)
		docker kill ${NAME}
    endif
	docker-compose down ${NAME}

${PAUSE}:
    ifneq ($(NAME),)
		docker $@ ${NAME}
    endif
	docker-compose $@ ${NAME}


backend: build
	docker-compose  up backend --build
	docker-compose  up pgadmin 

start: 
	docker-compose  up $(NAME) --build
restart: 
	docker-compose  restart $(NAME) 

build:
	docker-compose build

prisma:
	npx --yes prisma generate
	docker-compose exec backend bash /code/prisma/seed/seed.sh

nocache:
	docker-compose build --no-cache
	make all
	

exec:
    ifneq ($(NAME),)
		docker exec -it ${NAME} bash
    endif

rebuild: 
	docker-compose up --build

ps:
	echo  "\tcontainrs "
	echo  "**************************************"
	docker ps --format  'Name = {{.Names}}'
	echo  "**************************************"
	echo -n "count = "
	docker ps -q | wc -l


.PHONY: backend kill exec prisma
.SILENT: ps kill exec
