import { HelpCircle, BookOpen, Zap, Users, Star, Mail } from "lucide-react";
import { useState } from "react";

interface FaqItem {
  question: string;
  answer: string;
}

const faqs: FaqItem[] = [
  {
    question: "What are Orbs?",
    answer:
      "Orbs are themed learning communities. Each Orb focuses on a specific topic like Programming, Data Science, or Design. Join Orbs that match your interests to see relevant resources in your feed.",
  },
  {
    question: "How do Orb Points work?",
    answer:
      "You earn Orb Points by posting resources (+10 points), receiving orbs from other users, and maintaining your streak. Points determine your level: Novice → Student → Scholar → Expert → Master.",
  },
  {
    question: "What is the streak system?",
    answer:
      "Your streak tracks consecutive days of activity. Post a resource or interact with the community daily to keep it alive. Your longest streak is recorded on your profile.",
  },
  {
    question: "How do I give an Orb to a resource?",
    answer: "Click the Orb button on any resource or comment. The points given scale with your level — higher level users give more valuable orbs.",
  },
  {
    question: "What resource types can I create?",
    answer:
      "You can create Notes (quick tips), Articles (in-depth content), Code (snippets and tutorials), and Links (external resources). All support rich text editing.",
  },
  {
    question: "Can I save resources as drafts?",
    answer: "Yes! When creating a resource, click 'Save Draft' instead of 'Publish'. You can find and edit your drafts in the My Resources section.",
  },
];

export const HelpPage = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <>
      <div className="page-header">
        <div>
          <h1 className="page-title">Help & FAQ</h1>
          <p className="page-subtitle">Everything you need to know about Orbis</p>
        </div>
      </div>

      {/* Quick Links */}
      <div className="help-grid">
        <div className="card help-card">
          <BookOpen size={24} />
          <h3>Getting Started</h3>
          <p>Join an Orb, create your first resource, and start earning points.</p>
        </div>
        <div className="card help-card">
          <Zap size={24} />
          <h3>Orb Points & Levels</h3>
          <p>Learn how the progression system works and how to level up faster.</p>
        </div>
        <div className="card help-card">
          <Users size={24} />
          <h3>Communities</h3>
          <p>Discover and join Orbs that match your learning interests.</p>
        </div>
        <div className="card help-card">
          <Star size={24} />
          <h3>Resources</h3>
          <p>Create, share, and discover learning resources from the community.</p>
        </div>
      </div>

      {/* FAQ */}
      <div className="faq-section">
        <h2 className="section-title-sm">Frequently Asked Questions</h2>
        <div className="faq-list">
          {faqs.map((faq, index) => (
            <div key={index} className={`faq-item ${openFaq === index ? "open" : ""}`} onClick={() => setOpenFaq(openFaq === index ? null : index)}>
              <div className="faq-question">
                <HelpCircle size={18} />
                <span>{faq.question}</span>
                <span className="faq-toggle">{openFaq === index ? "−" : "+"}</span>
              </div>
              {openFaq === index && (
                <div className="faq-answer">
                  <p>{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Contact */}
      <div className="card help-contact">
        <Mail size={24} />
        <h3>Still need help?</h3>
        <p>
          Contact us at <a href="mailto:support@orbis.app">support@orbis.app</a>
        </p>
      </div>
    </>
  );
};
