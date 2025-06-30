import './AboutPage.css'

const AboutPage = () => {
  return (
    <div style={{ paddingTop: '100px', color: 'white', maxWidth: '800px', margin: '0 auto', textAlign: 'left', padding: '0 20px' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '40px', textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)' }}>About LilGrant</h1>

      <section style={{ marginBottom: '40px' }}>
        {/* === About Content === */}
        <div>
          <p style={{ lineHeight: '1.7', marginBottom: '20px', textShadow: '1px 1px 2px rgba(0, 0, 0, 0.3)' }}>
            Lilliane Nguyen is an international student at the University of Rochester, pursuing a degree in Business. Like many international students, she has faced the weight of financial uncertainty and the often-unspoken gaps in support that accompany studying far from home.
          </p>
          <p style={{ lineHeight: '1.7', marginBottom: '20px', textShadow: '1px 1px 2px rgba(0, 0, 0, 0.3)' }}>
            LilGrant began as more than a project - it is a purpose-driven initiative shaped by lived experience.
          </p>
          <p style={{ lineHeight: '1.7', marginBottom: '20px', textShadow: '1px 1px 2px rgba(0, 0, 0, 0.3)' }}>
            Without access to federal grants, loans, or the full spectrum of aid available to domestic peers, international students frequently face a silent struggle - one that adds invisible pressure to an already demanding journey. LilGrant was created as a response to that challenge, born from a belief that no student should feel alone in the search for opportunity.
          </p>
          <p style={{ lineHeight: '1.7', marginBottom: '20px', textShadow: '1px 1px 2px rgba(0, 0, 0, 0.3)' }}>
            At its core, LilGrant is a platform designed to make scholarship discovery accessible, transparent, and empowering. It's a space built not just for finding funding, but for fostering hope - for helping students turn barriers into bridges.
          </p>
          <p style={{ lineHeight: '1.7', marginBottom: '20px', textShadow: '1px 1px 2px rgba(0, 0, 0, 0.3)' }}>
            Whether you're looking for financial assistance or simply need guidance in the maze of applications and deadlines, LilGrant is here to support you. Because your dreams are valid, your ambitions are powerful, and your journey deserves to be met with resources - not roadblocks.
          </p>
        </div>
      </section>

      <section style={{ marginBottom: '40px' }}>
        <h2 style={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.4)', marginBottom: '20px' }}>Get in Touch!</h2>
        <p style={{ lineHeight: '1.7', marginBottom: '15px', textShadow: '1px 1px 2px rgba(0, 0, 0, 0.3)' }}>
          Your questions, feedback, and scholarship suggestions are incredibly valuable to LilGrant's growth and a big part of our community! Whether you have an idea to make LilGrant better, spot an issue, are interested in potential partnerships, or simply want to share your scholarship journey, we'd love to hear from you.
        </p>
        <p style={{ lineHeight: '1.7', marginBottom: '15px', textShadow: '1px 1px 2px rgba(0, 0, 0, 0.3)' }}>
          Please feel free to reach out via email at: <a href="mailto:lillianenguyen161@gmail.com" style={{ color: '#FFD1DC', textDecoration: 'underline' }}>lillianenguyen161@gmail.com</a>
        </p>
        <p style={{ lineHeight: '1.7', textShadow: '1px 1px 2px rgba(0, 0, 0, 0.3)' }}>
          A dedicated contact form is also planned for the future to make connecting even easier!
          </p>
        </section>

      <section style={{ marginBottom: '40px' }}>
        <h2 style={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.4)', marginBottom: '20px' }}>Frequently Asked Questions (FAQ)</h2>
        
        <div style={{ marginTop: '20px' }}>
          <h3 style={{ textShadow: '1px 1px 3px rgba(0, 0, 0, 0.4)' }}>How is LilGrant different from other scholarship platforms?</h3>
          <p style={{ lineHeight: '1.7', marginBottom: '15px', textShadow: '1px 1px 2px rgba(0, 0, 0, 0.3)' }}>LilGrant aims to provide a uniquely user-friendly, focused, and supportive experience, created with a deep understanding of the student journey—especially for international students. We prioritize clarity, direct links to official opportunities, and a curated approach to help reduce overwhelm.</p>
        </div>

        <div style={{ marginTop: '20px' }}>
          <h3 style={{ textShadow: '1px 1px 3px rgba(0, 0, 0, 0.4)' }}>How often are scholarships updated on LilGrant?</h3>
          <p style={{ lineHeight: '1.7', marginBottom: '15px', textShadow: '1px 1px 2px rgba(0, 0, 0, 0.3)' }}>The scholarship data on LilGrant is updated periodically once a week. We strive to keep the information as current and accurate as possible. As LilGrant grows, we'll be working on making this process even more frequent and robust. You'll often find a 'last updated' note or similar indicator in the future.</p>
        </div>

        <div style={{ marginTop: '20px' }}>
          <h3 style={{ textShadow: '1px 1px 3px rgba(0, 0, 0, 0.4)' }}>Is LilGrant free to use?</h3>
          <p style={{ lineHeight: '1.7', marginBottom: '15px', textShadow: '1px 1px 2px rgba(0, 0, 0, 0.3)' }}>Absolutely! LilGrant is completely free for students to use to find scholarship information and resources. Our goal is to make scholarship discovery more accessible to everyone.</p>
        </div>

        <div style={{ marginTop: '20px' }}>
          <h3 style={{ textShadow: '1px 1px 3px rgba(0, 0, 0, 0.4)' }}>What kinds of scholarships can I find on LilGrant?</h3>
          <p style={{ lineHeight: '1.7', marginBottom: '15px', textShadow: '1px 1px 2px rgba(0, 0, 0, 0.3)' }}>LilGrant focuses on a diverse range of scholarships suitable for various study levels (with an initial emphasis on undergraduate studies), fields of study, and for students looking at opportunities in different countries. While LilGrant has a particular empathy for international students, many scholarships listed can be beneficial for all students.</p>
        </div>

        <div style={{ marginTop: '20px' }}>
          <h3 style={{ textShadow: '1px 1px 3px rgba(0, 0, 0, 0.4)' }}>Can I submit a scholarship to be listed on LilGrant?</h3>
          <p style={{ lineHeight: '1.7', marginBottom: '15px', textShadow: '1px 1px 2px rgba(0, 0, 0, 0.3)' }}>Yes, please! If you know of a scholarship that could benefit fellow students and isn't yet listed, we encourage you to share it via the contact email above. Community contributions are highly valued!</p>
        </div>

        <div style={{ marginTop: '20px' }}>
          <h3 style={{ textShadow: '1px 1px 3px rgba(0, 0, 0, 0.4)' }}>How do I know if a scholarship listed is legitimate?</h3>
          <p style={{ lineHeight: '1.7', marginBottom: '15px', textShadow: '1px 1px 2px rgba(0, 0, 0, 0.3)' }}>LilGrant endeavors to list scholarships from reputable sources. However, it's always crucial for students to do their own thorough due diligence before applying to any scholarship or sharing personal information. Always verify information on the official scholarship provider's website (which LilGrant links directly to). LilGrant is a discovery tool and cannot guarantee the legitimacy or terms of external listings.</p>
        </div>
        </section>

      <section style={{ marginBottom: '40px' }}>
        <h2 style={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.4)', marginBottom: '20px' }}>Privacy Policy</h2>
        <p style={{ lineHeight: '1.7', marginBottom: '15px', textShadow: '1px 1px 2px rgba(0, 0, 0, 0.3)' }}>
          Your privacy is incredibly important to Lilliane Nguyen and to the integrity of LilGrant ("the Platform"). This section outlines the principles of how information related to your use of LilGrant might be handled. While the full, legally reviewed Privacy Policy document is being prepared, we are committed to transparency and protecting your data. Our goal is to collect only what is minimally necessary to provide and enhance the service, and to always handle it responsibly.
        </p>

        <h4 style={{ marginTop: '20px', marginBottom: '10px', textShadow: '1px 1px 3px rgba(0, 0, 0, 0.4)' }}>Information We Might Collect</h4>
        <p style={{ lineHeight: '1.7', marginBottom: '10px', textShadow: '1px 1px 2px rgba(0, 0, 0, 0.3)' }}>
          As LilGrant evolves, the types of information collected will be clearly detailed. Currently, the Platform primarily serves as an information resource.
        </p>
        <ul style={{ listStylePosition: 'inside', paddingLeft: '20px', lineHeight: '1.7', textShadow: '1px 1px 2px rgba(0, 0, 0, 0.3)' }}>
          <li style={{ marginBottom: '8px' }}><strong>Information You Provide:</strong> If you contact us directly via the provided email address (e.g., <a href="mailto:lillianenguyen161@gmail.com" style={{ color: '#FFD1DC', textDecoration: 'underline' }}>lillianenguyen161@gmail.com</a>), we will receive your email address and any information you voluntarily include in your message. If future features like a contact form or newsletter subscription are implemented, the specific information collected (e.g., name, email) and its purpose will be clearly stated at the point of collection.</li>
          <li style={{ marginBottom: '8px' }}><strong>Non-Personal Usage Data (Analytics):</strong> To improve LilGrant's functionality and user experience, we may use privacy-respecting analytics tools (such as Netlify Analytics, which is GDPR compliant, or a similar service). These tools may collect anonymous, aggregated data about how users interact with the Platform, such as pages visited, time spent on pages, general browser type, and approximate geographical location (country/city level, not specific addresses). This data is not used to personally identify you.</li>
        </ul>

        <h4 style={{ marginTop: '20px', marginBottom: '10px', textShadow: '1px 1px 3px rgba(0, 0, 0, 0.4)' }}>How We Use Your Information</h4>
        <ul style={{ listStylePosition: 'inside', paddingLeft: '20px', lineHeight: '1.7', textShadow: '1px 1px 2px rgba(0, 0, 0, 0.3)' }}>
          <li style={{ marginBottom: '8px' }}>To respond to your inquiries if you contact us.</li>
          <li style={{ marginBottom: '8px' }}>To analyze usage patterns to understand how LilGrant is being used, helping us to improve its design, content, and features.</li>
          <li style={{ marginBottom: '8px' }}>To maintain the security and operational integrity of the Platform.</li>
        </ul>

        <h4 style={{ marginTop: '20px', marginBottom: '10px', textShadow: '1px 1px 3px rgba(0, 0, 0, 0.4)' }}>Data Storage and Protection</h4>
        <p style={{ lineHeight: '1.7', marginBottom: '15px', textShadow: '1px 1px 2px rgba(0, 0, 0, 0.3)' }}>
          We are committed to taking reasonable administrative, technical, and physical measures to help protect any information collected against loss, theft, misuse, and unauthorized access, disclosure, alteration, and destruction. The specifics of data storage (e.g., for analytics or future features) and security measures will be detailed in the full Privacy Policy.
        </p>

        <h4 style={{ marginTop: '20px', marginBottom: '10px', textShadow: '1px 1px 3px rgba(0, 0, 0, 0.4)' }}>Your Rights Regarding Your Data</h4>
        <p style={{ lineHeight: '1.7', marginBottom: '15px', textShadow: '1px 1px 2px rgba(0, 0, 0, 0.3)' }}>
          You have rights regarding your personal information, subject to local applicable laws. These may include the right to access, correct, or request the deletion of your personal data that we might hold. The full Privacy Policy will provide detailed information on how you can exercise these rights.
        </p>

        <h4 style={{ marginTop: '20px', marginBottom: '10px', textShadow: '1px 1px 3px rgba(0, 0, 0, 0.4)' }}>Cookies and Tracking Technologies</h4>
        <p style={{ lineHeight: '1.7', marginBottom: '15px', textShadow: '1px 1px 2px rgba(0, 0, 0, 0.3)' }}>
          LilGrant aims for minimal use of cookies and tracking technologies. Currently, any cookies used are likely to be for essential site functionality provided by the hosting platform (Netlify) or for the aforementioned privacy-respecting analytics. The full Privacy Policy will include a detailed section on any cookies used, their purpose, and how you can manage your preferences.
        </p>

        <h4 style={{ marginTop: '20px', marginBottom: '10px', textShadow: '1px 1px 3px rgba(0, 0, 0, 0.4)' }}>Third-Party Links</h4>
        <p style={{ lineHeight: '1.7', marginBottom: '15px', textShadow: '1px 1px 2px rgba(0, 0, 0, 0.3)' }}>
          LilGrant contains links to external, third-party websites (e.g., official scholarship pages). This Privacy Policy does not apply to those external sites. We encourage you to review the privacy policies of any third-party websites you visit.
        </p>

        <h4 style={{ marginTop: '20px', marginBottom: '10px', textShadow: '1px 1px 3px rgba(0, 0, 0, 0.4)' }}>Children's Privacy</h4>
        <p style={{ lineHeight: '1.7', marginBottom: '15px', textShadow: '1px 1px 2px rgba(0, 0, 0, 0.3)' }}>
          LilGrant is not directed at individuals under the age of 16 (or a higher age if stipulated by local laws). We do not knowingly collect personal information from children. If we become aware that a child has provided us with personal information, we will take steps to delete such information.
        </p>

        <h4 style={{ marginTop: '20px', marginBottom: '10px', textShadow: '1px 1px 3px rgba(0, 0, 0, 0.4)' }}>Changes to This Policy</h4>
        <p style={{ lineHeight: '1.7', marginBottom: '15px', textShadow: '1px 1px 2px rgba(0, 0, 0, 0.3)' }}>
          This Privacy Policy may be updated from time to time as LilGrant evolves. Any significant changes will be communicated by posting the new policy on this page.
        </p>

        <h4 style={{ marginTop: '20px', marginBottom: '10px', textShadow: '1px 1px 3px rgba(0, 0, 0, 0.4)' }}>Contact Me</h4>
        <p style={{ lineHeight: '1.7', marginBottom: '15px', textShadow: '1px 1px 2px rgba(0, 0, 0, 0.3)' }}>
          If you have any questions about this privacy overview, please contact us at the email address provided in the "Get in Touch!" section.
        </p>
        <p style={{ lineHeight: '1.7', textShadow: '1px 1px 2px rgba(0, 0, 0, 0.3)' }}>
          <em>Please note: The full, legally compliant Privacy Policy document will be made available here as soon as it is finalized. This overview is for preliminary informational purposes.</em>
          </p>
        </section>

      <section style={{ marginBottom: '40px' }}>
        <h2 style={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.4)', marginBottom: '20px' }}>Terms of Use</h2>
        <p style={{ lineHeight: '1.7', marginBottom: '15px', textShadow: '1px 1px 2px rgba(0, 0, 0, 0.3)' }}>
          Welcome to LilGrant ("the Platform"), created and operated by Lilliane Nguyen! These Terms of Use govern your access to and use of the LilGrant website and its content. By accessing or using the Platform, you agree to be bound by these terms. Please read them carefully. The full, formal Terms of Use document is being prepared and will be available here soon.
        </p>

        <h4 style={{ marginTop: '20px', marginBottom: '10px', textShadow: '1px 1px 3px rgba(0, 0, 0, 0.4)' }}>1. Intended Use & User Responsibilities</h4>
        <p style={{ lineHeight: '1.7', marginBottom: '10px', textShadow: '1px 1px 2px rgba(0, 0, 0, 0.3)' }}>
          LilGrant is provided as an informational resource to help students discover scholarship opportunities. You agree to use the Platform for lawful, personal, and non-commercial purposes only. You are responsible for:
        </p>
        <ul style={{ listStylePosition: 'inside', paddingLeft: '20px', lineHeight: '1.7', textShadow: '1px 1px 2px rgba(0, 0, 0, 0.3)' }}>
          <li style={{ marginBottom: '8px' }}>Conducting your own thorough research and due diligence before applying for any scholarship listed or providing personal information to any third-party scholarship provider.</li>
          <li style={{ marginBottom: '8px' }}>Using information from the Platform responsibly and ethically.</li>
          <li style={{ marginBottom: '8px' }}>Not using the Platform in any way that could damage, disable, overburden, or impair it, or interfere with any other party's use and enjoyment of it.</li>
        </ul>

        <h4 style={{ marginTop: '20px', marginBottom: '10px', textShadow: '1px 1px 3px rgba(0, 0, 0, 0.4)' }}>2. Disclaimer of Warranties & Accuracy</h4>
        <p style={{ lineHeight: '1.7', marginBottom: '15px', textShadow: '1px 1px 2px rgba(0, 0, 0, 0.3)' }}>
          While we strive to provide accurate, helpful, and up-to-date scholarship information on LilGrant, the data is often sourced from third-party websites. LilGrant makes no representations or warranties of any kind, express or implied, about the completeness, accuracy, reliability, suitability, or availability of the scholarship information, or the legitimacy or terms of any external scholarship. Information can change rapidly, and you should always verify details directly with the official scholarship provider. Any reliance you place on the information found on LilGrant is strictly at your own risk. The Platform is provided on an "as is" and "as available" basis.
        </p>

        <h4 style={{ marginTop: '20px', marginBottom: '10px', textShadow: '1px 1px 3px rgba(0, 0, 0, 0.4)' }}>3. Links to Third-Party Websites</h4>
        <p style={{ lineHeight: '1.7', marginBottom: '15px', textShadow: '1px 1px 2px rgba(0, 0, 0, 0.3)' }}>
          LilGrant contains links to external scholarship websites and other third-party resources. These links are provided for your convenience to provide further information. We have no control over the nature, content, and availability of those external sites. The inclusion of any links does not necessarily imply a recommendation or endorse the views expressed within them. Your interaction with any third-party website is subject to the terms and conditions and privacy policies of that site.
        </p>

        <h4 style={{ marginTop: '20px', marginBottom: '10px', textShadow: '1px 1px 3px rgba(0, 0, 0, 0.4)' }}>4. Intellectual Property</h4>
        <p style={{ lineHeight: '1.7', marginBottom: '15px', textShadow: '1px 1px 2px rgba(0, 0, 0, 0.3)' }}>
          The content, design, logo, graphics, and overall "look and feel" of the LilGrant platform are the intellectual property of Lilliane Nguyen / LilGrant and are protected by applicable copyright and other intellectual property laws. You may not reproduce, republish, distribute, or otherwise use any material from this site for commercial purposes without prior written permission. You may use the information for personal, non-commercial scholarship search purposes.
        </p>

        <h4 style={{ marginTop: '20px', marginBottom: '10px', textShadow: '1px 1px 3px rgba(0, 0, 0, 0.4)' }}>5. Limitation of Liability</h4>
        <p style={{ lineHeight: '1.7', marginBottom: '15px', textShadow: '1px 1px 2px rgba(0, 0, 0, 0.3)' }}>
          To the fullest extent permitted by applicable law, Lilliane Nguyen / LilGrant shall not be liable for any direct, indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, or any loss of data, use, goodwill, or other intangible losses, resulting from (a) your access to or use of or inability to access or use the Platform; (b) any conduct or content of any third party on the Platform; or (c) any information obtained from the Platform.
        </p>

        <h4 style={{ marginTop: '20px', marginBottom: '10px', textShadow: '1px 1px 3px rgba(0, 0, 0, 0.4)' }}>6. Prohibited Uses</h4>
        <p style={{ lineHeight: '1.7', marginBottom: '15px', textShadow: '1px 1px 2px rgba(0, 0, 0, 0.3)' }}>
          You agree not to engage in any of the following prohibited activities: (a) copying, distributing, or disclosing any part of the Platform in any medium, including without limitation by any automated or non-automated "scraping"; (b) using any automated system, including without limitation "robots," "spiders," "offline readers," etc., to access the Platform in a manner that sends more request messages to the LilGrant servers than a human can reasonably produce in the same period by using a conventional on-line web browser; (c) transmitting spam, chain letters, or other unsolicited email; (d) attempting to interfere with, compromise the system integrity or security, or decipher any transmissions to or from the servers running the Platform; (e) engaging in any activity that is harmful, fraudulent, deceptive, threatening, abusive, harassing, defamatory, vulgar, obscene, or otherwise objectionable.
        </p>

        <h4 style={{ marginTop: '20px', marginBottom: '10px', textShadow: '1px 1px 3px rgba(0, 0, 0, 0.4)' }}>7. Changes to Terms</h4>
        <p style={{ lineHeight: '1.7', marginBottom: '15px', textShadow: '1px 1px 2px rgba(0, 0, 0, 0.3)' }}>
          We reserve the right to modify or replace these Terms of Use at any time. If a revision is material, we will try to provide notice prior to any new terms taking effect, for example, by posting a notice on the Platform. What constitutes a material change will be determined at our sole discretion. Your continued use of LilGrant after any such changes constitutes your acceptance of the new Terms of Use.
        </p>

        <h4 style={{ marginTop: '20px', marginBottom: '10px', textShadow: '1px 1px 3px rgba(0, 0, 0, 0.4)' }}>8. Governing Law</h4>
        <p style={{ lineHeight: '1.7', marginBottom: '15px', textShadow: '1px 1px 2px rgba(0, 0, 0, 0.3)' }}>
          The full Terms of Use will specify the governing law and jurisdiction for any disputes arising out of or relating to these terms or your use of the Platform.
        </p>

        <h4 style={{ marginTop: '20px', marginBottom: '10px', textShadow: '1px 1px 3px rgba(0, 0, 0, 0.4)' }}>Contact Me</h4>
        <p style={{ lineHeight: '1.7', marginBottom: '15px', textShadow: '1px 1px 2px rgba(0, 0, 0, 0.3)' }}>
          If you have any questions about this overview of the Terms of Use, please contact us at the email address provided in the "Get in Touch!" section.
        </p>
        <p style={{ lineHeight: '1.7', textShadow: '1px 1px 2px rgba(0, 0, 0, 0.3)' }}>
          <em>Please note: The full, legally binding Terms of Use document will be made available here as soon as it is finalized. This overview is for preliminary informational purposes.</em>
          </p>
        </section>
    </div>
  )
}

export default AboutPage 