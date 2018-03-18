#!/bin/bash
function run_development {
	docker-compose -f docker-compose-files/docker-compose.yml \
	-f docker-compose-files/docker-compose.development.yml $@
}

run_development ${@}