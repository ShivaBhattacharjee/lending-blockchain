"use client";
import React, { useState } from "react";
import { useWeb3ModalProvider } from "@web3modal/ethers5/react";
import { BrowserProvider, Contract, formatUnits } from "ethers";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { contractAbi } from "@/abi";

const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS!;

const BorrowerLoansComponent: React.FC = () => {
  const { walletProvider } = useWeb3ModalProvider();
  const [borrowerAddress, setBorrowerAddress] = useState<string>("");
  const [loans, setLoans] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedLoan, setSelectedLoan] = useState<any | null>(null);

  const fetchBorrowerLoans = async () => {
    try {
      setLoading(true);
      setError(null);

      const ethersProvider = new BrowserProvider(walletProvider);
      const signer = await ethersProvider.getSigner();
      const contract = new Contract(contractAddress, contractAbi, signer);

      const loanIds = await contract.getBorrowerLoans(borrowerAddress);
      const loansData = await Promise.all(
        loanIds.map(async (loanId: string) => {
          const loanDetails = await contract.getLoanDetails(loanId);
          return {
            loanId: loanDetails.loanId,
            receiver: loanDetails.receiver,
            amount: formatUnits(loanDetails.amount, 18),
            interestRate: loanDetails.interestRate.toString(),
            balance: formatUnits(loanDetails.balance, 18),
            loanTerm: loanDetails.loanTerm.toString(),
            isRepaid: loanDetails.isRepaid,
            isDefaulted: loanDetails.isDefaulted,
          };
        })
      );

      setLoans(loansData);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleLoanClick = (loan: any) => {
    setSelectedLoan(loan);
  };

  const closeLoanDetails = () => {
    setSelectedLoan(null);
  };

  return (
    <div className="overflow-x-scroll">
      <h2 className="text-xl md:text-3xl w-[90%] font-bold text-neutral-800 dark:text-neutral-200 font-sans">
        Search Borrower&apos;s Loans
      </h2>
      <div className="my-4">
        <Input
          type="text"
          placeholder="Enter borrower's address"
          value={borrowerAddress}
          onChange={(e) => setBorrowerAddress(e.target.value)}
        />
        <Button
          onClick={fetchBorrowerLoans}
          className=" mt-6"
          disabled={!borrowerAddress}
        >
          Search
        </Button>
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p style={{ color: "red" }}>Address Not found</p>
      ) : loans.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableCell>Loan ID</TableCell>
              <TableCell>Amount (ETH)</TableCell>
              <TableCell>Interest Rate</TableCell>
              <TableCell>Loan Term</TableCell>
              <TableCell>Balance</TableCell>
              <TableCell>Repaid</TableCell>
              <TableCell>Defaulted</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loans.map((loan, index) => (
              <TableRow
                key={index}
                style={{ color: loan.isDefaulted ? "red" : "inherit" }}
                onClick={() => handleLoanClick(loan)}
                className="cursor-pointer"
              >
                <TableCell>{loan.loanId}</TableCell>
                <TableCell>{loan.amount}</TableCell>
                <TableCell>{loan.interestRate}</TableCell>
                <TableCell>{loan.loanTerm}</TableCell>
                <TableCell>{loan.balance}</TableCell>
                <TableCell>{loan.isRepaid ? "Yes" : "No"}</TableCell>
                <TableCell>{loan.isDefaulted ? "Yes" : "No"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <></>
      )}

      {selectedLoan && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-black p-6 rounded-lg w-[90%] max-w-lg">
            <h3 className="text-xl font-bold mb-4">Loan Details</h3>
            <p>
              <strong>Loan ID:</strong> {selectedLoan.loanId}
            </p>
            <p>
              <strong>Receiver:</strong> {selectedLoan.receiver}
            </p>
            <p>
              <strong>Amount (ETH):</strong> {selectedLoan.amount}
            </p>
            <p>
              <strong>Interest Rate:</strong> {selectedLoan.interestRate}
            </p>
            <p>
              <strong>Loan Term:</strong> {selectedLoan.loanTerm}
            </p>
            <p>
              <strong>Balance:</strong> {selectedLoan.balance}
            </p>
            <p>
              <strong>Repaid:</strong> {selectedLoan.isRepaid ? "Yes" : "No"}
            </p>
            <p>
              <strong>Defaulted:</strong>{" "}
              {selectedLoan.isDefaulted ? "Yes" : "No"}
            </p>
            <Button onClick={closeLoanDetails} className="mt-4">
              Close
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BorrowerLoansComponent;
