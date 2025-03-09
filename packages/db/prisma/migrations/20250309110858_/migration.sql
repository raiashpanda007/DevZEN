/*
  Warnings:

  - The values [NODE_JS,NODE_JS_TYPESCRIPT,REACT,REACT_TYPESCRIPT,CPP,PYTHON,PYTHON_DJANGO,NEXT_JS,NEXT_JS_TURBO] on the enum `Templates` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Templates_new" AS ENUM ('node_js', 'node_js_typescript', 'react', 'react_typescript', 'cpp', 'python', 'python_django', 'next_js', 'next_js_turbo');
ALTER TABLE "Projects" ALTER COLUMN "template" TYPE "Templates_new" USING ("template"::text::"Templates_new");
ALTER TYPE "Templates" RENAME TO "Templates_old";
ALTER TYPE "Templates_new" RENAME TO "Templates";
DROP TYPE "Templates_old";
COMMIT;
