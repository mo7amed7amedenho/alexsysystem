"use client";

import {
  Badge,
  Box,
  Divider,
  Group,
  Skeleton,
  Text,
  Timeline,
  Title,
} from "@mantine/core";
import {
  IconCalendar,
  IconInfoCircle,
  IconPhone,
  IconMapPin,
} from "@tabler/icons-react";

interface CustomerDetailsProps {
  customer: any;
}

export default function CustomerDetails({ customer }: CustomerDetailsProps) {
  // تنسيق التاريخ
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ar-EG", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Box>
      <Title order={2} mb="lg" className="text-green-700">
        {customer.name}
      </Title>

      <Group mb="xl">
        <Badge
          size="lg"
          variant="light"
          color={customer.kind === "فرد" ? "blue" : "green"}
        >
          {customer.kind || "غير محدد"}
        </Badge>

        <Badge size="lg" variant="light" color="gray">
          {customer.department || "غير محدد"}
        </Badge>
      </Group>

      <Divider my="xl" />

      <Title order={3} mb="md">
        معلومات الاتصال
      </Title>

      <Timeline active={0} bulletSize={28} lineWidth={2} mb="xl">
        <Timeline.Item bullet={<IconPhone size={16} />} title="رقم الهاتف">
          <Text size="lg" mt={4}>
            {customer.phone}
          </Text>
        </Timeline.Item>

        <Timeline.Item bullet={<IconMapPin size={16} />} title="العنوان">
          <Text size="lg" mt={4}>
            {customer.address || "غير محدد"}
          </Text>
        </Timeline.Item>
      </Timeline>

      <Divider my="xl" />

      <Title order={3} mb="md">
        المعلومات الزمنية
      </Title>

      <Timeline active={0} bulletSize={28} lineWidth={2}>
        <Timeline.Item
          bullet={<IconCalendar size={16} />}
          title="تاريخ الإنشاء"
        >
          <Text size="lg" mt={4}>
            {formatDate(customer.createdAt)}
          </Text>
        </Timeline.Item>

        <Timeline.Item bullet={<IconCalendar size={16} />} title="آخر تحديث">
          <Text size="lg" mt={4}>
            {formatDate(customer.updatedAt)}
          </Text>
        </Timeline.Item>
      </Timeline>

      <Divider my="xl" />

      <Title order={3} mb="md">
        معلومات إضافية
      </Title>

      <Group mb="sm">
        <Text>المستخدم المسؤول:</Text>
        <Text>{customer.userCreated}</Text>
      </Group>

      <Group>
        <Text>معرف العميل:</Text>
        <Text>{customer.id}</Text>
      </Group>
    </Box>
  );
}
