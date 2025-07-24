"use client";

import { useState } from "react";
import { Form, Input, Button, Checkbox, message, Typography } from "antd";
import { createUser } from "@/actions/create-user";

const { Title } = Typography;

const permissionsList = [
  { label: "عرض البذور", value: "seeds.view" },
  { label: "إدارة العملاء", value: "crm.manage" },
  { label: "تقارير الحسابات", value: "accounts.reports" },
  { label: "فواتير المبيدات", value: "pesticides.invoices" },
];

const warehouseOptions = [
  { label: "مخزن البذور", value: "seed-warehouse" },
  { label: "مخزن المبيدات", value: "pesticide-warehouse" },
  { label: "مخزن الشتلات", value: "nursery-warehouse" },
];

export default function CreateUserPage() {
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: any) => {
    try {
      setLoading(true);
      await createUser(values);
      message.success("تم إنشاء المستخدم بنجاح");
    } catch (error: any) {
      console.error(error);
      message.error("فشل في إنشاء المستخدم");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-6">
      <Title level={3} className="text-center">
        إنشاء مستخدم جديد
      </Title>

      <Form
        layout="vertical"
        onFinish={onFinish}
        initialValues={{ permissions: [], warehouses: [] }}
      >
        <Form.Item
          name="firstName"
          label="الاسم الأول"
          rules={[{ required: true, message: "يرجى إدخال الاسم الأول" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="lastName"
          label="الاسم الأخير"
          rules={[{ required: true, message: "يرجى إدخال الاسم الأخير" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="email"
          label="البريد الإلكتروني"
          rules={[{ required: true, message: "يرجى إدخال الإيميل" }]}
        >
          <Input type="email" />
        </Form.Item>

        <Form.Item
          name="password"
          label="كلمة المرور"
          rules={[{ required: true, message: "يرجى إدخال كلمة المرور" }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          name="role"
          label="الدور الوظيفي"
          rules={[{ required: true, message: "يرجى إدخال الدور الوظيفي" }]}
        >
          <Input placeholder="مثلاً: مدير حسابات" />
        </Form.Item>

        <Form.Item
          name="department"
          label="القسم"
          rules={[{ required: true, message: "يرجى إدخال القسم" }]}
        >
          <Input placeholder="مثلاً: الحسابات، المبيدات، المشتل..." />
        </Form.Item>

        <Form.Item name="permissions" label="الصلاحيات">
          <Checkbox.Group options={permissionsList} />
        </Form.Item>

        <Form.Item name="warehouses" label="المخازن المسموح بها">
          <Checkbox.Group options={warehouseOptions} />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block>
            إنشاء المستخدم
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
