import { Router } from "express";
const router = Router();
import { handleAuthenticate } from '../controllers/authenticate';

//Authenticate
router.post("/", handleAuthenticate);

export default router;