export const S = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '24px 16px',
    background:
      'linear-gradient(135deg, #EAF4FF 0%, #DCEEFF 50%, #F3F9FF 100%)',
  },

  card: {
    width: '100%',
    maxWidth: '540px',
    background: '#ffffff',
    borderRadius: '18px',
    padding: 'clamp(28px, 5vw, 48px)',
    boxShadow: '0 20px 60px rgba(21,101,192,0.12)',
    border: '1px solid rgba(21,101,192,0.08)',
  },

  logoWrap: {
    textAlign: 'center' as const,
    marginBottom: '20px',
  },

  logo: {
    height: '60px',
    objectFit: 'contain' as const,
  },

  companyLine: {
    textAlign: 'center' as const,
    fontSize: '12px',
    fontWeight: 600,
    letterSpacing: '0.05em',
    textTransform: 'uppercase' as const,
    color: '#6B85A6',
    lineHeight: 1.5,
  },

  deptLine: {
    textAlign: 'center' as const,
    fontSize: '12px',
    fontWeight: 600,
    letterSpacing: '0.05em',
    textTransform: 'uppercase' as const,
    color: '#8AA6C1',
    marginBottom: '20px',
  },

  divider: {
    border: 'none',
    borderTop: '1px solid rgba(21,101,192,0.08)',
    margin: '20px 0 28px',
  },

  heading: {
    color: '#0D1F3C',
    fontWeight: 800,
    marginBottom: 4,
    fontSize: 'clamp(1.25rem, 3vw, 1.6rem)',
  },

  subheading: {
    color: '#456085',
    fontSize: '0.9rem',
    marginBottom: '28px',
    display: 'block' as const,
  },

  forgotWrap: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },

  forgot: {
    fontSize: '0.82rem',
    color: '#1565C0',
    cursor: 'pointer' as const,
  },

  submitBtn: {
    height: '48px',
    fontWeight: 700,
    fontSize: '0.9rem',
    letterSpacing: '0.05em',
    background: 'linear-gradient(135deg, #1565C0 0%, #1976D2 100%)',
    border: 'none',
    borderRadius: '10px',
    boxShadow: '0 6px 20px rgba(21,101,192,0.25)',
  },

  securityFooter: {
    marginTop: '24px',
    textAlign: 'center' as const,
    fontSize: '0.75rem',
    color: '#8AA6C1',
  },
};