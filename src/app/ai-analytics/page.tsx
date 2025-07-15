"use client";

import React from "react";
import {
  Table,
  Alert,
  Tag,
  Tabs,
  Statistic,
  Card,
  Timeline,
  Button,
  Badge,
  Progress,
  Row,
  Col,
  Space,
  message,
} from "antd";

const suspiciousInvoices = [
  {
    key: "1",
    number: "INV-1001",
    rep: "أحمد علي",
    client: "شركة الريف",
    price: 12000,
    discount: "10%",
    risk: "مرتفعة",
    notes: "خصم غير معتاد",
  },
  {
    key: "2",
    number: "INV-1002",
    rep: "سعيد محمد",
    client: "مزارع الوادي",
    price: 8000,
    discount: "5%",
    risk: "متوسطة",
    notes: "سعر أقل من المعتاد",
  },
  {
    key: "3",
    number: "INV-1003",
    rep: "منى حسن",
    client: "شركة الخيرات",
    price: 15000,
    discount: "15%",
    risk: "مرتفعة",
    notes: "خصم كبير",
  },
];

const suspiciousRate = 38; // نسبة الفواتير المشبوهة

const salesForecast = {
  total: 95000,
  data: [
    { month: "يناير", value: 7000 },
    { month: "فبراير", value: 12000 },
    { month: "مارس", value: 18000 },
    { month: "أبريل", value: 22000 },
    { month: "مايو", value: 36000 },
  ],
};
const collectionForecast = {
  total: 67000,
  data: [
    { month: "يناير", value: 5000 },
    { month: "فبراير", value: 9000 },
    { month: "مارس", value: 14000 },
    { month: "أبريل", value: 18000 },
    { month: "مايو", value: 21000 },
  ],
};
const expenseForecast = {
  total: 32000,
  data: [
    { month: "يناير", value: 4000 },
    { month: "فبراير", value: 6000 },
    { month: "مارس", value: 7000 },
    { month: "أبريل", value: 8000 },
    { month: "مايو", value: 7000 },
  ],
};

const repsPerformance = [
  {
    key: "1",
    name: "أحمد علي",
    rating: 4.8,
    collection: "92%",
    route: "ممتاز",
    returns: "2%",
    points: 98,
    status: "جيد جدًا",
  },
  {
    key: "2",
    name: "منى حسن",
    rating: 3.9,
    collection: "75%",
    route: "جيد",
    returns: "6%",
    points: 80,
    status: "جيد",
  },
  {
    key: "3",
    name: "سعيد محمد",
    rating: 2.7,
    collection: "61%",
    route: "ضعيف",
    returns: "12%",
    points: 55,
    status: "ضعيف",
  },
];

const recommendations = [
  {
    key: "1",
    text: "زيادة الزيارات في منطقة الشرقية",
    note: "لوحظ انخفاض المبيعات في هذه المنطقة مقارنة بالمناطق الأخرى.",
  },
  {
    key: "2",
    text: "تعديل سعر صنف الأسمدة العضوية",
    note: "تم رصد منافسة سعرية قوية على هذا الصنف.",
  },
  {
    key: "3",
    text: "تدريب إضافي للمندوبين الجدد",
    note: "انخفاض أداء بعض المندوبين الجدد في التحصيل والمبيعات.",
  },
];

const alerts = [
  {
    type: "error",
    message: "انخفاض مبيعات مندوب سعيد محمد بنسبة 30%",
  },
  {
    type: "warning",
    message: "تجاوز سقف الدين للعميل شركة الريف",
  },
  {
    type: "info",
    message: "حركة غير معتادة في منطقة الغربية",
  },
];

const summary = [
  {
    title: "أفضل مندوب هذا الأسبوع",
    value: "أحمد علي",
    icon: <Badge status="success" />, // يمكن تخصيص أيقونة
  },
  {
    title: "أكثر صنف عليه طلب",
    value: "الأسمدة العضوية",
    icon: <Badge status="processing" />, // يمكن تخصيص أيقونة
  },
  {
    title: "نسبة الفواتير المشبوهة",
    value: `${suspiciousRate}%`,
    icon: <Badge status={suspiciousRate > 30 ? "error" : "success"} />,
  },
  {
    title: "دقة نظام الذكاء الاصطناعي في التحليل",
    value: "97%",
    icon: <Badge status="success" />,
  },
];

function handleRecommendation(text: string) {
  message.success(`تم تنفيذ التوصية: ${text}`);
}

function renderLineChart(data: { month: string; value: number }[]) {
  // رسم بياني خطي بسيط باستخدام SVG فقط (بدون مكتبات خارجية)
  const max = Math.max(...data.map((d) => d.value));
  const points = data
    .map((d, i) => {
      const x = (i * 100) / (data.length - 1);
      const y = 60 - (d.value / max) * 50;
      return `${x},${y}`;
    })
    .join(" ");
  return (
    <svg viewBox="0 0 100 60" className="w-full h-20">
      <polyline fill="none" stroke="#1677ff" strokeWidth="2" points={points} />
      {data.map((d, i) => {
        const x = (i * 100) / (data.length - 1);
        const y = 60 - (d.value / max) * 50;
        return <circle key={i} cx={x} cy={y} r={2.5} fill="#1677ff" />;
      })}
    </svg>
  );
}

export default function Page() {
  return (
    <div className="min-h-screen font-sans p-2 md:p-6 flex flex-col gap-6">
      {/* التنبيهات الذكية */}
      <Space direction="vertical" className="w-full">
        {alerts.map((alert, idx) => (
          <Alert
            key={idx}
            type={alert.type as any}
            message={alert.message}
            showIcon
            className="rounded-md shadow-sm"
          />
        ))}
      </Space>

      {/* قسم تحليلات الفواتير المشبوهة */}
      <Card
        title="تحليلات الفواتير المشبوهة"
        className="shadow-sm"
        extra={
          suspiciousRate > 30 ? (
            <Alert
              type="error"
              message={`تنبيه: نسبة الفواتير المشبوهة مرتفعة (${suspiciousRate}%)`}
              showIcon
              className="rounded-md"
            />
          ) : null
        }
      >
        <div className="overflow-x-auto font-sans">
          <Table
            dataSource={suspiciousInvoices}
            pagination={false}
            className="mt-2 min-w-[600px]"
            columns={[
              {
                title: "رقم الفاتورة",
                dataIndex: "number",
              },
              {
                title: "اسم المندوب",
                dataIndex: "rep",
              },
              {
                title: "اسم العميل",
                dataIndex: "client",
              },
              {
                title: "السعر",
                dataIndex: "price",
                render: (v: number) => `${v.toLocaleString()} ج.م`,
              },
              {
                title: "الخصم",
                dataIndex: "discount",
              },
              {
                title: "درجة الخطورة",
                dataIndex: "risk",
                render: (v: string) => (
                  <Tag
                    color={
                      v === "مرتفعة" ? "red" : v === "متوسطة" ? "orange" : "green"
                    }
                  >
                    {v}
                  </Tag>
                ),
              },
              {
                title: "ملاحظات",
                dataIndex: "notes",
              },
            ]}
            scroll={{ x: 600 }}
          />
        </div>
      </Card>
      {/* قسم تقييم أداء المندوبين */}
      <Card title="تقييم أداء المندوبين" className="shadow-sm">
        <div className="overflow-x-auto font-sans">
          <Table
            dataSource={repsPerformance}
            pagination={false}
            className="min-w-[600px]"
            columns={[
              {
                title: "اسم المندوب",
                dataIndex: "name",
              },
              {
                title: "التقييم العام",
                dataIndex: "rating",
                render: (v: number) => (
                  <Tag color={v >= 4 ? "green" : v >= 3 ? "orange" : "red"}>
                    {v}
                  </Tag>
                ),
              },
              {
                title: "نسبة التحصيل",
                dataIndex: "collection",
                render: (v: string) => (
                  <Progress
                    percent={parseInt(v)}
                    size="small"
                    status={
                      parseInt(v) > 80
                        ? "success"
                        : parseInt(v) > 60
                        ? "active"
                        : "exception"
                    }
                    showInfo={false}
                  />
                ),
              },
              {
                title: "الالتزام بخط السير",
                dataIndex: "route",
                render: (v: string) => (
                  <Tag
                    color={v === "ممتاز" ? "green" : v === "جيد" ? "blue" : "red"}
                  >
                    {v}
                  </Tag>
                ),
              },
              {
                title: "نسبة المرتجعات",
                dataIndex: "returns",
                render: (v: string) => (
                  <Tag
                    color={
                      parseInt(v) < 5
                        ? "green"
                        : parseInt(v) < 10
                        ? "orange"
                        : "red"
                    }
                  >
                    {v}
                  </Tag>
                ),
              },
              {
                title: "نقاط الأداء",
                dataIndex: "points",
                render: (v: number) => (
                  <Badge
                    count={v}
                    style={{
                      backgroundColor:
                        v > 90 ? "#52c41a" : v > 70 ? "#1890ff" : "#f5222d",
                    }}
                  />
                ),
              },
              {
                title: "الحالة",
                dataIndex: "status",
                render: (v: string) => (
                  <Tag
                    color={
                      v === "جيد جدًا" ? "green" : v === "جيد" ? "blue" : "red"
                    }
                  >
                    {v}
                  </Tag>
                ),
              },
            ]}
            scroll={{ x: 600 }}
          />
        </div>
      </Card>

      {/* قسم التوصيات الذكية */}
      <Card title="التوصيات الذكية" className="shadow-sm">
        <div className="flex flex-row gap-4 overflow-x-auto py-2">
          {recommendations.map((rec) => (
            <Card
              key={rec.key}
              type="inner"
              title={
                <span className="font-bold">{rec.text}</span>
              }
              className="min-w-[260px] max-w-xs border-blue-200 border-2 shadow-md"
            >
              <div className=" text-sm mt-2">
                <b>ملاحظة:</b> {rec.note}
              </div>
            </Card>
          ))}
        </div>
      </Card>
    </div>
  );
}
