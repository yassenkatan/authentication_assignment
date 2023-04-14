import { applyDecorators } from '@nestjs/common';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';

export const ApiFile = (fieldName = 'file', required = false) => {
  return applyDecorators(
    ApiConsumes('multipart/form-data'),
    ApiBody({
      schema: {
        type: 'object',
        required: required ? [fieldName] : [],
        properties: {
          [fieldName]: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    }),
  );
};
