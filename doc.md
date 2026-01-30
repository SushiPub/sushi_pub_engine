- package.json
    main: When someone require()s this package, start here.
    type:for developer intelliSense.
- tsconfig.json
declaration: generates .d.ts to allow other packages to see this package




- Run Postgres:
docker compose up -d
docker ps
#reset volume
docker compose down -v
docker compose up -d


Databases are created by infrastructure
Schemas are created by migrations
Data is created by tests / app logic


-knex migrations
npx knex migrate:make 002_harden_articles