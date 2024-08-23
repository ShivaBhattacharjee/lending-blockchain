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

export default function CardWithForm() {
  const [receiver, setReceiver] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [interestRate, setInterestRate] = useState<string>("");
  const [loanTerm, setLoanTerm] = useState<string>("");

  const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS!;
  const abi = [
    {
      inputs: [
        {
          internalType: "address",
          name: "_receiver",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "_amount",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "_interestRate",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "_loanTerm",
          type: "uint256",
        },
      ],
      name: "issueLoan",
      outputs: [
        {
          internalType: "bytes32",
          name: "",
          type: "bytes32",
        },
      ],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "bytes32",
          name: "loanId",
          type: "bytes32",
        },
        {
          indexed: false,
          internalType: "address",
          name: "sender",
          type: "address",
        },
        {
          indexed: false,
          internalType: "address",
          name: "receiver",
          type: "address",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "amount",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "interestRate",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "loanTerm",
          type: "uint256",
        },
      ],
      name: "LoanIssued",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "bytes32",
          name: "loanId",
          type: "bytes32",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "amount",
          type: "uint256",
        },
      ],
      name: "LoanRepaid",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "bytes32",
          name: "loanId",
          type: "bytes32",
        },
        {
          indexed: false,
          internalType: "bool",
          name: "isRepaid",
          type: "bool",
        },
      ],
      name: "LoanStatusChanged",
      type: "event",
    },
    {
      inputs: [
        {
          internalType: "bytes32",
          name: "_loanId",
          type: "bytes32",
        },
        {
          internalType: "uint256",
          name: "_amount",
          type: "uint256",
        },
      ],
      name: "repayLoan",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      name: "allLoanIds",
      outputs: [
        {
          internalType: "bytes32",
          name: "",
          type: "bytes32",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      name: "borrowerLoans",
      outputs: [
        {
          internalType: "bytes32",
          name: "",
          type: "bytes32",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "bytes32",
          name: "_loanId",
          type: "bytes32",
        },
      ],
      name: "checkBalance",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "getAllLoans",
      outputs: [
        {
          components: [
            {
              internalType: "bytes32",
              name: "loanId",
              type: "bytes32",
            },
            {
              internalType: "address",
              name: "sender",
              type: "address",
            },
            {
              internalType: "address",
              name: "receiver",
              type: "address",
            },
            {
              internalType: "uint256",
              name: "amount",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "interestRate",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "balance",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "loanTerm",
              type: "uint256",
            },
            {
              internalType: "bool",
              name: "isRepaid",
              type: "bool",
            },
          ],
          internalType: "struct TokenizedStudentLoan.Loan[]",
          name: "",
          type: "tuple[]",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "_borrower",
          type: "address",
        },
      ],
      name: "getBorrowerLoans",
      outputs: [
        {
          internalType: "bytes32[]",
          name: "",
          type: "bytes32[]",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "bytes32",
          name: "_loanId",
          type: "bytes32",
        },
      ],
      name: "getLoanDetails",
      outputs: [
        {
          components: [
            {
              internalType: "bytes32",
              name: "loanId",
              type: "bytes32",
            },
            {
              internalType: "address",
              name: "sender",
              type: "address",
            },
            {
              internalType: "address",
              name: "receiver",
              type: "address",
            },
            {
              internalType: "uint256",
              name: "amount",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "interestRate",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "balance",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "loanTerm",
              type: "uint256",
            },
            {
              internalType: "bool",
              name: "isRepaid",
              type: "bool",
            },
          ],
          internalType: "struct TokenizedStudentLoan.Loan",
          name: "",
          type: "tuple",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "loanCounter",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "bytes32",
          name: "",
          type: "bytes32",
        },
      ],
      name: "loans",
      outputs: [
        {
          internalType: "bytes32",
          name: "loanId",
          type: "bytes32",
        },
        {
          internalType: "address",
          name: "sender",
          type: "address",
        },
        {
          internalType: "address",
          name: "receiver",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "amount",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "interestRate",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "balance",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "loanTerm",
          type: "uint256",
        },
        {
          internalType: "bool",
          name: "isRepaid",
          type: "bool",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
  ];
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

      const contract = new ethers.Contract(contractAddress, abi, signer);

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
      <GetAllLoansComponent />
    </div>
  );
}
