"use client";

import {
  Button,
  Group,
  LoadingOverlay,
  Select,
  TextInput,
  Textarea,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface CustomerFormProps {
  customer?: any;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function CustomerForm({
  customer,
  onSuccess,
  onCancel,
}: CustomerFormProps) {
  const { user, isLoaded } = useUser();
  const [departmentOptions, setDepartmentOptions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // تهيئة النموذج
  const form = useForm({
    initialValues: {
      name: customer?.name || "",
      phone: customer?.phone || "",
      address: customer?.address || "",
      kind: customer?.kind || "فرد",
      department: customer?.department || "",
    },

    validate: {
      name: (value) => (!value ? "اسم العميل مطلوب" : null),
      phone: (value) => (!value ? "رقم الهاتف مطلوب" : null),
    },
  });

  // جلب بيانات الأقسام
  useEffect(() => {
    if (isLoaded && user) {
      const departmentFromMetadata = user.publicMetadata.department;
      let departments: string[] = [];

      if (Array.isArray(departmentFromMetadata)) {
        departments = departmentFromMetadata;
      } else if (typeof departmentFromMetadata === "string") {
        departments = [departmentFromMetadata];
      } else if (departmentFromMetadata) {
        departments = [String(departmentFromMetadata)];
      }

      setDepartmentOptions(departments);
      setIsLoading(false);
    }
  }, [user, isLoaded]);

  // طفرة إضافة/تعديل العميل
  const mutation = useMutation({
    mutationFn: (values: any) => {
      if (customer) {
        return axios.put(`/api/customers/${customer.id}`, values);
      } else {
        return axios.post("/api/customers", {
          ...values,
          userId: user?.id,
          userCreated: user?.fullName || user?.emailAddresses[0]?.emailAddress,
        });
      }
    },
    onSuccess: () => {
      toast.success(
        customer ? "تم تحديث العميل بنجاح" : "تم إضافة العميل بنجاح"
      );
      onSuccess();
    },
    onError: () => {
      toast.error(
        customer ? "حدث خطأ أثناء تحديث العميل" : "حدث خطأ أثناء إضافة العميل"
      );
    },
  });

  // معالجة الإرسال
  const handleSubmit = (values: any) => {
    mutation.mutate(values);
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <TextInput
        label="اسم العميل"
        placeholder="أدخل اسم العميل"
        required
        {...form.getInputProps("name")}
        mb="md"
      />

      <TextInput
        label="رقم الهاتف"
        placeholder="أدخل رقم الهاتف"
        required
        {...form.getInputProps("phone")}
        mb="md"
      />

      <Textarea
        label="العنوان"
        placeholder="أدخل العنوان"
        {...form.getInputProps("address")}
        mb="md"
      />

      <Select
        label="نوع العميل"
        data={[
          { value: "فرد", label: "فرد" },
          { value: "شركة", label: "شركة" },
          { value: "مؤسسة", label: "مؤسسة" },
        ]}
        {...form.getInputProps("kind")}
        mb="md"
      />

      <Select
        label="القسم"
        placeholder="اختر القسم"
        data={departmentOptions.map((dept) => ({ value: dept, label: dept }))}
        {...form.getInputProps("department")}
        mb="xl"
      />

      <Group>
        <Button variant="outline" onClick={onCancel}>
          إلغاء
        </Button>
        <Button type="submit" color="green">
          {customer ? "تحديث" : "إضافة"}
        </Button>
      </Group>
    </form>
  );
}
