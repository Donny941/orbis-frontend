import { Navbar } from "../components/layout/Navbar";
import { FileText } from "lucide-react";

export const TermsPage = () => {
  return (
    <div>
      <Navbar variant="landing" />
      <div className="legal-page">
        <div className="container">
          <div className="legal-header">
            <FileText size={32} />
            <h1>Terms of Service</h1>
            <p className="legal-updated">Last updated: February 10, 2026</p>
          </div>

          <div className="legal-content">
            <section>
              <h2>1. Acceptance of Terms</h2>
              <p>
                By accessing or using Orbis ("the Platform"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not
                use the Platform.
              </p>
            </section>

            <section>
              <h2>2. Description of Service</h2>
              <p>
                Orbis is a collaborative learning platform where users can join themed communities ("Orbs"), share educational resources, earn Orb Points, and
                track their learning progress. The Platform is provided free of charge.
              </p>
            </section>

            <section>
              <h2>3. User Accounts</h2>
              <ul>
                <li>You must provide accurate and complete registration information</li>
                <li>You are responsible for maintaining the security of your account</li>
                <li>You must be at least 16 years old to create an account</li>
                <li>One person may not maintain more than one account</li>
                <li>You are responsible for all activity that occurs under your account</li>
              </ul>
            </section>

            <section>
              <h2>4. User Content</h2>
              <h3>4.1 Your Content</h3>
              <p>
                You retain ownership of the content you create and share on Orbis (resources, comments, etc.). By posting content, you grant Orbis a
                non-exclusive, worldwide license to display and distribute your content within the Platform.
              </p>

              <h3>4.2 Content Guidelines</h3>
              <p>You agree not to post content that:</p>
              <ul>
                <li>Is illegal, harmful, threatening, or abusive</li>
                <li>Infringes on intellectual property rights</li>
                <li>Contains spam, malware, or misleading information</li>
                <li>Harasses or discriminates against other users</li>
                <li>Violates the privacy of others</li>
                <li>Is sexually explicit or promotes violence</li>
              </ul>
            </section>

            <section>
              <h2>5. Orb Points and Gamification</h2>
              <p>
                Orb Points are a virtual reward system within the Platform. They have no monetary value and cannot be exchanged, transferred, or redeemed
                outside of Orbis. We reserve the right to modify the points system at any time.
              </p>
            </section>

            <section>
              <h2>6. Prohibited Activities</h2>
              <p>You agree not to:</p>
              <ul>
                <li>Attempt to gain unauthorized access to the Platform</li>
                <li>Use automated tools to scrape or collect data</li>
                <li>Manipulate the Orb Points system through fraudulent activity</li>
                <li>Impersonate other users or entities</li>
                <li>Interfere with the proper functioning of the Platform</li>
                <li>Use the Platform for any commercial purpose without permission</li>
              </ul>
            </section>

            <section>
              <h2>7. Termination</h2>
              <p>
                We reserve the right to suspend or terminate your account at any time for violations of these Terms, without prior notice. You may also delete
                your account at any time by contacting us.
              </p>
            </section>

            <section>
              <h2>8. Disclaimer of Warranties</h2>
              <p>
                The Platform is provided "as is" and "as available" without any warranties of any kind. We do not guarantee that the Platform will be
                uninterrupted, secure, or error-free. Educational content shared by users represents their personal views and is not endorsed by Orbis.
              </p>
            </section>

            <section>
              <h2>9. Limitation of Liability</h2>
              <p>
                To the fullest extent permitted by law, Orbis shall not be liable for any indirect, incidental, special, or consequential damages arising from
                your use of the Platform.
              </p>
            </section>

            <section>
              <h2>10. Changes to Terms</h2>
              <p>
                We may modify these Terms at any time. Continued use of the Platform after changes constitutes acceptance of the new Terms. We will make
                reasonable efforts to notify users of significant changes.
              </p>
            </section>

            <section>
              <h2>11. Governing Law</h2>
              <p>These Terms are governed by the laws of Italy. Any disputes shall be resolved in the courts of Italy.</p>
            </section>

            <section>
              <h2>12. Contact Us</h2>
              <p>
                For questions about these Terms, contact us at: <a href="mailto:alandonati7@gmail.com">alandonati7@gmail.com</a>
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};
