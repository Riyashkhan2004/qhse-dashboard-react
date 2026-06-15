import React from "react";
import {
  Card,
  Form,
  Select,
  Input,
  InputNumber,
  Button,
  Row,
  Col,
  ConfigProvider,
  DatePicker,
  Typography,
} from "antd";
import dayjs from "dayjs";
import "antd/dist/reset.css";

const { Title, Text } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

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
const RIGS = ["Rig 1", "Rig 2", "Rig 3", "Rig 4", "Rig 5"];
const INSPECTION_TYPES = ["RSI", "QSI", "WCI", "LPD Visits", "Div Internal"];
const PRIORITIES = ["P1", "P2", "P3", "P4"];
const STATUSES = ["Open", "Closed", "In Progress", "Rejected"];

/* ── Inspection Form ────────────────────────────────────── */
const InspectionForm: React.FC = () => {
  const [form] = Form.useForm();

  const onFinish = (values: any) => {
    const formatted = {
      ...values,
      dateOpened: values.dateOpened ? dayjs(values.dateOpened).format("YYYY-MM-DD") : null,
      targetDate: values.targetDate ? dayjs(values.targetDate).format("YYYY-MM-DD") : null,
    };
    console.log("Inspection Submitted:", formatted);
  };

  return (
    <Form layout="vertical" form={form} onFinish={onFinish}>
      <Row gutter={[16, 16]}>
        {/* Rig */}
        <Col xs={24} sm={24} md={8} lg={8}>
          <Form.Item
            label="Rig"
            name="rig"
            rules={[{ required: true, message: "Please enter rig name" }]}
          >
            <Input
              placeholder="Enter Rig name"
              size="large"
            />
          </Form.Item>
        </Col>

        {/* Inspection Type */}
        <Col xs={24} sm={24} md={8} lg={8}>
          <Form.Item
            label="Inspection Type"
            name="inspectionType"
            rules={[{ required: true, message: "Please select inspection type" }]}
          >
            <Select placeholder="Select Inspection Type" size="large" showSearch>
              {INSPECTION_TYPES.map((type) => (
                <Option key={type} value={type}>
                  {type}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>

        {/* Inspection Value */}
        <Col xs={24} sm={24} md={8} lg={8}>
          <Form.Item
            label="Inspection Value"
            name="inspectionValue"
            rules={[
              { required: true, message: "Please enter inspection value" },
              { type: "number", min: 0, message: "Value must be 0 or greater" },
            ]}
          >
            <InputNumber
              min={0}
              precision={0}
              placeholder="Enter inspection value"
              size="large"
              style={{ width: "100%" }}
            />
          </Form.Item>
        </Col>

        {/* Priority */}
        <Col xs={24} sm={24} md={12} lg={12}>
          <Form.Item
            label="Priority"
            name="priority"
            rules={[{ required: true, message: "Please select priority" }]}
          >
            <Select placeholder="Select Priority" size="large">
              {PRIORITIES.map((priority) => (
                <Option key={priority} value={priority}>
                  {priority}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>

        {/* Target Date */}
        <Col xs={24} sm={24} md={12} lg={12}>
          <Form.Item
            label="Target Date"
            name="targetDate"
            rules={[{ required: true, message: "Please select target date" }]}
          >
            <DatePicker
              style={{ width: "100%" }}
              size="large"
              placeholder="Select Target Date"
              format="YYYY-MM-DD"
            />
          </Form.Item>
        </Col>

        {/* Date Opened */}
        <Col xs={24} sm={24} md={12} lg={12}>
          <Form.Item
            label="Date Opened"
            name="dateOpened"
            rules={[{ required: true, message: "Please select date opened" }]}
          >
            <DatePicker
              style={{ width: "100%" }}
              size="large"
              placeholder="Select Date Opened"
              format="YYYY-MM-DD"
            />
          </Form.Item>
        </Col>

        {/* Status */}
        <Col xs={24} sm={24} md={12} lg={12}>
          <Form.Item
            label="Status"
            name="status"
            rules={[{ required: true, message: "Please select status" }]}
          >
            <Select placeholder="Select Status" size="large">
              {STATUSES.map((status) => (
                <Option key={status} value={status}>
                  {status}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>

        {/* Remarks */}
        <Col xs={24} sm={24} md={24} lg={24}>
          <Form.Item
            label="Remarks"
            name="remarks"
          >
            <Input.TextArea
              rows={2}
              placeholder="Enter remarks"
              size="large"
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
          style={{ minWidth: 120, height: 44, fontSize: 15 }}
        >
          Submit Inspection
        </Button>
      </div>
    </Form>
  );
};

/* ── Root ───────────────────────────────────────────────── */
const Inspection: React.FC = () => (
  <ConfigProvider theme={antdTheme}>
    <style>{`
      .ant-picker { width: 100% !important; }
      .ant-input, .ant-input-number, .ant-select-selector { width: 100% !important; }
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
        maxWidth: 960,
        margin: "0 auto",
        boxSizing: "border-box",
      }}
    >
      <Title
        level={3}
        style={{ marginBottom: 4, fontSize: "clamp(18px, 3vw, 24px)", textAlign: "center" }}
      >
        Inspection Entry
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
        Submit inspection records
      </Text>

      <Card
        style={{
          marginTop: 20,
          borderRadius: 12,
          boxShadow: "0 2px 12px rgba(21,101,192,0.08)",
        }}
      >
        <InspectionForm />
      </Card>
    </div>
  </ConfigProvider>
);

export default Inspection;