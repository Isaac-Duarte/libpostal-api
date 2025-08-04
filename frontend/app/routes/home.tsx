import type { Route } from "./+types/home";
import { LibPostalApp } from "../components/LibPostalApp";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "LibPostal API - Free Address Parsing & Normalization" },
    {
      name: "description",
      content:
        "Free API for parsing and normalizing addresses worldwide. Built on libpostal with high accuracy and performance.",
    },
  ];
}

export default function Home() {
  return <LibPostalApp />;
}
