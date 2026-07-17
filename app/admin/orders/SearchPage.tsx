import React from "react";
import { Field, Form, Formik } from "formik";
import { FormikSelectField, FormikTextInput } from "@/components/CustomField";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface StatusDialogProps {
  onClose: () => void;
  setSearchData: any;
}

const SearchPage = ({ onClose, setSearchData }: StatusDialogProps) => {
  const handleFormSubmit = (values: any) => {
    const payload = {
      orderNumber: values.orderNumber,
      ordertype: values.ordertype,
      status: values.status,
      name: values.name,
      username: values.username,
      email: values.email,
      mobileNumber: values.mobileNumber,
    };

    setSearchData(payload);
    // onClose();
  };

  const handleReset = (resetForm: any) => {
    resetForm();
    setSearchData({});
    onClose();
  };

  return (
    <div className="p-6 border-2 border-sky-200 bg-sky-50 rounded-lg shadow-sm">
      <Formik
        initialValues={{
          orderNumber: "",
          ordertype: "",
          status: "",
          name: "",
          username: "",
          email: "",
          mobileNumber: "",
        }}
        onSubmit={handleFormSubmit}
      >
        {({ handleSubmit, resetForm }) => (
          <Form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {/* Order Number */}
              <div className="space-y-2">
                <Field
                  label=" Order Number"
                  component={FormikTextInput}
                  name="orderNumber"
                  placeholder="Enter order number"
                  className="w-full"
                />
              </div>

              {/* Order Type */}
              <div className="space-y-2">
                <Field
                  component={FormikSelectField}
                  options={[
                    { label: "Purchase", value: "purchase" },
                    { label: "Analytics", value: "prediction" },
                    { label: "Free Credit", value: "credit" },
                  ]}
                  label="Order Type"
                  name="ordertype"
                />
              </div>

              {/* Status */}
              <div className="space-y-2">
                <Field
                  label="Status"
                  component={FormikSelectField}
                  options={[
                    { label: "Completed", value: "completed" },
                    { label: "Pending", value: "pending" },
                    { label: "Failed", value: "failed" },
                    { label: "Refunded", value: "refunded" },
                  ]}
                  name="status"
                />
              </div>

              {/* Name */}
              <div className="space-y-2">
                <Field
                  label="Name"
                  component={FormikTextInput}
                  name="name"
                  placeholder="Enter customer name"
                  className="w-full"
                />
              </div>

              {/* Username */}
              <div className="space-y-2">
                <Field
                  label="Username"
                  component={FormikTextInput}
                  name="username"
                  placeholder="Enter username"
                  className="w-full"
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Field
                  label="Email"
                  component={FormikTextInput}
                  name="email"
                  type="email"
                  placeholder="Enter email address"
                  className="w-full"
                />
              </div>

              {/* Mobile Number */}
              <div className="space-y-2">
                <Field
                  label="Mobile Number"
                  component={FormikTextInput}
                  name="mobileNumber"
                  placeholder="Enter mobile number"
                  className="w-full"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6 border-t border-sky-200">
              <Button
                type="button"
                variant="outline"
                onClick={() => handleReset(resetForm)}
                className="w-full sm:w-auto"
              >
                Clear All
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="w-full sm:w-auto"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto"
              >
                Apply Filters
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default SearchPage;
