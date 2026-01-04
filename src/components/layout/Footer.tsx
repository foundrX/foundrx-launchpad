import { forwardRef } from "react";
import { Link } from "react-router-dom";
import { Rocket, Mail, Twitter, Linkedin, Instagram, Phone } from "lucide-react";

const Footer = forwardRef<HTMLElement>((_, ref) => {
  const footerLinks = {
    Platform: [
      { label: "How It Works", href: "/about" },
      { label: "Features", href: "/about" },
      { label: "Workshops", href: "/workshop" },
      { label: "Ideas", href: "/ideas" },
    ],
    Resources: [
      { label: "Workshops", href: "/workshop" },
      { label: "Ideas", href: "/ideas" },
      { label: "About Us", href: "/about" },
      { label: "Join FoundrX", href: "/join" },
    ],
    Company: [
      { label: "About Us", href: "/about" },
      { label: "Our Team", href: "/team" },
      { label: "Apply Now", href: "/apply" },
      { label: "Contact", href: "mailto:foundrxofficial@gmail.com", external: true },
    ],
    Legal: [
      { label: "Terms & Policies", href: "/terms" },
    ],
    "Get in Touch": [
      { label: "+91 9897004701", href: "tel:+919897004701", icon: Phone, external: true },
      { label: "foundrxofficial@gmail.com", href: "mailto:foundrxofficial@gmail.com", icon: Mail, external: true },
    ],
  };

  const socialLinks = [
    { icon: Twitter, href: "https://twitter.com", label: "Twitter", external: true },
    { icon: Linkedin, href: "https://linkedin.com", label: "LinkedIn", external: true },
    { icon: Instagram, href: "https://instagram.com/FoundrX_Official", label: "Instagram", external: true },
    { icon: Mail, href: "mailto:foundrxofficial@gmail.com", label: "Email", external: true },
  ];

  return (
    <footer ref={ref} className="bg-muted py-16 md:py-20">
      <div className="container px-4">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8 mb-12">
          {/* Brand Column */}
          <div className="col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
                <Rocket className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold font-display">FoundrX</span>
            </Link>
            <p className="text-muted-foreground text-sm mb-6 max-w-xs">
              Empowering young entrepreneurs to build, learn, and grow together.
            </p>
            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-primary/10 hover:bg-primary/20 flex items-center justify-center transition-colors"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5 text-primary" />
                </a>
              ))}
            </div>
          </div>

          {/* Link Columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="font-bold mb-4">{title}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    {'external' in link && link.external ? (
                      <a
                        href={link.href}
                        target={link.href.startsWith('mailto:') || link.href.startsWith('tel:') ? undefined : "_blank"}
                        rel={link.href.startsWith('mailto:') || link.href.startsWith('tel:') ? undefined : "noopener noreferrer"}
                        className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"
                      >
                        {'icon' in link && link.icon && <link.icon className="w-4 h-4" />}
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        to={link.href}
                        className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"
                      >
                        {'icon' in link && link.icon && <link.icon className="w-4 h-4" />}
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © 2024 FoundrX. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground">
            Made with ❤️ by young founders, for young founders
          </p>
        </div>
      </div>
    </footer>
  );
});

Footer.displayName = "Footer";

export default Footer;