"use client";

import React, { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Database,
  Users,
  Building,
  UserRound,
  Landmark,
  Pencil,
  Trash,
} from "lucide-react";
import toast from "react-hot-toast";
import {
  StatsAutoSearch,
  StatsCreate,
  StatsList,
  StatsUpdate,
} from "../AdminService";
import { Formik, Form, Field } from "formik";
import { statsValidationFrontend } from "@/app/api/stats/StatsSchema";
import {
  FormikAutoSelectField,
  FormikSelectField,
  FormikTextInput,
} from "@/components/CustomField";
import CustomLoader from "@/components/ui/CustomLoader";
import moment from "moment";
import CustomDataTable from "@/components/ui/CustomDatatable";

const AdminStatsPage = () => {
  const [activeTab, setActiveTab] = useState("player");
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [actionType, setActionType] = useState("add");
  const [modalOpen, setModalOpen] = useState(false);
  const [players, setPlayers] = useState<any[]>([]);
  const [stadiums, setStadiums] = useState<any[]>([]);
  const [selectedData, setSelectedData] = useState<any>({});

  useEffect(() => {
    GetList();
  }, []);

  const GetList = () => {
    setIsLoading(true);
    StatsList()
      .then((res) => {
        setPlayers(res.data.filter((item: any) => item.type === "player"));
        setStadiums(res.data.filter((item: any) => item.type === "stadium"));
        setIsLoading(false);
      })
      .catch((err) => {
        setIsLoading(false);
        toast.error(err.message || "Failed to get details. Please try again.");
      });
  };

  const fetchAutoSearch = (query: any) => {
    return StatsAutoSearch({ srchValue: query, type: activeTab }).then(
      (res) => {
        return res.data.map((item: any) => ({
          ...item,
          label: item.name,
          value: item.name,
        }));
      }
    );
  };

  const filteredPlayers = players.filter(
    (player) =>
      player.originalName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      player.publicName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredStadiums = stadiums.filter(
    (stadium) =>
      stadium.originalName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stadium.publicName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const initialValues =
    actionType === "add"
      ? { originalName: "", publicName: "", type: activeTab }
      : {
          originalName: {
            label: selectedData.originalName,
            value: selectedData.originalName,
          },
          publicName: selectedData.publicName,
          type: activeTab,
        };

  const handelFormSubmit = (value: any) => {
    setIsLoading(true);
    const reqData = {
      originalName: value.originalName.value,
      publicName: value.publicName,
      type: value.type,
    };
    if (actionType === "add") {
      StatsCreate(reqData)
        .then((res) => {
          setIsLoading(false);
          toast.success(res.message);
          modelClose();
        })
        .catch((err) => {
          setIsLoading(false);
          toast.error(
            err.message || "Failed to save details. Please try again."
          );
        });
    }
    if (actionType === "edit") {
      StatsUpdate({ ...reqData, statsId: selectedData._id })
        .then((res) => {
          setIsLoading(false);
          toast.success(res.message);
          modelClose();
        })
        .catch((err) => {
          setIsLoading(false);
          toast.error(
            err.message || "Failed to save details. Please try again."
          );
        });
    }
  };
  const modelClose = () => {
    setModalOpen(false);
    setActionType("add");
    GetList();
  };
  const handelModal = () => {
    setActionType("add");
    setModalOpen(true);
  };

  const handleEdit = (item: any) => {
    setActionType("edit");
    setModalOpen(true);
    setSelectedData(item);
  };

  const handleDelete = (item: any) => {
    console.log(item);
  };

  const columns: any[] = [
    {
      name: "#",
      selector: (row: any, index: number) => index + 1,
      sortable: true,
      width: "60px",
    },
    {
      name: "Original Name",
      selector: (row: any) => row.originalName,
      sortable: true,
    },
    { name: "Public Name", selector: (row: any) => row.publicName },
    {
      name: "Type",
      selector: (row: any) => row.type,
      cell: (row: any) =>
        row.type === "player" ? (
          <div className="flex items-center gap-2 text-blue-600">
            <UserRound className="w-4 h-4" />
            <span className="text-sm">Player</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-green-600">
            <Landmark className="w-4 h-4" />
            <span className="text-sm">Stadium</span>
          </div>
        ),
    },
    {
      name: "Created At",
      selector: (row: any) => row.createdAt,
      cell: (row: any) => moment(row.createdAt).format("Do MMM,YYYY HH:mm"),
    },
    {
      name: "Actions",
      cell: (row: any) => (
        <div className="flex space-x-2">
          <button
            onClick={() => handleEdit(row)}
            className="text-blue-600 hover:text-blue-800"
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDelete(row)}
            className="text-red-600 hover:text-red-800"
          >
            <Trash className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <AdminLayout>
      {isLoading && <CustomLoader message="Loading" />}
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Stats Management
            </h1>
            <p className="text-gray-600 mt-2">
              Manage players and stadium information
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    Total Players
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {players.length}
                  </p>
                </div>
                <div className="p-3 rounded-full bg-blue-100">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    Total Stadiums
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stadiums.length}
                  </p>
                </div>
                <div className="p-3 rounded-full bg-green-100">
                  <Building className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Database className="h-5 w-5 text-blue-600" />
              <span>Database Management</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto sm:overflow-visible scrollbar-hide">
              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full"
              >
                <TabsList className="sm:grid sm:grid-cols-2 mb-6">
                  <TabsTrigger value="player">
                    Players ({players.length})
                  </TabsTrigger>
                  <TabsTrigger value="stadium">
                    Stadiums ({stadiums.length})
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="player" className="space-y-4">
                  <CustomDataTable
                    title="Player Stats"
                    data={filteredPlayers}
                    columns={columns}
                    onAdd={handelModal}
                    searchable
                    searchPlaceholder="Search Players..."
                  />
                </TabsContent>

                <TabsContent value="stadium" className="space-y-4">
                  <CustomDataTable
                    title="Stadium Stats"
                    data={filteredStadiums}
                    columns={columns}
                    onAdd={handelModal}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    searchable
                    searchPlaceholder="Search Stadium..."
                  />
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
        }}
      >
        <DialogContent className="max-w">
          <DialogHeader>
            <DialogTitle>
              {actionType === "add"
                ? `Add ${activeTab === "player" ? "Player" : "Stadium"}`
                : `Edit ${activeTab === "player" ? "Player" : "Stadium"}`}
            </DialogTitle>
          </DialogHeader>
          <Formik
            initialValues={initialValues}
            validationSchema={statsValidationFrontend}
            onSubmit={handelFormSubmit}
          >
            {({ handleSubmit, setFieldValue }) => (
              <Form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1">
                  <div className="space-y-2">
                    <Field
                      label="Original Name"
                      component={FormikAutoSelectField}
                      name="originalName"
                      loadOptions={fetchAutoSearch}
                      onChange={(e: any) => setFieldValue("originalName", e)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Field
                      label="Public Name"
                      component={FormikTextInput}
                      name="publicName"
                    />
                  </div>
                  <div className="space-y-2">
                    <Field
                      label="Type"
                      name="type"
                      disabled
                      component={FormikSelectField}
                      options={[
                        { label: "Player", value: "player" },
                        { label: "Stadium", value: "stadium" },
                      ]}
                    />
                  </div>
                </div>

                <div className="space-y-2 mt-2">
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {actionType === "add"
                      ? `Add ${activeTab === "player" ? "Player" : "Stadium"}`
                      : `Update ${
                          activeTab === "player" ? "Player" : "Stadium"
                        }`}
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

export default AdminStatsPage;
