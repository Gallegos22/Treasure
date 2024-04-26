set client_min_messages to warning;

-- DANGER: this is NOT how to do it in the real world.
-- `drop schema` INSTANTLY ERASES EVERYTHING.
drop schema "public" cascade;

create schema "public";

CREATE TABLE "public"."users" (
  "userId" serial PRIMARY KEY,
  "username" text not null,
  "hashedPassword" text not null,
  "createdAt" timestamptz(6) not null default now()
);
CREATE TABLE "public"."customers" (
  "customerId" serial PRIMARY KEY,
  "name" text not null,
  "address" text not null,
  "email" text not null,
  "phoneNumber" text not null,
  "createdAt" timestamptz(6) not null default now()
);
CREATE TABLE "public"."jobs" (
  "jobId" serial PRIMARY KEY,
  "customerId" integer not null,
  "jobDetails" text not null,
  "quantity" integer not null,
  "perCost" text not null,
  "dateOfJob" text not null,
  "createdAt" timestamptz(6) not null default now ()
);
ALTER TABLE "public"."jobs" ADD FOREIGN KEY ("customerId") REFERENCES "public"."customers" ("customerId");
