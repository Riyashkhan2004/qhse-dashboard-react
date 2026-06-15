import React from "react";
import {
  Card,
  Form,
  Input,
  Select,
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
const STATUSES = ["Open", "Closed", "In Progress", "Rejected"];

/* ── Corrective Form ────────────────────────────────────── */
const CorrectiveForm: React.FC = () => {
  const [form] = Form.useForm();

  const onFinish = (values: any) => {
    const formatted = {
      ...values,
      targetCompletionDate: values.targetCompletionDate ? dayjs(values.targetCompletionDate).format("YYYY-MM-DD") : null,
      completionDate: values.completionDate ? dayjs(values.completionDate).format("YYYY-MM-DD") : null,
    };
    console.log("Corrective Submitted:", formatted);
  };

  return (
    <Form layout="vertical" form={form} onFinish={onFinish}>
      <Row gutter={[16, 16]}>
        {/* Rig */}
        <Col xs={24} sm={24} md={12} lg={12}>
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

        {/* Target Completion Date */}
        <Col xs={24} sm={24} md={12} lg={12}>
          <Form.Item
            label="Target Completion Date"
            name="targetCompletionDate"
            rules={[{ required: true, message: "Please select target completion date" }]}
          >
            <DatePicker
              style={{ width: "100%" }}
              size="large"
              placeholder="Select Target Completion Date"
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

        {/* Completion Date */}
        <Col xs={24} sm={24} md={12} lg={12}>
          <Form.Item
            label="Completion Date"
            name="completionDate"
          >
            <DatePicker
              style={{ width: "100%" }}
              size="large"
              placeholder="Select Completion Date"
              format="YYYY-MM-DD"
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
          Submit Corrective
        </Button>
      </div>
    </Form>
  );
};

/* ── Root ───────────────────────────────────────────────── */
const Corrective: React.FC = () => (
  <ConfigProvider theme={antdTheme}>
    <style>{`
      .ant-picker { width: 100% !important; }
      .ant-input, .ant-input-number, .ant-select-selector { width: 100% !important; }
      @media (min-width: 600px) and (max-width: 1024px) {
        .ant-select-selector,
        .ant-input,
        .ant-input-number,
        .ant-picker { min-height: 46px !important; font-size: 15px !important; }
        .ant-form-item-label > label { font-size: 14px !important; }
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
        Corrective Action Entry
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
        Submit corrective action records
      </Text>

      <Card
        style={{
          marginTop: 20,
          borderRadius: 12,
          boxShadow: "0 2px 12px rgba(21,101,192,0.08)",
        }}
      >
        <CorrectiveForm />
      </Card>
    </div>
  </ConfigProvider>
);

export default Corrective;