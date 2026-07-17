"use client";
import React, { useEffect, useState } from "react";
import { subscriptionFrontendSchema } from "@/app/api/subscription/AubscriptionSchema";
import {
  SubscriptionCreate,
  SubscriptionList,
  SubscriptionUpdate,
} from "@/app/MainService";
import AdminLayout from "@/components/admin/AdminLayout";
import {
  FormikFieldArray,
  FormikRadioGroup,
  FormikTextInput,
} from "@/components/CustomField";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Field, Form, Formik } from "formik";
import { Plus, Search, Star, Check, X } from "lucide-react";
import toast from "react-hot-toast";
import CustomLoader from "@/components/ui/CustomLoader";
import { queryClient } from "@/lib/react-query-client";

const AdminSubscription = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [actionType, setActionType] = useState("add");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<any>({});
  const [isLoading, setIsLoading] = useState(false);
  const [subscriptionPlans, setSubscriptionPlans] = useState([]);

  useEffect(() => {
    planList();
  }, []);

  const planList = () => {
    setIsLoading(true);
    SubscriptionList()
      .then((res) => {
        setSubscriptionPlans(res.data);
        setIsLoading(false);
      })
      .catch((error) => {
        setIsLoading(false);
        toast.error(error.message || "Failed to get list. Please try again.");
      });
  };

  const activeSubscription = subscriptionPlans.filter(
    (plan: any) => plan.isActive
  ).length;
  const inactiveSubscription = subscriptionPlans.filter(
    (plan: any) => !plan.isActive
  ).length;

  const filteredPlans = subscriptionPlans.filter((plan: any) => {
    // Filter by search term
    const matchesSearch = plan.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    // Filter by active tab
    if (activeTab === "all") return matchesSearch;
    if (activeTab === "active") return plan.isActive && matchesSearch;
    if (activeTab === "suspended") return !plan.isActive && matchesSearch;

    return matchesSearch;
  });

  const initialValues = {
    name: selectedPlan?.name || "",
    type: selectedPlan.type || "",
    price: selectedPlan?.price || 0,
    credits: selectedPlan?.credits || 0,
    description: selectedPlan.description || "",
    borderColor: selectedPlan.borderColor || "",
    bgColor: selectedPlan.bgColor || "",
    color: selectedPlan.color || "",
    icon: selectedPlan.icon || "",
    features: selectedPlan?.features?.map((item: any) => ({
      name: item,
    })) || [{ name: "" }],
    popular: `${selectedPlan?.popular}` || "false",
    isActive: `${selectedPlan?.isActive}` || "true",
  };

  const modelClose = () => {
    setModalOpen(false);
    setActionType("add");
  };

  const handelFormSubmit = (values: any) => {
    setIsLoading(true);
    const reqData = {
      name: values.name,
      type: values.type,
      price: Number(values.price),
      credits: values.credits,
      description: values.description,
      borderColor: values.borderColor || "",
      bgColor: values.bgColor || "",
      color: values.color || "",
      icon: values.icon || "",
      features: values.features.map((item: any) => item.name),
      popular: JSON.parse(values.popular),
      isActive: JSON.parse(values.isActive),
    };
    if (actionType === "add") {
      SubscriptionCreate(reqData)
        .then((res) => {
          setIsLoading(false);
          toast.success(res.message);
          modelClose();
          planList();
        })
        .catch((err) => {
          setIsLoading(false);
          toast.error(
            err.message || "Failed to save details. Please try again."
          );
        });
    }
    if (actionType === "edit") {
      SubscriptionUpdate({ ...reqData, subscriptionId: selectedPlan._id })
        .then((res) => {
          setIsLoading(false);
          toast.success(res.message);
          modelClose();
          planList();
          setSelectedPlan({});
        })
        .catch((err) => {
          setIsLoading(false);
          toast.error(
            err.message || "Failed to save details. Please try again."
          );
        });
    }
    queryClient.invalidateQueries({ queryKey: ["subscription-list"] });
  };

  return (
    <AdminLayout>
      {isLoading && <CustomLoader />}
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Subscription Plans
            </h1>
          </div>
          <div className="mt-4 md:mt-0">
            <Button
              className="bg-blue-600 hover:bg-blue-700"
              type="button"
              onClick={() => {
                setModalOpen(true);
                setActionType("add");
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Subscription
            </Button>
          </div>
        </div>

        {/* Search and Filters */}
        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by plan name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Subscription List */}
        <Card className="border-0 shadow-lg">
          <CardContent>
            <div className="overflow-x-auto sm:overflow-visible scrollbar-hide">
              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full"
              >
                <TabsList className="sm:grid sm:grid-cols-4 mb-6">
                  <TabsTrigger value="all">
                    All ({subscriptionPlans.length})
                  </TabsTrigger>
                  <TabsTrigger value="active">
                    Active ({activeSubscription})
                  </TabsTrigger>
                  <TabsTrigger value="suspended">
                    Inactive ({inactiveSubscription})
                  </TabsTrigger>
                </TabsList>

                <TabsContent value={activeTab} className="space-y-4">
                  {filteredPlans.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredPlans.map((plan: any) => (
                        <Card
                          key={plan._id}
                          className="hover:shadow-xl transition-shadow"
                        >
                          <CardContent className="p-6">
                            <div className="flex flex-col h-full">
                              {/* Plan header */}
                              <div className="flex justify-between items-start mb-4">
                                <h3 className="text-xl font-bold text-gray-900">
                                  {plan.name}
                                </h3>
                                {plan.popular && (
                                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                    <Star className="h-3 w-3 mr-1" />
                                    Popular
                                  </span>
                                )}
                              </div>

                              {/* Price */}
                              <div className="mb-6">
                                <span className="text-3xl font-bold text-gray-900">
                                  ₹{plan.price}
                                </span>
                                <span className="text-gray-500">/month</span>
                              </div>

                              {/* Credits */}
                              <div className="mb-6">
                                <div className="flex items-center text-gray-700 mb-2">
                                  <span className="font-medium">
                                    {plan.credits} Credits
                                  </span>
                                </div>
                              </div>

                              {/* Features */}
                              <div className="flex-1 mb-6">
                                <ul className="space-y-2">
                                  {plan.features.map(
                                    (feature: string, index: number) => (
                                      <li
                                        key={index}
                                        className="flex items-start"
                                      >
                                        <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                                        <span className="text-gray-700">
                                          {feature}
                                        </span>
                                      </li>
                                    )
                                  )}
                                </ul>
                              </div>

                              {/* Status and actions */}
                              <div className="mt-auto">
                                <div className="flex items-center justify-between">
                                  <span
                                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                      plan.isActive
                                        ? "bg-green-100 text-green-800"
                                        : "bg-red-100 text-red-800"
                                    }`}
                                  >
                                    {plan.isActive ? (
                                      <>
                                        <Check className="h-3 w-3 mr-1" />
                                        Active
                                      </>
                                    ) : (
                                      <>
                                        <X className="h-3 w-3 mr-1" />
                                        Inactive
                                      </>
                                    )}
                                  </span>

                                  <div className="flex space-x-2">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      type="button"
                                      onClick={() => {
                                        setActionType("edit");
                                        setModalOpen(true);
                                        setSelectedPlan(plan);
                                      }}
                                    >
                                      Edit
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="h-16 w-16 text-gray-400 mx-auto mb-4">
                        <Search className="h-full w-full" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        No plans found
                      </h3>
                      <p className="text-gray-600">
                        {searchTerm
                          ? "Try adjusting your search criteria"
                          : "No plans match the selected filter"}
                      </p>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog
        open={modalOpen}
        onOpenChange={() => {
          setModalOpen(false);
          setActionType("add");
          setSelectedPlan({});
        }}
      >
        <DialogContent className="max-w-4xl w-full">
          <DialogHeader>
            <DialogTitle>
              {actionType === "add"
                ? "Edit Subscription Plan"
                : "Add New Subscription Plan"}
            </DialogTitle>
          </DialogHeader>
          <Formik
            initialValues={initialValues}
            validationSchema={subscriptionFrontendSchema}
            onSubmit={handelFormSubmit}
          >
            {({ handleSubmit, setFieldValue, values, errors }) => (
              <Form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-12 gap-2">
                  <div className="md:col-span-3">
                    <Field
                      label="Name"
                      component={FormikTextInput}
                      name="name"
                    />
                  </div>
                  <div className="md:col-span-3">
                    <Field
                      label="Type"
                      component={FormikTextInput}
                      name="type"
                    />
                  </div>
                  <div className="md:col-span-3">
                    <Field
                      label="Price"
                      component={FormikTextInput}
                      name="price"
                    />
                  </div>
                  <div className="md:col-span-3">
                    <Field
                      label="Credits"
                      component={FormikTextInput}
                      name="credits"
                    />
                  </div>
                  <div className="md:col-span-12">
                    <Field
                      label="Description"
                      component={FormikTextInput}
                      name="description"
                    />
                  </div>
                  <div className="md:col-span-4">
                    <Field
                      label="Lucide icon"
                      component={FormikTextInput}
                      name="icon"
                    />
                  </div>
                  <div className="md:col-span-4">
                    <Field
                      label="Color(Tailwind CSS)"
                      component={FormikTextInput}
                      name="color"
                    />
                  </div>
                  <div className="md:col-span-4">
                    <Field
                      label="BG Color(Tailwind CSS)"
                      component={FormikTextInput}
                      name="bgColor"
                    />
                  </div>
                  <div className="md:col-span-4">
                    <Field
                      label="Border Color(Tailwind CSS)"
                      component={FormikTextInput}
                      name="borderColor"
                    />
                  </div>
                  <div className="md:col-span-12">
                    <FormikFieldArray
                      data={{
                        label: "Features",
                        values: values.features,
                        name: "features",
                        initialObject: {
                          name: "",
                        },
                        keyArray: [
                          {
                            label: "Name",
                            component: FormikTextInput,
                            name: "name",
                            placeholder: "Name",
                            className: "md:col-span-9",
                          },
                        ],
                        buttonClass: "md:col-span-3",
                      }}
                    />
                  </div>

                  <div className="md:col-span-4">
                    <Field
                      label="Popular"
                      component={FormikRadioGroup}
                      name="popular"
                      options={[
                        { label: "Yes", value: "true" },
                        { label: "No", value: "false" },
                      ]}
                      onValueChange={(e: any) => setFieldValue("popular", e)}
                    />
                  </div>

                  <div className="md:col-span-4">
                    <Field
                      label="Active"
                      component={FormikRadioGroup}
                      name="isActive"
                      options={[
                        { label: "Yes", value: "true" },
                        { label: "No", value: "false" },
                      ]}
                      onValueChange={(e: any) => setFieldValue("isActive", e)}
                    />
                  </div>
                </div>

                <div className="mt-4 flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => modelClose()}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isLoading}>
                    {actionType === "add"
                      ? "Add Subscription"
                      : "Update Subscription"}
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminSubscription;
