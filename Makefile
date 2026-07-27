.PHONY: start dev test lint format seed db

start:
	npm start

dev:
	npm run dev

test:
	npm test

lint:
	npm run lint

format:
	npm run format

seed:
	npm run db:seed

db:
	docker-compose up -d
