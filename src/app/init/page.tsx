"use client";

import { useState } from "react";
import { Form, Input, Button, Typography, message, Checkbox } from "antd";
import { createUser } from "@/actions/create-user"; // نفس الأكشن اللي عملناه

const { Title } = Typography;

export default function InitPage() {
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: any) => {
    try {
      setLoading(true);
      await createUser({
        ...values,
        role: "مدير نظام",
        department: "الإدارة العامة",
        permissions: ["*"],
        warehouses: ["all"],
      });
      message.success("تم إنشاء المدير الأول بنجاح");
      window.location.href = "/sign-in";
    } catch (err) {
      console.error(err);
      message.error("حدث خطأ أثناء إنشاء الحساب");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-20 p-6 border rounded shadow">
      <Title level={3} className="text-center mb-6">
        إنشاء أول مدير للنظام
      </Title>

      <Form layout="vertical" onFinish={onFinish}>
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
          rules={[{ required: true, message: "يرجى إدخال البريد" }]}
        >
          <Input type="email" />
        </Form.Item>

        <Form.Item
          name="password"
          label="كلمة المرور"
          rules={[{ required: true, message: "يرجى إدخال كلمة مرور قوية" }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block loading={loading}>
            إنشاء المدير
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
