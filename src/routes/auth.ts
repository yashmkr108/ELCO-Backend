import { Request, Response, Router } from 'express';
// import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { UserModel } from '../db/db';
import { HttpStatus } from '../constants/HttpStatus';
import { z } from 'zod';

const authRouter: Router = Router();

const requiredBody = z.object({
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters long')
    .max(30, 'Username must be less than 30 characters')
    .regex(
      /^[a-zA-Z0-9_]+$/,
      'Username must contain only letters, numbers, and underscores',
    ),
  email: z.email('Invalid Email Format'),
  password: z
    .string()
    .min(4)
    .max(30)
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[@$!%*?&]/, 'Password must contain at least one special character'),
  aadharId: z.string().length(12, 'Aadhaar number must be exactly 12 digits'),
});

authRouter.post('/signup', async (req: Request, res: Response) => {
  try {
    const parsedBody = requiredBody.safeParse(req.body);

    if (!parsedBody.success) {
      const formattedErrors = z.treeifyError(parsedBody.error)
      return res.status(HttpStatus.BAD_REQUEST).json({
        msg: 'Invalid Input Data',
        err: formattedErrors,
      });
    }

    const { username, email, password, aadharId } = parsedBody.data;
    const ExistingUser = await UserModel.findOne({ email });

    if (ExistingUser) {
      return res
        .status(HttpStatus.CONFLICT)
        .json({ msg: 'User Already Exist' });
    }

    const hashedPassword = await bcrypt.hash(password, 7);
    await UserModel.create({
      username,
      aadharId,
      email,
      password: hashedPassword,
    });

    res.status(HttpStatus.CREATED).json({ msg: 'Signup Successful' });
  } catch (e) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      msg: 'Signup Failed: ' + e,
    });
  }
});

// authRouter.post('/signin', (req: Request, res: Response) => {
//   const { username, password } = req.body;

//   if (user) {
//     const token = jwt.sign({ id: user.id }, process.env.JWT_USER!);
//     res.json({
//       msg: token,
//     });
//     return;
//   }

//   res.json({
//     msg: 'User is not found',
//   });
// });

export default authRouter;
