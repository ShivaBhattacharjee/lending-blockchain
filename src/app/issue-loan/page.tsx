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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TableLoan } from "@/components/loan-table";

export default function CardWithForm() {
  return (
    <>
      <h2 className=" text-xl  md:text-5xl font-bold text-neutral-800 dark:text-neutral-200 font-sans">
        Issue Hassel free loans.
      </h2>
      <Card className="mr-auto mt-20 w-[800px]">
        <CardHeader>
          <CardTitle>Issue Loan</CardTitle>
          <CardDescription>Issue Your Loan in one-click.</CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="name">Reciver</Label>
                <Input id="name" placeholder="Name Reciever" />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="name">Amount</Label>
                <Input id="number" placeholder="Please Enter Loan Amount" />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="framework">Interest</Label>
                <Select>
                  <SelectTrigger id="framework">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent position="popper">
                    <SelectItem value="next">5%</SelectItem>
                    <SelectItem value="sveltekit">10%</SelectItem>
                    <SelectItem value="astro">15%</SelectItem>
                    <SelectItem value="nuxt">20%</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="framework">Loan Term</Label>
                <Select>
                  <SelectTrigger id="framework">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent position="popper">
                    <SelectItem value="next">1 year</SelectItem>
                    <SelectItem value="sveltekit">2 year</SelectItem>
                    <SelectItem value="astro">3 year</SelectItem>
                    <SelectItem value="nuxt">4 year</SelectItem>
                    <SelectItem value="nuxt">5 year</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline">Cancel</Button>
          <Button>Issue</Button>
        </CardFooter>
      </Card>
      <h2 className=" text-xl  md:text-5xl font-bold text-neutral-800 dark:text-neutral-200 font-sans">
        Issued Loans.
      </h2>
      <TableLoan />
    </>
  );
}
