"use client";

import React, { useState } from "react";
import {
  Box,
  Button,
  Card,
  Drawer,
  Flex,
  Grid,
  Group,
  Modal,
  Pagination,
  Select,
  Table,
  Text,
  TextInput,
  Tooltip,
  Badge,
  ActionIcon,
  Skeleton,
} from "@mantine/core";
import { useDisclosure, useDebouncedValue } from "@mantine/hooks";
import {
  IconSearch,
  IconPlus,
  IconEdit,
  IconTrash,
  IconInfoCircle,
  IconFilter,
  IconRefresh,
} from "@tabler/icons-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import CustomerForm from "../Customers/CustomerForm";
import CustomerDetails from "../Customers/CustomerDetails";

// أنواع البيانات
interface Customer {
  id: string;
  name: string;
  phone: string;
  address: string;
  department: string;
  kind: string;
  createdAt: string;
  updatedAt: string;
}

// مكون صفحة العملاء الرئيسي
export default function CustomersPage() {
  // حالات التحكم في الواجهة
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebouncedValue(search, 300);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [sortField, setSortField] = useState("createdAt");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [filterKind, setFilterKind] = useState<string | null>(null);

  // حالات التحكم في المودال والدرو
  const [openedAddModal, { open: openAddModal, close: closeAddModal }] =
    useDisclosure(false);
  const [
    openedDetailsDrawer,
    { open: openDetailsDrawer, close: closeDetailsDrawer },
  ] = useDisclosure(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null
  );
  const [editCustomer, setEditCustomer] = useState<Customer | null>(null);

  // حجم الشاشة للتصميم المتجاوب
  const [screenSize, setScreenSize] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 1200,
    height: typeof window !== "undefined" ? window.innerHeight : 800,
  });

  // استعلام البيانات
  const queryClient = useQueryClient();
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: [
      "customers",
      {
        page,
        pageSize,
        search: debouncedSearch,
        sortField,
        sortDirection,
        filterKind,
      },
    ],
    queryFn: async () => {
      const response = await axios.get("/api/customers", {
        params: {
          page,
          pageSize,
          search: debouncedSearch,
          sortField,
          sortDirection,
          filterKind,
        },
      });
      return response.data;
    },
  });

  // طفرة حذف العملاء
  const deleteMutation = useMutation({
    mutationFn: (id: string) => axios.delete(`/api/customers/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(["customers"]);
      toast.success("تم حذف العميل بنجاح");
    },
    onError: () => {
      toast.error("حدث خطأ أثناء حذف العميل");
    },
  });

  // معالجة الحذف
  const handleDelete = (customer: Customer) => {
    toast(
      <div className="p-4">
        <Text size="md">تأكيد الحذف</Text>
        <Text size="sm" className="mt-2">
          هل أنت متأكد من حذف العميل "{customer.name}"؟
        </Text>
        <div className="flex gap-2 mt-4">
          <Button
            variant="outline"
            color="gray"
            onClick={() => toast.dismiss()}
          >
            إلغاء
          </Button>
          <Button
            color="red"
            onClick={() => {
              deleteMutation.mutate(customer.id);
              toast.dismiss();
            }}
          >
            حذف
          </Button>
        </div>
      </div>
    );
  };

  // معالجة عرض التفاصيل
  const handleViewDetails = (customer: Customer) => {
    setSelectedCustomer(customer);
    openDetailsDrawer();
  };

  // معالجة التحرير
  const handleEdit = (customer: Customer) => {
    setEditCustomer(customer);
    openAddModal();
  };

  // معالجة إغلاق النموذج
  const handleFormClose = () => {
    setEditCustomer(null);
    closeAddModal();
  };

  // معالجة تغيير الفرز
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  // تنسيق التاريخ
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ar-EG", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // أعمدة الجدول
  const columns = [
    {
      accessor: "name",
      title: "الاسم",
      sortable: true,
      render: (customer: Customer) => <Text>{customer.name}</Text>,
    },
    {
      accessor: "phone",
      title: "الهاتف",
      sortable: true,
    },
    {
      accessor: "kind",
      title: "النوع",
      render: (customer: Customer) => (
        <Badge
          color={customer.kind === "فرد" ? "blue" : "green"}
          variant="light"
        >
          {customer.kind || "غير محدد"}
        </Badge>
      ),
    },
    {
      accessor: "department",
      title: "القسم",
      render: (customer: Customer) => (
        <Text>{customer.department || "غير محدد"}</Text>
      ),
    },
    {
      accessor: "createdAt",
      title: "تاريخ الإضافة",
      sortable: true,
      render: (customer: Customer) => (
        <Text>{formatDate(customer.createdAt)}</Text>
      ),
    },
    {
      accessor: "actions",
      title: "الإجراءات",
      render: (customer: Customer) => (
        <Group>
          <Tooltip label="عرض التفاصيل" position="top" withArrow>
            <ActionIcon
              color="blue"
              variant="light"
              onClick={() => handleViewDetails(customer)}
            >
              <IconInfoCircle size={18} />
            </ActionIcon>
          </Tooltip>

          <Tooltip label="تعديل" position="top" withArrow>
            <ActionIcon
              color="orange"
              variant="light"
              onClick={() => handleEdit(customer)}
            >
              <IconEdit size={18} />
            </ActionIcon>
          </Tooltip>

          <Tooltip label="حذف" position="top" withArrow>
            <ActionIcon
              color="red"
              variant="light"
              onClick={() => handleDelete(customer)}
            >
              <IconTrash size={18} />
            </ActionIcon>
          </Tooltip>
        </Group>
      ),
    },
  ];

  return (
    <Box p="md">
      {/* العنوان وأزرار الإجراءات */}
      <Flex justify="space-between" align="center" mb="xl">
        <Text size="xl" className="text-green-600">
          إدارة العملاء
        </Text>

        <Button
          onClick={openAddModal}
          variant="filled"
          color="green"
        >
          إضافة عميل جديد
        </Button>
      </Flex>

      {/* أدوات التحكم والبحث */}
      <Card shadow="sm" padding="lg" mb="xl" withBorder>
        <Grid gutter="md">
          <Grid.Col span={screenSize.width > 768 ? 6 : 12}>
            <TextInput
              placeholder="ابحث عن عميل..."
              value={search}
              onChange={(e) => setSearch(e.currentTarget.value)}
              className="rtl-input"
            />
          </Grid.Col>

          <Grid.Col span={screenSize.width > 768 ? 3 : 6}>
            <Select
              placeholder="فلترة حسب النوع"
              data={[
                { value: "فرد", label: "فرد" },
                { value: "شركة", label: "شركة" },
                { value: "مؤسسة", label: "مؤسسة" },
              ]}
              value={filterKind}
              onChange={setFilterKind}
              clearable
            />
          </Grid.Col>

          <Grid.Col span={screenSize.width > 768 ? 3 : 6}>
            <Button variant="outline" onClick={() => refetch()} fullWidth>
              تحديث البيانات
            </Button>
          </Grid.Col>
        </Grid>
      </Card>

      {/* جدول العملاء */}
      <Card shadow="sm" withBorder>
        <Table highlightOnHover verticalSpacing="md" horizontalSpacing="md">
          <thead>
            <tr>
              {columns.map((column) => (
                <th key={column.accessor}>
                  <Group>
                    <Text>{column.title}</Text>
                    {column.sortable && (
                      <ActionIcon
                        size="xs"
                        onClick={() => handleSort(column.accessor)}
                      >
                        {sortField === column.accessor &&
                        sortDirection === "asc"
                          ? "↑"
                          : "↓"}
                      </ActionIcon>
                    )}
                  </Group>
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <tr key={index}>
                  {columns.map((_, colIndex) => (
                    <td key={colIndex}>
                      <Skeleton height={20} />
                    </td>
                  ))}
                </tr>
              ))
            ) : isError ? (
              <tr>
                <td colSpan={columns.length} className="text-center py-8">
                  <Text color="red">حدث خطأ في تحميل البيانات</Text>
                </td>
              </tr>
            ) : data?.customers?.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="text-center py-8">
                  <Text>لا يوجد عملاء</Text>
                </td>
              </tr>
            ) : (
              data?.customers?.map((customer: Customer) => (
                <tr key={customer.id}>
                  {columns.map((column) => (
                    <td key={`${customer.id}-${column.accessor}`}>
                      {column.render
                        ? column.render(customer)
                        : customer[column.accessor as keyof Customer]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </Table>

        {/* التصفح بين الصفحات */}
        {data?.totalPages > 1 && (
          <Flex justify="center" mt="xl">
            <Pagination
              value={page}
              onChange={setPage}
              total={data.totalPages}
              siblings={1}
              boundaries={1}
              withEdges
              getItemProps={(page) => ({
                component: "button",
                onClick: () => setPage(page),
              })}
            />
          </Flex>
        )}
      </Card>

      {/* مودال إضافة/تعديل العميل */}
      <Modal
        opened={openedAddModal}
        onClose={handleFormClose}
        title={
          <Text size="xl">
            {editCustomer ? "تعديل العميل" : "إضافة عميل جديد"}
          </Text>
        }
        size="lg"
        centered
      >
        <CustomerForm
          customer={editCustomer}
          onSuccess={handleFormClose}
          onCancel={handleFormClose}
        />
      </Modal>

      {/* درو تفاصيل العميل */}
      <Drawer
        opened={openedDetailsDrawer}
        onClose={closeDetailsDrawer}
        title="تفاصيل العميل"
        position="left"
        size={screenSize.width > 768 ? "md" : "100%"}
        padding="xl"
      >
        {selectedCustomer && <CustomerDetails customer={selectedCustomer} />}
      </Drawer>
    </Box>
  );
}
