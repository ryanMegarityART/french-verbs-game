import express from 'express';
import { attempt } from './attempt';
import { chat } from './chat';
import { conjugate } from './conjugate';
import { leaderboard } from './leaderboard'
import { login } from './login';
import { register } from './register';
import { verb } from './verb';

const router = express.Router();
router.use('/leaderboard', leaderboard);
router.use('/verb', verb);
router.use('/attempt', attempt);
router.use('/login', login);
router.use('/register', register);
router.use('/conjugate', conjugate);
router.use('/chat', chat);

export default router