const { z } = require('zod');

const mongoId = z.string().regex(/^[a-fA-F0-9]{24}$/, 'Invalid ID');

const createSubjectSchema = z.object({
  name: z.string({ required_error: 'Subject name is required' }).min(1, 'Subject name is required'),
  subjectCode: z.string({ required_error: 'Subject code is required' }).min(1, 'Subject code is required'),
  departmentId: mongoId,
});

module.exports = { createSubjectSchema };
