import React from "react";
import { Metadata } from "next";
import AboutClient from "./AboutClient";

export const metadata: Metadata = {
  title: "About — Sudipta Sarkar",
  description:
    "Learn more about Sudipta Sarkar, an artist who loves to draw and sketch. View select clients, social connections, and start a project inquiry.",
};

export default function AboutPage() {
  return <AboutClient />;
}
