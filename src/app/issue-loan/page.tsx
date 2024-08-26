"use client";
import * as React from "react";
import { useState } from "react";
import { ethers } from "ethers";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import GetAllLoansComponent from "../get-all-loans/page";
import IssuedLoansComponent from "@/components/IssuedLoan";
import { contractAbi } from "@/abi";

export default function CardWithForm() {
  const [receiver, setReceiver] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [interestRate, setInterestRate] = useState<string>("");
  const [loanTerm, setLoanTerm] = useState<string>("");

  const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS!;

  const [loading, setLoading] = useState<boolean>(false);

  const handleIssueLoan = async (e: React.FormEvent) => {
    console.log("Issue loan triggered");
    setLoading(true);
    e.preventDefault();

    try {
      if (!window.ethereum)
        throw new Error("No crypto wallet found. Please install it.");

      await window.ethereum.request({ method: "eth_requestAccounts" });

      const provider = new ethers.BrowserProvider(window.ethereum); // Use BrowserProvider
      const signer = await provider.getSigner();

      const contract = new ethers.Contract(
        contractAddress,
        contractAbi,
        signer
      );

      const tx = await contract.issueLoan(
        receiver,
        ethers.parseEther(amount),
        parseInt(interestRate),
        parseInt(loanTerm)
      );

      await tx.wait();
      alert("Loan issued successfully!");

      // Clear form fields after successful submission
      setReceiver("");
      setAmount("");
      setInterestRate("");
      setLoanTerm("");
      window.location.reload();
    } catch (err: any) {
      console.error(err);
      alert("Failed to issue loan: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Issue a Loan</CardTitle>
          <CardDescription>Enter the loan details below.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleIssueLoan}>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="receiver">Receiver Address</Label>
                <Input
                  id="receiver"
                  type="text"
                  placeholder="0x..."
                  value={receiver}
                  onChange={(e) => setReceiver(e.target.value)}
                  required
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="amount">Loan Amount (ETH)</Label>
                <Input
                  id="amount"
                  type="text"
                  placeholder="1.0"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="interestRate">Interest Rate (%)</Label>
                <Input
                  id="interestRate"
                  type="text"
                  placeholder="5"
                  value={interestRate}
                  onChange={(e) => setInterestRate(e.target.value)}
                  required
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="loanTerm">Loan Term (days)</Label>
                <Input
                  id="loanTerm"
                  type="text"
                  placeholder="30"
                  value={loanTerm}
                  onChange={(e) => setLoanTerm(e.target.value)}
                  required
                />
              </div>
            </div>
            <CardFooter>
              <Button type="submit" className=" mt-5">
                {loading ? "Loading wallet" : "Issue Loan"}
              </Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
      <br />
      <br />
      <IssuedLoansComponent />
    </div>
  );
}
