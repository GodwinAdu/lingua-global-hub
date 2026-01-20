import { motion } from 'framer-motion';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { FileText, Scale, AlertCircle, CheckCircle } from 'lucide-react';

const TermsOfService = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main >
        {/* Hero Section */}
        <section className="pt-32 pb-20 bg-primary text-primary-foreground relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,_hsl(217_91%_50%_/_0.15)_0%,_transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_80%,_hsl(43_74%_49%_/_0.1)_0%,_transparent_50%)]" />
          
          <div className="container-premium relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-3xl"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-secondary/20 flex items-center justify-center">
                  <Scale className="w-6 h-6 text-secondary" />
                </div>
                <span className="text-primary-foreground/70 text-sm font-semibold">Legal</span>
              </div>
              <h1 className="font-display text-4xl md:text-5xl font-bold text-primary-foreground mb-4">
                Terms of Service
              </h1>
              <p className="text-primary-foreground/70 text-lg">
                Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </p>
            </motion.div>
          </div>
           <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
        </section>

        {/* Content */}
        <section className="py-16">
          <div className="container-premium">
            <div className="max-w-4xl mx-auto">
              <div className="prose prose-lg max-w-none">
                
                {/* Introduction */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-12"
                >
                  <div className="bg-secondary/5 border-l-4 border-secondary p-6 rounded-r-xl mb-8">
                    <p className="text-foreground/80 leading-relaxed m-0">
                      These Terms of Service ("Terms") govern your use of First Grade Lingua Consult's services. By accessing or using our services, you agree to be bound by these Terms. Please read them carefully.
                    </p>
                  </div>
                </motion.div>

                {/* Section 1 */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="mb-12"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <FileText className="w-6 h-6 text-secondary" />
                    <h2 className="text-2xl font-bold text-foreground m-0">1. Services Provided</h2>
                  </div>
                  <p className="text-foreground/70 leading-relaxed mb-4">
                    First Grade Lingua Consult provides professional language and media services including:
                  </p>
                  <ul className="space-y-2 text-foreground/70">
                    <li>Translation services in 50+ languages</li>
                    <li>Interpretation services (simultaneous and consecutive)</li>
                    <li>Voice-over and audio production</li>
                    <li>Jingle recording and music production</li>
                    <li>Editing and proofreading services</li>
                    <li>Script writing and content creation</li>
                  </ul>
                </motion.div>

                {/* Section 2 */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="mb-12"
                >
                  <h2 className="text-2xl font-bold text-foreground mb-4">2. Client Obligations</h2>
                  
                  <h3 className="text-xl font-semibold text-foreground mt-6 mb-3">2.1 Accurate Information</h3>
                  <p className="text-foreground/70 leading-relaxed mb-4">
                    You agree to provide accurate, complete, and timely information necessary for us to deliver our services effectively.
                  </p>

                  <h3 className="text-xl font-semibold text-foreground mt-6 mb-3">2.2 Source Materials</h3>
                  <p className="text-foreground/70 leading-relaxed mb-4">
                    You are responsible for ensuring that all source materials provided:
                  </p>
                  <ul className="space-y-2 text-foreground/70">
                    <li>Are legally owned or licensed by you</li>
                    <li>Do not infringe on third-party rights</li>
                    <li>Are clear, legible, and complete</li>
                    <li>Comply with all applicable laws and regulations</li>
                  </ul>
                </motion.div>

                {/* Section 3 */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="mb-12"
                >
                  <h2 className="text-2xl font-bold text-foreground mb-4">3. Payment Terms</h2>
                  
                  <h3 className="text-xl font-semibold text-foreground mt-6 mb-3">3.1 Pricing</h3>
                  <p className="text-foreground/70 leading-relaxed mb-4">
                    Prices are quoted based on project scope, language pair, turnaround time, and complexity. All quotes are valid for 30 days unless otherwise stated.
                  </p>

                  <h3 className="text-xl font-semibold text-foreground mt-6 mb-3">3.2 Payment Schedule</h3>
                  <ul className="space-y-2 text-foreground/70 mb-4">
                    <li>50% deposit required before project commencement</li>
                    <li>Remaining 50% due upon project completion</li>
                    <li>Payment terms: Net 15 days from invoice date</li>
                    <li>Late payments subject to 2% monthly interest charge</li>
                  </ul>

                  <h3 className="text-xl font-semibold text-foreground mt-6 mb-3">3.3 Cancellation</h3>
                  <p className="text-foreground/70 leading-relaxed">
                    Cancellations must be made in writing. Deposits are non-refundable. Work completed prior to cancellation will be billed at the agreed rate.
                  </p>
                </motion.div>

                {/* Section 4 */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="mb-12"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <CheckCircle className="w-6 h-6 text-secondary" />
                    <h2 className="text-2xl font-bold text-foreground m-0">4. Quality Assurance</h2>
                  </div>
                  <p className="text-foreground/70 leading-relaxed mb-4">
                    We are committed to delivering high-quality services:
                  </p>
                  <ul className="space-y-2 text-foreground/70">
                    <li>All work reviewed by qualified professionals</li>
                    <li>ISO 9001:2015 quality management standards</li>
                    <li>One round of revisions included in quoted price</li>
                    <li>Additional revisions billed at hourly rate</li>
                    <li>Quality guarantee for 30 days post-delivery</li>
                  </ul>
                </motion.div>

                {/* Section 5 */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="mb-12"
                >
                  <h2 className="text-2xl font-bold text-foreground mb-4">5. Confidentiality</h2>
                  <p className="text-foreground/70 leading-relaxed mb-4">
                    We maintain strict confidentiality of all client information and project materials:
                  </p>
                  <ul className="space-y-2 text-foreground/70">
                    <li>All staff and contractors sign confidentiality agreements</li>
                    <li>Secure file transfer and storage systems</li>
                    <li>Client materials deleted after project completion (unless otherwise requested)</li>
                    <li>NDA available upon request for sensitive projects</li>
                  </ul>
                </motion.div>

                {/* Section 6 */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="mb-12"
                >
                  <h2 className="text-2xl font-bold text-foreground mb-4">6. Intellectual Property</h2>
                  
                  <h3 className="text-xl font-semibold text-foreground mt-6 mb-3">6.1 Client Materials</h3>
                  <p className="text-foreground/70 leading-relaxed mb-4">
                    You retain all rights to your source materials. We claim no ownership of content you provide.
                  </p>

                  <h3 className="text-xl font-semibold text-foreground mt-6 mb-3">6.2 Deliverables</h3>
                  <p className="text-foreground/70 leading-relaxed">
                    Upon full payment, you receive full rights to the translated/produced content. We retain the right to use anonymized samples for portfolio purposes unless otherwise agreed.
                  </p>
                </motion.div>

                {/* Section 7 */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className="mb-12"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <AlertCircle className="w-6 h-6 text-secondary" />
                    <h2 className="text-2xl font-bold text-foreground m-0">7. Limitation of Liability</h2>
                  </div>
                  <p className="text-foreground/70 leading-relaxed mb-4">
                    Our liability is limited to the amount paid for the specific service:
                  </p>
                  <ul className="space-y-2 text-foreground/70">
                    <li>We are not liable for indirect, consequential, or incidental damages</li>
                    <li>Maximum liability capped at project value</li>
                    <li>Client responsible for final review and approval</li>
                    <li>We are not liable for delays caused by client or third parties</li>
                  </ul>
                </motion.div>

                {/* Section 8 */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  className="mb-12"
                >
                  <h2 className="text-2xl font-bold text-foreground mb-4">8. Dispute Resolution</h2>
                  <p className="text-foreground/70 leading-relaxed mb-4">
                    In the event of a dispute:
                  </p>
                  <ul className="space-y-2 text-foreground/70">
                    <li>Parties agree to first attempt resolution through good-faith negotiation</li>
                    <li>If unresolved, disputes subject to mediation</li>
                    <li>Governed by the laws of Nigeria</li>
                    <li>Jurisdiction: Lagos State Courts</li>
                  </ul>
                </motion.div>

                {/* Section 9 */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 }}
                  className="mb-12"
                >
                  <h2 className="text-2xl font-bold text-foreground mb-4">9. Modifications</h2>
                  <p className="text-foreground/70 leading-relaxed">
                    We reserve the right to modify these Terms at any time. Changes will be posted on our website with an updated effective date. Continued use of our services constitutes acceptance of modified Terms.
                  </p>
                </motion.div>

                {/* Contact */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 }}
                  className="bg-muted/30 p-8 rounded-2xl border border-border"
                >
                  <h2 className="text-2xl font-bold text-foreground mb-4">Contact Information</h2>
                  <p className="text-foreground/70 leading-relaxed mb-4">
                    For questions about these Terms of Service, please contact:
                  </p>
                  <div className="space-y-2 text-foreground/70">
                    <p><strong>Email:</strong> legal@firstgradelingua.com</p>
                    <p><strong>Phone:</strong> +233 24 217 8378 / +233 54 821 8019</p>
                    <p><strong>Address:</strong> HNO. BE 37, Dandellon Street, Danfa, Accra, Ghana</p>
                    <p><strong>P.O. Box:</strong> P. O. Box AF 1350, Adenta</p>
                  </div>
                </motion.div>

              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default TermsOfService;
