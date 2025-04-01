import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";
import Image from "next/image";
import { dummyInterviews } from "../../../constants";
import InterviewCard from "@/components/InterviewCard";
const page = () => {
  return (
    <>
      <section className="card-cta">
        <div className="flex flex-col gap-6 max-w-lg">
          <h2>Practise for interviews right in your browser</h2>
          <p className="text-2xl">
            Practise on real interview questions, get feedback from AI and
            improve your skills. InterPrep is the best way to prepare for
            interviews.
          </p>
          <Button asChild className="btn-primary max-sm:w-full">
            <Link href="/interview">Start an Interview</Link>
          </Button>
        </div>
        <Image
          src="/robot.png"
          alt="robot"
          width={400}
          height={400}
          className="max-sm:hidden"
        />
      </section>
      <section className="flex flex-col gap-6 mt-8 px-4">
        <h2>Your Interviews</h2>
        <div className="interview-section">
          {dummyInterviews.map((interview) => (
            <InterviewCard {...interview} key={interview.id} />
          ))}
        </div>
      </section>
      <section className="flex flex-col gap-6 mt-8 px-4">
        <h2>Take an Interviews</h2>
        <div className="interview-section">
          {dummyInterviews.map((interview) => (
            <InterviewCard {...interview} key={interview.id} />
          ))}
        </div>
      </section>
    </>
  );
};

export default page;
