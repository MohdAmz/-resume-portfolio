// Modern Professional Portfolio
// Built with React, Tailwind CSS, and Framer Motion
// Features: Scroll-spy navigation, timeline experience, animated skills, card-based projects

import { useState, useEffect } from "react";
// eslint-disable-next-line no-unused-vars
import { motion, useScroll, useTransform } from "framer-motion";

export default function App() {
  // Initialize dark mode from localStorage or system preference
  const [dark, setDark] = useState(() => {
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("theme");
      if (savedTheme) {
        return savedTheme === "dark";
      }
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    return false;
  });
  const [activeSection, setActiveSection] = useState("hero");

  // Apply dark mode class to html element immediately
  useEffect(() => {
    const root = document.documentElement;
    if (dark) {
      root.classList.add("dark");
      root.setAttribute("data-theme", "dark");
    } else {
      root.classList.remove("dark");
      root.setAttribute("data-theme", "light");
    }
  }, [dark]);

  // Apply initial dark mode class before React hydration to prevent flash
  useEffect(() => {
    const root = document.documentElement;
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const shouldBeDark = savedTheme ? savedTheme === "dark" : prefersDark;
    
    if (shouldBeDark) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, []);

  // Scroll spy functionality
  useEffect(() => {
    const handleScroll = () => {
      const sections = ["hero", "about", "skills", "experience", "projects", "education", "contact"];
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleDarkMode = () => {
    const newDark = !dark;
    setDark(newDark);
    localStorage.setItem("theme", newDark ? "dark" : "light");
  };

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80; // Navbar height
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
        <Navbar 
          toggle={toggleDarkMode} 
          activeSection={activeSection}
          scrollToSection={scrollToSection}
          dark={dark}
        />
        <Hero scrollToSection={scrollToSection} />
        <About />
        <Skills />
        <Experience />
        <Projects />
        <Education />
        <Contact />
    </div>
  );
}

// Sticky Navigation with Scroll-Spy
function Navbar({ toggle, activeSection, scrollToSection, dark }) {
  const { scrollY } = useScroll();
  const navbarBackground = useTransform(
    scrollY,
    [0, 50],
    ["rgba(255, 255, 255, 0.8)", "rgba(255, 255, 255, 0.95)"]
  );
  const navbarShadow = useTransform(
    scrollY,
    [0, 50],
    ["0px 0px 0px rgba(0,0,0,0)", "0px 4px 20px rgba(0,0,0,0.1)"]
  );

  const navItems = [
    { id: "about", label: "About" },
    { id: "skills", label: "Skills" },
    { id: "experience", label: "Experience" },
    { id: "projects", label: "Projects" },
    { id: "contact", label: "Contact" },
  ];

  return (
    <motion.nav
      style={{
        backgroundColor: navbarBackground,
        boxShadow: navbarShadow,
      }}
      className="fixed top-0 w-full z-50 backdrop-blur-md dark:bg-gray-900/80 dark:backdrop-blur-md border-b border-slate-200/50 dark:border-gray-800/50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo/Name */}
          <motion.button
            onClick={() => scrollToSection("hero")}
            className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent hover:opacity-80 transition-opacity"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            M. Ahmed
          </motion.button>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <motion.button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                  activeSection === item.id
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30"
                    : "text-gray-600 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-gray-800"
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {item.label}
              </motion.button>
            ))}
          </div>

          {/* Theme Toggle */}
          <motion.button
            onClick={toggle}
            className="p-2 rounded-xl bg-slate-100 dark:bg-gray-800 hover:bg-slate-200 dark:hover:bg-gray-700 transition-colors"
            whileHover={{ scale: 1.1, rotate: 15 }}
            whileTap={{ scale: 0.9 }}
            aria-label="Toggle dark mode"
          >
            <span className="text-xl">{dark ? "☀️" : "🌙"}</span>
          </motion.button>
        </div>
      </div>
    </motion.nav>
  );
}

// Full-Width Hero Section
function Hero({ scrollToSection }) {
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);
  const y = useTransform(scrollY, [0, 300], [0, 50]);

  return (
    <motion.section
      id="hero"
      style={{ opacity, y }}
      className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 relative overflow-hidden"
    >
      {/* Background Gradient Circles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-400/20 dark:bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-400/20 dark:bg-indigo-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="max-w-5xl mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Greeting */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-lg sm:text-xl text-blue-600 dark:text-blue-400 font-medium mb-4"
          >
            Hello, I'm
          </motion.p>

          {/* Name */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold mb-6 leading-tight"
          >
            <span className="bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-900 dark:from-white dark:via-blue-200 dark:to-indigo-200 bg-clip-text text-transparent">
              Mohammad Ahmed
            </span>
            <br />
            <span className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
              Mohammad Mohsin
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-xl sm:text-2xl md:text-3xl text-gray-600 dark:text-gray-300 font-medium mb-4"
          >
            Software Engineer II / Front End Developer
          </motion.p>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="text-base sm:text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto mb-12"
          >
            Building interactive e-learning experiences with React, JavaScript, and Canvas.
            Specializing in accessibility and user-centered design.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <motion.a
              href="/AhmedMohammadResume.pdf"
              download="AhmedMohammadResume.pdf"
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-2xl shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-300 flex items-center gap-2"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <span>📄</span>
              Download Resume
            </motion.a>
            <motion.button
              onClick={() => scrollToSection("contact")}
              className="px-8 py-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-semibold rounded-2xl border-2 border-gray-300 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400 transition-all duration-300"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              Get In Touch
            </motion.button>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="w-6 h-10 border-2 border-gray-400 dark:border-gray-600 rounded-full flex justify-center"
        >
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="w-1 h-3 bg-gray-400 dark:bg-gray-600 rounded-full mt-2"
          />
        </motion.div>
      </motion.div>
    </motion.section>
  );
}

// About Section
function About() {
  return (
    <motion.section
      id="about"
      className="scroll-offset py-24 px-4 sm:px-6 lg:px-8"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6 }}
    >
      <div className="max-w-4xl mx-auto">
        <motion.h2
          className="text-4xl sm:text-5xl font-bold mb-8 text-center bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          About Me
        </motion.h2>
        <motion.div
          className="prose prose-lg dark:prose-invert max-w-none"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          <p className="text-lg sm:text-xl text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
            Front End Developer with <strong className="text-blue-600 dark:text-blue-400">6+ years</strong> of experience
            in the <strong className="text-indigo-600 dark:text-indigo-400">E-learning domain</strong>, specializing in
            React, JavaScript, Canvas, and accessibility (a11y).
          </p>
          <p className="text-lg sm:text-xl text-gray-700 dark:text-gray-300 leading-relaxed">
            Proven expertise in building interactive learning modules, automating testing workflows, and delivering
            high-quality, accessible user experiences that empower learners of all abilities.
          </p>
        </motion.div>
      </div>
    </motion.section>
  );
}

// Skills Section with Animated Progress Bars
function Skills() {
  const skills = [
    { name: "React.js", level: 90, color: "from-blue-500 to-blue-600" },
    { name: "TypeScript", level: 85, color: "from-indigo-500 to-indigo-600" },
    { name: "JavaScript", level: 90, color: "from-yellow-500 to-yellow-600" },
    { name: "Canvas / CreateJS", level: 85, color: "from-green-500 to-green-600" },
    { name: "Accessibility (WCAG / JAWS)", level: 80, color: "from-purple-500 to-purple-600" },
  ];

  return (
    <motion.section
      id="skills"
      className="scroll-offset py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-100/50 via-white to-blue-50/30 dark:from-gray-800/50 dark:via-gray-900 dark:to-indigo-950/30"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6 }}
    >
      <div className="max-w-4xl mx-auto">
        <motion.h2
          className="text-4xl sm:text-5xl font-bold mb-12 text-center bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          Skills & Expertise
        </motion.h2>
        <div className="space-y-6">
          {skills.map((skill, index) => (
            <SkillBar key={skill.name} skill={skill} index={index} />
          ))}
        </div>
      </div>
    </motion.section>
  );
}

function SkillBar({ skill, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="group"
    >
      <div className="flex justify-between items-center mb-2">
        <span className="text-lg font-semibold text-gray-800 dark:text-gray-200">{skill.name}</span>
        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">{skill.level}%</span>
      </div>
      <div className="w-full h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden shadow-inner">
        <motion.div
          className={`h-full bg-gradient-to-r ${skill.color} rounded-full shadow-lg`}
          initial={{ width: 0 }}
          whileInView={{ width: `${skill.level}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: index * 0.1, ease: "easeOut" }}
        />
      </div>
    </motion.div>
  );
}

// Timeline-Style Experience Section
function Experience() {
  const experiences = [
    {
      company: "Mitr Learning & Media Pvt. Ltd.",
      role: "Software Engineer II (Front End Developer)",
      period: "Dec 2018 – Present",
      location: "Mumbai, India",
      achievements: [
        "Built high-level interactive e-learning modules using JavaScript, Canvas, and CreateJS",
        "Implemented accessibility (a11y) support for visually impaired users using JAWS",
        "Automated UX testing using Nightwatch Selenium",
        "Created Jenkins scripts to process and format error messages",
      ],
    },
  ];

  return (
    <motion.section
      id="experience"
      className="scroll-offset py-24 px-4 sm:px-6 lg:px-8"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6 }}
    >
      <div className="max-w-4xl mx-auto">
        <motion.h2
          className="text-4xl sm:text-5xl font-bold mb-12 text-center bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          Experience
        </motion.h2>
        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 via-indigo-500 to-purple-500 dark:from-blue-400 dark:via-indigo-400 dark:to-purple-400" />

          <div className="space-y-12">
            {experiences.map((exp, index) => (
              <TimelineItem key={index} experience={exp} index={index} />
            ))}
          </div>
        </div>
      </div>
    </motion.section>
  );
}

function TimelineItem({ experience, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.2 }}
      className="relative pl-20"
    >
      {/* Timeline Dot */}
      <div className="absolute left-6 top-2 w-4 h-4 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full border-4 border-white dark:border-gray-900 shadow-lg" />

      {/* Content Card */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-slate-200 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              {experience.role}
            </h3>
            <p className="text-lg font-semibold text-blue-600 dark:text-blue-400">
              {experience.company}
            </p>
          </div>
          <div className="mt-2 sm:mt-0 text-right">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
              {experience.period}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500">{experience.location}</p>
          </div>
        </div>
        <ul className="space-y-2 mt-4">
          {experience.achievements.map((achievement, i) => (
            <li key={i} className="flex items-start text-gray-700 dark:text-gray-300">
              <span className="text-blue-600 dark:text-blue-400 mr-2 mt-1">▸</span>
              <span>{achievement}</span>
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}

// Card-Based Projects Section
function Projects() {
  const projects = [
    {
      title: "i-Ready (Curriculum Associates)",
      description:
        "Interactive e-learning platform supporting math instruction with engaging, accessible learning modules built with React and Canvas.",
      tags: ["React", "Canvas", "Accessibility", "E-learning"],
      github: "#",
      live: "#",
    },
    {
      title: "E-Learning Module Builder",
      description:
        "Custom authoring tool for creating interactive educational content with drag-and-drop functionality and real-time preview.",
      tags: ["React", "TypeScript", "Canvas", "CreateJS"],
      github: "#",
      live: "#",
    },
  ];

  return (
    <motion.section
      id="projects"
      className="scroll-offset py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-100/50 via-white to-blue-50/30 dark:from-gray-800/50 dark:via-gray-900 dark:to-indigo-950/30"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6 }}
    >
      <div className="max-w-6xl mx-auto">
        <motion.h2
          className="text-4xl sm:text-5xl font-bold mb-12 text-center bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          Featured Projects
        </motion.h2>
        <div className="grid sm:grid-cols-2 gap-6 lg:gap-8">
          {projects.map((project, index) => (
            <ProjectCard key={index} project={project} index={index} />
          ))}
        </div>
      </div>
    </motion.section>
  );
}

function ProjectCard({ project, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.2 }}
      className="group bg-white dark:bg-gray-800 rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-200 dark:border-gray-700"
      whileHover={{ y: -8 }}
    >
      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
        {project.title}
      </h3>
      <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">{project.description}</p>
      <div className="flex flex-wrap gap-2 mb-6">
        {project.tags.map((tag) => (
          <span
            key={tag}
            className="px-3 py-1 text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full"
          >
            {tag}
          </span>
        ))}
      </div>
      <div className="flex gap-4">
        <motion.a
          href={project.github}
          className="text-blue-600 dark:text-blue-400 font-semibold hover:underline flex items-center gap-2"
          whileHover={{ x: 5 }}
        >
          <span>GitHub</span>
          <span>→</span>
        </motion.a>
        <motion.a
          href={project.live}
          className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline flex items-center gap-2"
          whileHover={{ x: 5 }}
        >
          <span>Live Demo</span>
          <span>→</span>
        </motion.a>
      </div>
    </motion.div>
  );
}

// Education Section
function Education() {
  const education = [
    {
      degree: "Diploma in Computer Science",
      institution: "BAMU University",
      period: "2015–2018",
    },
    {
      degree: "Bachelor of Computer Science",
      institution: "BAMU University",
      period: "2012–2015",
    },
  ];

  return (
    <motion.section
      id="education"
      className="scroll-offset py-24 px-4 sm:px-6 lg:px-8"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6 }}
    >
      <div className="max-w-4xl mx-auto">
        <motion.h2
          className="text-4xl sm:text-5xl font-bold mb-12 text-center bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          Education
        </motion.h2>
        <div className="grid sm:grid-cols-2 gap-6">
          {education.map((edu, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-slate-200 dark:border-gray-700"
            >
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{edu.degree}</h3>
              <p className="text-lg text-blue-600 dark:text-blue-400 font-semibold mb-1">
                {edu.institution}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">{edu.period}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}

// Contact Section with Strong CTA
function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log("Form submitted:", formData);
    alert("Thank you for your message! I'll get back to you soon.");
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <motion.section
      id="contact"
      className="scroll-offset py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-700 dark:via-indigo-700 dark:to-purple-700 text-white"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6 }}
    >
      <div className="max-w-2xl mx-auto">
        <motion.h2
          className="text-4xl sm:text-5xl font-bold mb-4 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          Let's Work Together
        </motion.h2>
        <motion.p
          className="text-xl text-blue-100 text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          Have a project in mind? I'd love to hear from you.
        </motion.p>
        <motion.form
          onSubmit={handleSubmit}
          className="space-y-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
        >
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-2">
              Name
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all"
              placeholder="Your name"
              required
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all"
              placeholder="your.email@example.com"
              required
            />
          </div>
          <div>
            <label htmlFor="message" className="block text-sm font-medium mb-2">
              Message
            </label>
            <textarea
              id="message"
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              rows={5}
              className="w-full px-4 py-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all resize-none"
              placeholder="Tell me about your project..."
              required
            />
          </div>
          <motion.button
            type="submit"
            className="w-full px-8 py-4 bg-white text-blue-600 font-bold rounded-xl shadow-lg hover:shadow-xl hover:bg-blue-50 transition-all duration-300"
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            Send Message
          </motion.button>
        </motion.form>
      </div>
    </motion.section>
  );
}
