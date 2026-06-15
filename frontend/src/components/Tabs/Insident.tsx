import React from "react";
import {
  Card,
  Form,
  Input,
  InputNumber,
  Button,
  Row,
  Col,
  ConfigProvider,
  DatePicker,
  Typography,
  Divider,
  Tabs,
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
const { WeekPicker } = DatePicker;
const { TextArea } = Input;

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

/* ── Lagging Indicators ─────────────────────────────────── */
const LAGGING_INDICATORS: { label: string; name: string }[] = [
  { label: "LTI – Lost Time Injury",                               name: "lti" },
  { label: "RDI – Restricted Duty Injury",  name: "rdi" },
  { label: "MTC – Medical Treatment Case",                         name: "mtc" },
  { label: "First Aid / FAI – First Aid Injury",                   name: "fai" },
  { label: "Near Miss",                                            name: "nearMiss" },
  { label: "Fire",                                                 name: "fire" },
  { label: "MVA – Motor Vehicle Accident",                         name: "mva" },
  { label: "Oil Spill / SPILL",                                    name: "spill" },
  { label: "Property Damage / PD",                                 name: "propertyDamage" },
  { label: "NWR – Non Work Related",                               name: "nwr" },
  { label: "FAT – Fatalities",                                     name: "fat" },
  { label: "Drop Object",                                          name: "dropObject" },
  { label: "Off Job Incident",                                     name: "offJobIncident" },
];

/* ── Inline styles ──────────────────────────────────────── */
const styles: Record<string, React.CSSProperties> = {
  page: {
    padding: "clamp(12px, 4vw, 32px)",
    maxWidth: 1100,
    margin: "0 auto",
    boxSizing: "border-box" as const,
  },
  headerWrap: {
    marginBottom: 4,
  },
  card: {
    marginTop: 20,
    borderRadius: 12,
    boxShadow: "0 2px 12px rgba(21,101,192,0.08)",
  },
  sectionTitle: {
    fontSize: "clamp(13px, 2vw, 15px)",
    fontWeight: 600,
    color: "#1565C0",
    marginBottom: 8,
    marginTop: 4,
    textTransform: "uppercase" as const,
    letterSpacing: "0.05em",
  },
  divider: {
    borderColor: "rgba(21,101,192,0.12)",
    margin: "12px 0",
  },
  actionRow: {
    display: "flex",
    flexWrap: "wrap" as const,
    justifyContent: "flex-end",
    gap: 10,
    marginTop: 16,
  },
  btn: {
    minWidth: 120,
    height: 44,
    fontSize: 15,
    flex: "0 0 auto",
  },
};

/* ── Section Header ─────────────────────────────────────── */
const SectionHeader: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={styles.sectionTitle}>{children}</div>
);

/* ── Form Actions ───────────────────────────────────────── */
const FormActions: React.FC<{ onReset: () => void; label: string }> = ({ onReset, label }) => (
  <div style={styles.actionRow}>
    <Button style={styles.btn} onClick={onReset}>Reset</Button>
    <Button type="primary" htmlType="submit" style={styles.btn}>{label}</Button>
  </div>
);

/* ── Incident Report Form ───────────────────────────────── */
const IncidentForm: React.FC = () => {
  const [form] = Form.useForm();

  return (
    <Form layout="vertical" form={form} onFinish={(v) => console.log("Incident Report:", v)}>

      {/* Basic Info */}
      <Row gutter={[8, 8]}>
        <Col xs={24} sm={24} md={12} lg={12}>
          <Form.Item
            label="Rig Number"
            name="rigNumber"
            rules={[{ required: true, message: "Enter Rig Number" }]}
          >
            <Input placeholder="e.g. SP-103" size="large" />
          </Form.Item>
        </Col>

        <Col xs={24} sm={24} md={12} lg={12}>
          <Form.Item
            label="Select Week"
            name="week"
            rules={[{ required: true, message: "Select Week" }]}
          >
            <WeekPicker style={{ width: "100%" }} size="large" />
          </Form.Item>
        </Col>
      </Row>

      <Divider style={styles.divider} />

      {/* Incident Count – Lagging Indicators */}
      <SectionHeader>Incident Count — Lagging Indicators</SectionHeader>
      <Row gutter={[8, 8]}>
        {LAGGING_INDICATORS.map(({ label, name }) => (
          <Col key={name} xs={24} sm={12} md={8} lg={8}>
            <Form.Item label={label} name={name}>
              <InputNumber min={0} placeholder="0" size="large" style={{ width: "100%" }} />
            </Form.Item>
          </Col>
        ))}
      </Row>

      <Divider style={styles.divider} />

      {/* Exposure Data */}
      <SectionHeader>Exposure Data</SectionHeader>
      <Row gutter={[8, 8]}>
        <Col xs={24} sm={24} md={12} lg={12}>
          <Form.Item
            label="Manhours"
            name="manhours"
            rules={[{ required: true, message: "Enter Manhours" }]}
          >
            <InputNumber min={0} placeholder="e.g. 1200" size="large" style={{ width: "100%" }} />
          </Form.Item>
        </Col>
      </Row>

      <Divider style={styles.divider} />

      {/* Weekly Summary */}
      <SectionHeader>Weekly Summary</SectionHeader>
      <Row gutter={[8, 8]}>
        <Col xs={24}>
          <Form.Item label="Incident Description" name="incidentDescription">
            <TextArea
              rows={3}
              placeholder="Enter Description"
              size="large"
              style={{ resize: "vertical" }}
            />
          </Form.Item>
        </Col>
      </Row>

      <FormActions onReset={() => form.resetFields()} label="Submit Incident" />
    </Form>
  );
};

/* ── LTI Free Count Form ────────────────────────────────── */
const LtiFreeCountForm: React.FC = () => {
  const [form] = Form.useForm();

  return (
    <Form layout="vertical" form={form} onFinish={(v) => console.log("LTI Free Count:", v)}>

      <SectionHeader>LTI Free Count Details</SectionHeader>
      <Row gutter={[8, 8]}>

        {/* Rig Number */}
        <Col xs={24} sm={24} md={12} lg={12}>
          <Form.Item
            label="Rig Number"
            name="rigNumber"
            rules={[{ required: true, message: "Enter Rig Number" }]}
          >
            <Input placeholder="e.g. SP-103" size="large" />
          </Form.Item>
        </Col>

        {/* Starting Date Without LTI */}
        <Col xs={24} sm={24} md={12} lg={12}>
          <Form.Item
            label="Starting Date Without LTI"
            name="startingDateWithoutLti"
            rules={[{ required: true, message: "Select starting date without LTI" }]}
          >
            <DatePicker
              style={{ width: "100%" }}
              size="large"
              placeholder="Select date"
              format="DD-MM-YYYY"
            />
          </Form.Item>
        </Col>

        {/* Commencement Date */}
        <Col xs={24} sm={24} md={12} lg={12}>
          <Form.Item
            label="Commencement Date"
            name="commencementDate"
            rules={[{ required: true, message: "Select commencement date" }]}
          >
            <DatePicker
              style={{ width: "100%" }}
              size="large"
              placeholder="Select date"
              format="DD-MM-YYYY"
            />
          </Form.Item>
        </Col>

      </Row>

      <FormActions onReset={() => form.resetFields()} label="Submit LTI Free Count" />
    </Form>
  );
};

/* ── Tab Items ──────────────────────────────────────────── */
const tabItems = [
  { key: "1", label: "Incident Report", children: <IncidentForm /> },
  { key: "2", label: "LTI Free Count",  children: <LtiFreeCountForm /> },
];

/* ── Root ───────────────────────────────────────────────── */
const Incident: React.FC = () => (
  <ConfigProvider theme={antdTheme}>
    <style>{`
      @media (max-width: 767px) {
        .ant-tabs-tab { padding: 10px 12px !important; font-size: 14px; }
      }
      @media (min-width: 600px) and (max-width: 1024px) {
        .ant-select-selector,
        .ant-input,
        .ant-input-number,
        .ant-picker { min-height: 38px !important; font-size: 14px !important; }
        .ant-form-item-label > label { font-size: 13px !important; }
        .ant-tabs-tab { padding: 12px 20px !important; font-size: 15px; }
      }
      .ant-picker { width: 100% !important; }
      .ant-input-number { width: 100% !important; }
    `}</style>

    <div style={styles.page}>
      <div style={styles.headerWrap}>
        <Title level={3} style={{ marginBottom: 4, fontSize: "clamp(18px, 3vw, 24px)", textAlign: "center" }}>
          Incident Report Entry
        </Title>
        <Text type="secondary" style={{ fontSize: "clamp(12px, 2vw, 14px)", display: "block", marginBottom: 0, textAlign: "center" }}>
          Weekly incident data, lagging indicators, exposure hours, summary and LTI free tracking
        </Text>
      </div>

      <Card style={styles.card}>
        <Tabs
          defaultActiveKey="1"
          items={tabItems}
          size="large"
          tabBarStyle={{ marginBottom: 24 }}
        />
      </Card>
    </div>
  </ConfigProvider>
);

export default Incident;