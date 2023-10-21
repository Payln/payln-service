DB_URL=postgres://root:fde24e52415e@localhost:5434/payln?sslmode=disable

migration_file:
	migrate create -ext sql -dir lib/db/migrations -seq $(file_name)

postgres:
	docker run --name postgres_dbs -p 5434:5432 -e POSTGRES_USER=root -e POSTGRES_PASSWORD=fde24e52415e -d postgres:15.2-alpine

createdb:
	docker exec -it postgres_dbs createdb --username=root --owner=root payln

dropdb:
	docker exec -it postgres_dbs dropdb payln

migrateup:
	migrate -path lib/db/migrations -database "$(DB_URL)" -verbose up

migrateup1:
	migrate -path lib/db/migrations -database "$(DB_URL)" -verbose up 1

migratedown:
	migrate -path lib/db/migrations -database "$(DB_URL)" -verbose down

migratedown1:
	migrate -path lib/db/migrations -database "$(DB_URL)" -verbose down 1

.PHONY: migration_file postgres createdb dropdb migrateup migratedown migrateup1 migratedown1