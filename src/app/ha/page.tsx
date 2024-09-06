import Ha from "@/components/ha/HaDisplay";
import React from "react";
import { getCongregations } from "../actions";
import { PageDefaults } from "@/components";

const HaPage = async () => {
  const congregations = await getCongregations();
  return <main className="bg-background text-textHeading h-[100dvh] max-w-[100vw] flex">
    <PageDefaults />
    <Ha congregations={congregations} />
  </main>
};

export default HaPage;