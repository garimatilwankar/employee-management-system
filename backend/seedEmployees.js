// Simple seed script to generate 100 realistic employees.
// Usage: node seedEmployees.js

const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

const firstNames = [
  "Aarav","Vihaan","Reyansh","Krishna","Arjun","Kabir","Aditi","Diya","Ananya","Riya",
  "Ishaan","Vivaan","Manav","Neil","Sanjay","Karan","Meera","Neha","Tanya","Simran",
  "Aditya","Nikhil","Rahul","Rohan","Sahil","Varun","Pranav","Yash","Sanya","Ira"
];
const lastNames = [
  "Sharma","Verma","Gupta","Mehta","Singh","Kapoor","Joshi","Kulkarni","Patel","Reddy",
  "Nair","Bose","Chatterjee","Iyer","Banerjee","Chopra","Roy","Das","Saxena","Mishra"
];

const departments = [
  "Engineering","Human Resources","Finance","Marketing","Sales","Operations","IT","Legal","Support","Design"
];
const designations = [
  "Software Engineer","Senior Software Engineer","QA Analyst","Product Analyst","HR Coordinator","Accountant","Marketing Executive",
  "Sales Associate","Operations Manager","IT Specialist","Legal Associate","Customer Support Rep","UX Designer","Data Analyst"
];

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pick(arr) {
  return arr[randInt(0, arr.length - 1)];
}

function makePhone() {
  const p = `9${randInt(100000000, 999999999)}`;
  return p;
}

function makeEmail(name, i) {
  const safe = name.toLowerCase().replace(/\s+/g, ".");
  return `${safe}${i}@company.com`;
}

function makeAddress() {
  return `${randInt(10, 9999)} ${pick(["Main St","Park Rd","Lake View","Tech Avenue","Business Blvd","Green Street"])} ` +
    `${pick(["Springfield","Riverside","Fairview","Centerville","Madison","Georgetown"])}, ${pick(["CA","NY","TX","IL","WA","FL"])}`;
}

(async () => {
  try {
    const emailExists = async (email) => {
      const r = await pool.query("SELECT id FROM users WHERE email=$1", [email]);
      return r.rows.length > 0;
    };

    // Ensure departments exist
    for (const d of departments) {
      await pool.query(
        "INSERT INTO departments(department_name) VALUES($1) ON CONFLICT (department_name) DO NOTHING",
        [d]
      );
    }

    for (const _ of new Array(100).fill(null)) {
      const first = pick(firstNames);
      const last = pick(lastNames);
      const name = `${first} ${last}`;
      const i = randInt(1000, 9999);
      const email = makeEmail(name, i);

      if (await emailExists(email)) continue;

      // Create user with default password hash placeholder.
      // Note: This seed uses a fixed password; update if needed.
      // For production, hash with bcrypt.
      const bcrypt = require("bcrypt");
      const hashed = await bcrypt.hash("Password@123", 10);

      const deptName = pick(departments);
      const dept = await pool.query("SELECT id FROM departments WHERE department_name=$1", [deptName]);
      const department_id = dept.rows[0].id;

      const designation = pick(designations);
      const salary = randInt(50000, 180000);

      const userRes = await pool.query(
        "INSERT INTO users(name,email,password,role) VALUES($1,$2,$3,$4) RETURNING id",
        [name, email, hashed, "Employee"]
      );
      const user_id = userRes.rows[0].id;

      await pool.query(
        "INSERT INTO employee_profiles(user_id, department_id, phone, address, designation, salary) VALUES($1,$2,$3,$4,$5,$6)",
        [user_id, department_id, makePhone(), makeAddress(), designation, salary]
      );
    }

    console.log("Seeded 100 employees (best effort). ");
  } catch (e) {
    console.error("Seed failed", e);
  } finally {
    await pool.end();
  }
})();

