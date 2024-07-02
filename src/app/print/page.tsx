"use client";

import { ReactElement } from "react";

interface Props {
  title: string;
  subtitle: string;
  cardTitle: string;
  cardDescription: string;
  button?: ReactElement;
  color: string;
  imageURL: string;
  flip?: boolean;
}

const CardSlider: React.FC<Props> = ({ title, subtitle, cardTitle, cardDescription, button, color, imageURL, flip = false }) => {

  return <div className="relative overflow-hidden group">
    <div style={{ backgroundImage: `url(${imageURL})`, backgroundColor: color }} className="relative bg-blend-multiply bg-no-repeat bg-center bg-cover min-h-80 w-full px-4">
      <div className="absolute top-1/2 -translate-y-1/2">
        <h1 style={{ color: color }} className="uppercase text-5xl font-thin">{title}</h1>
        <h2 className="text-white font-black uppercase text-xl">{subtitle}</h2>
      </div>
    </div>

    <div className="absolute grid place-items-center inset-0 group-hover:!translate-y-0 transition-transform duration-500" style={{ transform: flip ? "translateY(100%)" : "translateY(-100%)", backgroundColor: color, backgroundImage: `radial-gradient(#2c3e5055 10%, transparent 10%), radial-gradient(#2c3e5055 10% 10%, transparent 10%)`, backgroundSize: "10px 10px", backgroundPosition: "0 0, 5px 5px" }}>

      <div className="absolute top-1/2 -translate-y-1/2 text-center px-8 text-white grid gap-2">
        <h1 style={{ color: color }} className="lowercase brightness-50 text-3xl font-normal">{cardTitle}</h1>
        <p className="font-bold">{cardDescription}</p>
        {button}
      </div>
    </div>
  </div>
}

export default function TestPage() {
  return <article className="m-6">
    <div className="grid grid-cols-3 w-full max-w-[1400px] mx-auto">
      <CardSlider
        title="idea"
        subtitle="generation"
        cardTitle="growth ideas"
        cardDescription="Does your marketing team need some fresh ideas for your brand or next campaign?"
        button={<a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ" className="outline outline-2 px-8 py-1 block w-max mx-auto mt-2 uppercase hover:bg-[#FFFFFF55]">get ideas</a>}
        color="#9FB94F"
        imageURL="https://redsidemarketing.com/wp-content/uploads/2023/01/lighbulbs2.png"
      />
      <CardSlider
        title="project"
        subtitle="support"
        cardTitle="pressure valve"
        cardDescription="We get it! Sometimes you need a marketing pressure valve. That's where we shine … taking on projects you can't fit into your internal marketing workflow."
        button={<a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ" className="outline outline-2 px-8 py-1 block w-max mx-auto mt-2 uppercase hover:bg-[#FFFFFF55]">let us help</a>}
        color="#7bd5da"
        imageURL="https://redsidemarketing.com/wp-content/uploads/2023/02/pressure-valve-2.png"
        flip={true}
      />
      <CardSlider
        title="virtual"
        subtitle="marketing"
        cardTitle="build our team"
        cardDescription="Don't have an in-house marketing department and want to add bench strength fast? Redside can seamlessly plug into your organization."
        button={<a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ" className="outline outline-2 px-8 py-1 block w-max mx-auto mt-2 uppercase hover:bg-[#FFFFFF55]">go virtual</a>}
        color="#CE863B"
        imageURL="https://redsidemarketing.com/wp-content/uploads/2023/02/virtual.png"
      />
    </div>
  </article>
}