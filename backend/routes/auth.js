const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../db");

const router = express.Router();

// REGISTER

router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const hashedPassword =
      await bcrypt.hash(password, 10);

    const result = await pool.query(
      `
      INSERT INTO users(name,email,password)
      VALUES($1,$2,$3)
      RETURNING *
      `,
      [name, email, hashedPassword]
    );

    res.status(201).json(result.rows[0]);

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Registration Failed"
    });
  }
});

// LOGIN

router.post("/login", async (req, res) => {
  try {

    const { email, password } = req.body;

    const result = await pool.query(
      "SELECT * FROM users WHERE email=$1",
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "User Not Found"
      });
    }

    const user = result.rows[0];

    const validPassword =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!validPassword) {
      return res.status(401).json({
        message: "Invalid Password"
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h"
      }
    );

    res.json({
      token
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Login Failed"
    });
  }
});

module.exports = router;