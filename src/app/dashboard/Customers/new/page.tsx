"use client";

import { useUser } from "@clerk/nextjs";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { Checkbox } from "antd";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

type DepartmentOption = {
  label: string;
  value: string;
};

export default function NewCustomerPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [formData, setFormData] = React.useState({
    name: "",
    phone: "",
    address: "",
    department: [] as string[],
  });
  const [departmentOptions, setDepartmentOptions] = React.useState<
    DepartmentOption[]
  >([]);

  // معالجة مشكلة map is not a function
  useEffect(() => {
    if (!isLoaded || !user) return;

    const departmentFromMetadata = user.publicMetadata.department;
    let departments: string[] = [];

    if (Array.isArray(departmentFromMetadata)) {
      departments = departmentFromMetadata;
    } else if (typeof departmentFromMetadata === "string") {
      departments = [departmentFromMetadata];
    } else if (departmentFromMetadata) {
      departments = [String(departmentFromMetadata)];
    }

    setDepartmentOptions(
      departments.map((dept) => ({
        label: dept,
        value: dept,
      }))
    );
  }, [user, isLoaded]);

  // طلب POST لإنشاء عميل جديد
  const mutation = useMutation({
    mutationFn: (newCustomer: any) => axios.post("/api/customers", newCustomer),
    onSuccess: () => {
      toast.success("تم تسجيل العميل الجديد بنجاح", {
        description: "تم تسجيل العميل الجديد بنجاح",
      });
      router.push("/dashboard/customers");
    },
    onError: (error: any) => {
      toast.error("خطأ في تسجيل العميل", {
        description: error.response?.data?.error || "حدث خطأ أثناء التسجيل",
      });
    },
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDepartmentChange = (checkedValues: string[]) => {
    setFormData((prev) => ({ ...prev, department: checkedValues }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.department.length === 0) {
      toast.warning("يرجى اختيار قسم واحد على الأقل", {
        description: "يرجى اختيار قسم واحد على الأقل",
      });
      return;
    }

    mutation.mutate({
      ...formData,
      userId: user?.id,
      userCreated: user?.fullName,
    });
  };

  if (!isLoaded) {
    return (
      <div className="p-6 max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-48" />
          </CardHeader>
          <CardContent className="space-y-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
            <Skeleton className="h-10 w-32" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold ">تسجيل عميل جديد</CardTitle>
        </CardHeader>

        <CardContent>
          {departmentOptions.length === 0 && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>تحذير</AlertTitle>
              <AlertDescription>
                لا تملك أقسامًا مسموحًا لك بإدارة العملاء لها. الرجاء التواصل مع
                المسؤول لتعيين الأقسام المناسبة لك.
              </AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="block ">
                اسم العميل *
              </Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="أدخل اسم العميل الكامل"
                required
                className=" focus:border-blue-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="block ">
                رقم الهاتف *
              </Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="أدخل رقم الهاتف"
                required
                className=" focus:border-blue-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address" className="block ">
                العنوان
              </Label>
              <Textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="أدخل العنوان الكامل"
                rows={3}
                className=" focus:border-blue-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="userCreated" className="block ">
                المستخدم المسؤول عن إنشاء العميل
              </Label>
              <Textarea
                id="userCreated"
                name="userCreated"
                value={user?.fullName || ""}
                readOnly
                placeholder="أدخل اسم المستخدم المسؤول عن إنشاء العميل"
                rows={3}
                className=" focus:border-blue-500"
              />
            </div>

            <div className="space-y-2">
              <Label className="block ">الأقسام المسموح بها *</Label>

              {departmentOptions.length > 0 ? (
                <Checkbox.Group
                  options={departmentOptions}
                  value={formData.department}
                  onChange={handleDepartmentChange}
                  className="grid grid-cols-1 md:grid-cols-2 gap-3"
                />
              ) : (
                <div className="bg-gray-100 p-4 rounded-md border border-gray-200">
                  <p className="text-gray-500 text-center">
                    لا توجد أقسام متاحة
                  </p>
                </div>
              )}

              <p className="text-sm text-gray-500 mt-1">
                اختر الأقسام التي سيتمكن العميل من التعامل معها
              </p>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/dashboard/customers")}
                disabled={mutation.isPending}
              >
                إلغاء
              </Button>
              <Button
                type="submit"
                disabled={mutation.isPending || departmentOptions.length === 0}
              >
                {mutation.isPending ? "جاري الحفظ..." : "تسجيل العميل"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
