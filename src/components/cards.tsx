"use client";
import React, { useEffect } from "react";
import { Carousel, Card } from "@/components/ui/apple-cards-carousel";
import { ConnectWallet } from "./connect-wallet";
import Globe from "./ui/magic-globe";
import { Charts } from "./ui/charts";
import ClientTweetCard from "./ui/tweet-card";
import { useConnection } from "@/context/ConnectionConnect";
import ConnectButton from "./connect-btn";

function AppleCards() {
  const { isConnected, disconnect, connect } = useConnection();
  const cards = data.map((card, index) => (
    <Card key={card.src} card={card} index={index} />
  ));
  useEffect(() => {}, []);

  return (
    <div className="w-full min-h-screen overflow-y-scroll">
      <div className="flex justify-between">
        <h2 className=" text-xl  md:text-5xl font-bold text-neutral-800 dark:text-neutral-200 font-sans">
          What do we offer.
        </h2>
        {isConnected ? (
          <ConnectButton />
        ) : (
          <button onClick={connect}>
            <ConnectWallet />
          </button>
        )}
      </div>
      <Carousel items={cards} />
      <div className="relative flex h-full w-full  items-center justify-center overflow-hidden rounded-lg  bg-background px-40 pb-40 pt-8 md:pb-60 md:shadow-xl">
        <span className="pointer-events-none whitespace-pre-wrap bg-gradient-to-b from-black to-gray-300/80 bg-clip-text text-center text-6xl font-semibold leading-none text-transparent dark:from-white dark:to-slate-900/10">
          Global Loan Transfers: Seamlessly Send Funds Anywhere via Web3
        </span>
        <Globe className="top-28" />
        <div className="pointer-events-none absolute inset-0 h-full bg-[radial-gradient(circle_at_50%_200%,rgba(0,0,0,0.2),rgba(255,255,255,0))]" />
      </div>

      <div className="mt-24">
        <Charts />
      </div>

      <div className=" mt-24 w-full text-center">
        <span className="pointer-events-none w-full whitespace-pre-wrap bg-gradient-to-b from-black to-gray-300/80 bg-clip-text text-center text-6xl font-semibold leading-none text-transparent dark:from-white dark:to-slate-900/10">
          Testiomials
        </span>
        <div className="flex justify-center items-center gap-9 flex-wrap">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((i, _) => (
            <ClientTweetCard id="1823357161797542280" key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}

const data = [
  {
    category: "Fintech / Loans",
    title: "Streamlined Loan Application and Management",
    src: "https://images.unsplash.com/photo-1709534486708-fb8f94150d0a?q=80&w=2001&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    content: (
      <div className="bg-[#F5F5F7] dark:bg-neutral-800 p-8 md:p-14 rounded-3xl mb-20">
        <p className="text-neutral-600 dark:text-neutral-400 text-base md:text-2xl font-sans max-w-3xl mx-auto">
          <span className="font-bold text-neutral-700 dark:text-neutral-200">
            Streamlining your loan application process has never been easier.
          </span>{" "}
          Our advanced system ensures a smooth and efficient loan application
          and management experience. Apply for loans with minimal effort and
          manage your finances effortlessly.
        </p>
      </div>
    ),
  },
  {
    category: "Financial Technology / Tracking",
    title: "Effortless Loan Tracking and Instant Repayment",
    src: "https://images.unsplash.com/photo-1707581471193-183252f0d85b?q=80&w=3477&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    content: (
      <div className="bg-[#F5F5F7] dark:bg-neutral-800 p-8 md:p-14 rounded-3xl mb-20">
        <p className="text-neutral-600 dark:text-neutral-400 text-base md:text-2xl font-sans max-w-3xl mx-auto">
          <span className="font-bold text-neutral-700 dark:text-neutral-200">
            Track your loans effortlessly and make instant repayments.
          </span>{" "}
          Our platform provides real-time tracking of your loan status and
          offers convenient options for instant repayment, keeping you in
          control of your finances at all times.
        </p>
      </div>
    ),
  },
  {
    category: "Personal Finance / Management",
    title: "Flexible Loans with Minimal Interest and Easy Management",
    src: "https://images.unsplash.com/photo-1556155092-8707de31f9c4?q=80&w=2987&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    content: (
      <div className="bg-[#F5F5F7] dark:bg-neutral-800 p-8 md:p-14 rounded-3xl mb-20">
        <p className="text-neutral-600 dark:text-neutral-400 text-base md:text-2xl font-sans max-w-3xl mx-auto">
          <span className="font-bold text-neutral-700 dark:text-neutral-200">
            Enjoy flexible loan options with minimal interest rates.
          </span>{" "}
          Our service ensures easy management of your loans, with competitive
          interest rates and a user-friendly interface designed to enhance your
          financial well-being.
        </p>
      </div>
    ),
  },
  {
    category: "Fintech / Analytics",
    title: "Real-Time Loan Checks and Comprehensive Analytics",
    src: "https://images.unsplash.com/photo-1707762890671-52ef6d6f51e7?q=80&w=2050&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    content: (
      <div className="bg-[#F5F5F7] dark:bg-neutral-800 p-8 md:p-14 rounded-3xl mb-20">
        <p className="text-neutral-600 dark:text-neutral-400 text-base md:text-2xl font-sans max-w-3xl mx-auto">
          <span className="font-bold text-neutral-700 dark:text-neutral-200">
            Access real-time loan information and in-depth analytics.
          </span>{" "}
          Our platform offers comprehensive analytics and up-to-date checks,
          helping you make informed decisions and manage your loans with
          precision.
        </p>
      </div>
    ),
  },
  {
    category: "Financial Services / Loans",
    title: "Instant Loan Solutions with Negligible Interest Rates",
    src: "https://images.unsplash.com/photo-1533421644343-45b606745fb1?q=80&w=2947&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    content: (
      <div className="bg-[#F5F5F7] dark:bg-neutral-800 p-8 md:p-14 rounded-3xl mb-20">
        <p className="text-neutral-600 dark:text-neutral-400 text-base md:text-2xl font-sans max-w-3xl mx-auto">
          <span className="font-bold text-neutral-700 dark:text-neutral-200">
            Get instant loan solutions with minimal interest rates.
          </span>{" "}
          Our innovative approach provides fast loan approvals and exceptionally
          low interest rates, ensuring that you can address your financial needs
          swiftly and affordably.
        </p>
      </div>
    ),
  },
  {
    category: "Blockchain / Financial Technology",
    title: "Manage Your Loans Seamlessly with Advanced Blockchain Tech",
    src: "https://images.unsplash.com/photo-1639754391620-197afd388802?q=80&w=3413&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    content: (
      <div className="bg-[#F5F5F7] dark:bg-neutral-800 p-8 md:p-14 rounded-3xl mb-20">
        <p className="text-neutral-600 dark:text-neutral-400 text-base md:text-2xl font-sans max-w-3xl mx-auto">
          <span className="font-bold text-neutral-700 dark:text-neutral-200">
            Experience seamless loan management with blockchain technology.
          </span>{" "}
          Our cutting-edge blockchain system ensures secure, transparent, and
          efficient loan management, giving you peace of mind and control over
          your financial transactions.
        </p>
      </div>
    ),
  },
];

export default AppleCards;
