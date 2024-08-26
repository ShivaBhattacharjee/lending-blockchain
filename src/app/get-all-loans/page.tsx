"use client";
import React, { useState, useEffect } from "react";
import {
  useWeb3ModalProvider,
  useWeb3ModalAccount,
} from "@web3modal/ethers5/react";
import { BrowserProvider, Contract, ethers, formatUnits } from "ethers";
import { ClipLoader } from "react-spinners";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";
import { contractAbi } from "@/abi";

const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS!;

const GetAllLoansComponent: React.FC = () => {
  const { address, isConnected } = useWeb3ModalAccount();
  const { walletProvider } = useWeb3ModalProvider();
  const [loans, setLoans] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchAllLoans = async () => {
    try {
      if (!isConnected) {
        throw new Error("User is not connected");
      }

      const ethersProvider = new BrowserProvider(walletProvider);
      const signer = await ethersProvider.getSigner();
      const contract = new Contract(contractAddress, contractAbi, signer);

      const loansData = await contract.getAllLoans();
      console.log(loansData);
      const filteredLoans = loansData.filter(
        (loan: any) => loan.sender === address || loan.receiver === address
      );
      const formattedLoans = filteredLoans.map((loan: any) => ({
        loanId: loan.loanId,
        sender: loan.sender,
        receiver: loan.receiver,
        amount: formatUnits(loan.amount, 18),
        interestRate: loan.interestRate.toString(),
        balance: formatUnits(loan.balance, 18),
        loanTerm: loan.loanTerm.toString(),
        isRepaid: loan.isRepaid,
        isDefaulted: loan.isDefaulted,
      }));
      console.log(formattedLoans);
      setLoans(formattedLoans);
      setError(null);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllLoans();
  }, [isConnected]);

  const [loanId, setLoanId] = useState<string>("");
  const [repayAmount, setRepayAmount] = useState<string>("");
  const [repayloading, setRepayLoading] = useState<boolean>(false);

  const handleRepayLoan = async (e: React.FormEvent) => {
    console.log("Repay loan triggered");
    setRepayLoading(true);
    e.preventDefault();

    try {
      if (!window.ethereum)
        throw new Error("No crypto wallet found. Please install it.");

      await window.ethereum.request({ method: "eth_requestAccounts" });

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      const contract = new ethers.Contract(
        contractAddress,
        contractAbi,
        signer
      );

      const tx = await contract.repayLoan(
        loanId,
        ethers.parseEther(repayAmount)
      );

      await tx.wait();
      alert("Loan repaid successfully!");

      setLoanId("");
      setRepayAmount("");
    } catch (err: any) {
      console.error(err);
      alert("Failed to repay loan: " + err.message);
    } finally {
      setRepayLoading(false);
    }
  };

  const [openRepayLoan, setOpenRepayLoan] = useState<boolean>(false);
  console.log(openRepayLoan);

  return (
    <div className="overflow-x-scroll min-h-screen relative">
      <h2 className=" text-xl  md:text-5xl font-bold text-neutral-800 dark:text-neutral-200 font-sans">
        List of all Loans.
      </h2>
      {loading ? (
        <div className="flex justify-center items-center w-full">
          <ClipLoader color="white" />
        </div>
      ) : error ? (
        <p style={{ color: "red" }}>Error: {error}</p>
      ) : loans.length > 0 ? (
        <Table className="  overscroll-x-scroll">
          <TableCaption>A list of all loans.</TableCaption>
          <TableHeader className=" overflow-x-scroll">
            <TableRow>
              <TableHead>Amount (ETH)</TableHead>
              <TableHead>Interest Rate</TableHead>
              <TableHead>Loan Term</TableHead>
              <TableHead>Repaid</TableHead>
              <TableHead>Repay</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loans
              .slice()
              .reverse()
              .map((loan, index) => (
                <TableRow key={index}>
                  <TableCell>{loan.balance}</TableCell>
                  <TableCell>{loan.interestRate}</TableCell>
                  <TableCell>{loan.loanTerm}</TableCell>
                  <TableCell>{loan.isRepaid ? "Yes" : "No"}</TableCell>
                  <TableCell>
                    {loan.balance > 0 && (
                      <Button
                        onClick={() => {
                          setLoanId(loan.loanId);
                          setOpenRepayLoan(true);
                        }}
                        variant={loan.isDefaulted ? "destructive" : "default"}
                      >
                        Repay Loan
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}

            <div
              className={` ${
                openRepayLoan ? "block" : "hidden"
              } w-full min-h-[400vh] absolute  top-20`}
            >
              <div className=" w-96 bg-black m-auto p-5 ">
                <X
                  className=" float-right mr-8 z-50 cursor-pointer"
                  onClick={() => setOpenRepayLoan(false)}
                />
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
                        <Label htmlFor="repayAmount">
                          Repayment Amount (ETH)
                        </Label>
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
                        {repayloading ? "Processing" : "Repay Loan"}
                      </Button>
                    </CardFooter>
                  </form>
                </CardContent>
              </div>
            </div>
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={7}>Total Loans</TableCell>
              <TableCell>{loans.length}</TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      ) : (
        <p>No loans found.</p>
      )}
    </div>
  );
};

export default GetAllLoansComponent;
