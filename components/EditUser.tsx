"use client";
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Field, Form, Formik } from "formik";
import {
  FormikRadioGroup,
  FormikTextArea,
  FormikTextInput,
} from "./CustomField";
import { Check, Mail, Phone, User } from "lucide-react";
import { Button } from "./ui/button";
import * as Yup from "yup";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { UserUpdate } from "@/app/MainService";
import toast from "react-hot-toast";

const validationSchema = Yup.object().shape({
  username: Yup.string()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username must be less than 20 characters")
    .required("Username is required"),

  name: Yup.string()
    .required("Full name is required")
    .matches(/^[a-zA-Z ]*$/, "Only alphabets are allowed"),

  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),

  mobileNumber: Yup.string()
    .required("Mobile number is required")
    .matches(/^[0-9]{10}$/, "Mobile number must be 10 digits"),

  // Only validate when admin
  isActive: Yup.string().required("Please select active status"),

  status: Yup.string()
    .oneOf(["active", "suspended", "banned"], "Invalid status")
    .required("Status is required"),

  remarks: Yup.string().when(["isActive", "status"], {
    is: (isActive: string, status: string) =>
      isActive === "false" || status !== "active",
    then: () => Yup.string().required("Remarks are required"),
    otherwise: () => Yup.string().nullable(),
  }),
});

const EditUser = ({ isOpen, onClose, data }: any) => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [isLoading, setIsLoading] = useState(false);

  const handelSubmit = (values: any) => {
    setIsLoading(true);
    let reqData: any = { userId: values._id };
    if (data.name !== values.name) {
      reqData.name = values.name;
    }
    if (data.email !== values.email) {
      reqData.email = values.email;
    }
    if (data.mobileNumber !== values.mobileNumber) {
      reqData.mobileNumber = values.mobileNumber;
    }
    if (user?.role === "admin") {
      if (data.isActive !== JSON.parse(values.isActive)) {
        reqData.isActive = JSON.parse(values.isActive);
      }
      if (data.status !== values.status) {
        reqData.status = values.status;
      }
      if (reqData.isActive === false || reqData.status !== "active") {
        reqData.remarks = values.remarks;
      }
    }
    UserUpdate(reqData)
      .then((res) => {
        setIsLoading(false);
        toast.success(res.message);
        onClose();
      })
      .catch((err) => {
        setIsLoading(false);
        toast.error(err.message || "Failed to save details. Please try again.");
      });
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl w-[95vw] max-h-[90vh] overflow-y-auto sm:max-h-none sm:overflow-y-visible mx-auto p-4 sm:p-6">
        <DialogHeader className="pb-4 sm:pb-6">
          <DialogTitle className="text-lg sm:text-xl font-semibold text-center sm:text-left">
            Edit User
          </DialogTitle>
        </DialogHeader>

        <Formik
          initialValues={{
            username: data.username || "",
            name: data.name || "",
            email: data.email || "",
            mobileNumber: data.mobileNumber || "",
            isActive: JSON.stringify(data.isActive),
            status: data.status || "",
            remarks: data.remarks || "",
            role: data.role || "user",
            _id: data._id || "",
          }}
          validationSchema={validationSchema}
          onSubmit={handelSubmit}
        >
          {({ handleSubmit, setFieldValue, values }) => (
            <Form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4 sm:gap-6">
                {/* Username */}
                <div className="sm:col-span-2 lg:col-span-4">
                  <Field
                    label="Username"
                    component={FormikTextInput}
                    name="username"
                    icon={
                      <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    }
                    disabled={true}
                    className="text-sm sm:text-base"
                  />
                </div>

                {/* Full Name */}
                <div className="sm:col-span-2 lg:col-span-4">
                  <Field
                    label="Full Name"
                    component={FormikTextInput}
                    name="name"
                    icon={
                      <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    }
                    className="text-sm sm:text-base"
                  />
                </div>

                {/* Email Address */}
                <div className="sm:col-span-2 lg:col-span-4">
                  <Field
                    label="Email Address"
                    component={FormikTextInput}
                    name="email"
                    icon={
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    }
                    className="text-sm sm:text-base"
                  />
                </div>

                {/* Mobile Number */}
                <div className="sm:col-span-2 lg:col-span-4">
                  <Field
                    label="Mobile Number"
                    component={FormikTextInput}
                    name="mobileNumber"
                    icon={
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    }
                    className="text-sm sm:text-base"
                  />
                </div>

                {/* Admin Only Fields */}
                {user?.role === "admin" && (
                  <>
                    {/* Active Status */}
                    <div className="sm:col-span-2 lg:col-span-12">
                      <Field
                        label="Active"
                        component={FormikRadioGroup}
                        name="isActive"
                        options={[
                          { label: "Yes", value: "true" },
                          { label: "No", value: "false" },
                        ]}
                        onValueChange={(e: any) => setFieldValue("isActive", e)}
                        className="text-sm sm:text-base"
                      />
                    </div>

                    {/* Status */}
                    <div className="sm:col-span-2 lg:col-span-12">
                      <Field
                        label="Status"
                        component={FormikRadioGroup}
                        name="status"
                        options={[
                          { label: "Active", value: "active" },
                          { label: "Suspended", value: "suspended" },
                          { label: "Banned", value: "banned" },
                        ]}
                        onValueChange={(e: any) => setFieldValue("status", e)}
                        className="text-sm sm:text-base"
                      />
                    </div>

                    {/* Remarks - Conditionally Rendered */}
                    {(values.isActive === "false" ||
                      values.status !== "active") && (
                      <div className="sm:col-span-2 lg:col-span-12">
                        <Field
                          label="Remarks"
                          component={FormikTextArea}
                          name="remarks"
                          size="3"
                          className="text-sm sm:text-base min-h-[80px]"
                        />
                      </div>
                    )}
                  </>
                )}

                {/* Submit Button */}
                <div className="sm:col-span-2 lg:col-span-12 pt-2 sm:pt-4">
                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 sm:py-2 rounded-lg transition-all duration-300 transform hover:-translate-y-0.5 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-sm sm:text-base"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        <span className="text-sm sm:text-base">
                          Updating Account...
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center">
                        <Check className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                        <span className="text-sm sm:text-base">
                          Update Account
                        </span>
                      </div>
                    )}
                  </Button>
                </div>
              </div>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
};

export default EditUser;
