/*
  Warnings:

  - The values [NEXT_JS_TYPESCRIPT] on the enum `Templates` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Templates_new" AS ENUM ('NODE_JS', 'NODE_JS_TYPESCRIPT', 'REACT', 'REACT_TYPESCRIPT', 'CPP', 'PYTHON', 'PYTHON_DJANGO', 'NEXT_JS', 'NEXT_JS_TURBO');
ALTER TYPE "Templates" RENAME TO "Templates_old";
ALTER TYPE "Templates_new" RENAME TO "Templates";
DROP TYPE "Templates_old";
COMMIT;
