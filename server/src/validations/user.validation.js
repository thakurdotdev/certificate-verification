const { z } = require('zod');

const mongoId = z.string().regex(/^[a-fA-F0-9]{24}$/, 'Invalid ID');

const objectIdParam = z.object({
  id: mongoId,
});

const optionalNumber = z.preprocess(
  (val) => (val === '' || val === undefined || val === null) ? undefined : Number(val),
  z.number().int().min(1).max(8).optional()
);

const optionalBool = z.preprocess(
  (val) => val === 'true' ? true : val === 'false' ? false : val,
  z.boolean().optional()
);

const createUserSchema = z.looseObject({
  name: z.string({ required_error: 'Name is required' }).min(1, 'Name is required'),
  email: z.string({ required_error: 'Email is required' }).email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters').optional(),
  role: z.enum(['STUDENT', 'FACULTY'], { required_error: 'Role is required' }),
  rollNo: z.string().optional(),
  departmentId: z.string().optional(),
  phone: z.string().optional(),
  gender: z.enum(['MALE', 'FEMALE']).optional(),
  semester: optionalNumber,
  grNo: z.string().optional(),
  dob: z.string().optional(),
  isActive: optionalBool,
});

const updateUserSchema = z.looseObject({
  name: z.string().min(1).optional(),
  role: z.enum(['STUDENT', 'FACULTY']).optional(),
  rollNo: z.string().optional(),
  departmentId: z.string().optional(),
  phone: z.string().optional(),
  alternateEmail: z.string().email('Invalid alternate email').or(z.literal('')).optional(),
  gender: z.enum(['MALE', 'FEMALE']).optional(),
  semester: optionalNumber,
  grNo: z.string().optional(),
  dob: z.string().optional(),
  isActive: optionalBool,
});

const updateProfileSchema = z.looseObject({
  name: z.string().min(1).optional(),
  phone: z.string().optional(),
  alternateEmail: z.string().email('Invalid alternate email').or(z.literal('')).optional(),
  gender: z.enum(['MALE', 'FEMALE']).optional(),
  dob: z.string().optional(),
});

module.exports = { createUserSchema, updateUserSchema, updateProfileSchema, objectIdParam };
