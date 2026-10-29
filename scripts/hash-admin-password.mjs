// Prints the ADMIN_PASSWORD_HASH value for a password (see docs/ADMIN.md).
//
//   node scripts/hash-admin-password.mjs
//
// The password is read from the terminal, not from the command line, so it
// does not end up in the shell history.
import { randomBytes, scryptSync } from "node:crypto"
import { createInterface } from "node:readline"

const rl = createInterface({ input: process.stdin, output: process.stdout, terminal: true })
rl._writeToOutput = (s) => {
  if (s.includes("Mot de passe")) process.stdout.write(s)
}

rl.question("Mot de passe admin (12 caractères minimum) : ", (password) => {
  rl.close()
  process.stdout.write("\n")
  if (password.length < 12) {
    console.error("Trop court : 12 caractères minimum.")
    process.exit(1)
  }
  const salt = randomBytes(16)
  const hash = scryptSync(password, salt, 64)
  console.log(`ADMIN_PASSWORD_HASH=scrypt:${salt.toString("base64url")}:${hash.toString("base64url")}`)
})
