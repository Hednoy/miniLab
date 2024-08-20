import { useCallback } from "react";

import * as Yup from "yup";

interface ValidationResolverProps {
  [key: string]: any;
}

const useYupValidationResolver = (
  validationSchema: Yup.Schema<ValidationResolverProps>
) =>
  useCallback(
    async (data: ValidationResolverProps) => {
      try {
        const values = await validationSchema.validate(data, {
          abortEarly: false,
        });

        return {
          values,
          errors: {},
        };
      } catch (errors) {
        return {
          values: {},
          errors: (errors as Yup.ValidationError).inner.reduce(
            (allErrors: { [key: string]: any }, currentError: any) => ({
              ...allErrors,
              [currentError.path]: {
                type: currentError.type ?? "validation",
                message: currentError.message,
              },
            }),
            {}
          ),
        };
      }
    },
    [validationSchema]
  );

export default useYupValidationResolver;
