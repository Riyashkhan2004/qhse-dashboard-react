import React, { useEffect, useState } from "react";
import {
  Card,
  Form,
  Input,
  Select,
  InputNumber,
  Button,
  Row,
  Col,
  ConfigProvider,
  DatePicker,
  Typography,
  message,
  Table,
} from "antd";
import dayjs from "dayjs";
import "antd/dist/reset.css";
import { mvvAPI, MVVRecord } from "../../services/mvvAPI";

const { Title, Text } = Typography;
const { Option } = Select;
const { MonthPicker } = DatePicker;

/* ── Theme ─────────────────────────────────────────────── */
const antdTheme = {
  token: {
    colorPrimary: "#1565C0",
    colorBorder: "rgba(21,101,192,0.2)",
    borderRadius: 8,
    fontFamily: '"Inter", "Helvetica Neue", sans-serif',
    colorText: "#0D1F3C",
    colorBgContainer: "#FFFFFF",
    controlHeight: 36,
    fontSize: 14,
  },
};

/* ── Data ───────────────────────────────────────────────── */
const VIOLATION_TYPES = [
  "Handheld Device",
  "Illegal Modification", 
  "MVPI Expire",
  "Not a Seat Belt",
  "On Road Traffic Violation",
  "Over Speed",
  "RoadLine Not Following",
  "Wrong Parking"
];

/* ── Table Columns ──────────────────────────────────────── */
const columns = [
  {
    title: "ID",
    dataIndex: "id",
    key: "id",
    width: 60,
  },
  {
    title: "Project",
    dataIndex: "project",
    key: "project",
  },
  {
    title: "Violation Type",
    dataIndex: "violation_type",
    key: "violation_type",
  },
  {
    title: "MVV Count",
    dataIndex: "mvv_count",
    key: "mvv_count",
    align: "center" as const,
  },
  {
    title: "Reporting Month",
    dataIndex: "reporting_month",
    key: "reporting_month",
    render: (date: string) => dayjs(date).format("MMMM YYYY"),
  },
  {
    title: "Created At",
    dataIndex: "created_at",
    key: "created_at",
    render: (datetime: string) => dayjs(datetime).format("YYYY-MM-DD HH:mm"),
  },
];

/* ── MVV Form ───────────────────────────────────────────── */
const MVVForm: React.FC<{ onSuccess: () => void }> = ({ onSuccess }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      // Format the data for backend API
      const reportingMonth = values.month ? dayjs(values.month).format("YYYY-MM-01") : "";
      
      const formatted = {
        project: values.project,
        violation_type: values.violationType,
        mvv_count: values.mvvCount,
        reporting_month: reportingMonth,
      };
      
      await mvvAPI.create(formatted);
      message.success("MVV record submitted successfully!");
      form.resetFields();
      onSuccess();
    } catch (error: any) {
      message.error(error.response?.data?.detail || "Failed to submit MVV record");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form layout="vertical" form={form} onFinish={onFinish}>
      <Row gutter={[16, 16]}>
        {/* Project */}
        <Col xs={24} sm={24} md={12} lg={12}>
          <Form.Item
            label="Project"
            name="project"
            rules={[{ required: true, message: "Please enter project name" }]}
          >
            <Input placeholder="Enter project name" size="large" />
          </Form.Item>
        </Col>

        {/* Violation Type */}
        <Col xs={24} sm={24} md={12} lg={12}>
          <Form.Item
            label="Violation Type"
            name="violationType"
            rules={[{ required: true, message: "Please select a violation type" }]}
          >
            <Select placeholder="Select Violation Type" size="large" showSearch>
              {VIOLATION_TYPES.map((type) => (
                <Option key={type} value={type}>
                  {type}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>

        {/* MVV Count */}
        <Col xs={24} sm={24} md={12} lg={12}>
          <Form.Item
            label="MVV Count"
            name="mvvCount"
            rules={[
              { required: true, message: "Please enter MVV count" },
              { type: "number", min: 0, message: "Value must be 0 or greater" },
            ]}
          >
            <InputNumber
              min={0}
              precision={0}
              placeholder="Enter MVV count"
              size="large"
              style={{ width: "100%" }}
            />
          </Form.Item>
        </Col>

        {/* Month */}
        <Col xs={24} sm={24} md={12} lg={12}>
          <Form.Item
            label="Select Month"
            name="month"
            rules={[{ required: true, message: "Please select a month" }]}
          >
            <MonthPicker
              style={{ width: "100%" }}
              size="large"
              placeholder="Select Month"
              format="MMMM YYYY"
            />
          </Form.Item>
        </Col>
      </Row>

      {/* Actions */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "flex-end",
          gap: 10,
          marginTop: 20,
        }}
      >
        <Button
          style={{ minWidth: 120, height: 44, fontSize: 15 }}
          onClick={() => form.resetFields()}
        >
          Reset
        </Button>
        <Button
          type="primary"
          htmlType="submit"
          loading={loading}
          style={{ minWidth: 120, height: 44, fontSize: 15 }}
        >
          Submit MVV
        </Button>
      </div>
    </Form>
  );
};

/* ── Root ───────────────────────────────────────────────── */
const MVV: React.FC = () => {
  const [mvvData, setMvvData] = useState<MVVRecord[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchMVVRecords = async () => {
    setLoading(true);
    try {
      const data = await mvvAPI.getAll();
      setMvvData(data);
    } catch (error: any) {
      message.error(error.response?.data?.detail || "Failed to fetch MVV records");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMVVRecords();
  }, []);

  return (
    <ConfigProvider theme={antdTheme}>
      <style>{`
        .ant-picker { width: 100% !important; }
        .ant-input-number { width: 100% !important; }
        @media (min-width: 600px) and (max-width: 1024px) {
          .ant-select-selector,
          .ant-input,
          .ant-input-number,
          .ant-picker { min-height: 38px !important; font-size: 14px !important; }
          .ant-form-item-label > label { font-size: 13px !important; }
        }
      `}</style>

      <div
        style={{
          padding: "clamp(12px, 4vw, 32px)",
          maxWidth: 1200,
          margin: "0 auto",
          boxSizing: "border-box",
        }}
      >
        <Title
          level={3}
          style={{ marginBottom: 4, fontSize: "clamp(18px, 3vw, 24px)", textAlign: "center" }}
        >
          MVV Entry
        </Title>
        <Text
          type="secondary"
          style={{
            display: "block",
            marginBottom: 0,
            fontSize: "clamp(12px, 2vw, 14px)",
            textAlign: "center",
          }}
        >
          Submit Monthly Vehicle Verification records
        </Text>

        <Card
          style={{
            marginTop: 20,
            borderRadius: 12,
            boxShadow: "0 2px 12px rgba(21,101,192,0.08)",
          }}
        >
          <MVVForm onSuccess={fetchMVVRecords} />
        </Card>

        <Card
          style={{
            marginTop: 20,
            borderRadius: 12,
            boxShadow: "0 2px 12px rgba(21,101,192,0.08)",
          }}
          title="MVV Records"
        >
          <Table
            columns={columns}
            dataSource={mvvData}
            loading={loading}
            rowKey="id"
            pagination={{ pageSize: 10 }}
            scroll={{ x: "max-content" }}
          />
        </Card>
      </div>
    </ConfigProvider>
  );
};

export default MVV;
