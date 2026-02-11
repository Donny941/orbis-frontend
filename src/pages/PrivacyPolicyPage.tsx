import { Navbar } from "../components/layout/Navbar";
import { Shield } from "lucide-react";

export const PrivacyPolicyPage = () => {
  return (
    <div>
      <Navbar variant="landing" />
      <div className="legal-page">
        <div className="container">
          <div className="legal-header">
            <Shield size={32} />
            <h1>Privacy Policy</h1>
            <p className="legal-updated">Last updated: February 10, 2026</p>
          </div>

          <div className="legal-content">
            <section>
              <h2>1. Introduction</h2>
              <p>
                Welcome to Orbis ("we", "our", "us"). We are committed to protecting your personal information and your right to privacy. This Privacy Policy
                explains how we collect, use, disclose, and safeguard your information when you use our platform at orbis.alandonati.blog.
              </p>
            </section>

            <section>
              <h2>2. Information We Collect</h2>
              <h3>2.1 Personal Information</h3>
              <p>When you register for an account, we collect:</p>
              <ul>
                <li>Username and display name</li>
                <li>Email address</li>
                <li>Password (stored securely using hashing)</li>
              </ul>

              <h3>2.2 Usage Data</h3>
              <p>We automatically collect certain information when you use Orbis:</p>
              <ul>
                <li>Pages visited and features used</li>
                <li>Content you create, share, or interact with</li>
                <li>Orb Points earned and level progression</li>
                <li>IP address for security and analytics purposes</li>
              </ul>

              <h3>2.3 Cookies</h3>
              <p>
                We use essential cookies to keep you logged in and maintain your session. We may also use analytics cookies to understand how our platform is
                used, but only with your consent.
              </p>
            </section>

            <section>
              <h2>3. How We Use Your Information</h2>
              <p>We use the information we collect to:</p>
              <ul>
                <li>Provide and maintain the Orbis platform</li>
                <li>Manage your account and authentication</li>
                <li>Track your learning progress and Orb Points</li>
                <li>Display your profile and contributions to other users</li>
                <li>Improve and optimize our platform</li>
                <li>Communicate important updates about the service</li>
              </ul>
            </section>

            <section>
              <h2>4. Data Sharing</h2>
              <p>
                We do not sell, trade, or rent your personal information to third parties. Your content (resources, comments) is visible to other Orbis users as
                part of the platform's collaborative nature. We may share data only if required by law or to protect our rights.
              </p>
            </section>

            <section>
              <h2>5. Data Security</h2>
              <p>
                We implement industry-standard security measures including encrypted passwords, JWT-based authentication, and HTTPS encryption. However, no
                method of transmission over the Internet is 100% secure, and we cannot guarantee absolute security.
              </p>
            </section>

            <section>
              <h2>6. Data Retention</h2>
              <p>
                We retain your personal data for as long as your account is active. If you wish to delete your account and associated data, please contact us at
                the email below.
              </p>
            </section>

            <section>
              <h2>7. Your Rights</h2>
              <p>Under applicable data protection laws, you have the right to:</p>
              <ul>
                <li>Access the personal data we hold about you</li>
                <li>Request correction of inaccurate data</li>
                <li>Request deletion of your data</li>
                <li>Withdraw consent for analytics cookies at any time</li>
                <li>Export your data in a portable format</li>
              </ul>
            </section>

            <section>
              <h2>8. Children's Privacy</h2>
              <p>
                Orbis is not intended for users under the age of 16. We do not knowingly collect personal information from children. If you believe a child has
                provided us with personal data, please contact us immediately.
              </p>
            </section>

            <section>
              <h2>9. Changes to This Policy</h2>
              <p>
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the
                "Last updated" date.
              </p>
            </section>

            <section>
              <h2>10. Contact Us</h2>
              <p>
                If you have any questions about this Privacy Policy, please contact us at: <a href="mailto:alandonati7@gmail.com">alandonati7@gmail.com</a>
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};
