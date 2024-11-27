PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;

-- Create a new table with the desired schema
CREATE TABLE "new_VerificationCode" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "expiresAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, -- Default value for new rows
    "userId" INTEGER NOT NULL,
    "code" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expired" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "VerificationCode_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- Copy data from the old table into the new one
-- Set "expiresAt" to a default value (e.g., current timestamp) for existing rows
INSERT INTO "new_VerificationCode" ("id", "expiresAt", "userId", "code", "createdAt", "expired")
SELECT 
    "id", 
    CURRENT_TIMESTAMP AS "expiresAt", -- Default value for existing rows
    "userId", 
    "code", 
    "createdAt", 
    "expired" 
FROM "VerificationCode";

-- Drop the old table
DROP TABLE "VerificationCode";

-- Rename the new table to match the original table name
ALTER TABLE "new_VerificationCode" RENAME TO "VerificationCode";

PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
