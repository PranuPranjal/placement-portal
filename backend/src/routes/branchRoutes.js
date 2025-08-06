const express = require('express');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const router = express.Router();

router.get('/', async (req, res) => {
  const branches = await prisma.branch.findMany();
  res.json(branches);
});

module.exports = router;
