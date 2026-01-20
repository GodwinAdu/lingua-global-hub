import { motion } from 'framer-motion';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Cookie, Settings, BarChart, Shield } from 'lucide-react';

const CookiePolicy = () => {
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
                  <Cookie className="w-6 h-6 text-secondary" />
                </div>
                <span className="text-primary-foreground/70 text-sm font-semibold">Legal</span>
              </div>
              <h1 className="font-display text-4xl md:text-5xl font-bold text-primary-foreground mb-4">
                Cookie Policy
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
                      This Cookie Policy explains how First Grade Lingua Consult uses cookies and similar technologies on our website. By using our website, you consent to the use of cookies as described in this policy.
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
                  <h2 className="text-2xl font-bold text-foreground mb-4">What Are Cookies?</h2>
                  <p className="text-foreground/70 leading-relaxed mb-4">
                    Cookies are small text files that are placed on your device when you visit a website. They are widely used to make websites work more efficiently and provide information to website owners.
                  </p>
                  <p className="text-foreground/70 leading-relaxed">
                    Cookies can be "persistent" or "session" cookies. Persistent cookies remain on your device after you close your browser, while session cookies are deleted when you close your browser.
                  </p>
                </motion.div>

                {/* Section 2 */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="mb-12"
                >
                  <h2 className="text-2xl font-bold text-foreground mb-4">Types of Cookies We Use</h2>
                  
                  {/* Essential Cookies */}
                  <div className="bg-card border border-border rounded-xl p-6 mb-6">
                    <div className="flex items-center gap-3 mb-3">
                      <Shield className="w-5 h-5 text-secondary" />
                      <h3 className="text-xl font-semibold text-foreground m-0">1. Essential Cookies</h3>
                    </div>
                    <p className="text-foreground/70 leading-relaxed mb-3">
                      These cookies are necessary for the website to function properly. They enable basic functions like page navigation and access to secure areas.
                    </p>
                    <div className="bg-muted/30 p-4 rounded-lg">
                      <p className="text-sm text-foreground/70 m-0"><strong>Examples:</strong> Session management, security tokens, load balancing</p>
                      <p className="text-sm text-foreground/70 m-0 mt-2"><strong>Duration:</strong> Session or up to 1 year</p>
                    </div>
                  </div>

                  {/* Analytics Cookies */}
                  <div className="bg-card border border-border rounded-xl p-6 mb-6">
                    <div className="flex items-center gap-3 mb-3">
                      <BarChart className="w-5 h-5 text-secondary" />
                      <h3 className="text-xl font-semibold text-foreground m-0">2. Analytics Cookies</h3>
                    </div>
                    <p className="text-foreground/70 leading-relaxed mb-3">
                      These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously.
                    </p>
                    <div className="bg-muted/30 p-4 rounded-lg">
                      <p className="text-sm text-foreground/70 m-0"><strong>Examples:</strong> Google Analytics, page views, bounce rate, traffic sources</p>
                      <p className="text-sm text-foreground/70 m-0 mt-2"><strong>Duration:</strong> Up to 2 years</p>
                    </div>
                  </div>

                  {/* Functionality Cookies */}
                  <div className="bg-card border border-border rounded-xl p-6 mb-6">
                    <div className="flex items-center gap-3 mb-3">
                      <Settings className="w-5 h-5 text-secondary" />
                      <h3 className="text-xl font-semibold text-foreground m-0">3. Functionality Cookies</h3>
                    </div>
                    <p className="text-foreground/70 leading-relaxed mb-3">
                      These cookies enable enhanced functionality and personalization, such as remembering your preferences.
                    </p>
                    <div className="bg-muted/30 p-4 rounded-lg">
                      <p className="text-sm text-foreground/70 m-0"><strong>Examples:</strong> Language preferences, region settings, user preferences</p>
                      <p className="text-sm text-foreground/70 m-0 mt-2"><strong>Duration:</strong> Up to 1 year</p>
                    </div>
                  </div>

                  {/* Marketing Cookies */}
                  <div className="bg-card border border-border rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <Cookie className="w-5 h-5 text-secondary" />
                      <h3 className="text-xl font-semibold text-foreground m-0">4. Marketing Cookies</h3>
                    </div>
                    <p className="text-foreground/70 leading-relaxed mb-3">
                      These cookies track your online activity to help advertisers deliver more relevant advertising or limit how many times you see an ad.
                    </p>
                    <div className="bg-muted/30 p-4 rounded-lg">
                      <p className="text-sm text-foreground/70 m-0"><strong>Examples:</strong> Facebook Pixel, Google Ads, retargeting pixels</p>
                      <p className="text-sm text-foreground/70 m-0 mt-2"><strong>Duration:</strong> Up to 2 years</p>
                    </div>
                  </div>
                </motion.div>

                {/* Section 3 */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="mb-12"
                >
                  <h2 className="text-2xl font-bold text-foreground mb-4">Third-Party Cookies</h2>
                  <p className="text-foreground/70 leading-relaxed mb-4">
                    We use services from third-party companies that may set cookies on your device:
                  </p>
                  <ul className="space-y-2 text-foreground/70">
                    <li><strong>Google Analytics:</strong> Website traffic analysis</li>
                    <li><strong>Google Ads:</strong> Advertising and remarketing</li>
                    <li><strong>Facebook:</strong> Social media integration and advertising</li>
                    <li><strong>LinkedIn:</strong> Professional networking and advertising</li>
                    <li><strong>YouTube:</strong> Video content embedding</li>
                  </ul>
                </motion.div>

                {/* Section 4 */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="mb-12"
                >
                  <h2 className="text-2xl font-bold text-foreground mb-4">How to Control Cookies</h2>
                  <p className="text-foreground/70 leading-relaxed mb-4">
                    You have several options to manage or disable cookies:
                  </p>
                  
                  <h3 className="text-xl font-semibold text-foreground mt-6 mb-3">Browser Settings</h3>
                  <p className="text-foreground/70 leading-relaxed mb-4">
                    Most web browsers allow you to control cookies through their settings:
                  </p>
                  <ul className="space-y-2 text-foreground/70 mb-6">
                    <li><strong>Chrome:</strong> Settings → Privacy and security → Cookies</li>
                    <li><strong>Firefox:</strong> Options → Privacy & Security → Cookies</li>
                    <li><strong>Safari:</strong> Preferences → Privacy → Cookies</li>
                    <li><strong>Edge:</strong> Settings → Privacy → Cookies</li>
                  </ul>

                  <h3 className="text-xl font-semibold text-foreground mt-6 mb-3">Opt-Out Tools</h3>
                  <p className="text-foreground/70 leading-relaxed mb-4">
                    You can opt out of specific tracking:
                  </p>
                  <ul className="space-y-2 text-foreground/70">
                    <li><strong>Google Analytics:</strong> <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" className="text-secondary hover:underline">Google Analytics Opt-out Browser Add-on</a></li>
                    <li><strong>Facebook:</strong> Ad preferences in your Facebook settings</li>
                    <li><strong>Network Advertising:</strong> <a href="http://optout.networkadvertising.org/" target="_blank" rel="noopener noreferrer" className="text-secondary hover:underline">NAI Opt-Out Tool</a></li>
                  </ul>
                </motion.div>

                {/* Section 5 */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="mb-12"
                >
                  <h2 className="text-2xl font-bold text-foreground mb-4">Impact of Disabling Cookies</h2>
                  <p className="text-foreground/70 leading-relaxed mb-4">
                    Please note that disabling cookies may affect your experience on our website:
                  </p>
                  <ul className="space-y-2 text-foreground/70">
                    <li>Some features may not function properly</li>
                    <li>You may need to re-enter information more frequently</li>
                    <li>Personalized content may not be available</li>
                    <li>Website performance may be impacted</li>
                  </ul>
                </motion.div>

                {/* Section 6 */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="mb-12"
                >
                  <h2 className="text-2xl font-bold text-foreground mb-4">Updates to This Policy</h2>
                  <p className="text-foreground/70 leading-relaxed">
                    We may update this Cookie Policy from time to time to reflect changes in technology, legislation, or our business practices. We encourage you to review this policy periodically.
                  </p>
                </motion.div>

                {/* Contact */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className="bg-muted/30 p-8 rounded-2xl border border-border"
                >
                  <h2 className="text-2xl font-bold text-foreground mb-4">Questions About Cookies?</h2>
                  <p className="text-foreground/70 leading-relaxed mb-4">
                    If you have questions about our use of cookies, please contact us:
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

export default CookiePolicy;
