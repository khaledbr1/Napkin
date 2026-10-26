export interface PresetTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  draw: (ctx: CanvasRenderingContext2D, width: number, height: number) => void;
}

// Helper to simulate hand-drawn sketch lines
function drawSketchLine(
  ctx: CanvasRenderingContext2D,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  roughness: number = 1.2
) {
  ctx.beginPath();
  const midX = (x1 + x2) / 2 + (Math.random() - 0.5) * roughness * 2;
  const midY = (y1 + y2) / 2 + (Math.random() - 0.5) * roughness * 2;
  ctx.moveTo(x1, y1);
  ctx.quadraticCurveTo(midX, midY, x2, y2);
  ctx.stroke();
}

// Helper to draw a sketch rectangle
function drawSketchRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  fill?: string
) {
  if (fill) {
    ctx.save();
    ctx.fillStyle = fill;
    ctx.fillRect(x, y, w, h);
    ctx.restore();
  }
  drawSketchLine(ctx, x, y, x + w, y);
  drawSketchLine(ctx, x + w, y, x + w, y + h);
  drawSketchLine(ctx, x + w, y + h, x, y + h);
  drawSketchLine(ctx, x, y + h, x, y);
}

export const CANVAS_PRESETS: PresetTemplate[] = [
  {
    id: 'pricing-table',
    name: 'SaaS Pricing Grid',
    description: '3-tier pricing comparison with Popular badge, feature lists & CTAs',
    category: 'Marketing',
    draw: (ctx, width, height) => {
      ctx.save();
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 2.5;
      ctx.font = 'bold 22px system-ui, sans-serif';
      ctx.fillStyle = '#0f172a';

      // Title
      ctx.textAlign = 'center';
      ctx.fillText('Simple, Transparent Pricing', width / 2, 60);
      ctx.font = '14px system-ui, sans-serif';
      ctx.fillStyle = '#64748b';
      ctx.fillText('Choose the perfect plan for your team', width / 2, 85);

      const cardW = Math.min(220, (width - 100) / 3);
      const cardH = 340;
      const startY = 120;
      const gap = 20;
      const totalW = cardW * 3 + gap * 2;
      const startX = (width - totalW) / 2;

      // Card 1: Starter
      let x = startX;
      drawSketchRect(ctx, x, startY, cardW, cardH, '#f8fafc');
      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 18px system-ui, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText('Starter', x + 20, startY + 40);
      ctx.font = 'bold 28px system-ui, sans-serif';
      ctx.fillText('$19', x + 20, startY + 80);
      ctx.font = '12px system-ui, sans-serif';
      ctx.fillStyle = '#64748b';
      ctx.fillText('/ month', x + 75, startY + 75);

      // Features
      ctx.font = '13px system-ui, sans-serif';
      ctx.fillStyle = '#334155';
      const f1 = ['✓ 5 Team Members', '✓ 10GB Cloud Storage', '✓ Basic Analytics', '✓ Community Support'];
      f1.forEach((f, i) => ctx.fillText(f, x + 20, startY + 130 + i * 28));

      // Button
      drawSketchRect(ctx, x + 20, startY + cardH - 60, cardW - 40, 38, '#e2e8f0');
      ctx.font = 'bold 13px system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillStyle = '#0f172a';
      ctx.fillText('Get Started', x + cardW / 2, startY + cardH - 36);

      // Card 2: Pro (Featured)
      x = startX + cardW + gap;
      drawSketchRect(ctx, x, startY - 15, cardW, cardH + 30, '#eff6ff');
      // Popular badge
      drawSketchRect(ctx, x + cardW / 2 - 45, startY - 26, 90, 24, '#2563eb');
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 11px system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('MOST POPULAR', x + cardW / 2, startY - 10);

      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 18px system-ui, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText('Pro Team', x + 20, startY + 35);
      ctx.font = 'bold 28px system-ui, sans-serif';
      ctx.fillText('$49', x + 20, startY + 75);
      ctx.font = '12px system-ui, sans-serif';
      ctx.fillStyle = '#64748b';
      ctx.fillText('/ month', x + 75, startY + 70);

      ctx.font = '13px system-ui, sans-serif';
      ctx.fillStyle = '#1e293b';
      const f2 = ['✓ Unlimited Members', '✓ 100GB Cloud Storage', '✓ Advanced AI Insights', '✓ Priority 24/7 Chat', '✓ Custom Domain'];
      f2.forEach((f, i) => ctx.fillText(f, x + 20, startY + 120 + i * 28));

      drawSketchRect(ctx, x + 20, startY + cardH - 45, cardW - 40, 42, '#2563eb');
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 14px system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Start Free Trial', x + cardW / 2, startY + cardH - 18);

      // Card 3: Enterprise
      x = startX + (cardW + gap) * 2;
      drawSketchRect(ctx, x, startY, cardW, cardH, '#f8fafc');
      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 18px system-ui, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText('Enterprise', x + 20, startY + 40);
      ctx.font = 'bold 28px system-ui, sans-serif';
      ctx.fillText('$199', x + 20, startY + 80);
      ctx.font = '12px system-ui, sans-serif';
      ctx.fillStyle = '#64748b';
      ctx.fillText('/ month', x + 90, startY + 75);

      ctx.font = '13px system-ui, sans-serif';
      ctx.fillStyle = '#334155';
      const f3 = ['✓ Dedicated Manager', '✓ 1TB Storage', '✓ Custom SLA', '✓ SSO & Audit Logs'];
      f3.forEach((f, i) => ctx.fillText(f, x + 20, startY + 130 + i * 28));

      drawSketchRect(ctx, x + 20, startY + cardH - 60, cardW - 40, 38, '#e2e8f0');
      ctx.font = 'bold 13px system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillStyle = '#0f172a';
      ctx.fillText('Contact Sales', x + cardW / 2, startY + cardH - 36);

      ctx.restore();
    },
  },
  {
    id: 'login-modal',
    name: 'Modern Auth Card',
    description: 'Login card with social auth, inputs, password toggle, and CTA',
    category: 'Forms',
    draw: (ctx, width, height) => {
      ctx.save();
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 2.5;

      const cardW = 380;
      const cardH = 460;
      const x = (width - cardW) / 2;
      const y = Math.max(30, (height - cardH) / 2);

      // Main container
      drawSketchRect(ctx, x, y, cardW, cardH, '#ffffff');

      // Title & Subtitle
      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 22px system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Welcome Back', x + cardW / 2, y + 45);
      ctx.font = '13px system-ui, sans-serif';
      ctx.fillStyle = '#64748b';
      ctx.fillText('Sign in to access your developer dashboard', x + cardW / 2, y + 70);

      // Social Auth Buttons
      drawSketchRect(ctx, x + 35, y + 95, 145, 38, '#f1f5f9');
      ctx.fillStyle = '#334155';
      ctx.font = '12px system-ui, sans-serif';
      ctx.fillText('G  Google', x + 107, y + 119);

      drawSketchRect(ctx, x + 200, y + 95, 145, 38, '#f1f5f9');
      ctx.fillText('⌘  GitHub', x + 272, y + 119);

      // Divider
      drawSketchLine(ctx, x + 35, y + 155, x + cardW / 2 - 25, y + 155);
      ctx.fillStyle = '#94a3b8';
      ctx.font = '11px system-ui, sans-serif';
      ctx.fillText('OR', x + cardW / 2, y + 159);
      drawSketchLine(ctx, x + cardW / 2 + 25, y + 155, x + cardW - 35, y + 155);

      // Email field
      ctx.textAlign = 'left';
      ctx.fillStyle = '#334155';
      ctx.font = 'bold 12px system-ui, sans-serif';
      ctx.fillText('Email address', x + 35, y + 185);
      drawSketchRect(ctx, x + 35, y + 195, cardW - 70, 42, '#f8fafc');
      ctx.fillStyle = '#94a3b8';
      ctx.font = '13px system-ui, sans-serif';
      ctx.fillText('you@company.com', x + 48, y + 221);

      // Password field
      ctx.fillStyle = '#334155';
      ctx.font = 'bold 12px system-ui, sans-serif';
      ctx.fillText('Password', x + 35, y + 265);
      drawSketchRect(ctx, x + 35, y + 275, cardW - 70, 42, '#f8fafc');
      ctx.fillStyle = '#94a3b8';
      ctx.font = '14px system-ui, sans-serif';
      ctx.fillText('••••••••••••', x + 48, y + 302);

      // Checkbox & Forgot Password
      drawSketchRect(ctx, x + 35, y + 332, 16, 16);
      ctx.font = '12px system-ui, sans-serif';
      ctx.fillStyle = '#475569';
      ctx.fillText('Remember me for 30 days', x + 58, y + 345);
      ctx.textAlign = 'right';
      ctx.fillStyle = '#2563eb';
      ctx.fillText('Forgot password?', x + cardW - 35, y + 345);

      // Submit Button
      drawSketchRect(ctx, x + 35, y + 375, cardW - 70, 46, '#2563eb');
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 14px system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Sign In to Account →', x + cardW / 2, y + 404);

      ctx.restore();
    },
  },
  {
    id: 'analytics-dashboard',
    name: 'Analytics Dashboard Card',
    description: 'Header with KPIs, line chart graph sketch, and activity feed',
    category: 'Dashboard',
    draw: (ctx, width, height) => {
      ctx.save();
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 2.5;

      const cardW = Math.min(680, width - 80);
      const cardH = 440;
      const x = (width - cardW) / 2;
      const y = Math.max(30, (height - cardH) / 2);

      // Main Card
      drawSketchRect(ctx, x, y, cardW, cardH, '#ffffff');

      // Card Header
      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 18px system-ui, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText('Revenue & Growth Analytics', x + 25, y + 40);
      ctx.font = '12px system-ui, sans-serif';
      ctx.fillStyle = '#64748b';
      ctx.fillText('Real-time metric breakdown this quarter', x + 25, y + 60);

      // Time Range Pills
      drawSketchRect(ctx, x + cardW - 190, y + 25, 50, 28, '#2563eb');
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 11px system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('30D', x + cardW - 165, y + 43);

      drawSketchRect(ctx, x + cardW - 130, y + 25, 50, 28, '#f1f5f9');
      ctx.fillStyle = '#475569';
      ctx.fillText('90D', x + cardW - 105, y + 43);

      drawSketchRect(ctx, x + cardW - 70, y + 25, 50, 28, '#f1f5f9');
      ctx.fillText('1Y', x + cardW - 45, y + 43);

      // 3 KPI Mini Cards
      const kpiW = (cardW - 80) / 3;
      const kpis = [
        { label: 'Total Revenue', value: '$84,230', change: '+18.4%' },
        { label: 'Active Users', value: '14,892', change: '+12.1%' },
        { label: 'Conversion Rate', value: '3.64%', change: '+0.8%' },
      ];
      kpis.forEach((kpi, i) => {
        const kX = x + 25 + i * (kpiW + 15);
        drawSketchRect(ctx, kX, y + 85, kpiW, 75, '#f8fafc');
        ctx.fillStyle = '#64748b';
        ctx.font = '11px system-ui, sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText(kpi.label, kX + 15, y + 108);
        ctx.fillStyle = '#0f172a';
        ctx.font = 'bold 20px system-ui, sans-serif';
        ctx.fillText(kpi.value, kX + 15, y + 138);
        ctx.fillStyle = '#16a34a';
        ctx.font = 'bold 11px system-ui, sans-serif';
        ctx.textAlign = 'right';
        ctx.fillText(kpi.change, kX + kpiW - 15, y + 138);
      });

      // Chart Area
      drawSketchRect(ctx, x + 25, y + 180, cardW - 50, 160, '#fafafa');
      // Chart Grid lines
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 1;
      for (let i = 1; i <= 3; i++) {
        drawSketchLine(ctx, x + 40, y + 180 + i * 40, x + cardW - 40, y + 180 + i * 40);
      }

      // Chart Line
      ctx.strokeStyle = '#2563eb';
      ctx.lineWidth = 3;
      ctx.beginPath();
      const chartPoints = [
        [x + 50, y + 310],
        [x + 130, y + 270],
        [x + 210, y + 285],
        [x + 290, y + 230],
        [x + 370, y + 250],
        [x + 450, y + 200],
        [x + 530, y + 215],
        [x + cardW - 60, y + 195],
      ];
      ctx.moveTo(chartPoints[0][0], chartPoints[0][1]);
      for (let i = 1; i < chartPoints.length; i++) {
        ctx.lineTo(chartPoints[i][0], chartPoints[i][1]);
      }
      ctx.stroke();

      // Recent Activity Rows
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 2;
      ctx.fillStyle = '#334155';
      ctx.font = '12px system-ui, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText('⚡ Stripe webhook processed: +$249.00 from Acrobatic Corp', x + 35, y + 370);
      ctx.fillText('👤 New enterprise user invite accepted by Sarah Jenkins', x + 35, y + 400);

      ctx.restore();
    },
  },
  {
    id: 'hero-section',
    name: 'Hero Landing Section',
    description: 'Modern SaaS landing hero with headline, badges, dual CTAs & mockup',
    category: 'Marketing',
    draw: (ctx, width, height) => {
      ctx.save();
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 2.5;

      const midX = width / 2;

      // Badge
      drawSketchRect(ctx, midX - 110, 40, 220, 30, '#ede9fe');
      ctx.fillStyle = '#6d28d9';
      ctx.font = 'bold 12px system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('✨ Napkin 2.0 is live → Learn more', midX, 60);

      // Headline
      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 32px system-ui, sans-serif';
      ctx.fillText('Turn Sketch Wireframes Into', midX, 115);
      ctx.fillStyle = '#2563eb';
      ctx.fillText('Live Interactive React Apps', midX, 155);

      // Subtitle
      ctx.fillStyle = '#64748b';
      ctx.font = '14px system-ui, sans-serif';
      ctx.fillText('Draw on canvas. Let Groq Vision transpile your wireframes to Tailwind JSX.', midX, 190);

      // Dual CTAs
      drawSketchRect(ctx, midX - 170, 220, 160, 48, '#2563eb');
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 14px system-ui, sans-serif';
      ctx.fillText('Start Building Free', midX - 90, 250);

      drawSketchRect(ctx, midX + 10, 220, 160, 48, '#ffffff');
      ctx.fillStyle = '#0f172a';
      ctx.fillText('▶ Watch Demo', midX + 90, 250);

      // Browser Mockup Frame
      const mockW = Math.min(600, width - 80);
      const mockH = 180;
      const mX = (width - mockW) / 2;
      drawSketchRect(ctx, mX, 300, mockW, mockH, '#f8fafc');
      // Mockup header dots
      ctx.fillStyle = '#ef4444';
      ctx.beginPath(); ctx.arc(mX + 20, 318, 5, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath(); ctx.arc(mX + 35, 318, 5, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#10b981';
      ctx.beginPath(); ctx.arc(mX + 50, 318, 5, 0, Math.PI * 2); ctx.fill();

      // Mock search bar
      drawSketchRect(ctx, mX + 80, 310, mockW - 120, 16, '#e2e8f0');

      ctx.restore();
    },
  },
  {
    id: 'product-card',
    name: 'E-Commerce Product Card',
    description: 'Product showcase with image placeholder, rating, colors & Add to Cart',
    category: 'E-Commerce',
    draw: (ctx, width, height) => {
      ctx.save();
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 2.5;

      const cardW = 340;
      const cardH = 460;
      const x = (width - cardW) / 2;
      const y = Math.max(30, (height - cardH) / 2);

      drawSketchRect(ctx, x, y, cardW, cardH, '#ffffff');

      // Image placeholder with diagonal cross
      drawSketchRect(ctx, x + 20, y + 20, cardW - 40, 200, '#f1f5f9');
      drawSketchLine(ctx, x + 20, y + 20, x + cardW - 20, y + 220);
      drawSketchLine(ctx, x + cardW - 20, y + 20, x + 20, y + 220);
      // Sale Tag
      drawSketchRect(ctx, x + 30, y + 30, 75, 24, '#ef4444');
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 11px system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('-30% OFF', x + 67, y + 46);

      // Title & Category
      ctx.textAlign = 'left';
      ctx.fillStyle = '#64748b';
      ctx.font = '11px system-ui, sans-serif';
      ctx.fillText('RUNNING FOOTWEAR', x + 25, y + 248);

      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 18px system-ui, sans-serif';
      ctx.fillText('Velocity Pro Ultra 3', x + 25, y + 272);

      // Rating
      ctx.fillStyle = '#f59e0b';
      ctx.font = '14px system-ui, sans-serif';
      ctx.fillText('★★★★★', x + 25, y + 295);
      ctx.fillStyle = '#64748b';
      ctx.font = '11px system-ui, sans-serif';
      ctx.fillText('(128 reviews)', x + 90, y + 294);

      // Color swatches
      ctx.fillStyle = '#334155';
      ctx.font = 'bold 11px system-ui, sans-serif';
      ctx.fillText('Color:', x + 25, y + 325);
      const colors = ['#2563eb', '#0f172a', '#10b981', '#dc2626'];
      colors.forEach((col, i) => {
        ctx.fillStyle = col;
        ctx.beginPath();
        ctx.arc(x + 75 + i * 24, y + 321, 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      });

      // Price
      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 24px system-ui, sans-serif';
      ctx.fillText('$139.00', x + 25, y + 370);
      ctx.fillStyle = '#94a3b8';
      ctx.font = '14px system-ui, sans-serif';
      ctx.fillText('$199.00', x + 130, y + 368);

      // Add to Cart Button
      drawSketchRect(ctx, x + 25, y + 395, cardW - 50, 44, '#0f172a');
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 14px system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('🛍  Add to Shopping Bag', x + cardW / 2, y + 423);

      ctx.restore();
    },
  },
];
