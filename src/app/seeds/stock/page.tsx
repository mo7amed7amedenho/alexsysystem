"use client";
import React, { useState, useMemo, useRef } from "react";
import {
  ConfigProvider,
  Table,
  Tag,
  Button,
  Input,
  Select,
  DatePicker,
  Space,
  Modal,
  Form,
  InputNumber,
  Switch,
  Drawer,
  Tooltip,
  message,
  notification,
  Card,
  Statistic,
  Row,
  Col,
  Divider,
  Typography,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  InfoCircleOutlined,
  BarcodeOutlined,
  PrinterOutlined,
  SearchOutlined,
  CameraOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import dayjs, { Dayjs } from "dayjs";

const { Title, Text } = Typography;

// بيانات تجريبية
const seedTypes = [
  { label: "قمح", value: "قمح" },
  { label: "ذرة", value: "ذرة" },
  { label: "أرز", value: "أرز" },
  { label: "شعير", value: "شعير" },
];

const statusColors: Record<string, string> = {
  صالح: "green",
  "قريب الانتهاء": "orange",
  منتهي: "red",
};

const statusOptions = [
  { label: "صالح", value: "صالح" },
  { label: "منتهي", value: "منتهي" },
  { label: "قريب الانتهاء", value: "قريب الانتهاء" },
];

const initialData = [
  {
    key: "1",
    name: "قمح مصري",
    type: "قمح",
    lot: "LOT1234",
    quantity: 1200,
    expDate: "2025-01-10",
    prodDate: "2024-01-10",
    status: "صالح",
    barcode: "1234567890123",
    sold: 300,
    customers: ["شركة النيل", "مزرعة أ"],
    availableWith: "مخزن 1",
    movements: [
      {
        from: "المخزن الرئيسي",
        to: "مخزن 1",
        quantity: 200,
        type: "out",
        date: "2024-03-01",
      },
      {
        from: "مخزن 1",
        to: "مزرعة أ",
        quantity: 50,
        type: "out",
        date: "2024-04-10",
      },
    ],
  },
  {
    key: "2",
    name: "ذرة صفراء",
    type: "ذرة",
    lot: "LOT5678",
    quantity: 800,
    expDate: "2024-08-15",
    prodDate: "2023-08-15",
    status: "قريب الانتهاء",
    barcode: "9876543210987",
    sold: 600,
    customers: ["شركة الوادي"],
    availableWith: "مخزن 2",
    movements: [
      {
        from: "المخزن الرئيسي",
        to: "مخزن 2",
        quantity: 100,
        type: "out",
        date: "2024-06-01",
      },
    ],
  },
  {
    key: "3",
    name: "أرز هجين",
    type: "أرز",
    lot: "LOT9999",
    quantity: 0,
    expDate: "2023-05-20",
    prodDate: "2022-05-20",
    status: "منتهي",
    barcode: "5555555555555",
    sold: 1000,
    customers: ["مزرعة ب"],
    availableWith: "غير متوفر",
    movements: [],
  },
];

const movementColumns = [
  { title: "من", dataIndex: "from", key: "from" },
  { title: "إلى", dataIndex: "to", key: "to" },
  { title: "الكمية", dataIndex: "quantity", key: "quantity" },
  {
    title: "نوع الحركة",
    dataIndex: "type",
    key: "type",
    render: (t: string) =>
      t === "in" ? (
        <Tag color="green">دخول</Tag>
      ) : (
        <Tag color="orange">خروج</Tag>
      ),
  },
  { title: "التاريخ", dataIndex: "date", key: "date" },
];

const pageTitle = "إدارة مخزون البذور – قسم البذور في نظام ERP زراعي";

const StockPage: React.FC = () => {
  // State
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [barcodeSearch, setBarcodeSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<string | undefined>();
  const [dateRange, setDateRange] = useState<
    [Dayjs | null, Dayjs | null] | null
  >(null);
  const [statusFilter, setStatusFilter] = useState<string | undefined>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<any>(null);
  const [form] = Form.useForm();
  const [autoBarcode, setAutoBarcode] = useState(true);
  const [scanMode, setScanMode] = useState(false);
  const barcodeInputRef = useRef<any>(null);

  // فلترة البيانات
  const filteredData = useMemo(() => {
    let filtered = [...data];
    if (search) {
      filtered = filtered.filter(
        (item) => item.name.includes(search) || item.lot.includes(search)
      );
    }
    if (barcodeSearch) {
      filtered = filtered.filter((item) =>
        item.barcode.includes(barcodeSearch)
      );
    }
    if (typeFilter) {
      filtered = filtered.filter((item) => item.type === typeFilter);
    }
    if (dateRange && dateRange[0] && dateRange[1]) {
      filtered = filtered.filter(
        (item) =>
          dayjs(item.prodDate).isAfter(dateRange[0]!.subtract(1, "day")) &&
          dayjs(item.prodDate).isBefore(dateRange[1]!.add(1, "day"))
      );
    }
    if (statusFilter) {
      filtered = filtered.filter((item) => item.status === statusFilter);
    }
    return filtered;
  }, [data, search, barcodeSearch, typeFilter, dateRange, statusFilter]);

  // Dashboard Cards
  const totalCount = data.length;
  const expiredCount = data.filter((d) => d.status === "منتهي").length;
  const nearExpireCount = data.filter(
    (d) => d.status === "قريب الانتهاء"
  ).length;
  const totalQuantity = data.reduce((acc, d) => acc + d.quantity, 0);
  const totalSold = data.reduce((acc, d) => acc + (d.sold || 0), 0);
  const mostSold = data.reduce(
    (max, d) => (d.sold > (max?.sold || 0) ? d : max),
    null as any
  );

  // أعمدة الجدول
  const columns = [
    {
      title: "النوع",
      dataIndex: "type",
      key: "type",
      filters: seedTypes.map((t) => ({ text: t.label, value: t.value })),
      onFilter: (value: any, record: any) => record.type === value,
      responsive: ["sm", "md", "lg"],
    },
    {
      title: "اسم الصنف",
      dataIndex: "name",
      key: "name",
      ellipsis: true,
      responsive: ["xs", "sm", "md", "lg"],
    },

    {
      title: "رقم LOT",
      dataIndex: "lot",
      key: "lot",
      ellipsis: true,
      responsive: ["sm", "md", "lg"],
    },
    {
      title: "الكمية الحالية",
      dataIndex: "quantity",
      key: "quantity",
      align: "center" as const,
      responsive: ["xs", "sm", "md", "lg"],
    },
    {
      title: "تاريخ الانتهاء",
      dataIndex: "expDate",
      key: "expDate",
      render: (date: string) => dayjs(date).format("YYYY-MM-DD"),
      responsive: ["md", "lg"],
    },
    {
      title: "حالة الصنف",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <Tag color={statusColors[status] || "default"}>{status}</Tag>
      ),
      responsive: ["xs", "sm", "md", "lg"],
    },
    {
      title: "إجراءات",
      key: "actions",
      fixed: "right" as const,
      render: (_: any, record: any) => (
        <Space>
          <Tooltip title="تعديل">
            <Button
              icon={<EditOutlined />}
              size="small"
              type="text"
              onClick={() => handleEdit(record)}
            />
          </Tooltip>
          <Tooltip title="حذف">
            <Button
              icon={<DeleteOutlined />}
              size="small"
              type="text"
              danger
              onClick={() => handleDelete(record)}
            />
          </Tooltip>
          <Tooltip title="تفاصيل">
            <Button
              icon={<InfoCircleOutlined />}
              size="small"
              type="text"
              onClick={() => handleShowDetails(record)}
            />
          </Tooltip>
          <Tooltip title="طباعة باركود">
            <Button
              icon={<PrinterOutlined />}
              size="small"
              type="text"
              onClick={() => handlePrintBarcode(record.barcode)}
            />
          </Tooltip>
        </Space>
      ),
      responsive: ["xs", "sm", "md", "lg"],
    },
  ];

  // إجراءات
  const handleEdit = (record: any) => {
    form.setFieldsValue({
      ...record,
      prodDate: dayjs(record.prodDate),
      expDate: dayjs(record.expDate),
      barcode: record.barcode,
    });
    setAutoBarcode(!record.barcode || record.barcode.length < 5);
    setIsModalOpen(true);
  };

  const handleDelete = (record: any) => {
    Modal.confirm({
      title: `تأكيد حذف الصنف (${record.name})؟`,
      okText: "حذف",
      okType: "danger",
      cancelText: "إلغاء",
      onOk: () => {
        setData((prev) => prev.filter((item) => item.key !== record.key));
        message.success("تم حذف الصنف بنجاح");
      },
    });
  };

  const handleShowDetails = (record: any) => {
    setSelectedRow(record);
    setIsDrawerOpen(true);
  };

  // إضافة صنف جديد
  const handleAddNew = () => {
    form.resetFields();
    setAutoBarcode(true);
    setIsModalOpen(true);
  };

  // حفظ الصنف
  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      const newItem = {
        ...values,
        key: Math.random().toString(36).substr(2, 9),
        prodDate: values.prodDate.format("YYYY-MM-DD"),
        expDate: values.expDate.format("YYYY-MM-DD"),
        status: getStatus(values.expDate),
        barcode: autoBarcode ? generateBarcode() : values.barcode,
        sold: 0,
        customers: [],
        availableWith: "المخزن الرئيسي",
        movements: [],
      };
      setData((prev) => [newItem, ...prev]);
      setIsModalOpen(false);
      message.success("تم إضافة الصنف بنجاح");
      notification.success({
        message: "نجاح",
        description: "تم حفظ الصنف الجديد في المخزون.",
      });
    } catch (err) {
      //
    } finally {
      setLoading(false);
    }
  };

  // توليد باركود عشوائي
  const generateBarcode = () => {
    return (
      Date.now().toString().slice(-10) +
      Math.floor(Math.random() * 1000).toString()
    );
  };

  // تحديد حالة الصنف بناءً على تاريخ الانتهاء
  const getStatus = (expDate: Dayjs | string) => {
    const now = dayjs();
    const exp = typeof expDate === "string" ? dayjs(expDate) : expDate;
    if (exp.isBefore(now, "day")) return "منتهي";
    if (exp.diff(now, "month") <= 2) return "قريب الانتهاء";
    return "صالح";
  };

  // طباعة باركود
  const handlePrintBarcode = (barcode: string) => {
    // UI فقط
    message.info(`تم إرسال الباركود للطابعة: ${barcode}`);
  };

  // بحث بالباركود
  const handleBarcodeSearch = (val: string) => {
    setBarcodeSearch(val);
    if (val.length > 4) {
      const found = data.find((item) => item.barcode === val);
      if (found) {
        setSelectedRow(found);
        setIsDrawerOpen(true);
      }
    }
  };

  // توسيع الصفوف (مستقبلاً)
  const expandable = {
    expandedRowRender: (record: any) => (
      <div style={{ color: "#888" }}>تفاصيل إضافية مستقبلية...</div>
    ),
    rowExpandable: () => false, // يمكن تفعيلها لاحقاً
  };

  // رندر الصفحة
  return (
    <div style={{ padding: 8, maxWidth: 1400, margin: "auto" }}>
      <Title level={3} style={{ textAlign: "center", marginBottom: 16 }}>
        {pageTitle}
      </Title>
      {/* أدوات التحكم */}
      <Card style={{ marginBottom: 16 }} bodyStyle={{ padding: 12 }}>
        <Row gutter={[8, 8]} align="middle" wrap>
          <Col xs={24} sm={12} md={6}>
            <Input
              allowClear
              prefix={<SearchOutlined />}
              placeholder="بحث بالاسم أو رقم LOT"
              onChange={(e) => setSearch(e.target.value)}
              style={{ width: "100%" }}
            />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Input.Group compact>
              <Input
                ref={barcodeInputRef}
                allowClear
                placeholder="بحث بالباركود"
                value={barcodeSearch}
                onChange={(e) => handleBarcodeSearch(e.target.value)}
                style={{ width: "70%" }}
              />
              <Button
                icon={<CameraOutlined />}
                style={{ width: "30%" }}
                onClick={() => {
                  setScanMode(true);
                  message.info("تم تفعيل وضع مسح الباركود بالكاميرا (UI فقط)");
                }}
              >
                <span style={{ display: "none" }}>مسح</span>
              </Button>
            </Input.Group>
          </Col>
          <Col xs={24} sm={12} md={4}>
            <Select
              allowClear
              placeholder="نوع البذرة"
              options={seedTypes}
              style={{ width: "100%" }}
              onChange={setTypeFilter}
            />
          </Col>
          <Col xs={24} sm={12} md={4}>
            <Select
              allowClear
              placeholder="حالة الصنف"
              options={statusOptions}
              style={{ width: "100%" }}
              onChange={setStatusFilter}
            />
          </Col>

          <Col xs={24} sm={12} md={4} style={{ textAlign: "end" }}>
            <Button
              type="default"
              icon={<PlusOutlined />}
              onClick={handleAddNew}
              style={{ minWidth: 120 }}
            >
              إضافة صنف جديد
            </Button>
          </Col>
        </Row>
      </Card>

      {/* كروت Dashboard */}
      <Row gutter={[12, 12]} style={{ marginBottom: 16 }}>
        <Col xs={12} sm={8} md={4}>
          <Card bordered={false} size="small">
            <Statistic
              title="عدد الأصناف الكلي"
              value={totalCount}
              valueStyle={{ color: "#52c41a" }}
              prefix={<FileTextOutlined />}
            />
          </Card>
        </Col>
        <Col xs={12} sm={8} md={4}>
          <Card bordered={false} size="small">
            <Statistic
              title="منتهية الصلاحية"
              value={expiredCount}
              valueStyle={{ color: "#ff4d4f" }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={8} md={4}>
          <Card bordered={false} size="small">
            <Statistic
              title="قريبة الانتهاء"
              value={nearExpireCount}
              valueStyle={{ color: "#faad14" }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={8} md={4}>
          <Card bordered={false} size="small">
            <Statistic
              title="إجمالي الكمية المتاحة"
              value={totalQuantity}
              valueStyle={{ color: "#52c41a" }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={8} md={4}>
          <Card bordered={false} size="small">
            <Statistic
              title="إجمالي الكمية المُباعة"
              value={totalSold}
              valueStyle={{ color: "#1890ff" }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={8} md={4}>
          <Card bordered={false} size="small">
            <Statistic
              title="أكثر صنف مبيعًا"
              value={mostSold?.name || "-"}
              valueStyle={{ color: "#52c41a" }}
            />
          </Card>
        </Col>
      </Row>

      {/* الجدول */}
      <Table
        columns={columns}
        dataSource={filteredData}
        loading={loading}
        pagination={{ pageSize: 8, showSizeChanger: false }}
        rowKey="key"
        bordered
        size="small"
        style={{ background: "none" }}
        locale={{ emptyText: "لا توجد بيانات" }}
      />

      {/* Modal إضافة/تعديل صنف */}
      <Modal
        title="إضافة صنف جديد"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={handleSave}
        okText="حفظ"
        confirmLoading={loading}
        destroyOnClose
        centered
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            quantity: 1,
            prodDate: dayjs(),
            expDate: dayjs().add(1, "year"),
          }}
        >
          <Form.Item
            name="name"
            label="اسم البذرة"
            rules={[{ required: true, message: "يرجى اختيار اسم البذرة" }]}
          >
            <Select
              showSearch
              placeholder="اختر اسم البذرة"
              options={seedTypes}
              filterOption={(input, option) =>
                (option?.label ?? "").includes(input)
              }
            />
          </Form.Item>
          <Form.Item
            name="type"
            label="نوع البذرة"
            rules={[{ required: true, message: "يرجى اختيار النوع" }]}
          >
            <Select options={seedTypes} placeholder="نوع البذرة" />
          </Form.Item>
          <Form.Item
            name="lot"
            label="رقم LOT"
            rules={[{ required: true, message: "يرجى إدخال رقم LOT" }]}
          >
            <Input placeholder="رقم LOT" />
          </Form.Item>
          <Form.Item
            name="quantity"
            label="الكمية"
            rules={[{ required: true, message: "يرجى إدخال الكمية" }]}
          >
            <InputNumber
              min={1}
              style={{ width: "100%" }}
              placeholder="الكمية"
            />
          </Form.Item>
          <Form.Item
            name="prodDate"
            label="تاريخ الإنتاج"
            rules={[{ required: true, message: "يرجى اختيار تاريخ الإنتاج" }]}
          >
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            name="expDate"
            label="تاريخ الانتهاء"
            rules={[{ required: true, message: "يرجى اختيار تاريخ الانتهاء" }]}
          >
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item label="توليد الباركود تلقائيًا" valuePropName="checked">
            <Switch checked={autoBarcode} onChange={setAutoBarcode} />
          </Form.Item>
          {!autoBarcode && (
            <Form.Item
              name="barcode"
              label="الباركود"
              rules={[{ required: true, message: "يرجى إدخال الباركود" }]}
            >
              <Input placeholder="الباركود" />
            </Form.Item>
          )}
        </Form>
      </Modal>

      {/* Drawer تفاصيل الصنف */}
      <Drawer
        title={
          selectedRow ? `تفاصيل الصنف: ${selectedRow.name}` : "تفاصيل الصنف"
        }
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        width={Math.min(
          500,
          typeof window !== "undefined" ? window.innerWidth - 40 : 500
        )}
        placement="right"
        destroyOnClose
      >
        {selectedRow && (
          <>
            <div style={{ marginBottom: 16 }}>
              <b>اسم البذرة:</b> {selectedRow.name}
              <br />
              <b>النوع:</b> {selectedRow.type}
              <br />
              <b>رقم LOT:</b> {selectedRow.lot}
              <br />
              <b>الكمية المتبقية:</b> {selectedRow.quantity}
              <br />
              <b>الكمية المباعة:</b> {selectedRow.sold || 0}
              <br />
              <b>تاريخ الإنتاج:</b>{" "}
              {dayjs(selectedRow.prodDate).format("YYYY-MM-DD")}
              <br />
              <b>تاريخ الانتهاء:</b>{" "}
              {dayjs(selectedRow.expDate).format("YYYY-MM-DD")}
              <br />
              <b>حالة الصنف:</b>{" "}
              <Tag color={statusColors[selectedRow.status] || "default"}>
                {selectedRow.status}
              </Tag>
              <br />
              <b>الباركود:</b> {selectedRow.barcode}
              <br />
              <b>العملاء/المندوبون:</b>{" "}
              {selectedRow.customers?.join("، ") || "-"}
              <br />
              <b>متوفر مع:</b> {selectedRow.availableWith || "-"}
            </div>
            <Button
              icon={<PrinterOutlined />}
              type="primary"
              block
              style={{ marginBottom: 16 }}
              onClick={() => window.print()}
            >
              طباعة تقرير عن هذا الصنف
            </Button>
            <Divider>حركات الصنف</Divider>
            <Table
              columns={movementColumns}
              dataSource={selectedRow.movements}
              size="small"
              pagination={false}
              locale={{ emptyText: "لا توجد حركات" }}
              rowKey={(_, i) => (i !== undefined ? i.toString() : "")}
              style={{ marginBottom: 16 }}
              scroll={{ x: 400 }}
            />
          </>
        )}
      </Drawer>

      {/* UI فقط: وضع مسح الباركود بالكاميرا */}
      <Modal
        open={scanMode}
        onCancel={() => setScanMode(false)}
        footer={null}
        centered
      >
        <div style={{ textAlign: "center", padding: 24 }}>
          <CameraOutlined style={{ fontSize: 48, color: "#52c41a" }} />
          <div style={{ margin: 16 }}>
            واجهة مسح الباركود بالكاميرا (UI فقط)
          </div>
          <Button type="primary" onClick={() => setScanMode(false)}>
            إغلاق
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default StockPage;
