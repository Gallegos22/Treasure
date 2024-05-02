/* eslint-disable @typescript-eslint/no-unused-vars -- Remove when used */
import 'dotenv/config';
import express from 'express';
import pg from 'pg';
import {
  ClientError,
  defaultMiddleware,
  errorMiddleware,
} from './lib/index.js';
import { add } from 'husky';

type Customer = {
  customerId: number;
  name: string;
  address: string;
  email: string;
  phoneNumber: string;
};

type Job = {
  customerId: number;
  jobDetails: string;
  quantity: string;
  perCost: string;
  dateOfJob: string;
};

const connectionString =
  process.env.DATABASE_URL ||
  `postgresql://${process.env.RDS_USERNAME}:${process.env.RDS_PASSWORD}@${process.env.RDS_HOSTNAME}:${process.env.RDS_PORT}/${process.env.RDS_DB_NAME}`;
const db = new pg.Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false,
  },
});

const app = express();
app.use(express.json());

// Create paths for static directories
const reactStaticDir = new URL('../client/dist', import.meta.url).pathname;
const uploadsStaticDir = new URL('public', import.meta.url).pathname;

app.use(express.static(reactStaticDir));
// Static directory for file uploads server/public/
app.use(express.static(uploadsStaticDir));
app.use(express.json());

app.get('/api/customers', async (req, res, next) => {
  // hit this emdponit for all customers , use this to populate select component
  try {
    const sql = `
      select *
        from "customers"
        order by "customerId";
    `;
    const result = await db.query<Customer>(sql);
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
});

app.get('/api/customers/:customerId', async (req, res, next) => {
  try {
    const { customerId } = req.params;
    if (!Number.isInteger(+customerId)) {
      throw new ClientError(400, `Non-integer actorId: ${customerId}`);
    }
    const sql = `
      select * from "customers"
      where "customerId" = $1;
    `;
    const params = [customerId];
    const result = await db.query(sql, params);
    const customer = result.rows[0];
    if (!customer) throw new ClientError(404, `actor ${customerId} not found`);
    res.json(customer);
  } catch (err) {
    next(err);
  }
});

app.post('/api/customers', async (req, res, next) => {
  try {
    const { name, address, email, phoneNumber } = req.body;
    if (!name || !address || !email || !phoneNumber) {
      throw new ClientError(400, 'missing customer information required');
    }
    const sql = `
      insert into "customers" ("name", "address", "email", "phoneNumber")
        values ($1, $2, $3, $4)
        returning *
    `;
    const params = [name, address, email, phoneNumber];
    const result = await db.query<Customer>(sql, params);
    const [customer] = result.rows;
    res.status(201).json(customer);
  } catch (err) {
    next(err);
  }
});

app.put('/api/customers/:customerId', async (req, res, next) => {
  try {
    const { customerId } = req.params;
    if (!Number.isInteger(+customerId)) {
      throw new ClientError(400, `Non-integer customerId: ${customerId}`);
    }
    const { name, address, email, phoneNumber } = req.body;
    if (!name || !address || !email || !phoneNumber) {
      throw new ClientError(400, 'missing information required');
    }
    const sql = `
      update "customers"
        set "name" = $1,
            "address" = $2,
            "email" = $3,
            "phoneNumber" = $4
      where "customerId" = $5
      returning *;
      `;
    const params = [name, address, email, phoneNumber, customerId];
    const result = await db.query(sql, params);
    const customer = result.rows[0];
    if (!customer) throw new ClientError(404, `actor ${customerId} not found`);
    res.status(200).json(customer);
  } catch (err) {
    next(err);
  }
});

app.delete('/api/customers/:customerId', async (req, res, next) => {
  try {
    const { customerId } = req.params;
    if (!Number.isInteger(+customerId)) {
      throw new ClientError(400, `Non-integer customer: ${customerId}`);
    }
    const sql = `
      delete from "customers"
      where "customerId" = $1
      returning *;
      `;
    const params = [customerId];
    const result = await db.query(sql, params);
    const customer = result.rows[0];
    if (!customer)
      throw new ClientError(404, `customer ${customerId} not found`);
    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
});

app.get('/api/jobs', async (req, res, next) => {
  try {
    const sql = `
    select "jobDetails",
      "jobId",
      "quantity",
      "perCost",
      "dateOfJob",
      "customers"."customerId",
      "customers"."name"
      from "jobs"
      join "customers" using ("customerId")
      order by "jobId";
    `;
    const result = await db.query<Job>(sql);
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
});

app.get('/api/jobSearch/:customerName', async (req, res, next) => {
  try {
    const { customerName } = req.params;
    console.log('customerName:', customerName);
    if (!customerName) {
      throw new ClientError(400, `Missing customer name`);
    }
    const sql = `
    select "jobDetails",
      "jobId",
      "quantity",
      "perCost",
      "dateOfJob",
      "customers"."name"
      from "jobs"
      join "customers" using ("customerId")
      where "customers"."name" = $1
      order by "jobId";
    `;
    const params = [customerName];
    const result = await db.query<Job>(sql, params);
    res.json(result.rows);
    console.log('result.rows:', result.rows);
  } catch (err) {
    next(err);
  }
});

app.get('/api/jobs/:jobId', async (req, res, next) => {
  try {
    const { jobId } = req.params;
    if (!Number.isInteger(+jobId)) {
      throw new ClientError(400, `Non-integer jobId: ${jobId}`);
    }
    const sql = `
      select * from "jobs"
      where "jobId" = $1;
    `;
    const params = [jobId];
    const result = await db.query(sql, params);
    const job = result.rows[0];
    console.log('jobb:', job);
    if (!job) throw new ClientError(404, `job ${jobId} not found`);
    res.json(job);
  } catch (err) {
    next(err);
  }
});

app.post('/api/jobs', async (req, res, next) => {
  try {
    console.log('req.body:', req.body);
    const { customerId, jobDetails, quantity, perCost, dateOfJob } = req.body;
    if (!customerId || !jobDetails || !quantity || !perCost || !dateOfJob) {
      throw new ClientError(400, 'missing job information required');
    }
    const sql = `
      insert into "jobs" ("jobDetails","quantity","perCost","dateOfJob","customerId")
        values ($1, $2, $3, $4, $5)
        returning *
    `;
    const params = [jobDetails, quantity, perCost, dateOfJob, customerId];
    const result = await db.query<Job>(sql, params);
    const [job] = result.rows;
    res.status(201).json(job);
  } catch (err) {
    next(err);
  }
});

app.put('/api/jobs/:jobId', async (req, res, next) => {
  try {
    const { jobId } = req.params;
    if (!Number.isInteger(+jobId)) {
      throw new ClientError(400, `Non-integer customerId: ${jobId}`);
    }
    const { customerId, jobDetails, quantity, perCost, dateOfJob } = req.body;
    if (!customerId || !jobDetails || !quantity || !perCost || !dateOfJob) {
      throw new ClientError(400, 'missing job information required');
    }
    const sql = `
      update "jobs"
        set "customerId" = $1,
            "jobDetails" = $2,
            "quantity" = $3,
            "perCost" = $4,
            "dateOfJob" = $5
      where "jobId" = $6
      returning *;
      `;
    const params = [
      customerId,
      jobDetails,
      quantity,
      perCost,
      dateOfJob,
      jobId,
    ];
    const result = await db.query(sql, params);
    const job = result.rows[0];
    if (!job) throw new ClientError(404, `job ${jobId} not found`);
    res.status(200).json(job);
  } catch (err) {
    next(err);
  }
});

app.delete('/api/jobs/:jobId', async (req, res, next) => {
  try {
    const { jobId } = req.params;
    if (!Number.isInteger(+jobId)) {
      throw new ClientError(400, `Non-integer job: ${jobId}`);
    }
    const sql = `
      delete from "jobs"
      where "jobId" = $1
      returning *;
      `;
    const params = [jobId];
    const result = await db.query(sql, params);
    const job = result.rows[0];
    if (!job) throw new ClientError(404, `job ${jobId} not found`);
    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
});

/*
 * Middleware that handles paths that aren't handled by static middleware
 * or API route handlers.
 * This must be the _last_ non-error middleware installed, after all the
 * get/post/put/etc. route handlers and just before errorMiddleware.
 */
app.use(defaultMiddleware(reactStaticDir));

app.use(errorMiddleware);

app.listen(process.env.PORT, () => {
  process.stdout.write(`\n\napp listening on port ${process.env.PORT}\n\n`);
});
