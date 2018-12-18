/*
 Navicat Premium Data Transfer

 Source Server         : Local PGSQL
 Source Server Type    : PostgreSQL
 Source Server Version : 100005
 Source Host           : localhost:5432
 Source Catalog        : indorse
 Source Schema         : public

 Target Server Type    : PostgreSQL
 Target Server Version : 100005
 File Encoding         : 65001

 Date: 18/12/2018 04:01:00
*/


-- ----------------------------
-- Type structure for enum_ab
-- ----------------------------
DROP TYPE IF EXISTS "public"."enum_ab";
CREATE TYPE "public"."enum_ab" AS ENUM (
  'A',
  'B'
);

-- ----------------------------
-- Type structure for enum_ap
-- ----------------------------
DROP TYPE IF EXISTS "public"."enum_ap";
CREATE TYPE "public"."enum_ap" AS ENUM (
  'A',
  'P'
);

-- ----------------------------
-- Type structure for enum_sg
-- ----------------------------
DROP TYPE IF EXISTS "public"."enum_sg";
CREATE TYPE "public"."enum_sg" AS ENUM (
  'S',
  'G'
);

-- ----------------------------
-- Sequence structure for log-sq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."log-sq";
CREATE SEQUENCE "public"."log-sq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 99999999999999
START 1
CACHE 1;

-- ----------------------------
-- Sequence structure for user-sq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."user-sq";
CREATE SEQUENCE "public"."user-sq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 9999999999999999
START 1
CACHE 1;

-- ----------------------------
-- Sequence structure for user_session-sq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."user_session-sq";
CREATE SEQUENCE "public"."user_session-sq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 999999999999999999
START 1
CACHE 1;

-- ----------------------------
-- Table structure for log
-- ----------------------------
DROP TABLE IF EXISTS "public"."log";
CREATE TABLE "public"."log" (
  "id" int4 NOT NULL DEFAULT nextval('"log-sq"'::regclass),
  "message" text COLLATE "pg_catalog"."default",
  "stack" text COLLATE "pg_catalog"."default",
  "created_at" timestamp(6) NOT NULL DEFAULT now(),
  "updated_at" timestamp(6) NOT NULL DEFAULT now(),
  "counter" int4 DEFAULT 0
)
;
COMMENT ON COLUMN "public"."log"."id" IS 'Log ID';
COMMENT ON COLUMN "public"."log"."message" IS 'Log';
COMMENT ON COLUMN "public"."log"."stack" IS 'Stack';
COMMENT ON COLUMN "public"."log"."created_at" IS 'Created Date';
COMMENT ON COLUMN "public"."log"."updated_at" IS 'Updated Date';
COMMENT ON COLUMN "public"."log"."counter" IS 'Counting';
COMMENT ON TABLE "public"."log" IS 'Logging';

-- ----------------------------
-- Table structure for user
-- ----------------------------
DROP TABLE IF EXISTS "public"."user";
CREATE TABLE "public"."user" (
  "id" int8 NOT NULL DEFAULT nextval('"user-sq"'::regclass),
  "email" varchar(512) COLLATE "pg_catalog"."default" NOT NULL,
  "password" varchar(64) COLLATE "pg_catalog"."default" NOT NULL,
  "firstname" varchar(255) COLLATE "pg_catalog"."default" NOT NULL,
  "lastname" varchar(255) COLLATE "pg_catalog"."default" NOT NULL,
  "note" varchar(255) COLLATE "pg_catalog"."default",
  "status" "public"."enum_ap" DEFAULT 'P'::enum_ap,
  "verify_code" varchar(255) COLLATE "pg_catalog"."default"
)
WITH (OIDS=TRUE)
;
COMMENT ON COLUMN "public"."user"."id" IS 'User ID';
COMMENT ON COLUMN "public"."user"."email" IS 'E-Mail';
COMMENT ON COLUMN "public"."user"."password" IS 'Password';
COMMENT ON COLUMN "public"."user"."firstname" IS 'Name';
COMMENT ON COLUMN "public"."user"."lastname" IS 'Surname';
COMMENT ON COLUMN "public"."user"."note" IS 'Note';
COMMENT ON COLUMN "public"."user"."status" IS 'Status';
COMMENT ON COLUMN "public"."user"."verify_code" IS 'E-mail Verify Code';
COMMENT ON TABLE "public"."user" IS 'End Users';

-- ----------------------------
-- Records of user
-- ----------------------------
INSERT INTO "public"."user" VALUES (16, 'volkan.muhtar@indorse.com', '202cb962ac59075b964b07152d234b70', 'Volkan', 'MUHTAR', 'Test', 'A', 'd341c438fa066b9b14dffca5319e9bb5bf5d22f0');

-- ----------------------------
-- Table structure for user_session
-- ----------------------------
DROP TABLE IF EXISTS "public"."user_session";
CREATE TABLE "public"."user_session" (
  "id" int8 NOT NULL DEFAULT nextval('"user_session-sq"'::regclass),
  "user_id" int8 NOT NULL,
  "login_date" timestamp(6) NOT NULL DEFAULT now(),
  "last_action_date" timestamp(6) NOT NULL DEFAULT now(),
  "ip_address" inet NOT NULL,
  "token" varchar(2048) COLLATE "pg_catalog"."default" NOT NULL,
  "status" "public"."enum_ap" NOT NULL DEFAULT 'A'::enum_ap
)
WITH (OIDS=TRUE)
;
COMMENT ON COLUMN "public"."user_session"."id" IS 'Index ID';
COMMENT ON COLUMN "public"."user_session"."user_id" IS 'User ID';
COMMENT ON COLUMN "public"."user_session"."login_date" IS 'Login Datetime';
COMMENT ON COLUMN "public"."user_session"."last_action_date" IS 'Last Action DateTime (Ping-Pong)';
COMMENT ON COLUMN "public"."user_session"."ip_address" IS 'IP';
COMMENT ON COLUMN "public"."user_session"."token" IS 'JWT Token';
COMMENT ON COLUMN "public"."user_session"."status" IS 'Status';
COMMENT ON TABLE "public"."user_session" IS 'End Users Sessions';

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
SELECT setval('"public"."log-sq"', 3, true);
SELECT setval('"public"."user-sq"', 25, true);
SELECT setval('"public"."user_session-sq"', 44, true);

-- ----------------------------
-- Indexes structure for table user
-- ----------------------------
CREATE UNIQUE INDEX "_user_email" ON "public"."user" USING btree (
  "email" COLLATE "pg_catalog"."default" "pg_catalog"."text_ops" ASC NULLS LAST
);
CREATE UNIQUE INDEX "_user_id" ON "public"."user" USING btree (
  "id" "pg_catalog"."int8_ops" ASC NULLS LAST
);

-- ----------------------------
-- Primary Key structure for table user
-- ----------------------------
ALTER TABLE "public"."user" ADD CONSTRAINT "user_pkey" PRIMARY KEY ("id");
