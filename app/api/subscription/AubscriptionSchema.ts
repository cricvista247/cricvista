import * as yup from "yup";

export const subscriptionValidationSchema = yup.object({
  name: yup.string().required("Name is required"),
  type: yup.string().required("Type is required"),
  price: yup.number().min(0).required("Price is required"),
  credits: yup.number().min(0).required("Credits are required"),
  description: yup.string().required("Description is required"),

  features: yup.array().of(yup.string()).required("Features are required"),

  popular: yup.boolean().required("Popular flag is required"),

  icon: yup.string().nullable(),
  color: yup.string().nullable(),
  bgColor: yup.string().nullable(),
  borderColor: yup.string().nullable(),

  isActive: yup.boolean().required("Status is required"),
});

export const subscriptionFrontendSchema = yup.object({
  name: yup.string().required("Name is required"),
  type: yup.string().required("Type is required"),
  price: yup.number().min(0).required("Price is required"),
  credits: yup.number().min(0).required("Credits are required"),
  description: yup.string().required("Description is required"),

  features: yup
    .array()
    .of(
      yup.object().shape({
        name: yup.string().required("Required"),
      })
    )
    .required("Features are required"),

  popular: yup.boolean().required("Popular flag is required"),

  icon: yup.string().nullable(),
  color: yup.string().nullable(),
  bgColor: yup.string().nullable(),
  borderColor: yup.string().nullable(),

  isActive: yup.boolean().required("Status is required"),
});
