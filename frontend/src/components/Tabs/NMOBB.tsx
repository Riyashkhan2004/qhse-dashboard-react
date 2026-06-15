import React from "react";
import {
  Card,
  Form,
  Input,
  Select,
  InputNumber,
  Button,
  Tabs,
  Row,
  Col,
  ConfigProvider,
  DatePicker,
  Typography,
} from "antd";
import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";
import weekOfYear from "dayjs/plugin/weekOfYear";
import advancedFormat from "dayjs/plugin/advancedFormat";
import "antd/dist/reset.css";

dayjs.extend(isoWeek);
dayjs.extend(weekOfYear);
dayjs.extend(advancedFormat);

const { Title, Text } = Typography;
const { Option } = Select;
const { WeekPicker } = DatePicker;

/* ── Theme ─────────────────────────────────────────────── */
const antdTheme = {
  token: {
    colorPrimary: "#1565C0",
    colorBorder: "rgba(21,101,192,0.2)",
    borderRadius: 8,
    fontFamily: '"Inter", "Helvetica Neue", sans-serif',
    colorText: "#0D1F3C",
    colorBgContainer: "#FFFFFF",
    controlHeight: 36,          // smaller touch targets for compactness
    fontSize: 14,
  },
};

/* ── Data ───────────────────────────────────────────────── */
const NEAR_MISS_CATEGORIES = [
  "Slip, Trip & Fall","Poor Situational Awareness","Rigging & Lifting Operations",
  "Pinch Point","Hammering Job","Equipment Defective","Incorrect Use Of Tool",
  "Forklift/Crane Operations","Caught Between/In/On","Line Of Fire","Manual Handling",
  "Other","Pressure Release","Electrical Issue","Miss Communication","Poor Housekeeping",
  "Dropped Object","H2S System","Tong Operations","Fall Protection","3rd Party Vehicle",
  "PTW Violation","Genie Man Lift Operation",
];

const OBB_TYPES: string[] = []; // Manual entry only - no predefined list

const MAIN_CATEGORIES = [
  "Forklifts/Cranes/Trucks/Vehicles","Position of People",
  "Procedures and House Keeping","Tools and Equipment",
  "Personal Protective Equipment","Other",
];

/* ── Inline responsive styles ───────────────────────────── */
const styles: Record<string, React.CSSProperties> = {
  page: {
    padding: "clamp(12px, 4vw, 32px)",
    maxWidth: 960,
    margin: "0 auto",
    boxSizing: "border-box" as const,
  },
  headerWrap: {
    marginBottom: 4,
  },
  title: {
    marginBottom: "4px !important",
    fontSize: "clamp(18px, 3vw, 24px)",
  },
  subtitle: {
    fontSize: "clamp(12px, 2vw, 14px)",
    display: "block",
    marginBottom: 0,
  },
  card: {
    marginTop: 20,
    borderRadius: 12,
    boxShadow: "0 2px 12px rgba(21,101,192,0.08)",
  },
  actionRow: {
    display: "flex",
    flexWrap: "wrap" as const,
    justifyContent: "flex-end",
    gap: 10,
    marginTop: 20,
  },
  btn: {
    minWidth: 120,
    height: 44,
    fontSize: 15,
    flex: "0 0 auto",
  },
};

/* ── Shared form footer ─────────────────────────────────── */
const FormActions: React.FC<{ onReset: () => void; label: string }> = ({ onReset, label }) => (
  <div style={styles.actionRow}>
    <Button style={styles.btn} onClick={onReset}>Reset</Button>
    <Button type="primary" htmlType="submit" style={styles.btn}>{label}</Button>
  </div>
);

/* ── Combined Form ─────────────────────────────────────── */
const CombinedForm: React.FC = () => {
  const [form] = Form.useForm();
  return (
    <Form layout="vertical" form={form} onFinish={(v) => console.log("Form:", v)}>
      {/* First row: 3 input fields */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={24} md={8} lg={8}>
          <Form.Item label="Rig Number" name="rigNumber" rules={[{ required: true, message: "Enter Rig Number" }]}>
            <Input placeholder="e.g. SP-103" size="large" />
          </Form.Item>
        </Col>

        <Col xs={24} sm={24} md={8} lg={8}>
          <Form.Item label="Near Miss Value" name="nmValue" rules={[{ required: true, message: "Enter NM value" }]}>
            <InputNumber min={0} style={{ width: "100%" }} size="large" />
          </Form.Item>
        </Col>

        <Col xs={24} sm={24} md={8} lg={8}>
          <Form.Item label="Select Category" name="category" rules={[{ required: true, message: "Select Category" }]}>
            <Select showSearch placeholder="Select Category" size="large">
              {NEAR_MISS_CATEGORIES.map((cat) => (
                <Option key={cat} value={cat}>{cat}</Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
      </Row>

      {/* Second row: 2 input fields */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={24} md={12} lg={12}>
          <Form.Item label="OBB Type" name="obbType" rules={[{ required: true, message: "Enter OBB Type" }]}>
            <Input placeholder="Enter OBB Type" size="large" />
          </Form.Item>
        </Col>

        <Col xs={24} sm={24} md={12} lg={12}>
          <Form.Item label="OBB Value" name="obbValue" rules={[{ required: true, message: "Enter OBB value" }]}>
            <InputNumber min={0} style={{ width: "100%" }} size="large" />
          </Form.Item>
        </Col>
      </Row>

      {/* Third row: 2 input fields */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={24} md={12} lg={12}>
          <Form.Item label="Main Category" name="mainCategory" rules={[{ required: true, message: "Select Main Category" }]}>
            <Select placeholder="Select Main Category" size="large">
              {MAIN_CATEGORIES.map((cat) => (
                <Option key={cat} value={cat}>{cat}</Option>
              ))}
            </Select>
          </Form.Item>
        </Col>

        <Col xs={24} sm={24} md={12} lg={12}>
          <Form.Item label="Select Week" name="week" rules={[{ required: true, message: "Select Week" }]}>
            <WeekPicker style={{ width: "100%" }} size="large" />
          </Form.Item>
        </Col>
      </Row>

      <FormActions onReset={() => form.resetFields()} label="Submit" />
    </Form>
  );
};

/* ── Root ───────────────────────────────────────────────── */
const NMOBB: React.FC = () => (
  <ConfigProvider theme={antdTheme}>
    {/* Global override: ensure inputs, selects, pickers are 100% width inside cols */}
    <style>{`
      /* Fluid page padding */
      @media (max-width: 767px) {
        .ant-tabs-tab { padding: 10px 12px !important; font-size: 14px; }
      }
      /* Tablet-specific touch enhancements */
      @media (min-width: 600px) and (max-width: 1024px) {
        .ant-select-selector,
        .ant-input,
        .ant-input-number,
        .ant-picker { min-height: 38px !important; font-size: 14px !important; }
        .ant-form-item-label > label { font-size: 13px !important; }
        .ant-tabs-tab { padding: 12px 20px !important; font-size: 15px; }
      }
      /* Make DatePicker/WeekPicker fully stretch */
      .ant-picker { width: 100% !important; }
      /* InputNumber full width */
      .ant-input-number { width: 100% !important; }
    `}</style>

    <div style={styles.page}>
      <div style={styles.headerWrap}>
        <Title level={3} style={{ marginBottom: 4, fontSize: "clamp(18px, 3vw, 24px)", textAlign: "center" }}>
          NM / OBB Entry
        </Title>
        <Text type="secondary" style={{ ...styles.subtitle, textAlign: "center" }}>
          Submit Near Miss incidents and Behavioral-Based Observations
        </Text>
      </div>

      <Card style={styles.card}>
        <CombinedForm />
      </Card>
    </div>
  </ConfigProvider>
);

export default NMOBB;