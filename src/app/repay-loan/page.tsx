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

export default function RepayLoanCard() {
  const [loanId, setLoanId] = useState<string>("");
  const [repayAmount, setRepayAmount] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS!;
  const abi = [
    // Include the ABI for the `repayLoan` function
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
    // Include any other necessary ABI entries
  ];

  const handleRepayLoan = async (e: React.FormEvent) => {
    console.log("Repay loan triggered");
    setLoading(true);
    e.preventDefault();

    try {
      if (!window.ethereum)
        throw new Error("No crypto wallet found. Please install it.");

      await window.ethereum.request({ method: "eth_requestAccounts" });

      const provider = new ethers.BrowserProvider(window.ethereum); // Use BrowserProvider
      const signer = await provider.getSigner();

      const contract = new ethers.Contract(contractAddress, abi, signer);

      const tx = await contract.repayLoan(
        loanId,
        ethers.parseEther(repayAmount)
      );

      await tx.wait();
      alert("Loan repaid successfully!");

      // Clear form fields after successful submission
      setLoanId("");
      setRepayAmount("");
    } catch (err: any) {
      console.error(err);
      alert("Failed to repay loan: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Repay a Loan</CardTitle>
          <CardDescription>
            Enter the loan ID and repayment amount below.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRepayLoan}>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="loanId">Loan ID</Label>
                <Input
                  id="loanId"
                  type="text"
                  placeholder="0x..."
                  value={loanId}
                  onChange={(e) => setLoanId(e.target.value)}
                  required
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="repayAmount">Repayment Amount (ETH)</Label>
                <Input
                  id="repayAmount"
                  type="text"
                  placeholder="0.5"
                  value={repayAmount}
                  onChange={(e) => setRepayAmount(e.target.value)}
                  required
                />
              </div>
            </div>
            <CardFooter>
              <Button type="submit" className=" mt-5">
                {loading ? "Processing" : "Repay Loan"}
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
