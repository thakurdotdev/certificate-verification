const { z } = require('zod');

const createDepartmentSchema = z.object({
  name: z.string({ required_error: 'Department name is required' }).min(1, 'Department name is required'),
});

module.exports = { createDepartmentSchema };
