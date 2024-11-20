COMPOSE_FILE:=./docker-compose.yml
ENV_VAR:=0

all: banner build

build:
	@echo "Building the project"
	@if [ ! -f .env ]; then \
        echo -n "Enter the decryption password: "; \
        stty -echo && read PASSWORD && stty echo; \
        echo $$PASSWORD | openssl enc -aes-256-cbc -d -pbkdf2 -in encrypt.env.enc -out .env || (echo "Decryption failed. Exiting."; exit 1); \
    fi
	@docker compose -f ${COMPOSE_FILE} up --build --remove-orphans

up:
	@echo "Starting the project"
	-docker compose -f ${COMPOSE_FILE} up -d

down:
	@echo "Stopping the project"
	@if [ $(ENV_VAR) -eq 1 ]; then \
        echo "Removing the .env file"; \
        rm -f .env; \
    fi
	-docker compose -f ${COMPOSE_FILE} down -v

stop:
	@echo "Down the project"
	-docker compose -f ${COMPOSE_FILE} stop


reset: down
	-docker volume rm $(docker volume ls -q)
	-docker container prune -f
	-docker rmi $$(docker images -a -q)
	-docker volume prune -f
	-docker image prune -f -a
	-docker network prune -f
	-docker builder prune --all

hard-reset: reset
	-docker system prune --all --volumes -f

re: reset all

subject:
	@xdg-open https://cdn.intra.42.fr/pdf/pdf/133398/en.subject.pdf </dev/null >/dev/null 2>&1

banner:
	@clear
	@echo "\033[1;32m _____                                        _                     \033[0m"
	@echo "\033[1;32m/__   \\_ __ __ _ _ __  ___  ___ ___ _ __   __| | ___ _ __   ___ ___ \033[0m"
	@echo "\033[1;32m  / /\\/ '__/ _\` | '_ \\/ __|/ __/ _ \\ '_ \\ / _\` |/ _ \\ '_ \\ / __/ _ \\ \033[0m"
	@echo "\033[1;32m / /  | | | (_| | | | \\__ \\ (_|  __/ | | | (_| |  __/ | | | (_|  __/ \033[0m"
	@echo "\033[1;32m \\/   |_|  \\__,_|_| |_|___/\\___\\___|_| |_|\\__,_|\\___|_| |_|\\___\\___| \033[0m"
	@echo "\033[1;32m                                                                     \033[0m"

.PHONY: all build up down stop reset hard-reset rebuild subject banner

