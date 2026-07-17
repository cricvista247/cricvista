import * as yup from "yup";

export const orderValidationSchema = yup.object().shape({
  ordertype: yup
    .string()
    .oneOf(["purchase", "prediction", "credit"])
    .required("Order type is required"),

  price: yup.number().nullable().min(0, "Price cannot be negative"),

  userId: yup.string().required("User ID is required"),

  credits: yup.number().nullable().min(0, "Credits cannot be negative"),

  status: yup
    .string()
    .oneOf(["pending", "refunded", "completed", "failed"])
    .default("pending"),

  paymentId: yup.string().nullable(),

  paymentMode: yup
    .string()
    .nullable()
    .oneOf(["UPI", "NETBANKING", "QRCODE", "PROMOTION", "DEDUCTION", null]),

  receiverId: yup.string().nullable(),

  paymentDate: yup.date().nullable(),
});
