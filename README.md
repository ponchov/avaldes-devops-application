# devops-test-app

A basic NodeJs backend application created for the devops test.

### General description

The application consist in two general endpoints, these are `GET /users` and `GET /files`. The first endpoint retrieves all the registers of users stored in a postgreSQL database, and the second one list all the files that are stored in a S3 bucket. The rest of the endpoint are for ensuring application health and rediness

### Endpoint list

| HTTP method | Endpoint |
| ---- | --------------- |
| GET | /users |
| GET | /files |
| GET | /version |
| GET | /health |
| GET | /ready |

### Endpoints description

* `GET /users`

This endpoint returns a fixed number of users (2) registered in the postgres database with the following structure:

```json
{
"meta": {
	"count" : 2
},

"data": [
	{
		"id": 1,
		"username": "Fake User 1",
		"email": "foo@email.com",
		"created_at": "2018-10-17T15:46:08.0003Z",
		"updated_at": "2018-10-17T15:46:08.0003Z",
		},
	{
		"id": 2,
		"username": "Fake User 2",
		"email": "bar@email.com",
		"created_at": "2018-10-17T15:46:08.0003Z",
		"updated_at": "2018-10-17T15:46:08.0003Z",
		}
	]
}
```

* `GET /files`

This endpoint returns the total number of items and the name of the files (2) stored in a s3 bucket with the following structure:

```json
{
"meta": {
	"count" : 1
},

"data": {
		"number_of_items": 2,
		"filenames": ["foo.txt", "bar.txt"]
	}
}
```

* `GET /version`

This endpoint returns the actual version of the software running and it's uptime in seconds

```json
{
"meta": {
	"count": 0
},

"data": {
	"uptime": 82467,
	"version": "0.1.1"
	}
}
```

* `GET /health`

This endpoint returns the uptime of the application in seconds

```json
{
"meta": {
	"count": 0
},

"data": {
	"uptime": 82467,
	}
}
```

* `GET /ready`

This endpoint returns the current service uptime and dependencies readiness

```json
{
"meta": {
	"count": 0
},

"data": {
	"uptime": 82669,
	"service": "ok",
	"postgres": "ok"
	}
}
```

### Requirements

You will need the following tools to operate over `devops-test-app`:

- `nodejs` = 8.11
- `postgres` >= 9.4

### Local development/deployment

To run this application locally, please execute the following commands in your terminal:

- Change to `devops-test-app` root directory

```bash
$ cd devops-test-app
```

- Install the nodejs dependencies

```bash
$ npm install
```

- Create a postgres database for the application

```bash
postgres=# CREATE DATABASE testdb;

```

- Run migrations and seeders

```bash
$ npm run migrate-up
```

- Run the application

```bash
$ npm run start
```

### Unit testing

To run applications tests, please execute the following commands in your terminal:

- Change to `devops-test-app` root directory

```bash
$ cd devops-test-app
```

- run unit tests

```bash
$ npm run test
```

### Available configuration variables

| Name | Description | Default Value | Required |
| ---- | ----------- | ------------- | -------- |
| **Application** | | | |
| DEVOPS_TEST_BACKEND_RELEASE_VERSION | The current release of the application | - | no |
| DEVOPS_TEST_BACKEND_NAME | The name of the application | devops-test-backend | no |
| DEVOPS_TEST_ENV | The environment the application is running in | development | no |
| DEVOPS_TEST_PORT | The port that the application accepts requests on | 3091 | no |
| **Database** | | | |
| DEVOPS_TEST_DATABASE_NAME | The name of the application's database | postgres | no |
| DEVOPS_TEST_DATABASE_USERNAME | The username for the application's database | postgres | no |
| DEVOPS_TEST_DATABASE_PASSWORD | The password for the application's database | none | no |
| DEVOPS_TEST_DATABASE_HOST | The hostname for the application's database | devops_test | no |
| DEVOPS_TEST_DATABASE_PORT | The port for the application's database | 5432 | no |
| DEVOPS_TEST_DATABASE_POOL_SIZE_MAX | The maximum size of the connection pool to use with the application's database | 3 | no |
| DEVOPS_TEST_DATABASE_POOL_SIZE_MIN | The minimum size of the connection pool to use with the application's database | 0 | no |
| DEVOPS_TEST_DATABASE_TIMEOUT | The amount of time (in milliseconds) to wait for the application's database before timing out | 1000 | no |
| DEVOPS_TEST_DATABASE_POOL_SIZE_MIN | The amount of times to retry connections to the application's database before erroring out | 3 | no |
| **External cloud services** | | | |
| DEVOPS_TEST_BACKEND_AWS_USER_BUCKET_NAME | The name of the bucket used for storing files | devops-test-dev-bucket | no |
| DEVOPS_TEST_BACKEND_AWS_ACCESS_KEY | The aws api access key used for devops-test | - | yes |
| DEVOPS_TEST_BACKEND_AWS_SECRET_KEY | The aws api secret key used for devops-test | - | yes |
| DEVOPS_TEST_BACKEND_AWS_PREFIX | The s3 prefix where files are stored | files | no |
| DEVOPS_TEST_BACKEND_AWS_REGION | The aws region where | us-east-1 | yes |
