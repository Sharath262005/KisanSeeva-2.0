const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../config/db");
require("dotenv").config();

// Register a new user
const register = async (req, res) => {
  const { name, email, password, phone, role, extraInfo, lat, lng, addressCity, addressState } = req.body;

  // Phone is primary — email is optional for farmer/provider
  if (!name || !password || !phone || !role) {
    return res.status(400).json({ message: "Please fill in all required fields (name, phone, password, role)." });
  }

  try {
    // Phone uniqueness check (primary identifier)
    const phoneExist = await db.query("SELECT id FROM users WHERE phone = $1", [phone]);
    if (phoneExist.rows.length > 0) {
      return res.status(400).json({ message: "A user with this phone number already exists." });
    }

    // Email uniqueness check — only if email is provided
    if (email) {
      const userExist = await db.query("SELECT * FROM users WHERE email = $1", [email.toLowerCase()]);
      if (userExist.rows.length > 0) {
        return res.status(400).json({ message: "User with this email already exists." });
      }
    }

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Insert user into DB
    const insertQuery = `
      INSERT INTO users (name, email, password, phone, role, extra_info, lat, lng, address_city, address_state) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) 
      RETURNING id, name, email, phone, role, extra_info, status, lat, lng, address_city, address_state, created_at
    `;
    const result = await db.query(insertQuery, [
      name,
      email ? email.toLowerCase() : null,
      hashedPassword,
      phone,
      role,
      extraInfo || "",
      lat || null,
      lng || null,
      addressCity || "",
      addressState || ""
    ]);

    const newUser = result.rows[0];

    // Create JWT only if admin (active), otherwise return just user for pending flow
    let token = null;
    let message = "Registration successful. Your account is pending admin approval.";

    if (newUser.role === "admin" || newUser.status === "active") {
      token = jwt.sign(
        { id: newUser.id, email: newUser.email, role: newUser.role },
        process.env.JWT_SECRET,
        { expiresIn: "30d" }
      );
      message = "Registration successful.";
    }

    res.status(201).json({
      message,
      token,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        role: newUser.role,
        extraInfo: newUser.extra_info,
        status: newUser.status
      }
    });

  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({ message: "Server error during registration." });
  }
};

// Login user
const login = async (req, res) => {
  const { email, password, role } = req.body;

  if (!email || !password || !role) {
    return res.status(400).json({ message: "Please provide email, password, and role." });
  }

  try {
    // Fetch only the columns needed for login — avoids loading large JSONB document blobs (aadhar/selfie).
    // PERF TIP: Ensure an index exists: CREATE INDEX IF NOT EXISTS idx_users_email ON users (email);
    const result = await db.query(
      "SELECT id, name, email, phone, role, password, status, extra_info FROM users WHERE email = $1",
      [email.toLowerCase()]
    );
    if (result.rows.length === 0) {
      return res.status(400).json({ message: "Invalid email or password." });
    }

    const user = result.rows[0];

    // Check role match
    if (user.role !== role) {
      return res.status(400).json({ message: `Access denied. Registered role is '${user.role}' not '${role}'.` });
    }

    // Check account status
    if (user.status === "pending") {
      return res.status(403).json({ message: "Your account is under review. Please wait for admin approval." });
    }
    if (user.status === "suspended") {
      return res.status(403).json({ message: "Your account is suspended. Please contact the administrator." });
    }

    // Match password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password." });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );

    res.json({
      message: "Login successful.",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        extraInfo: user.extra_info,
        status: user.status
      }
    });

  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Server error during login." });
  }
};

// Get current profile
const getProfile = async (req, res) => {
  try {
    const result = await db.query(
      "SELECT id, name, email, phone, role, extra_info, status, documents, created_at FROM users WHERE id = $1",
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found." });
    }

    const user = result.rows[0];
    res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        extraInfo: user.extra_info,
        status: user.status,
        documents: user.documents
      }
    });

  } catch (error) {
    console.error("Get Profile Error:", error);
    res.status(500).json({ message: "Server error retrieving profile." });
  }
};

// Update profile
const updateProfile = async (req, res) => {
  const { name, phone, extraInfo, documents } = req.body;

  if (!name || !phone) {
    return res.status(400).json({ message: "Name and phone fields are required." });
  }

  try {
    const docQuery = documents ? JSON.stringify(documents) : null;
    const updateQuery = `
      UPDATE users 
      SET name = $1, phone = $2, extra_info = $3,
          documents = CASE WHEN $5::jsonb IS NOT NULL THEN COALESCE(documents, '{}'::jsonb) || $5::jsonb ELSE documents END
      WHERE id = $4 
      RETURNING id, name, email, phone, role, extra_info, status, documents
    `;
    const result = await db.query(updateQuery, [name, phone, extraInfo || "", req.user.id, docQuery]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found." });
    }

    const updatedUser = result.rows[0];
    res.json({
      message: "Profile updated successfully.",
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        role: updatedUser.role,
        extraInfo: updatedUser.extra_info,
        status: updatedUser.status,
        documents: updatedUser.documents
      }
    });

  } catch (error) {
    console.error("Update Profile Error:", error);
    res.status(500).json({ message: "Server error updating profile." });
  }
};

const crypto = require("crypto");
const nodemailer = require("nodemailer");

// ── Build reusable Gmail SMTP transporter ────────────────────────────────────
// Requires GMAIL_USER and GMAIL_APP_PASSWORD in .env
// Generate an App Password at: https://myaccount.google.com/apppasswords
function createMailTransporter() {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });
}

// Forgot Password
const forgotPassword = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Please provide an email." });
  }

  try {
    const result = await db.query("SELECT * FROM users WHERE email = $1", [email.toLowerCase()]);
    if (result.rows.length === 0) {
      // Generic response to prevent email enumeration
      return res.json({ message: "If that email is registered, a reset link has been sent." });
    }

    const user = result.rows[0];
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetExpires = new Date(Date.now() + 3600000); // 1 hour

    await db.query(
      "UPDATE users SET reset_password_token = $1, reset_password_expires = $2 WHERE email = $3",
      [resetToken, resetExpires, email.toLowerCase()]
    );

    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
    const resetUrl = `${frontendUrl}/reset-password?token=${resetToken}`;

    // ── Dev mode: no Gmail credentials configured ────────────────────────
    if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
      console.warn("⚠️  GMAIL_USER / GMAIL_APP_PASSWORD not set.");
      console.log(`[DEV] Password reset link for ${email}: ${resetUrl}`);
      return res.json({
        message: "Dev Mode: Gmail not configured. Reset link printed to server console.",
        devResetToken: resetToken,
      });
    }

    const htmlBody = `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#0f172a;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0f172a;padding:40px 0;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#1e293b;border-radius:20px;overflow:hidden;border:1px solid #334155;">
        <tr>
          <td style="background:linear-gradient(135deg,#059669,#10b981);padding:36px 40px;text-align:center;">
            <h1 style="margin:0;color:#fff;font-size:28px;font-weight:900;">🌾 KisanSeeva</h1>
            <p style="margin:8px 0 0;color:rgba(255,255,255,0.85);font-size:14px;">Connecting Rural India</p>
          </td>
        </tr>
        <tr>
          <td style="padding:40px;">
            <h2 style="margin:0 0 16px;color:#f1f5f9;font-size:22px;font-weight:700;">Password Reset Request</h2>
            <p style="margin:0 0 12px;color:#94a3b8;font-size:15px;line-height:1.6;">Hi <strong style="color:#e2e8f0;">${user.name}</strong>,</p>
            <p style="margin:0 0 28px;color:#94a3b8;font-size:15px;line-height:1.6;">We received a request to reset your password. This link expires in <strong style="color:#34d399;">1 hour</strong>.</p>
            <table cellpadding="0" cellspacing="0" style="margin:0 auto 28px;">
              <tr>
                <td style="border-radius:12px;overflow:hidden;">
                  <a href="${resetUrl}" style="display:block;padding:14px 40px;background:linear-gradient(135deg,#059669,#10b981);color:#fff;font-size:16px;font-weight:700;text-decoration:none;text-align:center;">Reset My Password</a>
                </td>
              </tr>
            </table>
            <p style="margin:0 0 8px;color:#64748b;font-size:13px;">Or copy this link:</p>
            <p style="margin:0 0 28px;word-break:break-all;"><a href="${resetUrl}" style="color:#34d399;font-size:13px;">${resetUrl}</a></p>
            <hr style="border:none;border-top:1px solid #334155;margin:0 0 24px;">
            <p style="margin:0;color:#475569;font-size:13px;">If you didn't request this, you can safely ignore this email.</p>
          </td>
        </tr>
        <tr>
          <td style="background:#0f172a;padding:20px 40px;text-align:center;">
            <p style="margin:0;color:#334155;font-size:12px;">© 2026 KisanSeeva Technologies Pvt. Ltd.</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

    // ── Send via Gmail SMTP (Nodemailer) ─────────────────────────────────
    try {
      const transporter = createMailTransporter();
      await transporter.sendMail({
        from: process.env.GMAIL_USER,
        to: email,
        subject: "🔐 Reset Your KisanSeeva Password",
        html: htmlBody,
      });
      console.log(`✅ Password reset email sent via Gmail to ${email}`);
      res.json({ message: "Password reset link sent to your email." });
    } catch (emailError) {
      console.error("❌ Gmail email send failed:", emailError.message);
      res.status(500).json({ message: "Failed to send email. Please try again.", error: emailError.message });
    }

  } catch (error) {
    console.error("Forgot Password Error:", error);
    res.status(500).json({ message: "Server error processing request." });
  }
};



// Reset Password
const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  if (!token || !newPassword) {
    return res.status(400).json({ message: "Token and new password are required." });
  }

  try {
    const result = await db.query(
      "SELECT * FROM users WHERE reset_password_token = $1 AND reset_password_expires > NOW()",
      [token]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({ message: "Password reset token is invalid or has expired." });
    }

    const user = result.rows[0];
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await db.query(
      "UPDATE users SET password = $1, reset_password_token = NULL, reset_password_expires = NULL WHERE id = $2",
      [hashedPassword, user.id]
    );

    res.json({ message: "Password has been successfully reset. You can now login." });
  } catch (error) {
    console.error("Reset Password Error:", error);
    res.status(500).json({ message: "Server error resetting password." });
  }
};

const getPublicProfile = async (req, res) => {
  const { id } = req.params;
  try {
    // Fetch user — allow viewing any non-pending user (active/suspended both OK for booking partners)
    const userRes = await db.query(
      `SELECT id, name, phone, role, extra_info, documents, created_at, address_city, address_state, status
       FROM users WHERE id = $1 AND status != 'pending'`,
      [id]
    );
    if (userRes.rows.length === 0) {
      return res.status(404).json({ message: 'User profile not found or still pending approval.' });
    }
    const user = userRes.rows[0];

    // Ratings/reviews
    let reviews = [];
    if (user.role === 'provider') {
      const reviewsRes = await db.query(`
        SELECT b.rating, b.feedback, b.booking_date, u.name as reviewer_name
        FROM bookings b
        JOIN users u ON b.farmer_id = u.id
        JOIN services s ON b.service_id = s.id
        WHERE s.provider_id = $1 AND b.rating IS NOT NULL
        ORDER BY b.created_at DESC LIMIT 10
      `, [id]);
      reviews = reviewsRes.rows;
    } else if (user.role === 'farmer') {
      const reviewsRes = await db.query(`
        SELECT b.rating, b.feedback, b.booking_date, u.name as reviewer_name, s.name as service_name
        FROM bookings b
        JOIN services s ON b.service_id = s.id
        JOIN users u ON s.provider_id = u.id
        WHERE b.farmer_id = $1 AND b.rating IS NOT NULL
        ORDER BY b.created_at DESC LIMIT 10
      `, [id]);
      reviews = reviewsRes.rows;
    }

    // Services (provider only)
    let services = [];
    if (user.role === 'provider') {
      const servicesRes = await db.query(
        `SELECT id, name, type, price_per_hour, pricing_model, description, status
         FROM services WHERE provider_id = $1 AND status = 'available'`,
        [id]
      );
      services = servicesRes.rows;
    }

    const avgRating = reviews.length > 0
      ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
      : null;

    res.json({ user: { ...user, extraInfo: user.extra_info }, reviews, services, avgRating });
  } catch (error) {
    console.error('Get Public Profile Error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

// ─── Send OTP ─────────────────────────────────────────────────────────────────
// Generates a 6-digit OTP for phone-based login (Farmer/Provider).
// Dev mode: OTP returned in response. Prod mode: log to console (swap in SMS provider).
const sendOtp = async (req, res) => {
  const { phone, role } = req.body;

  if (!phone || !role) {
    return res.status(400).json({ message: "Phone number and role are required." });
  }

  try {
    const result = await db.query("SELECT * FROM users WHERE phone = $1", [phone]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "This phone number is not registered. Please register first.",
        notRegistered: true
      });
    }

    const user = result.rows[0];

    if (user.role !== role) {
      return res.status(403).json({
        message: `This number is registered as a '${user.role}', not '${role}'.`
      });
    }

    if (user.status === "pending") {
      return res.status(403).json({
        message: "Your account is pending admin approval. Please wait."
      });
    }

    if (user.status === "suspended") {
      return res.status(403).json({
        message: "Your account is suspended. Please contact the administrator."
      });
    }

    // Generate 6-digit OTP
    const otp = String(Math.floor(100000 + Math.random() * 900000));
    const expires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await db.query(
      "UPDATE users SET otp_code = $1, otp_expires = $2 WHERE phone = $3",
      [otp, expires, phone]
    );

    // Dev mode: return OTP in response for testing
    // Prod: swap in Twilio/MSG91 here, remove otp from response
    const isDev = process.env.NODE_ENV !== "production";
    if (isDev) {
      console.log(`[DEV OTP] Phone: ${phone} | OTP: ${otp}`);
      return res.json({
        message: "OTP sent successfully. (Dev mode — check API response)",
        otp // ← REMOVE THIS in production
      });
    }

    // --- Production SMS send would go here ---
    // await twilioClient.messages.create({ body: `Your KisanSeeva OTP: ${otp}`, from: process.env.TWILIO_FROM, to: phone });
    console.log(`[PROD OTP] Phone: ${phone} | OTP: ${otp} (SMS not configured)`);
    res.json({ message: "OTP sent to your registered mobile number." });

  } catch (error) {
    console.error("Send OTP Error:", error);
    res.status(500).json({ message: "Server error sending OTP." });
  }
};

// ─── Verify OTP ────────────────────────────────────────────────────────────────
// Verifies OTP and returns JWT on success (same shape as existing login).
const verifyOtp = async (req, res) => {
  const { phone, otp, role } = req.body;

  if (!phone || !otp || !role) {
    return res.status(400).json({ message: "Phone, OTP, and role are required." });
  }

  try {
    const result = await db.query(
      "SELECT * FROM users WHERE phone = $1",
      [phone]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Phone number not found." });
    }

    const user = result.rows[0];

    if (!user.otp_code || !user.otp_expires) {
      return res.status(400).json({ message: "No OTP was requested. Please request a new OTP." });
    }

    if (new Date() > new Date(user.otp_expires)) {
      return res.status(400).json({ message: "OTP has expired. Please request a new one." });
    }

    if (user.otp_code !== String(otp).trim()) {
      return res.status(400).json({ message: "Incorrect OTP. Please try again." });
    }

    if (user.role !== role) {
      return res.status(403).json({ message: `This number is registered as '${user.role}'.` });
    }

    // Clear OTP after use
    await db.query(
      "UPDATE users SET otp_code = NULL, otp_expires = NULL WHERE phone = $1",
      [phone]
    );

    // Generate JWT
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );

    res.json({
      message: "Login successful.",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        extraInfo: user.extra_info,
        status: user.status
      }
    });

  } catch (error) {
    console.error("Verify OTP Error:", error);
    res.status(500).json({ message: "Server error verifying OTP." });
  }
};



module.exports = {
  register,
  login,
  getProfile,
  updateProfile,
  forgotPassword,
  resetPassword,
  getPublicProfile,
  sendOtp,
  verifyOtp
};
