import { ConnectionOptions } from "typeorm";

export const getConnectionConfig = (): ConnectionOptions => {
    return {
        type: "sqlite",
        database: "database.sqlite",
        synchronize: true,
        logging: false,
        entities: [
            process.env.TYPEORM_ENTITIES || 'src/entity/*.ts'
        ],
        migrations: [
            process.env.TYPEORM_MIGRATIONS || 'src/migration/*.ts'
        ],
        subscribers: [
            process.env.TYPEORM_SUBSCRIBERS || 'src/subscriber/*.ts'
        ],
        cli: {
            "entitiesDir": "src/entity",
            "migrationsDir": "src/migration",
            "subscribersDir": "src/subscriber"
        }
    };
}

// export default databaseConfig;
// {
//    "type": "sqlite",
//    "database": "database.sqlite",
//    "synchronize": true,
//    "logging": false,
//    "entities": [
//       "build/entity/*.js"
//    ],
//    "migrations": [
//       "build/migration/*.js"
//    ],
//    "subscribers": [
//       "build/subscriber/*.js"
//    ],
//    "cli": {
//       "entitiesDir": "src/entity",
//       "migrationsDir": "src/migration",
//       "subscribersDir": "src/subscriber"
//    }
// }
