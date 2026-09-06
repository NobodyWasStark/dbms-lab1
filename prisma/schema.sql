CREATE EXTENSION IF NOT EXISTS "pgcrypto";

DROP TABLE IF EXISTS "User" CASCADE;
DROP TABLE IF EXISTS "Course" CASCADE;
DROP TYPE IF EXISTS "Gender" CASCADE;

CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE', 'OTHER');

CREATE TABLE "User" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "fullName" VARCHAR(100) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "passwordHash" VARCHAR(255) NOT NULL,
    "phone" VARCHAR(20) NOT NULL,
    "gender" "Gender" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UQ_User_email" UNIQUE ("email"),
    CONSTRAINT "CK_User_fullName_min_length" CHECK (char_length("fullName") >= 3)
);

CREATE TABLE "Course" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "title" VARCHAR(150) NOT NULL,
    "code" VARCHAR(20) NOT NULL,
    "credits" INTEGER NOT NULL,
    "description" TEXT,

    CONSTRAINT "UQ_Course_code" UNIQUE ("code"),
    CONSTRAINT "CK_Course_credits_positive" CHECK ("credits" > 0 AND "credits" <= 6)
);

CREATE INDEX "idx_user_email" ON "User" ("email");
CREATE INDEX "idx_user_created_at" ON "User" ("createdAt" DESC);
CREATE INDEX "idx_course_code" ON "Course" ("code");

CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW."updatedAt" = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_user_modtime
    BEFORE UPDATE ON "User"
    FOR EACH ROW
    EXECUTE FUNCTION update_modified_column();

INSERT INTO "Course" ("id", "title", "code", "credits", "description") VALUES
    (gen_random_uuid(), 'Database Management Systems', 'CSE311', 3, 'Relational models, SQL, normalization, transaction management, indexing, and query optimization.'),
    (gen_random_uuid(), 'Database Management Systems Lab', 'CSE311L', 1, 'Hands-on laboratory sessions focusing on DDL, DML, relational algebra, and full-stack DB integration.'),
    (gen_random_uuid(), 'Software Engineering', 'CSE327', 3, 'Software development life cycles, agile methodologies, design patterns, UML, and architectural modeling.'),
    (gen_random_uuid(), 'Design & Analysis of Algorithms', 'CSE373', 3, 'Asymptotic notation, divide-and-conquer, dynamic programming, greedy algorithms, and graph theory.'),
    (gen_random_uuid(), 'Computer Networks', 'CSE421', 3, 'OSI and TCP/IP protocol stacks, socket programming, routing protocols, flow control, and network security.'),
    (gen_random_uuid(), 'Operating Systems', 'CSE325', 3, 'Process synchronization, CPU scheduling algorithms, virtual memory paging, and file system architecture.')
ON CONFLICT ("code") DO NOTHING;
