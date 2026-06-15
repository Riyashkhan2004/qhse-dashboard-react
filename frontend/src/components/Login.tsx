import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Form,
  Input,
  Button,
  Checkbox,
  Typography,
  ConfigProvider,
  Alert,
} from 'antd';
import {
  UserOutlined,
  LockOutlined,
  SafetyOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
} from '@ant-design/icons';
import 'antd/dist/reset.css';
import sinopecLogo from '../assets/sinopec.png';
import { S } from '../style/Login';
import { useAuth } from '../context/AuthContext';

const { Title, Text } = Typography;

/* ── Light Theme ───────────────────────────────────────── */
const antdTheme = {
  token: {
    colorPrimary: '#1565C0',
    borderRadius: 10,
    controlHeight: 48,
    fontFamily: '"Inter", "Helvetica Neue", sans-serif',
    colorBgContainer: '#ffffff',
  },
};


/* ── Component ───────────────────────────────────────── */
const Login: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const onFinish = (values: Record<string, unknown>) => {
    setErrorMsg('');
    setLoading(true);
    console.log('Login:', values);

    const username = values.username as string;
    const password = values.password as string;

    // Authenticate with AuthContext
    const success = login(username, password);
    
    setTimeout(() => {
      setLoading(false);
      if (success) {
        navigate('/');
      } else {
        setErrorMsg('Invalid credentials. Please try again.');
      }
    }, 500);
  };

  return (
    <ConfigProvider theme={antdTheme}>
      <div style={S.page}>
        <div style={S.card}>
          {/* Logo */}
          <div style={S.logoWrap}>
            <img src={sinopecLogo} alt="Sinopec" style={S.logo} />
          </div>

          {/* Company Info */}
          <p style={S.companyLine}>
            Branch of Sinopec International Petroleum Service Corporation – K.S.A
          </p>
          <p style={S.deptLine}>
            HSE Department – Drilling & Workover Operation
          </p>

          <hr style={S.divider} />

          {/* Heading */}
          <Title level={3} style={S.heading}>
            Welcome Back
          </Title>
          <Text style={S.subheading}>
            Sign in to access the QHSE dashboard
          </Text>

          {/* Error Message */}
          {errorMsg && (
            <Alert
              message={errorMsg}
              type="error"
              showIcon
              closable
              onClose={() => setErrorMsg('')}
              style={{ marginBottom: 20, borderRadius: 8 }}
            />
          )}

          {/* Form */}
          <Form
            layout="vertical"
            onFinish={onFinish}
            requiredMark={false}
          >
            <Form.Item
              label="Username"
              name="username"
              rules={[{ required: true, message: 'Please enter your username' }]}
            >
              <Input
                prefix={<UserOutlined />}
                placeholder="Enter your username"
                autoComplete="username"
                size="large"
              />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[{ required: true, message: 'Please enter your password' }]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Enter your password"
                autoComplete="current-password"
                size="large"
                iconRender={(visible) =>
                  visible ? (
                    <EyeTwoTone twoToneColor="#1565C0" />
                  ) : (
                    <EyeInvisibleOutlined />
                  )
                }
              />
            </Form.Item>

            <div style={S.forgotWrap}>
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox>Remember me</Checkbox>
              </Form.Item>
            </div>

            <Form.Item style={{ marginBottom: 0 }}>
              <Button
                type="primary"
                htmlType="submit"
                block
                loading={loading}
                size="large"
                style={S.submitBtn}
              >
                {loading ? 'Signing In…' : 'Sign In'}
              </Button>
            </Form.Item>
          </Form>

          {/* Footer */}
          <div style={S.securityFooter}>
            <SafetyOutlined /> Authorized personnel only · ©{' '}
            {new Date().getFullYear()} Sinopec HSE
          </div>
        </div>
      </div>
    </ConfigProvider>
  );
};

export default Login;