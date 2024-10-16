-- CreateTable
CREATE TABLE "Expense" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "description" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "amount" REAL NOT NULL,
    "date" DATETIME NOT NULL,
    "type" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Category" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Category_name_key" ON "Category"("name");
