const config = {
  application: {
    name: process.env.DEVOPS_TEST_BACKEND_NAME || 'devops-test-backend',
    env: process.env.DEVOPS_TEST_ENV || 'development',
    port: parseInt(process.env.DEVOPS_TEST_PORT || 3081, 10),
    release_version: process.env.DEVOPS_TEST_RELEASE_VERSION || '0.1.0',
    start_time: Date.now(),
  },
  aws: {
    bucket_name: process.env.DEVOPS_TEST_BACKEND_AWS_USER_BUCKET_NAME,
    access_key:  process.env.DEVOPS_TEST_BACKEND_AWS_ACCESS_KEY,
    secret_key:  process.env.DEVOPS_TEST_BACKEND_AWS_SECRET_KEY,
    aws_prefix:  process.env.DEVOPS_TEST_BACKEND_AWS_PREFIX,
    aws_region:  process.env.DEVOPS_TEST_BACKEND_AWS_REGION,
  },
  database: {
    name: process.env.DEVOPS_TEST_DATABASE_NAME || 'devops_test',
    username: process.env.DEVOPS_TEST_DATABASE_USERNAME || 'postgres',
    password: process.env.DEVOPS_TEST_DATABASE_PASSWORD || '',
    options: {
      host: process.env.DEVOPS_TEST_DATABASE_HOST || 'devops-global-postgres',
      port: parseInt(process.env.DEVOPS_TEST_DATABASE_PORT || 5432, 10),
      dialect: 'postgres',
      define: {
        timestamps: false,
      },
      logging: false,
      pool: {
        max: parseInt(process.env.DEVOPS_TEST_DATABASE_POOL_SIZE_MAX || 3, 10),
        min: parseInt(process.env.DEVOPS_TEST_DATABASE_POOL_SIZE_MIN || 0, 10),
        idle: parseInt(process.env.DEVOPS_TEST_DATABASE_TIMEOUT || 1000, 10),
        acquire: parseInt(process.env.DEVOPS_TEST_DATABASE_TIMEOUT || 1000, 10),
      },
      retry: {
        match: ['ER_LOCK_DEADLOCK'],
        max: parseInt(process.env.DEVOPS_TEST_DATABASE_MAX_RETRIES || 3, 10),
      },
    },
  },
};

module.exports = config;
