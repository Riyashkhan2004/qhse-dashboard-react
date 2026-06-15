import React, { useState, useRef } from "react";
import {
  Card,
  Button,
  Modal,
  DatePicker,
  Typography,
  Spin,
  message,
  Row,
  Col,
} from "antd";
import {
  DownloadOutlined,
} from "@ant-design/icons";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import dayjs, { Dayjs } from "dayjs";
import weekOfYear from "dayjs/plugin/weekOfYear";
import WeeklyChartDashboard from "../WeeklyChartDashboard";

const { Title, Text, Paragraph } = Typography;
const { WeekPicker } = DatePicker;

// Extend dayjs with weekOfYear plugin
dayjs.extend(weekOfYear);

// Get current year
const CURRENT_YEAR = new Date().getFullYear();

const DownloadReports: React.FC = () => {
  // Download modal states
  const [downloadModalOpen, setDownloadModalOpen] = useState(false);
  const [selectedWeek, setSelectedWeek] = useState<string | null>(null);
  const [pdfGenerating, setPdfGenerating] = useState(false);
  const dashboardRef = useRef<HTMLDivElement>(null);

  const generatePDF = async () => {
    if (!selectedWeek) {
      message.warning("Please select a week first");
      return;
    }

    if (!dashboardRef.current) {
      message.error("Dashboard reference not found");
      return;
    }

    setPdfGenerating(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 3000));

      const canvas = await html2canvas(dashboardRef.current as HTMLElement, {
        scale: 3,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
        windowWidth: 1800,
        x: 0,
        y: 0,
      });

      if (canvas.width === 0 || canvas.height === 0) {
        throw new Error("Failed to capture dashboard");
      }

      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4"
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const margin = 10;
      const contentWidth = pdfWidth - (margin * 2);
      const contentHeight = pdfHeight - (margin * 2);

      // Add header information
      pdf.setFontSize(24);
      pdf.setTextColor(30, 144, 255);
      pdf.text("RIGS HSE Weekly Report", pdfWidth / 2, 20, { align: "center" });
      
      pdf.setFontSize(16);
      pdf.setTextColor(0, 0, 0);
      const weekText = `Week ${selectedWeek.replace("week", "")} - ${CURRENT_YEAR}`;
      pdf.text(weekText, pdfWidth / 2, 32, { align: "center" });

      pdf.setFontSize(12);
      pdf.text(`Generated on: ${new Date().toLocaleDateString('en-GB')}`, pdfWidth / 2, 42, { align: "center" });

      const headerHeight = 55; // Space reserved for headers

      const imgData = canvas.toDataURL("image/png", 1.0);
      
      if (!imgData || imgData === "data:," || imgData.length < 100) {
        throw new Error("Failed to generate image data");
      }

      const imgAspectRatio = canvas.width / canvas.height;
      const availableHeight = contentHeight - (headerHeight / 2); // Account for header space
      
      // Use full content width for better chart visibility
      const imgWidth = contentWidth;
      const imgHeight = imgWidth / imgAspectRatio;
      const totalContentHeightMM = imgHeight;
      
      if (imgHeight <= availableHeight) {
        pdf.addPage();
        pdf.addImage(imgData, "PNG", margin, margin + headerHeight / 2, imgWidth, imgHeight);
      } else {
        const pagesNeeded = Math.ceil(imgHeight / availableHeight);
        
        for (let page = 0; page < pagesNeeded; page++) {
          pdf.addPage();
          
          const yOffset = (page * contentHeight) / imgHeight * canvas.height;
          const remainingHeight = canvas.height - yOffset;
          const heightOnPage = Math.min(canvas.height - yOffset, canvas.height / pagesNeeded * 1.5);
          
          const pageCanvas = document.createElement("canvas");
          pageCanvas.width = canvas.width;
          pageCanvas.height = Math.min(canvas.height / pagesNeeded * 1.5, remainingHeight);
          
          const ctx = pageCanvas.getContext("2d");
          if (ctx) {
            ctx.drawImage(
              canvas,
              0, yOffset,
              canvas.width, pageCanvas.height,
              0, 0,
              pageCanvas.width, pageCanvas.height
            );
            
            const pageImgData = pageCanvas.toDataURL("image/png", 1.0);
            const portionHeight = (pageCanvas.height / canvas.height) * imgHeight;
            
            pdf.addImage(pageImgData, "PNG", margin, margin, contentWidth, portionHeight);
          }
        }
      }

      const weekNumber = selectedWeek.replace("week", "");
      const filename = `HSE_Charts_Week-${weekNumber}_${CURRENT_YEAR}.pdf`;

      pdf.save(filename);
      message.success("PDF downloaded successfully!");
      setDownloadModalOpen(false);
    } catch (error) {
      console.error("PDF generation error:", error);
      message.error("Error generating PDF: " + (error as Error).message);
    } finally {
      setPdfGenerating(false);
    }
  };

  return (
    <div style={{ padding: "24px", maxWidth: "1200px", margin: "0 auto" }}>
      <div style={{ marginBottom: "24px", textAlign: "center" }}>
        <Title level={2} style={{ fontWeight: 700, color: "#1890ff", marginBottom: "8px" }}>
          Download Reports
        </Title>
        <Paragraph type="secondary">
          Generate and download weekly HSE performance reports as PDF
        </Paragraph>
      </div>

      <Card style={{ borderRadius: 12, boxShadow: "0 2px 12px rgba(0,0,0,0.1)" }}>
        <Row gutter={[24, 24]} justify="center" align="middle" style={{ minHeight: "400px" }}>
          <Col xs={24} md={16} lg={12}>
            <div style={{ textAlign: "center", padding: "40px 20px" }}>
              <DownloadOutlined style={{ fontSize: 64, color: "#1890ff", marginBottom: 24 }} />
              <Title level={4}>Weekly HSE Report</Title>
              <Paragraph type="secondary" style={{ marginBottom: 24 }}>
                Generate a PDF containing all HSE performance charts.
              </Paragraph>
              <Button 
                type="primary" 
                size="large" 
                icon={<DownloadOutlined />}
                onClick={() => setDownloadModalOpen(true)}
                style={{ borderRadius: 8, paddingLeft: 24, paddingRight: 24, height: 48 }}
              >
                Download Charts PDF
              </Button>
            </div>
          </Col>
        </Row>
      </Card>

      {/* Hidden dashboard for PDF generation */}
      <div
        ref={dashboardRef}
        style={{
          position: "fixed",
          left: "-9999px",
          top: 0,
          width: "1800px",
          minHeight: "1200px",
          backgroundColor: "white",
          padding: "24px",
          zIndex: -1,
        }}
      >
        <WeeklyChartDashboard />
      </div>

      {/* Download Modal */}
      <Modal
        title={
          <Title level={4} style={{ fontWeight: 700, color: "#3d3d3d", marginBottom: 0 }}>
            Download Weekly Report as PDF
          </Title>
        }
        open={downloadModalOpen}
        onCancel={() => setDownloadModalOpen(false)}
        footer={null}
        width="500px"
        styles={{ body: { padding: "24px" } }}
        destroyOnClose
      >
        <div style={{ paddingTop: "24px" }}>
          <div style={{ marginBottom: "16px" }}>
            <Text strong style={{ display: "block", marginBottom: "8px" }}>Select Week</Text>
            <WeekPicker
              value={selectedWeek ? dayjs().week(Number(selectedWeek.replace('week', ''))) : null}
              onChange={(date: Dayjs | null) => setSelectedWeek(date ? `week${date.week()}` : null)}
              style={{ width: "100%" }}
              size="large"
              placeholder={`Select Week - ${CURRENT_YEAR}`}
              getPopupContainer={(trigger: HTMLElement) => trigger.parentElement!}
            />
          </div>

          {pdfGenerating && (
            <div style={{ display: "flex", alignItems: "center", gap: "16px", marginTop: "16px" }}>
              <Spin size="small" />
              <Text type="secondary">
                Generating PDF...
              </Text>
            </div>
          )}
        </div>

        <div
          style={{
            padding: "16px 24px 24px",
            borderTop: "1px solid #e8e8e8",
            marginTop: "24px",
            display: "flex",
            gap: "12px",
            justifyContent: "flex-end",
          }}
        >
          <Button
            onClick={() => setDownloadModalOpen(false)}
            disabled={pdfGenerating}
            style={{ borderRadius: "8px", paddingLeft: "20px", paddingRight: "20px" }}
          >
            Cancel
          </Button>
          <Button
            type="primary"
            onClick={generatePDF}
            loading={pdfGenerating}
            icon={pdfGenerating ? <Spin size="small" /> : <DownloadOutlined />}
            disabled={pdfGenerating}
            style={{ borderRadius: "8px", paddingLeft: "24px", paddingRight: "24px" }}
          >
            {pdfGenerating ? "Generating..." : "Download PDF"}
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default DownloadReports;
