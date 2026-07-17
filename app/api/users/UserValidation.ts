import * as yup from "yup";

export const userValidationSchema = yup.object().shape({
  name: yup
    .string()
    .min(2, "Name must be at least 3 characters")
    .required("Name is required"),
  username: yup
    .string()
    .min(2, "Username must be at least 3 characters")
    .required("Username is required"),
  email: yup
    .string()
    .email("Invalid email address")
    .required("Email is required"),
  mobileNumber: yup
    .string()
    .matches(/^\d{10}$/, "Mobile number must be exactly 10 digits")
    .required("Mobile number is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  agreeToTerms: yup
    .boolean()
    .oneOf([true], "You must accept the terms and conditions"),
});
