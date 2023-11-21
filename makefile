


ifeq (kill,$(firstword $(MAKECMDGOALS)))
  NAME := $(wordlist 2,$(words $(MAKECMDGOALS)),$(MAKECMDGOALS))
  $(eval $(NAME):;@:)
endif
ifeq (pause,$(firstword $(MAKECMDGOALS)))
  NAME := $(wordlist 2,$(words $(MAKECMDGOALS)),$(MAKECMDGOALS))
  $(eval $(NAME):;@:)
endif


DETACH=d detach

all: build
	docker-compose up 

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


build: 
	docker-compose build

rebuild: 
	docker-compose up --build

ps:
	echo  "\tcontainrs "
	echo  "**************************************"
	docker ps --format  'Name = {{.Names}}'
	echo  "**************************************"
	echo -n "count = "
	docker ps -q | wc -l


.PHONY: backend kill
.SILENT: ps kill
