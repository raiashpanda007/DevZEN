"use client";
import { motion } from "framer-motion";
const HomeCards = () => {
  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        viewport={{ once: true, amount: 0.5 }} // Ensures animation triggers when half of it is in view
        className="flex sm:h-48 h-20 w-full space-x-9  ">
        <img
          src="CodeEditor.png"
          alt=""
          className="rounded-lg shadow-2xl   h-full"
        />
        <div className="sm:w-1/2 w-full ">
          <h1 className="text-3xl  font-bold">DevZEN Editor</h1>
          <p className="">
            <strong className="text-red-600 font-bold">DevZEN Editor</strong>{" "}
            is a powerful yet minimalistic online code editor designed to
            provide a smooth, focused, and distraction-free coding experience.
            Whether you're writing code, collaborating with a team, or
            experimenting with new ideas, DevZEN Editor ensures a seamless and
            efficient workflow.
          </p>
        </div>
      </motion.div>
      <div className="h-80 sm:h-20 w-full"></div>
      <div className="flex sm:justify-end  sm:h-48 h-20 w-full space-x-9  ">
        <div className="w-1/2 animate-slideIn">
          <h1 className="text-3xl  font-bold">Instant Coding, Zero Setup</h1>
          <p>
            Start coding in your favorite languages without the hassle of
            installations or configurations.{" "}
            <strong className="text-red-600 font-bold">DevZEN</strong> provides
            a seamless, browser-based experience so you can focus on building,
            not setting up.
          </p>
        </div>
        <img
          src="Code-Instant.png"
          alt=""
          className="rounded-lg shadow-2xl animate-slideInFromBelow opacity-0 h-full"
        />
      </div>
      <div className="h-80 sm:h-20 w-full"></div>
      <motion.div initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        viewport={{ once: true, amount: 0.5 }} // Ensures animation triggers when half of it is in view
        className="flex sm:justify-start  sm:h-48 h-20 w-full space-x-9  ">
        <img
          src="open-source.png"
          alt=""
          className="rounded-lg shadow-2xl  h-full"
        />
        <div className="w-1/2 ">
          <h1 className="text-3xl  font-bold">Open-Source & Community-Drive</h1>
          <p>
            <strong className="text-red-600">DenZEN</strong> is built with
            transparency and collaboration at its core. As an open-source
            project, it thrives on contributions from developers worldwide,
            ensuring continuous innovation and improvement. Join the community
            and help shape the future !
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default HomeCards
