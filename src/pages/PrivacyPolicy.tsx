import { motion } from 'framer-motion';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Shield, Lock, Eye, Database, Mail } from 'lucide-react';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main>
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
                  <Shield className="w-6 h-6 text-secondary" />
                </div>
                <span className="text-primary-foreground/70 text-sm font-semibold">Legal</span>
              </div>
              <h1 className="font-display text-4xl md:text-5xl font-bold text-primary-foreground mb-4">
                Privacy Policy
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
                      At First Grade Lingua Consult, we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our services.
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
                    <Database className="w-6 h-6 text-secondary" />
                    <h2 className="text-2xl font-bold text-foreground m-0">Information We Collect</h2>
                  </div>
                  
                  <h3 className="text-xl font-semibold text-foreground mt-6 mb-3">Personal Information</h3>
                  <p className="text-foreground/70 leading-relaxed mb-4">
                    We may collect personal information that you provide directly to us, including:
                  </p>
                  <ul className="space-y-2 text-foreground/70 mb-6">
                    <li>Name and contact information (email, phone number, address)</li>
                    <li>Company name and business information</li>
                    <li>Payment and billing information</li>
                    <li>Project details and documents for translation services</li>
                    <li>Communication preferences</li>
                  </ul>

                  <h3 className="text-xl font-semibold text-foreground mt-6 mb-3">Automatically Collected Information</h3>
                  <p className="text-foreground/70 leading-relaxed mb-4">
                    When you visit our website, we automatically collect certain information:
                  </p>
                  <ul className="space-y-2 text-foreground/70">
                    <li>IP address and browser type</li>
                    <li>Device information and operating system</li>
                    <li>Pages visited and time spent on our site</li>
                    <li>Referring website addresses</li>
                  </ul>
                </motion.div>

                {/* Section 2 */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="mb-12"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <Eye className="w-6 h-6 text-secondary" />
                    <h2 className="text-2xl font-bold text-foreground m-0">How We Use Your Information</h2>
                  </div>
                  <p className="text-foreground/70 leading-relaxed mb-4">
                    We use the information we collect for the following purposes:
                  </p>
                  <ul className="space-y-2 text-foreground/70">
                    <li>Providing and delivering our translation and language services</li>
                    <li>Processing payments and managing your account</li>
                    <li>Communicating with you about projects, updates, and services</li>
                    <li>Improving our services and website functionality</li>
                    <li>Sending marketing communications (with your consent)</li>
                    <li>Complying with legal obligations and protecting our rights</li>
                  </ul>
                </motion.div>

                {/* Section 3 */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="mb-12"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <Lock className="w-6 h-6 text-secondary" />
                    <h2 className="text-2xl font-bold text-foreground m-0">Data Security</h2>
                  </div>
                  <p className="text-foreground/70 leading-relaxed mb-4">
                    We implement appropriate technical and organizational security measures to protect your personal information:
                  </p>
                  <ul className="space-y-2 text-foreground/70">
                    <li>Encryption of data in transit and at rest</li>
                    <li>Secure servers and regular security audits</li>
                    <li>Access controls and authentication procedures</li>
                    <li>Employee training on data protection</li>
                    <li>Regular backup and disaster recovery procedures</li>
                  </ul>
                </motion.div>

                {/* Section 4 */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="mb-12"
                >
                  <h2 className="text-2xl font-bold text-foreground mb-4">Information Sharing</h2>
                  <p className="text-foreground/70 leading-relaxed mb-4">
                    We do not sell your personal information. We may share your information with:
                  </p>
                  <ul className="space-y-2 text-foreground/70">
                    <li><strong>Service Providers:</strong> Third-party vendors who assist in our operations</li>
                    <li><strong>Professional Translators:</strong> Qualified linguists working on your projects (under strict confidentiality agreements)</li>
                    <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
                    <li><strong>Business Transfers:</strong> In connection with mergers or acquisitions</li>
                  </ul>
                </motion.div>

                {/* Section 5 */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="mb-12"
                >
                  <h2 className="text-2xl font-bold text-foreground mb-4">Your Rights</h2>
                  <p className="text-foreground/70 leading-relaxed mb-4">
                    You have the following rights regarding your personal information:
                  </p>
                  <ul className="space-y-2 text-foreground/70">
                    <li><strong>Access:</strong> Request a copy of your personal data</li>
                    <li><strong>Correction:</strong> Update or correct inaccurate information</li>
                    <li><strong>Deletion:</strong> Request deletion of your personal data</li>
                    <li><strong>Objection:</strong> Object to processing of your information</li>
                    <li><strong>Portability:</strong> Receive your data in a portable format</li>
                    <li><strong>Withdraw Consent:</strong> Opt-out of marketing communications</li>
                  </ul>
                </motion.div>

                {/* Section 6 */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="mb-12"
                >
                  <h2 className="text-2xl font-bold text-foreground mb-4">Cookies and Tracking</h2>
                  <p className="text-foreground/70 leading-relaxed mb-4">
                    We use cookies and similar tracking technologies to enhance your experience. For detailed information, please see our <a href="/cookie-policy" className="text-secondary hover:underline">Cookie Policy</a>.
                  </p>
                </motion.div>

                {/* Contact */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className="bg-muted/30 p-8 rounded-2xl border border-border"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <Mail className="w-6 h-6 text-secondary" />
                    <h2 className="text-2xl font-bold text-foreground m-0">Contact Us</h2>
                  </div>
                  <p className="text-foreground/70 leading-relaxed mb-4">
                    If you have questions about this Privacy Policy or wish to exercise your rights, please contact us:
                  </p>
                  <div className="space-y-2 text-foreground/70">
                    <p><strong>Email:</strong> privacy@firstgradelingua.com</p>
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

export default PrivacyPolicy;
