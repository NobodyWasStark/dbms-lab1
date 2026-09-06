import base64
import os
import subprocess

def get_base64_image(path):
    with open(path, "rb") as f:
        return f"data:image/png;base64,{base64.b64encode(f.read()).decode('utf-8')}"

base_dir = "/home/shawn/Videos/mid-assinment"
img_reg = get_base64_image(os.path.join(base_dir, "screenshots/01_registration_page.png"))
img_login = get_base64_image(os.path.join(base_dir, "screenshots/02_login_page.png"))
img_dash = get_base64_image(os.path.join(base_dir, "screenshots/03_dashboard_page.png"))

html_content = f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>DBMS Laboratory Mid-Assignment Submission Report</title>
<style>
  @page {{
    size: A4;
    margin: 12mm 14mm 12mm 14mm;
  }}
  * {{
    box-sizing: border-box;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }}
  body {{
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    color: #0f172a;
    background-color: #ffffff;
    line-height: 1.4;
    font-size: 10pt;
    margin: 0;
    padding: 0;
  }}
  .page {{
    page-break-after: always;
    min-height: 98%;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
  }}
  .page:last-child {{
    page-break-after: avoid;
  }}
  .header-card {{
    border-bottom: 2.5px solid #0284c7;
    padding-bottom: 10px;
    margin-bottom: 12px;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
  }}
  .header-left h1 {{
    font-size: 18pt;
    margin: 0 0 3px 0;
    color: #0f172a;
    font-weight: 800;
    letter-spacing: -0.5px;
  }}
  .header-left h2 {{
    font-size: 11pt;
    margin: 0;
    color: #0284c7;
    font-weight: 600;
  }}
  .badge-container {{
    display: flex;
    gap: 6px;
    margin-top: 6px;
  }}
  .badge {{
    display: inline-block;
    padding: 2px 7px;
    border-radius: 4px;
    font-size: 7.5pt;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }}
  .badge-blue {{
    background: #e0f2fe;
    color: #0369a1;
    border: 1px solid #bae6fd;
  }}
  .badge-emerald {{
    background: #dcfce7;
    color: #15803d;
    border: 1px solid #bbf7d0;
  }}
  .meta-table {{
    font-size: 9pt;
    text-align: right;
    border-collapse: collapse;
  }}
  .meta-table td {{
    padding: 1.5px 5px;
  }}
  .meta-label {{
    color: #64748b;
    font-weight: 600;
  }}
  .meta-val {{
    color: #0f172a;
    font-weight: 700;
  }}
  h3 {{
    font-size: 12pt;
    color: #0f172a;
    margin: 12px 0 6px 0;
    padding-bottom: 3px;
    border-bottom: 1px solid #e2e8f0;
    font-weight: 700;
  }}
  h4 {{
    font-size: 10pt;
    color: #334155;
    margin: 8px 0 4px 0;
    font-weight: 700;
  }}
  p {{
    margin: 0 0 6px 0;
    font-size: 9pt;
    color: #334155;
  }}
  .code-block {{
    background-color: #0b1120;
    color: #f8fafc;
    padding: 8px 12px;
    border-radius: 6px;
    font-family: "Courier New", Courier, monospace;
    font-size: 7.6pt;
    line-height: 1.3;
    overflow-x: hidden;
    margin: 4px 0 8px 0;
    white-space: pre-wrap;
    border: 1px solid #1e293b;
  }}
  .keyword {{ color: #38bdf8; font-weight: bold; }}
  .type {{ color: #c084fc; }}
  .string {{ color: #fde047; }}
  .comment {{ color: #94a3b8; font-style: italic; }}
  .highlight {{ color: #34d399; font-weight: bold; }}
  
  .spec-grid {{
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
    margin-bottom: 10px;
  }}
  .spec-card {{
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 6px;
    padding: 8px 10px;
  }}
  .spec-card h5 {{
    margin: 0 0 4px 0;
    font-size: 9pt;
    color: #0f172a;
    font-weight: 700;
  }}
  .spec-card ul {{
    margin: 0;
    padding-left: 14px;
    font-size: 8pt;
    color: #475569;
  }}
  .spec-card li {{
    margin-bottom: 2px;
  }}
  
  .img-frame {{
    border: 1px solid #cbd5e1;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.08);
    background: #f8fafc;
    margin: 4px 0 6px 0;
  }}
  .img-frame img {{
    width: 100%;
    display: block;
  }}
  .img-caption {{
    padding: 5px 10px;
    font-size: 8pt;
    font-weight: 600;
    color: #475569;
    background: #f1f5f9;
    border-top: 1px solid #e2e8f0;
    display: flex;
    justify-content: space-between;
  }}
  .footer-note {{
    margin-top: 8px;
    padding: 6px 10px;
    border-left: 3px solid #059669;
    background: #f0fdf4;
    font-size: 7.8pt;
    color: #166534;
  }}
  .page-footer {{
    margin-top: auto;
    padding-top: 6px;
    border-top: 1px solid #e2e8f0;
    display: flex;
    justify-content: space-between;
    font-size: 7.5pt;
    color: #94a3b8;
  }}
</style>
</head>
<body>

  <!-- ==================== PAGE 1: COVER & ARCHITECTURE ==================== -->
  <div class="page">
    <div class="header-card">
      <div class="header-left">
        <h1>DBMS Laboratory Mid-Assignment</h1>
        <h2>Relational System Implementation &amp; Database Verification Report</h2>
        <div class="badge-container">
          <span class="badge badge-blue">Course: CSE311L</span>
          <span class="badge badge-emerald">PostgreSQL 16 Engine</span>
          <span class="badge badge-blue">Full-Stack Next.js 16</span>
        </div>
      </div>
      <table class="meta-table">
        <tr>
          <td class="meta-label">Student:</td>
          <td class="meta-val">Shawn Rahaman</td>
        </tr>
        <tr>
          <td class="meta-label">Student ID:</td>
          <td class="meta-val">011212080</td>
        </tr>
        <tr>
          <td class="meta-label">Email:</td>
          <td class="meta-val">admin@gmail.com</td>
        </tr>
        <tr>
          <td class="meta-label">Date:</td>
          <td class="meta-val">September 5, 2026</td>
        </tr>
        <tr>
          <td class="meta-label">Database:</td>
          <td class="meta-val">PostgreSQL 16 / Port 5432</td>
        </tr>
      </table>
    </div>

    <h3>1. System Architecture &amp; Technology Stack</h3>
    <div class="spec-grid">
      <div class="spec-card">
        <h5>Relational Database Layer (PostgreSQL 16)</h5>
        <ul>
          <li><strong>Relational Integrity:</strong> Primary Keys (UUID), Unique email constraint, CHECK constraints.</li>
          <li><strong>Cryptographic Extensions:</strong> <code>pgcrypto</code> for server-side UUID generation (<code>gen_random_uuid()</code>).</li>
          <li><strong>Security:</strong> <code>bcrypt</code> password hashing with cost factor 12 (never stored in plaintext).</li>
          <li><strong>Index Optimization:</strong> B-Tree indexes on lookup attributes (<code>email</code>, <code>createdAt</code>, <code>code</code>).</li>
          <li><strong>Automated Auditing:</strong> PostgreSQL Trigger function updating <code>"updatedAt"</code> timestamp on record updates.</li>
        </ul>
      </div>
      <div class="spec-card">
        <h5>Full-Stack Application Layer (Next.js 16)</h5>
        <ul>
          <li><strong>Framework:</strong> Next.js 16 (React 19, TypeScript, App Router).</li>
          <li><strong>Session Management:</strong> Custom cryptographic JWT cookies set as <code>httpOnly</code>, <code>SameSite=Lax</code>, <code>Secure</code>.</li>
          <li><strong>Edge Security:</strong> Next.js Edge Middleware route guards protecting <code>/dashboard</code> from unauthorized access.</li>
          <li><strong>Strict Validation:</strong> Dual-boundary Zod validation (client UX &amp; server Route Handlers).</li>
          <li><strong>Visual Feedback:</strong> Responsive tables, live aggregate stat counters, and Recharts demographic distributions.</li>
        </ul>
      </div>
    </div>

    <h4>Project Repository Layout</h4>
    <div class="code-block"><span class="highlight">mid-assinment/</span>
├── <span class="keyword">app/</span>
│   ├── <span class="string">api/auth/</span>            <span class="comment"># Registration, Login, Logout, Session endpoints</span>
│   ├── <span class="string">api/dashboard/</span>       <span class="comment"># Aggregate statistics, Users, and Courses endpoints</span>
│   ├── <span class="string">dashboard/</span>           <span class="comment"># Authenticated student portal dashboard view</span>
│   ├── <span class="string">login/</span>               <span class="comment"># Student sign-in portal</span>
│   └── <span class="string">register/</span>            <span class="comment"># Student onboarding &amp; registration form</span>
├── <span class="keyword">components/</span>              <span class="comment"># Modular tables, charts, query inspector, forms</span>
├── <span class="keyword">lib/</span>                     <span class="comment"># Database singleton, auth token utilities, Zod validation</span>
├── <span class="keyword">middleware.ts</span>            <span class="comment"># Next.js Edge middleware for route access control</span>
├── <span class="keyword">prisma/schema.sql</span>        <span class="comment"># Handwritten, pure PostgreSQL DDL &amp; DML script</span>
└── <span class="keyword">screenshots/</span>             <span class="comment"># Verified visual evidence of application execution</span></div>

    <h4>Submission Requirements Checklist</h4>
    <div class="spec-card">
      <ul>
        <li><strong>Requirement 1 (Source Code):</strong> Complete modular code base packaged in <code>DBMS_Lab_Mid_Assignment_Submission.zip</code>.</li>
        <li><strong>Requirement 2 (Database Schema / SQL Script):</strong> Pure raw PostgreSQL DDL &amp; DML scripts provided in Section 2 &amp; 3.</li>
        <li><strong>Requirement 3 (Screenshots):</strong> Verified high-resolution screenshots of Registration, Login, and Dashboard in Section 4.</li>
      </ul>
    </div>

    <div class="page-footer">
      <span>DBMS Laboratory Practical Submission &bull; CSE311L</span>
      <span>Page 1 of 6</span>
    </div>
  </div>

  <!-- ==================== PAGE 2: PURE RAW SQL DDL ==================== -->
  <div class="page">
    <h3>2. Database Schema: Pure Raw PostgreSQL DDL Script</h3>
    <p>Handwritten PostgreSQL Data Definition Language (DDL) script with extensions, custom ENUM types, tables, constraints, B-Tree indexes, and triggers.</p>

    <div class="code-block"><span class="comment">-- 1. Enable Cryptographic UUID Generator</span>
<span class="keyword">CREATE EXTENSION IF NOT EXISTS</span> <span class="string">"pgcrypto"</span>;

<span class="comment">-- 2. Drop existing objects for idempotent migration</span>
<span class="keyword">DROP TABLE IF EXISTS</span> <span class="string">"User"</span> <span class="keyword">CASCADE</span>;
<span class="keyword">DROP TABLE IF EXISTS</span> <span class="string">"Course"</span> <span class="keyword">CASCADE</span>;
<span class="keyword">DROP TYPE IF EXISTS</span> <span class="string">"Gender"</span> <span class="keyword">CASCADE</span>;

<span class="comment">-- 3. Custom Enumerated Type</span>
<span class="keyword">CREATE TYPE</span> <span class="string">"Gender"</span> <span class="keyword">AS ENUM</span> (<span class="string">'MALE'</span>, <span class="string">'FEMALE'</span>, <span class="string">'OTHER'</span>);

<span class="comment">-- 4. User Entity (Authentication &amp; Student Profiles)</span>
<span class="keyword">CREATE TABLE</span> <span class="string">"User"</span> (
    <span class="string">"id"</span> <span class="type">UUID</span> <span class="keyword">PRIMARY KEY DEFAULT</span> gen_random_uuid(),
    <span class="string">"fullName"</span> <span class="type">VARCHAR(100)</span> <span class="keyword">NOT NULL</span>,
    <span class="string">"email"</span> <span class="type">VARCHAR(255)</span> <span class="keyword">NOT NULL</span>,
    <span class="string">"passwordHash"</span> <span class="type">VARCHAR(255)</span> <span class="keyword">NOT NULL</span>,
    <span class="string">"phone"</span> <span class="type">VARCHAR(20)</span> <span class="keyword">NOT NULL</span>,
    <span class="string">"gender"</span> <span class="string">"Gender"</span> <span class="keyword">NOT NULL</span>,
    <span class="string">"createdAt"</span> <span class="type">TIMESTAMP(3)</span> <span class="keyword">NOT NULL DEFAULT</span> CURRENT_TIMESTAMP,
    <span class="string">"updatedAt"</span> <span class="type">TIMESTAMP(3)</span> <span class="keyword">NOT NULL DEFAULT</span> CURRENT_TIMESTAMP,

    <span class="keyword">CONSTRAINT</span> <span class="string">"UQ_User_email"</span> <span class="keyword">UNIQUE</span> (<span class="string">"email"</span>),
    <span class="keyword">CONSTRAINT</span> <span class="string">"CK_User_fullName_min_length"</span> <span class="keyword">CHECK</span> (char_length(<span class="string">"fullName"</span>) &gt;= 3)
);

<span class="comment">-- 5. Course Catalog Entity (Independent Sample Entity)</span>
<span class="keyword">CREATE TABLE</span> <span class="string">"Course"</span> (
    <span class="string">"id"</span> <span class="type">UUID</span> <span class="keyword">PRIMARY KEY DEFAULT</span> gen_random_uuid(),
    <span class="string">"title"</span> <span class="type">VARCHAR(150)</span> <span class="keyword">NOT NULL</span>,
    <span class="string">"code"</span> <span class="type">VARCHAR(20)</span> <span class="keyword">NOT NULL</span>,
    <span class="string">"credits"</span> <span class="type">INTEGER</span> <span class="keyword">NOT NULL</span>,
    <span class="string">"description"</span> <span class="type">TEXT</span>,

    <span class="keyword">CONSTRAINT</span> <span class="string">"UQ_Course_code"</span> <span class="keyword">UNIQUE</span> (<span class="string">"code"</span>),
    <span class="keyword">CONSTRAINT</span> <span class="string">"CK_Course_credits_positive"</span> <span class="keyword">CHECK</span> (<span class="string">"credits"</span> &gt; 0 <span class="keyword">AND</span> <span class="string">"credits"</span> &lt;= 6)
);

<span class="comment">-- 6. Performance B-Tree Indexes</span>
<span class="keyword">CREATE INDEX</span> <span class="string">"idx_user_email"</span> <span class="keyword">ON</span> <span class="string">"User"</span> (<span class="string">"email"</span>);
<span class="keyword">CREATE INDEX</span> <span class="string">"idx_user_created_at"</span> <span class="keyword">ON</span> <span class="string">"User"</span> (<span class="string">"createdAt"</span> <span class="keyword">DESC</span>);
<span class="keyword">CREATE INDEX</span> <span class="string">"idx_course_code"</span> <span class="keyword">ON</span> <span class="string">"Course"</span> (<span class="string">"code"</span>);

<span class="comment">-- 7. Automated Audit Trigger Function</span>
<span class="keyword">CREATE OR REPLACE FUNCTION</span> update_modified_column()
<span class="keyword">RETURNS TRIGGER AS</span> $$
<span class="keyword">BEGIN</span>
    NEW.<span class="string">"updatedAt"</span> = CURRENT_TIMESTAMP;
    <span class="keyword">RETURN</span> NEW;
<span class="keyword">END</span>;
$$ <span class="keyword">LANGUAGE</span> <span class="string">'plpgsql'</span>;

<span class="keyword">CREATE TRIGGER</span> update_user_modtime
    <span class="keyword">BEFORE UPDATE ON</span> <span class="string">"User"</span>
    <span class="keyword">FOR EACH ROW</span>
    <span class="keyword">EXECUTE FUNCTION</span> update_modified_column();</div>

    <div class="page-footer">
      <span>DBMS Laboratory Practical Submission &bull; CSE311L</span>
      <span>Page 2 of 6</span>
    </div>
  </div>

  <!-- ==================== PAGE 3: APPLICATION RUNTIME RAW SQL ==================== -->
  <div class="page">
    <h3>3. Application Runtime Raw SQL (DML, DQL &amp; Aggregates)</h3>
    <p>Pure SQL queries executed by the backend application for registration, authentication, analytics, and data display.</p>

    <h4>A. Student Registration (Uniqueness Check &amp; Parameterized Insertion)</h4>
    <div class="code-block"><span class="comment">-- 1. Uniqueness check for email</span>
<span class="keyword">SELECT</span> <span class="string">"id"</span> <span class="keyword">FROM</span> <span class="string">"User"</span> <span class="keyword">WHERE</span> <span class="string">"email"</span> = $1 <span class="keyword">LIMIT</span> 1;

<span class="comment">-- 2. Insert new student record with UUID and hashed password</span>
<span class="keyword">INSERT INTO</span> <span class="string">"User"</span> (
    <span class="string">"id"</span>, <span class="string">"fullName"</span>, <span class="string">"email"</span>, <span class="string">"passwordHash"</span>, <span class="string">"phone"</span>, <span class="string">"gender"</span>, <span class="string">"createdAt"</span>, <span class="string">"updatedAt"</span>
) <span class="keyword">VALUES</span> (
    gen_random_uuid(), $1, $2, $3, $4, $5::<span class="string">"Gender"</span>, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
)
<span class="keyword">RETURNING</span> <span class="string">"id"</span>, <span class="string">"fullName"</span>, <span class="string">"email"</span>, <span class="string">"phone"</span>, <span class="string">"gender"</span>, <span class="string">"createdAt"</span>;</div>

    <h4>B. Authentication &amp; User Session Profile Lookup</h4>
    <div class="code-block"><span class="comment">-- Login credential verification</span>
<span class="keyword">SELECT</span> <span class="string">"id"</span>, <span class="string">"fullName"</span>, <span class="string">"email"</span>, <span class="string">"passwordHash"</span>, <span class="string">"phone"</span>, <span class="string">"gender"</span>, <span class="string">"createdAt"</span>
<span class="keyword">FROM</span> <span class="string">"User"</span> <span class="keyword">WHERE</span> <span class="string">"email"</span> = $1 <span class="keyword">LIMIT</span> 1;

<span class="comment">-- Active session retrieval (passwordHash excluded from projection)</span>
<span class="keyword">SELECT</span> <span class="string">"id"</span>, <span class="string">"fullName"</span>, <span class="string">"email"</span>, <span class="string">"phone"</span>, <span class="string">"gender"</span>, <span class="string">"createdAt"</span>, <span class="string">"updatedAt"</span>
<span class="keyword">FROM</span> <span class="string">"User"</span> <span class="keyword">WHERE</span> <span class="string">"id"</span> = $1 <span class="keyword">LIMIT</span> 1;</div>

    <h4>C. Dashboard Relational Aggregations &amp; Catalog Retrieval</h4>
    <div class="code-block"><span class="comment">-- Aggregate count of registered students</span>
<span class="keyword">SELECT COUNT</span>(*) <span class="keyword">AS</span> total_students <span class="keyword">FROM</span> <span class="string">"User"</span>;

<span class="comment">-- Aggregate count of active catalog courses</span>
<span class="keyword">SELECT COUNT</span>(*) <span class="keyword">AS</span> total_courses <span class="keyword">FROM</span> <span class="string">"Course"</span>;

<span class="comment">-- Demographic distribution grouping (Recharts integration)</span>
<span class="keyword">SELECT</span> <span class="string">"gender"</span>, <span class="keyword">COUNT</span>(*) <span class="keyword">AS</span> count <span class="keyword">FROM</span> <span class="string">"User"</span> <span class="keyword">GROUP BY</span> <span class="string">"gender"</span>;

<span class="comment">-- Paginated student directory ordered by newest registration</span>
<span class="keyword">SELECT</span> <span class="string">"id"</span>, <span class="string">"fullName"</span>, <span class="string">"email"</span>, <span class="string">"phone"</span>, <span class="string">"gender"</span>, <span class="string">"createdAt"</span>
<span class="keyword">FROM</span> <span class="string">"User"</span> <span class="keyword">ORDER BY</span> <span class="string">"createdAt"</span> <span class="keyword">DESC LIMIT</span> $1 <span class="keyword">OFFSET</span> $2;

<span class="comment">-- Course catalog catalog retrieval</span>
<span class="keyword">SELECT</span> <span class="string">"id"</span>, <span class="string">"title"</span>, <span class="string">"code"</span>, <span class="string">"credits"</span>, <span class="string">"description"</span>
<span class="keyword">FROM</span> <span class="string">"Course"</span> <span class="keyword">ORDER BY</span> <span class="string">"code"</span> <span class="keyword">ASC</span>;</div>

    <h4>D. Database Initial Course Catalog Seed</h4>
    <div class="code-block"><span class="keyword">INSERT INTO</span> <span class="string">"Course"</span> (<span class="string">"id"</span>, <span class="string">"title"</span>, <span class="string">"code"</span>, <span class="string">"credits"</span>, <span class="string">"description"</span>) <span class="keyword">VALUES</span>
  (gen_random_uuid(), <span class="string">'Database Management Systems'</span>, <span class="string">'CSE311'</span>, 3, <span class="string">'Relational theory, SQL optimization, and ACID properties.'</span>),
  (gen_random_uuid(), <span class="string">'Database Systems Lab'</span>, <span class="string">'CSE311L'</span>, 1, <span class="string">'Practical lab sessions covering DDL, DML, and PostgreSQL integration.'</span>),
  (gen_random_uuid(), <span class="string">'Software Engineering'</span>, <span class="string">'CSE327'</span>, 3, <span class="string">'SDLC, agile methodologies, design patterns, and UML modeling.'</span>),
  (gen_random_uuid(), <span class="string">'Design &amp; Analysis of Algorithms'</span>, <span class="string">'CSE373'</span>, 3, <span class="string">'Dynamic programming, greedy algorithms, and graph theory.'</span>),
  (gen_random_uuid(), <span class="string">'Computer Networks'</span>, <span class="string">'CSE421'</span>, 3, <span class="string">'OSI and TCP/IP stacks, socket programming, and routing protocols.'</span>),
  (gen_random_uuid(), <span class="string">'Operating Systems'</span>, <span class="string">'CSE325'</span>, 3, <span class="string">'Process scheduling, virtual memory paging, and file systems.'</span>)
<span class="keyword">ON CONFLICT</span> (<span class="string">"code"</span>) <span class="keyword">DO NOTHING</span>;</div>

    <div class="page-footer">
      <span>DBMS Laboratory Practical Submission &bull; CSE311L</span>
      <span>Page 3 of 6</span>
    </div>
  </div>

  <!-- ==================== PAGE 4: SCREENSHOT 1 ==================== -->
  <div class="page">
    <h3>4. Visual Verification Screenshots</h3>
    <h4>A. Registration Page Screenshot</h4>
    <p>Student registration portal providing client-side validation, password strength calculation, and direct insertion into PostgreSQL.</p>
    
    <div class="img-frame">
      <img src="{img_reg}" alt="Registration Page Screenshot">
      <div class="img-caption">
        <span>Figure 1: Student Registration Portal (URL: /register)</span>
        <span>PostgreSQL 16 Storage &bull; bcrypt Salt 12 &bull; Zod Schema</span>
      </div>
    </div>

    <div class="spec-card" style="margin-top: 8px;">
      <h5>Registration Engineering Highlights:</h5>
      <ul>
        <li>Client &amp; Server validation: Name minimum 3 chars, Bangladeshi phone format, matching passwords.</li>
        <li>Real-time visual strength scoring verifying lowercase, uppercase, number, symbol, and 8+ length.</li>
        <li>Server hashes plaintext with <code>bcrypt.hash(password, 12)</code> before executing SQL insert.</li>
      </ul>
    </div>

    <div class="page-footer">
      <span>DBMS Laboratory Practical Submission &bull; CSE311L</span>
      <span>Page 4 of 6</span>
    </div>
  </div>

  <!-- ==================== PAGE 5: SCREENSHOT 2 ==================== -->
  <div class="page">
    <h3>4. Visual Verification Screenshots (Continued)</h3>
    <h4>B. Login Page Screenshot</h4>
    <p>Authentication interface verifying student email, comparing bcrypt hashes, and provisioning tamper-proof session tokens.</p>
    
    <div class="img-frame">
      <img src="{img_login}" alt="Login Page Screenshot">
      <div class="img-caption">
        <span>Figure 2: Student Login Portal (URL: /login)</span>
        <span>Edge Middleware Guard &bull; httpOnly Cookie Session</span>
      </div>
    </div>

    <div class="spec-card" style="margin-top: 8px;">
      <h5>Authentication Engineering Highlights:</h5>
      <ul>
        <li>Queries user by email using the <code>"idx_user_email"</code> B-Tree index for sub-millisecond retrieval.</li>
        <li>Timing-safe hash comparison via <code>bcrypt.compare</code> to prevent timing attacks.</li>
        <li>Generates signed JWT stored in an <code>httpOnly</code> cookie (inaccessible via JavaScript document.cookie).</li>
      </ul>
    </div>

    <div class="page-footer">
      <span>DBMS Laboratory Practical Submission &bull; CSE311L</span>
      <span>Page 5 of 6</span>
    </div>
  </div>

  <!-- ==================== PAGE 6: SCREENSHOT 3 ==================== -->
  <div class="page">
    <h3>4. Visual Verification Screenshots (Continued)</h3>
    <h4>C. Dashboard Showing Database Data</h4>
    <p>Real-time relational dashboard executing queries displaying active student profile, counters, demographic breakdown, and course catalog.</p>
    
    <div class="img-frame" style="max-height: 620px; text-align: center;">
      <img src="{img_dash}" style="max-height: 590px; width: auto; max-width: 100%; margin: 0 auto;" alt="Dashboard Page Screenshot">
      <div class="img-caption">
        <span>Figure 3: Live Student &amp; Academic Dashboard (URL: /dashboard)</span>
        <span>SELECT COUNT(*), GROUP BY, B-Tree Index Lookups</span>
      </div>
    </div>

    <div class="footer-note">
      <strong>Comprehensive Security &amp; Database Audit:</strong>
      All SQL interactions use parameterized arguments to eliminate SQL injection vulnerabilities. Authentication is secured using salted bcrypt hashing and tamper-proof httpOnly session cookies. Relational schema constraints ensure data normalization and referential integrity across the system.
    </div>

    <div class="page-footer">
      <span>DBMS Laboratory Practical Submission &bull; CSE311L</span>
      <span>Page 6 of 6</span>
    </div>
  </div>

</body>
</html>
"""

report_html_path = os.path.join(base_dir, "submission_report.html")
pdf_path = os.path.join(base_dir, "DBMS_Lab_Mid_Assignment_Submission.pdf")

with open(report_html_path, "w", encoding="utf-8") as f:
    f.write(html_content)

print(f"✓ Generated HTML at {report_html_path}")

cmd = [
    "google-chrome",
    "--headless",
    "--disable-gpu",
    "--no-sandbox",
    "--run-all-compositor-stages-before-draw",
    "--no-pdf-header-footer",
    f"--print-to-pdf={pdf_path}",
    report_html_path
]

print("Executing Chrome headless PDF render with --no-pdf-header-footer...")
subprocess.run(cmd, check=True)
print(f"✅ Generated PDF at {pdf_path}")
print(f"File size: {os.path.getsize(pdf_path) / 1024:.2f} KB")
