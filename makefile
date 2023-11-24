


ifeq ($(filter kill pause exec start restart,$(firstword $(MAKECMDGOALS))),$(firstword $(MAKECMDGOALS)))
  NAME := $(wordlist 2,$(words $(MAKECMDGOALS)),$(MAKECMDGOALS))
  $(eval $(NAME):;@:)
endif


DETACH=d detach

all: build
	docker-compose up --build

${DETACH}:
	docker-compose up  -d --build

kill:
    ifneq ($(NAME),)
		docker kill ${NAME}
    endif
	docker-compose down ${NAME}
pause:
    ifneq ($(NAME),)
		docker pause ${NAME}
    endif
	docker-compose pause ${NAME}

backend: build
	docker-compose  up backend --build
	# docker-compose  up pgadmin -d 

start: 
	docker-compose  up $(NAME) --build
restart: 
	docker-compose  restart $(NAME) 

build:
	docker-compose build

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


.PHONY: backend kill exec
.SILENT: ps kill exec
