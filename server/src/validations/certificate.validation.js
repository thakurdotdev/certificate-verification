const { z } = require('zod');

const mongoId = z.string().regex(/^[a-fA-F0-9]{24}$/, 'Invalid ID');

const objectIdParam = z.object({
  id: mongoId,
});

const createCertificateSchema = z.looseObject({
  name: z.string({ required_error: 'Name on certificate is required' }).min(1, 'Name on certificate is required'),
  title: z.string({ required_error: 'Title is required' }).min(1, 'Title is required'),
  description: z.string().optional(),
  subjectId: z.string().optional(),
  subjectDate: z.string().optional(),
});

const updateCertificateSchema = z.looseObject({
  name: z.string().min(1).optional(),
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  subjectId: z.string().optional(),
  subjectDate: z.string().optional(),
});

const verifyCertificateSchema = z.object({
  status: z.enum(['APPROVED', 'REJECTED'], { required_error: 'Status is required' }),
  remarks: z.string().optional(),
});

const getAllQuerySchema = z.object({
  page: z.preprocess((v) => (v === '' || v === undefined) ? 1 : Number(v), z.number().int().min(1)),
  limit: z.preprocess((v) => (v === '' || v === undefined) ? 10 : Number(v), z.number().int().min(1).max(100)),
  search: z.string().default(''),
  status: z.enum(['ALL', 'PENDING', 'APPROVED', 'REJECTED']).default('ALL'),
});

module.exports = { createCertificateSchema, updateCertificateSchema, verifyCertificateSchema, getAllQuerySchema, objectIdParam };
