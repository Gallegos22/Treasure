/* eslint-disable @typescript-eslint/no-unused-vars -- Remove when used */
import 'dotenv/config';
import express from 'express';
import pg from 'pg';
import {
  ClientError,
  defaultMiddleware,
  errorMiddleware,
  authMiddleware,
} from './lib/index.js';
import argon2 from 'argon2';
import jwt from 'jsonwebtoken';

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

type User = {
  userId: number;
  username: string;
  hashedPassword: string;
};

type Auth = {
  username: string;
  password: string;
};

const db = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

const hashKey = process.env.TOKEN_SECRET;
if (!hashKey) throw new Error('TOKEN_SECRET not found in .env');

const app = express();
app.use(express.json());

// Create paths for static directories
const reactStaticDir = new URL('../client/dist', import.meta.url).pathname;
const uploadsStaticDir = new URL('public', import.meta.url).pathname;

app.use(express.static(reactStaticDir));
// Static directory for file uploads server/public/
app.use(express.static(uploadsStaticDir));
app.use(express.json());

app.post('/api/auth/sign-up', async (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      throw new ClientError(400, 'username and password are required fields');
    }
    const hashedPassword = await argon2.hash(password);
    const sql = `
      insert into "users" ("username", "hashedPassword")
      values ($1, $2)
      returning "userId", "username", "createdAt"
    `;
    const params = [username, hashedPassword];
    const result = await db.query<User>(sql, params);
    const [user] = result.rows;
    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
});

app.post('/api/auth/sign-in', async (req, res, next) => {
  try {
    const { username, password } = req.body as Partial<Auth>;
    if (!username || !password) {
      throw new ClientError(401, 'first error');
    }
    const sql = `
    select "userId",
           "hashedPassword"
      from "users"
     where "username" = $1
  `;
    const params = [username];
    const result = await db.query<User>(sql, params);
    const [user] = result.rows;
    if (!user) {
      throw new ClientError(401, 'user error');
    } else {
      const { userId, hashedPassword } = user;
      const verified = await argon2.verify(hashedPassword, password);
      if (!verified) {
        throw new ClientError(401, 'verify error');
      } else {
        const payload = { userId, username };
        const token = jwt.sign(payload, hashKey);
        res.json({ token, user: payload });
      }
    }
  } catch (err) {
    next(err);
  }
});

app.get('/api/customers', authMiddleware, async (req, res, next) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      throw new ClientError(400, `Non-integer userId: ${userId}`);
    }
    const sql = `
      select *
        from "customers"
        where "userId" = $1
        order by "customerId";
    `;
    const params = [userId];
    const result = await db.query<Customer>(sql, params);
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
});

app.get(
  '/api/customers/:customerId',
  authMiddleware,
  async (req, res, next) => {
    try {
      const { customerId } = req.params;
      if (!Number.isInteger(+customerId)) {
        throw new ClientError(400, `Non-integer customerId: ${customerId}`);
      }
      const sql = `
      select * from "customers"
      where "customerId" = $1;
    `;
      const params = [customerId];
      const result = await db.query(sql, params);
      const customer = result.rows[0];
      if (!customer)
        throw new ClientError(404, `actor ${customerId} not found`);
      res.json(customer);
    } catch (err) {
      next(err);
    }
  }
);

app.post('/api/customers', authMiddleware, async (req, res, next) => {
  try {
    const userId = req.user?.userId;
    const { name, address, email, phoneNumber } = req.body;
    if (!name || !address || !email || !phoneNumber) {
      throw new ClientError(400, 'missing customer information required');
    }
    const sql = `
      insert into "customers" ("name", "address", "email", "phoneNumber","userId")
        values ($1, $2, $3, $4, $5)
        returning *
    `;
    const params = [name, address, email, phoneNumber, userId];
    const result = await db.query<Customer>(sql, params);
    const [customer] = result.rows;
    res.status(201).json(customer);
  } catch (err) {
    next(err);
  }
});

app.put(
  '/api/customers/:customerId',
  authMiddleware,
  async (req, res, next) => {
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
      if (!customer)
        throw new ClientError(404, `actor ${customerId} not found`);
      res.status(200).json(customer);
    } catch (err) {
      next(err);
    }
  }
);

app.delete(
  '/api/customers/:customerId',
  authMiddleware,
  async (req, res, next) => {
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
  }
);

app.get('/api/jobs', authMiddleware, async (req, res, next) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      throw new ClientError(400, `Non-integer userId: ${userId}`);
    }
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
      where "jobs"."userId" = $1
      order by "jobId";
    `;
    const params = [userId];
    const result = await db.query<Job>(sql, params);
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
});

app.get(
  '/api/jobSearch/:customerName',
  authMiddleware,
  async (req, res, next) => {
    // :customerName is designating name the of variable
    try {
      const { customerName } = req.params;
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
    } catch (err) {
      next(err);
    }
  }
);

app.get('/api/jobs/:jobId', authMiddleware, async (req, res, next) => {
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
    if (!job) throw new ClientError(404, `job ${jobId} not found`);
    res.json(job);
  } catch (err) {
    next(err);
  }
});

app.post('/api/jobs', authMiddleware, async (req, res, next) => {
  try {
    const userId = req.user?.userId;
    const { customerId, jobDetails, quantity, perCost, dateOfJob } = req.body;
    if (!customerId || !jobDetails || !quantity || !perCost || !dateOfJob) {
      throw new ClientError(400, 'missing job information required');
    }
    const sql = `
      insert into "jobs" ("jobDetails","quantity","perCost","dateOfJob","customerId", "userId")
        values ($1, $2, $3, $4, $5, $6)
        returning *
    `;
    const params = [
      jobDetails,
      quantity,
      perCost,
      dateOfJob,
      customerId,
      userId,
    ];
    const result = await db.query<Job>(sql, params);
    const [job] = result.rows;
    res.status(201).json(job);
  } catch (err) {
    next(err);
  }
});

app.put('/api/jobs/:jobId', authMiddleware, async (req, res, next) => {
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

app.delete('/api/jobs/:jobId', authMiddleware, async (req, res, next) => {
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
  console.log(`\n\napp listening on port ${process.env.PORT}\n\n`);
});
