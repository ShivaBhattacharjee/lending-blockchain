import * as React from "react";

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
import { TableLoan } from "@/components/loan-table";

export default function CardWithForm() {
  return (
    <>
      <h2 className=" text-xl  md:text-5xl font-bold text-neutral-800 dark:text-neutral-200 font-sans">
        Repay Your loans.
      </h2>
      <Card className="mr-auto mt-20 w-[800px]">
        <CardHeader>
          <CardTitle>Repay Loan</CardTitle>
          <CardDescription>Repay Your Loan in one-click.</CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="name">LoanId</Label>
                <Input id="name" placeholder="Enter Your LoanId" />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="name">Amount</Label>
                <Input id="number" placeholder="Please Enter Loan Amount" />
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline">Cancel</Button>
          <Button>Repay</Button>
        </CardFooter>
      </Card>
      <h2 className=" text-xl mt-20  md:text-5xl font-bold text-neutral-800 dark:text-neutral-200 font-sans">
        Repaid Loans.
      </h2>
      <TableLoan />
    </>
  );
}
