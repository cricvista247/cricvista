"use client";
import React from "react";
import { Field, Form, Formik } from "formik";
import * as Yup from "yup";
import { FormikTextPassword } from "./CustomField";
import { Clock, Lock, LockKeyhole } from "lucide-react";
import { Button } from "./ui/button";

const validationSchema = Yup.object({
  password: Yup.string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters"),

  confirmPassword: Yup.string()
    .required("Confirm password is required")
    .oneOf([Yup.ref("password")], "Passwords must match"),
});

const ForgetPassword = (props: any) => {
  const handleRegister = (values: any) => {
    props.onSubmit(values);
  };
  return (
    <Formik
      initialValues={{
        password: "",
        confirmPassword: "",
      }}
      validationSchema={validationSchema}
      onSubmit={handleRegister}
    >
      {({ handleSubmit, isSubmitting }) => (
        <Form onSubmit={handleSubmit}>
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-12">
              <Field
                label="Password"
                component={FormikTextPassword}
                name="password"
                icon={
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                }
              />
            </div>
            <div className="col-span-12">
              <Field
                label="Confirm Password"
                component={FormikTextPassword}
                name="confirmPassword"
                icon={
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                }
              />
            </div>

            <div className="col-span-12">
              <Button className="w-full" type="submit" disabled={props.loading}>
                {props.loading ? (
                  <>
                    <Clock className="mr-2 h-4 w-4 animate-spin" />
                    Resetting Password...
                  </>
                ) : (
                  <>
                    <LockKeyhole className="mr-2 h-4 w-4" />
                    Reset Password
                  </>
                )}
              </Button>
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default ForgetPassword;
