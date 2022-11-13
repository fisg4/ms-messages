import express from 'express';

const router = express.Router();

/* GET home page. */
router.get('/', (req, res) => {
  res.json({ data: 'Hello from Messages\' microservice' });
});

export default router;
