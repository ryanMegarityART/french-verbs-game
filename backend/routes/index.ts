import express from 'express';
import { attempt } from './attempt';
import { leaderboard } from './leaderboard'
import { login } from './login';
import { verb } from './verb';

const router = express.Router();
router.use('/leaderboard', leaderboard);
router.use('/verb', verb);
router.use('/attempt', attempt);
router.use('/login', login);

export default router